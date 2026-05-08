// File: app/api/users/route.ts

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_SERVER_URL;

// ================= GET USERS =================
export async function GET() {
  try {
    const res = await fetch(`${BACKEND_URL}/users`, {
      method: "GET",
      cache: "no-store",
    });

    const data = await res.json();

    return NextResponse.json(data, {
      status: res.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to fetch users",
      },
      {
        status: 500,
      }
    );
  }
}

// ================= CREATE USER =================
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
console.log(body)
    const res = await fetch(`${BACKEND_URL}/users`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(body),
    });

    const data = await res.json();
console.log('rest: ',data)
    return NextResponse.json(data, {
      status: res.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to create user",
      },
      {
        status: 500,
      }
    );
  }
}