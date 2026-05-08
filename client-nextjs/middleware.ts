//middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.JWT_ACCESS_SECRET
);

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const accessToken =
    req.cookies.get("access_token")?.value;

    

  // ONLY protect dashboard
  if (pathname.startsWith("/dashboard")) {
    // no token
    if (!accessToken) {
      return NextResponse.redirect(
        new URL("/", req.url)
      );
    }

    try {
      await jwtVerify(accessToken, SECRET);

      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(
        new URL("/", req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};