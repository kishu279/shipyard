import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

function verifySignature(payload: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac("sha256", secret);
  const digest = "sha256=" + hmac.update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-hub-signature-256");
    const event = request.headers.get("x-github-event");
    const delivery = request.headers.get("x-github-delivery");

    console.log("=".repeat(80));
    console.log("📦 GitHub Webhook Received");
    console.log("=".repeat(80));
    console.log("Event Type:", event);
    console.log("Delivery ID:", delivery);
    console.log("Signature:", signature);

    // Verify signature if secret is configured
    const secret = process.env.WEBHOOK_SECRET;
    if (secret && signature) {
      const isValid = verifySignature(body, signature, secret);
      if (!isValid) {
        console.error("❌ Invalid signature");
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
      }
      console.log("✅ Signature verified");
    } else {
      console.warn("⚠️  No signature verification (WEBHOOK_SECRET not set)");
    }

    const payload = JSON.parse(body);

    console.log("\n📝 Payload Summary:");
    console.log("Repository:", payload.repository?.full_name);
    console.log("Sender:", payload.sender?.login);

    if (event === "push") {
      console.log("\n🚀 Push Event Details:");
      console.log("Branch:", payload.ref?.replace("refs/heads/", ""));
      console.log("Commits:", payload.commits?.length || 0);
      console.log("Pusher:", payload.pusher?.name);
      
      if (payload.commits && payload.commits.length > 0) {
        console.log("\n📋 Recent Commits:");
        payload.commits.slice(0, 3).forEach((commit: any, index: number) => {
          console.log(`  ${index + 1}. ${commit.message} (${commit.id.substring(0, 7)})`);
          console.log(`     Author: ${commit.author.name}`);
        });
      }
    } else if (event === "pull_request") {
      console.log("\n🔀 Pull Request Event Details:");
      console.log("Action:", payload.action);
      console.log("PR Number:", payload.pull_request?.number);
      console.log("Title:", payload.pull_request?.title);
      console.log("State:", payload.pull_request?.state);
      console.log("Author:", payload.pull_request?.user?.login);
      console.log("Base Branch:", payload.pull_request?.base?.ref);
      console.log("Head Branch:", payload.pull_request?.head?.ref);
    }

    console.log("\n📦 Full Payload:");
    console.log(JSON.stringify(payload, null, 2));
    console.log("=".repeat(80));

    return NextResponse.json({ 
      success: true, 
      message: "Webhook received",
      event,
      delivery 
    });
  } catch (error) {
    console.error("❌ Error processing webhook:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Webhook endpoint is active",
    info: "POST GitHub webhook events to this endpoint",
  });
}
