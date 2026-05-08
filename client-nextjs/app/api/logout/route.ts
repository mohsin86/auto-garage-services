import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  // clear cookies
  response.cookies.set("access_token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  response.cookies.set("refresh_token", "", {
    httpOnly: true,
    expires: new Date(0),
    path: "/",
  });

  return response;
}