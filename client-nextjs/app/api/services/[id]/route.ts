import {
  NextRequest,
  NextResponse,
} from "next/server";

const BACKEND_URL =
  process.env.BACKEND_SERVER_URL;

export async function GET(
  req: NextRequest,
  context: any
) {
  const { id } =
    await context.params;

  const res = await fetch(
    `${BACKEND_URL}/services/${id}`
  );

  const data = await res.json();

  return NextResponse.json(data);
}

export async function PATCH(
  req: NextRequest,
  context: any
) {
  const { id } =
    await context.params;

  const body = await req.json();

  const res = await fetch(
    `${BACKEND_URL}/services/${id}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify(body),
    }
  );

  const data = await res.json();

  return NextResponse.json(data);
}

export async function DELETE(
  req: NextRequest,
  context: any
) {
  const { id } =
    await context.params;

  const res = await fetch(
    `${BACKEND_URL}/services/${id}`,
    {
      method: "DELETE",
    }
  );

  const data = await res.json();

  return NextResponse.json(data);
}