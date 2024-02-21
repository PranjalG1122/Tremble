import { SignJWT, jwtVerify } from "jose";
import { maxAge } from "./utils";

export const signTokenJose = async (data: string): Promise<string> => {
  return new SignJWT({ id: data })
    .setProtectedHeader({
      alg: "HS256",
    })
    .setExpirationTime(Math.floor(Date.now() / 1000) + maxAge)
    .sign(new TextEncoder().encode(process.env.JWT_SECRET!));
};

export const verifyTokenJose = async (value: string) => {
  return await jwtVerify(
    value,
    new TextEncoder().encode(process.env.JWT_SECRET!)
  );
};
