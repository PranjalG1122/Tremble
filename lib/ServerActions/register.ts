"use server";

import { Prisma, PrismaClient } from "@prisma/client";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import type {
  RegistrationResponseJSON,
  PublicKeyCredentialCreationOptionsJSON,
} from "@simplewebauthn/types";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { maxAge } from "../utils";

const prisma = new PrismaClient();

export const registerOptions = async (
  name: string
): Promise<PublicKeyCredentialCreationOptionsJSON | null> => {
  try {
    const options = await generateRegistrationOptions({
      rpName: process.env.RP_NAME!,
      rpID: process.env.RP_ID!,
      userID: crypto.randomUUID(),
      userName: name,
      authenticatorSelection: {
        residentKey: "required",
        userVerification: "required",
        authenticatorAttachment: "platform",
      },
    });

    await prisma.$transaction(async (tx) => {
      const cookie = cookies();
      const user = await tx.user.create({
        data: {
          name: name,
        },
      });

      await tx.challenge.create({
        data: {
          challenge: options.challenge,
        },
      });

      const activeToken = await tx.activeTokens.create({
        data: {
          user: {
            connect: {
              id: user.id,
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

      cookie.set("token", token, {
        path: "/",
        maxAge: maxAge,
        sameSite: "strict",
        secure: true,
      });
    });

    return options;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const verifyRegisterOptions = async (
  res: RegistrationResponseJSON
): Promise<boolean> => {
  try {
    const clientData = JSON.parse(atob(res.response.clientDataJSON));

    const challenge = await prisma.challenge.findUniqueOrThrow({
      where: {
        challenge: clientData.challenge,
      },
    });

    const verification = await verifyRegistrationResponse({
      response: res,
      expectedRPID: process.env.RP_ID!,
      expectedOrigin: process.env.EXPECTED_ORIGIN!,
      expectedChallenge: challenge.challenge,
    });

    if (verification.verified && verification.registrationInfo) {
      const { credentialID, credentialPublicKey, counter } =
        verification.registrationInfo;

      return await prisma.$transaction(async (tx) => {
        const cookie = cookies();
        const token = cookie.get("token");
        if (!token) return false;

        const { id } = jwt.verify(token.value, process.env.JWT_SECRET!) as {
          id: string;
        };

        const user = await tx.activeTokens.findUniqueOrThrow({
          where: {
            id: id,
          },
          select: {
            user: {
              select: {
                id: true,
              },
            },
          },
        });

        await tx.auth.create({
          data: {
            user: {
              connect: {
                id: user.user.id,
              },
            },
            credentialID: Buffer.from(credentialID).toString("base64url"),
            credentialPublicKey:
              Buffer.from(credentialPublicKey).toString("base64url"),
            counter: counter,
          },
        });

        await tx.activeTokens.update({
          where: {
            id: id,
          },
          data: {
            tokenValid: true,
          },
        });

        await tx.challenge.delete({
          where: {
            challenge: clientData.challenge,
          },
        });
        return true;
      });
    }
    return false;
  } catch (e) {
    console.error(e);
    return false;
  }
};
