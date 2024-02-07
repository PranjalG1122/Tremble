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

const prisma = new PrismaClient();

export const genereateAuthOptions = async (
  username: string
): Promise<PublicKeyCredentialRequestOptionsJSON | null> => {
  try {
    const options = await generateAuthenticationOptions({
      rpID: process.env.RP_ID || "localhost",
      userVerification: "required",
    });

    await prisma.user.update({
      where: {
        username: username,
      },
      data: {
        auth: {
          update: {
            challenge: options.challenge,
          },
        },
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
): Promise<boolean | null> => {
  try {
    const clientData = JSON.parse(atob(res.response.clientDataJSON));

    const user = await prisma.auth.findUniqueOrThrow({
      where: {
        challenge: clientData.challenge,
      },
      select: {
        credentialID: true,
        credentialPublicKey: true,
        counter: true,
      },
    });

    const verification = await verifyAuthenticationResponse({
      response: res,
      expectedChallenge: clientData.challenge,
      expectedOrigin: "http://localhost:3000",
      expectedRPID: process.env.RP_ID || "localhost",
      authenticator: {
        credentialID: new Uint8Array(user.credentialID!),
        credentialPublicKey: new Uint8Array(user.credentialPublicKey!),
        counter: user.counter!,
      },
    });

    if (verification.verified) {
      const cookie = cookies();

      const { newCounter } = verification.authenticationInfo;

      await prisma.auth.update({
        where: {
          challenge: clientData.challenge,
        },
        data: {
          counter: newCounter,
          challenge: null,
        },
      });

      const token = jwt.sign(
        {
          username: "Test User",
        },
        process.env.JWT_SECRET!,
        {
          expiresIn: "30d",
        }
      );

      cookie.set("token", token, {
        maxAge: 30 * 24 * 60 * 60,
      });

      return true;
    }
    return false;
  } catch (e) {
    console.error(e);
    return null;
  }
};
