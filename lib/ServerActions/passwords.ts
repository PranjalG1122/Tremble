"use server";

import { PrismaClient } from "@prisma/client";
import { getTokenID } from "./getTokenID";
import crypto from "node:crypto";

const prisma = new PrismaClient();

const importKey = async (): Promise<CryptoKey | null | undefined> => {
  return await crypto.subtle.importKey(
    "jwk",
    JSON.parse(process.env.KEY!),
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"]
  );
};

const encryptPassword = async (password: string) => {
  let iv = crypto.getRandomValues(new Uint8Array(64));

  const key = await importKey();
  if (!key) return null;
  const encryptedPassword = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    new TextEncoder().encode(password)
  );
  return {
    encryptedPassword,
    iv,
  };
};

const decryptPassword = async (
  encryptedData: Buffer,
  iv: Buffer
): Promise<string | null> => {
  const key = await importKey();
  if (!key) return null;
  const decryptedPassword = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    encryptedData
  );
  return new TextDecoder().decode(decryptedPassword);
};

export const createPassword = async ({
  title,
  username,
  password,
}: {
  title: string;
  username: string;
  password: string;
}): Promise<boolean> => {
  try {
    const id = getTokenID();
    if (!id) return false;

    return await prisma.$transaction(async (tx) => {
      const user = await tx.activeTokens.findUniqueOrThrow({
        where: {
          id: id,
        },
        select: {
          user: true,
        },
      });

      const encryptedData = await encryptPassword(password);
      if (!encryptedData) return false;

      await tx.passwords.create({
        data: {
          title,
          username,
          password: Buffer.from(encryptedData.encryptedPassword),
          userId: user.user.id,
          iv: Buffer.from(encryptedData.iv),
        },
      });
      return true;
    });
  } catch (e) {
    console.error(e);
    return false;
  }
};

export const fetchPasswords = async () => {
  try {
    const id = getTokenID();
    if (!id) return false;

    const passwords = await prisma.$transaction(async (tx) => {
      const user = await tx.activeTokens.findUniqueOrThrow({
        where: {
          id: id,
        },
        select: {
          user: true,
        },
      });

      const passwords = await tx.passwords.findMany({
        where: {
          userId: user.user.id,
        },
        select: {
          title: true,
          username: true,
          password: true,
          iv: true,
        },
      });

      return passwords;
    });

    return await Promise.all(
      passwords.map(async (password) => {
        const decryptedPassword = await decryptPassword(
          Buffer.from(password.password),
          Buffer.from(password.iv)
        );
        return {
          title: password.title,
          username: password.username,
          password: decryptedPassword,
        };
      })
    );
  } catch (e) {
    console.error(e);
    return null;
  }
};
