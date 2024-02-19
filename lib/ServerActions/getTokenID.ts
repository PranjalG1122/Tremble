import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export const getTokenID = (): string | null => {
  const cookie = cookies();
  const token = cookie.get("token");
  if (!token) return null;

  const { id } = jwt.verify(token.value, process.env.JWT_SECRET!) as {
    id: string;
  };

  return id;
};
