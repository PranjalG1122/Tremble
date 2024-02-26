import { cookies } from "next/headers";
import { verifyTokenJose } from "../joseToken";

export const getTokenID = async (): Promise<string | null> => {
  const cookie = cookies();
  const token = cookie.get("token");
  if (!token) return null;
  

  const res = await verifyTokenJose(token.value);

  if (!res.payload.id) return null;

  return res.payload.id as string;
};
