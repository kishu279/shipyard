import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { getAccessTokenFromDB } from "@/src/lib/db";
import { deleteRepoWebhook, getRepoWebhooks } from "@/src/lib/github-webhook";
import prisma from "@/src/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const integration = await prisma.repositoryIntegration.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!integration) {
      return NextResponse.json({ error: "Webhook not found" }, { status: 404 });
    }

    const userEmail = session.user?.email;

    if (!userEmail) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 });
    }

    const userData = await getAccessTokenFromDB(userEmail);

    if (!userData || !userData.account || userData.account.length === 0) {
      return NextResponse.json({ error: "No GitHub account linked" }, { status: 404 });
    }

    const accessToken = userData.account[0]?.accessToken;

    if (!accessToken) {
      return NextResponse.json({ error: "No access token found" }, { status: 404 });
    }

    // Get webhook details from GitHub
    const webhooks = await getRepoWebhooks(
      accessToken,
      integration.owner,
      integration.repoName
    );

    const webhook = webhooks.find((w) => w.id === Number(integration.webhookId));

    return NextResponse.json({
      integration: {
        ...integration,
        githubRepoId: integration.githubRepoId.toString(),
        webhookId: integration.webhookId.toString(),
      },
      webhook,
    });
  } catch (error) {
    console.error("Error fetching webhook:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const integration = await prisma.repositoryIntegration.findUnique({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!integration) {
      return NextResponse.json({ error: "Webhook not found" }, { status: 404 });
    }

    const userEmail = session.user?.email;

    if (!userEmail) {
      return NextResponse.json({ error: "User email not found" }, { status: 400 });
    }

    const userData = await getAccessTokenFromDB(userEmail);

    if (!userData || !userData.account || userData.account.length === 0) {
      return NextResponse.json({ error: "No GitHub account linked" }, { status: 404 });
    }

    const accessToken = userData.account[0]?.accessToken;

    if (!accessToken) {
      return NextResponse.json({ error: "No access token found" }, { status: 404 });
    }

    // Delete webhook from GitHub
    await deleteRepoWebhook(
      accessToken,
      integration.owner,
      integration.repoName,
      Number(integration.webhookId)
    );

    // Delete from database
    await prisma.repositoryIntegration.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({ success: true, message: "Webhook deleted successfully" });
  } catch (error) {
    console.error("Error deleting webhook:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
