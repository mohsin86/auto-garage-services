import {
  NextRequest,
  NextResponse,
} from "next/server";

const BACKEND_URL =
  process.env.BACKEND_SERVER_URL;

export async function GET(
  req: NextRequest
) {
  try {
    const { searchParams } = new URL(
      req.url
    );

    const ownerId =
      searchParams.get("ownerId");

    if (!ownerId) {
      return NextResponse.json(
        {
          message:
            "Owner ID required",
        },
        {
          status: 400,
        }
      );
    }

    const res = await fetch(
      `${BACKEND_URL}/vehicles/owner/${ownerId}`,
      {
        cache: "no-store",
      }
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        message:
          "Failed to fetch vehicles",
      },
      {
        status: 500,
      }
    );
  }
}