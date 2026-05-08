// File: api/register/route.ts

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const backendRes = await fetch(
      `${process.env.BACKEND_SERVER_URL}/auth/login`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),

        // IMPORTANT
        credentials: "include",
      }
    );

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(
        {
          message: data.message || "Login failed",
        },
        {
          status: backendRes.status,
        }
      );
    }



    // CREATE RESPONSE
    const response = NextResponse.json(
      {
        success: true,
        access_token: data.data.access_token,
        user: data.data.user,
      },
      {
        status: 200,
      }
    );

    

    // ACCESS TOKEN COOKIE
    response.cookies.set("access_token", data.data.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 15, // 15 min
    });

    // REFRESH TOKEN COOKIE
    if (data.data.refresh_token) {
      response.cookies.set(
        "refresh_token",
        data.refresh_token,
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          path: "/",
          maxAge: 60 * 60 * 24 * 7,
        }
      );
    }

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        message: "Server error",
      },
      {
        status: 500,
      }
    );
  }
}