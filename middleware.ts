import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/ServerActions/verifyToken";

export async function middleware(request: NextRequest) {
  const result = await verifyToken();
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!result) {
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    } else {
      return NextResponse.next();
    }
  } else if (request.nextUrl.pathname.startsWith("/login")) {
    if (result) {
      return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
    } else {
      return NextResponse.next();
    }
  } else {
    return NextResponse.next();
  }
}
