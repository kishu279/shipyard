import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { storeServer, getServersByUserId } from "@/src/lib/db/userCredentials";

export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const servers = await getServersByUserId(session.user.id);
    return NextResponse.json(servers, { status: 200 });
  } catch (error) {
    console.error("Error fetching credentials:", error);
    return NextResponse.json({ error: "Failed to fetch credentials" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, host, port, username, privateKey } = body;

  if (!name || !host || !port || !username || !privateKey) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const server = await storeServer({
      userId: session.user.id,
      name,
      host,
      port: Number(port),
      username,
      privateKey,
    });

    return NextResponse.json(server, { status: 201 });
  } catch (error) {
    console.error("Error storing credentials:", error);
    return NextResponse.json({ error: "Failed to store credentials" }, { status: 500 });
  }
}
