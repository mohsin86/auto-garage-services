// File: app/api/users/[id]/route.ts

import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_SERVER_URL;

// ================= GET SINGLE USER =================
export async function GET(
  req: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const res = await fetch(`${BACKEND_URL}/users/${id}`, {
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
        message: "Failed to fetch user",
      },
      {
        status: 500,
      }
    );
  }
}

// ================= UPDATE USER =================
export async function PATCH(
  req: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const body = await req.json();
console.log('udpate ', body);
    const res = await fetch(`${BACKEND_URL}/users/${id}`, {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(body),
    });

    const data = await res.json();

    return NextResponse.json(data, {
      status: res.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to update user",
      },
      {
        status: 500,
      }
    );
  }
}

// ================= DELETE USER =================
export async function DELETE(
  req: NextRequest,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const res = await fetch(`${BACKEND_URL}/users/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    return NextResponse.json(data, {
      status: res.status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to delete user",
      },
      {
        status: 500,
      }
    );
  }
}