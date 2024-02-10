"use server";

import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const verifyToken = (): boolean => {
  const cookie = cookies();

  const token = cookie.get("token");
  if (!token) return false;

  const decodedToken = jwt.verify(token.value, process.env.JWT_SECRET!) as {
    id: string;
    iat: number;
    exp: number;
  };

  if (!decodedToken) return false;
  if (decodedToken.exp < Date.now()) return false;

  return true;
};
