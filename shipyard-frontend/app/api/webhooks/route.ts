import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/src/lib/auth";
import { getAccessTokenFromDB } from "@/src/lib/db";
import { createRepoWebhook } from "@/src/lib/github-webhook";
import prisma from "@/src/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { repoName } = await request.json();

    if (!repoName) {
      return NextResponse.json(
        { error: "Repository name is required" },
        { status: 400 },
      );
    }

    const userEmail = session.user?.email;
    const username = session.user?.name;

    if (!userEmail || !username) {
      return NextResponse.json(
        { error: "User information not found" },
        { status: 400 },
      );
    }

    // Get access token from database
    const userData = await getAccessTokenFromDB(userEmail);

    if (!userData || !userData.account || userData.account.length === 0) {
      return NextResponse.json(
        { error: "No GitHub account linked" },
        { status: 404 },
      );
    }

    const accessToken = userData.account[0]?.accessToken;

    if (!accessToken) {
      return NextResponse.json(
        { error: "No access token found" },
        { status: 404 },
      );
    }

    const webhook = await createRepoWebhook(accessToken, {
      // owner: username,
      owner: "kishu279",
      repo: repoName,
      config: {
        url: `${process.env.NEXT_PUBLIC_WEBHOOK_URL || "http://localhost:3000"}/api/webhook`,
        content_type: "json",
        // secret: process.env.WEBHOOK_SECRET,
      },
      events: ["push", "pull_request"],
      active: true,
    });

    // Create entry in database
    const repoIntegration = await prisma.repositoryIntegration.create({
      data: {
        id: `${username}-${repoName}-${Date.now()}`,
        userId: session.user.id,
        githubRepoId: BigInt(webhook.id),
        owner: username,
        repoName: repoName,
        fullName: `${username}/${repoName}`,
        webhookId: BigInt(webhook.id),
        status: "RUNNING",
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      webhook,
      integration: {
        ...repoIntegration,
        githubRepoId: repoIntegration.githubRepoId.toString(),
        webhookId: repoIntegration.webhookId.toString(),
      },
    });
  } catch (error) {
    console.error("Error creating webhook:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const integrations = await prisma.repositoryIntegration.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      integrations: integrations.map((integration) => ({
        ...integration,
        githubRepoId: integration.githubRepoId.toString(),
        webhookId: integration.webhookId.toString(),
      })),
    });
  } catch (error) {
    console.error("Error fetching webhooks:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
