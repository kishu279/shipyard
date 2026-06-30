import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { getServerById, deleteServer } from "@/src/lib/db/userCredentials";

export async function GET(
  req: NextRequest,
  { params }: { params: { serverId: string } }
) {
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const server = await getServerById(params.serverId);
    
    if (!server) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 });
    }

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.error("Error fetching credentials:", error);
    return NextResponse.json({ error: "Failed to fetch credentials" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { serverId: string } }
) {
  const session = await auth.api.getSession({ headers: req.headers });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await deleteServer(params.serverId);
    return NextResponse.json({ message: "Server deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting server:", error);
    return NextResponse.json({ error: "Failed to delete server" }, { status: 500 });
  }
}
