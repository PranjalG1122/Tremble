"use server";

import { cookies } from "next/headers";
import { verifyTokenJose } from "../joseToken";

export const verifyToken = async (): Promise<boolean> => {
  const cookie = cookies();

  const token = cookie.get("token");
  if (!token) return false;

  const decodedToken = await verifyTokenJose(token.value);
  if (!decodedToken.payload.id) return false;
  if (!decodedToken.payload.exp) return false;
  if (decodedToken.payload.exp < Date.now() / 1000) return false;

  return true;
};
