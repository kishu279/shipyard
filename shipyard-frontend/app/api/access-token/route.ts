import { NextRequest, NextResponse } from "next/server";
import { getAccessTokenFromDB } from "@/src/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const userData = await getAccessTokenFromDB(email);

    if (!userData || !userData.account || userData.account.length === 0) {
      return NextResponse.json({ error: "User not found or no account linked" }, { status: 404 });
    }

    const accessToken = userData.account[0]?.accessToken;

    if (!accessToken) {
      return NextResponse.json({ error: "No access token found" }, { status: 404 });
    }

    return NextResponse.json({ accessToken });
  } catch (error) {
    console.error("Error fetching access token:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
