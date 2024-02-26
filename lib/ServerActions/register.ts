"use server";

import { PrismaClient } from "@prisma/client";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import type {
  RegistrationResponseJSON,
  PublicKeyCredentialCreationOptionsJSON,
} from "@simplewebauthn/types";
import { cookies } from "next/headers";
import { maxAge } from "../utils";
import { signTokenJose } from "../joseToken";

const prisma = new PrismaClient();

export const getRegistrationOptions = async (
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

export const verifyRegistrationOptions = async (
  id: string,
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
        const user = await tx.user.create({
          data: {
            id: id,
            name: id,
            auth: {
              create: {
                credentialId: Buffer.from(credentialID).toString("base64url"),
                credentialPublicKey:
                  Buffer.from(credentialPublicKey).toString("base64url"),
                counter: counter,
              },
            },
          },
        });

        const newToken = await tx.activeTokens.create({
          data: {
            user: {
              connect: {
                id: user.id,
              },
            },
          },
        });

        const cookie = cookies();
        const token = await signTokenJose(newToken.id);

        cookie.set("token", token, {
          path: "/",
          maxAge: maxAge,
          sameSite: "strict",
          secure: true,
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
