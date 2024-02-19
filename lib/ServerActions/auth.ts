"use server";

import { PrismaClient } from "@prisma/client";
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import type {
  AuthenticationResponseJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from "@simplewebauthn/types";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { maxAge } from "../utils";

const prisma = new PrismaClient();

export const genereateAuthOptions =
  async (): Promise<PublicKeyCredentialRequestOptionsJSON | null> => {
    try {
      const options = await generateAuthenticationOptions({
        rpID: process.env.RP_ID,
        userVerification: "required",
      });

      await prisma.challenge.create({
        data: {
          challenge: options.challenge,
        },
      });

      return options;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

export const verifyAuthOptions = async (
  res: AuthenticationResponseJSON
): Promise<boolean> => {
  try {
    const clientData = JSON.parse(atob(res.response.clientDataJSON));

    return await prisma.$transaction(async (tx) => {
      const auth = await tx.auth.findUniqueOrThrow({
        where: {
          credentialId: res.rawId,
        },
        include: {
          user: true,
        },
      });

      const challenge = await tx.challenge.findUniqueOrThrow({
        where: {
          challenge: clientData.challenge,
        },
        select: {
          challenge: true,
        },
      });

      const verification = await verifyAuthenticationResponse({
        response: res,
        expectedChallenge: challenge.challenge,
        expectedOrigin: process.env.EXPECTED_ORIGIN!,
        expectedRPID: process.env.RP_ID!,
        authenticator: {
          credentialID: Buffer.from(auth.credentialId, "base64url"),
          credentialPublicKey: Buffer.from(
            auth.credentialPublicKey,
            "base64url"
          ),
          counter: auth.counter,
        },
      });

      if (verification.verified) {
        const { newCounter, credentialID } = verification.authenticationInfo;

        await tx.challenge.delete({
          where: {
            challenge: challenge.challenge,
          },
        });
        await tx.auth.update({
          where: {
            credentialId: Buffer.from(credentialID).toString("base64url"),
          },
          data: {
            counter: newCounter,
          },
        });

        const activeToken = await tx.activeTokens.create({
          data: {
            tokenValid: true,
            user: {
              connect: {
                id: auth.userId,
              },
            },
          },
        });

        const token = jwt.sign(
          {
            id: activeToken.id,
          },
          process.env.JWT_SECRET!,
          {
            expiresIn: maxAge,
          }
        );

        const cookie = cookies();
        cookie.set("token", token, {
          maxAge: maxAge,
          path: "/",
          sameSite: "strict",
          secure: true,
        });
        return true;
      }

      return false;
    });
  } catch (e) {
    console.error(e);
    return false;
  }
  return false;
};
