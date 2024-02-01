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

const prisma = new PrismaClient();

export const registerOptions = async (
  username: string
): Promise<PublicKeyCredentialCreationOptionsJSON | null> => {
  try {
    const options = await generateRegistrationOptions({
      rpName: process.env.RP_NAME!,
      rpID: process.env.RP_ID!,
      userID: crypto.randomUUID(),
      userName: username,
      attestationType: "none",
      authenticatorSelection: {
        residentKey: "required",
        userVerification: "required",
        authenticatorAttachment: "platform",
      },
    });

    await prisma.user.create({
      data: {
        username: username,
        auth: {
          create: {
            challenge: options.challenge,
          },
        },
      },
    });

    return options;
  } catch (e) {
    console.warn(e);
    return null;
  }
};

export const verifyOptions = async (
  res: RegistrationResponseJSON
): Promise<boolean | null> => {
  try {
    const clientData = JSON.parse(atob(res.response.clientDataJSON));

    const verification = await verifyRegistrationResponse({
      response: res,
      expectedRPID: process.env.RP_ID!,
      expectedOrigin: process.env.EXPECTED_ORIGIN!,
      expectedChallenge: clientData.challenge,
    });

    if (verification.verified && verification.registrationInfo) {
      const { credentialID, credentialPublicKey, counter } =
        verification.registrationInfo;
      await prisma.auth.update({
        where: {
          challenge: clientData.challenge,
        },
        data: {
          challenge: null,
          credentialID: Buffer.from(credentialID),
          credentialPublicKey: Buffer.from(credentialPublicKey),
          counter: counter,
        },
      });

      return true;
    }
    return false;
  } catch (e) {
    console.warn(e);
    return null;
  }
};
