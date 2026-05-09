import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL =  process.env.BACKEND_SERVER_URL;

export async function GET() {
  const res = await fetch(
    `${BACKEND_URL}/vehicles`,
    {
      cache: "no-store",
    }
  );

  const data = await res.json();

  return NextResponse.json(data);
}

export async function POST(
  req: NextRequest
) {
  const body = await req.json();

  const res = await fetch( `${BACKEND_URL}/vehicles`, {
                                            method: "POST",

                                            headers: {
                                            "Content-Type": "application/json",
                                            },

                                            body: JSON.stringify(body),
                                        }
                                        );

  const data = await res.json();

  return NextResponse.json(data);
}