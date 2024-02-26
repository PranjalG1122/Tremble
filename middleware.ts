import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { verifyToken } from "./lib/ServerActions/verifyToken";

export async function middleware(request: NextRequest) {
  const result = await verifyToken();
  const loginPage = request.nextUrl.pathname == "/login";

  if (!result) {
    if (loginPage) return NextResponse.next();
    return NextResponse.redirect(new URL("/login", request.nextUrl).toString());
  }

  if (loginPage)
    return NextResponse.redirect(
      new URL("/dashboard", request.nextUrl).toString()
    );

  return NextResponse.next();
}

export const config = { matcher: ["/dashboard", "/login"] };
