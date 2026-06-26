"use client";

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ProjectSidebar } from "@/components/project-sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rocket, Webhook as WebhookIcon } from "lucide-react";
import { useSession } from "@/src/lib/auth-client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const username = params.username as string;
  const projectId = params.projectId as string;
  const [loadingToken, setLoadingToken] = useState(false);
  const [creatingWebhook, setCreatingWebhook] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [webhooks, setWebhooks] = useState<any[]>([]);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth");
    } else {
      // console.log("Session data:", session?.user.name);
    }
  }, [session, isPending, router]);

  useEffect(() => {
    async function fetchWebhooks() {
      if (!session) return;

      try {
        const response = await fetch("/api/webhooks");
        if (response.ok) {
          const data = await response.json();
          setWebhooks(data.integrations || []);
        }
      } catch (error) {
        console.error("Failed to fetch webhooks:", error);
      }
    }

    if (session) {
      fetchWebhooks();
    }
  }, [session]);

  const handleCreateWebhook = async () => {
    setCreatingWebhook(true);
    const loadingToast = toast.loading("Creating webhook...");

    try {
      const response = await fetch("/api/webhooks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repoName: projectId,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create webhook");
      }

      const data = await response.json();
      setWebhooks((prev) => [data.integration, ...prev]);
      toast.success("Webhook created successfully!", { id: loadingToast });
    } catch (error) {
      console.error("Failed to create webhook:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create webhook",
        { id: loadingToast },
      );
    } finally {
      setCreatingWebhook(false);
    }
  };

  if (isPending || loadingToken) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <SidebarProvider>
      <ProjectSidebar
        onCreateWebhook={() => setActiveSection("webhooks")}
        onDeploy={() => setActiveSection("deploy")}
        onSettings={() => setActiveSection("settings")}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/${username}`}>
                  Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{projectId}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-8">
          {activeSection === "overview" && (
            <>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h1 className="text-3xl font-bold tracking-tight">
                    {projectId}
                  </h1>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Production</Badge>
                    <span className="text-sm text-muted-foreground">
                      Last deployed 2 hours ago
                    </span>
                  </div>
                </div>
                <Button size="lg">
                  <Rocket className="mr-2 h-4 w-4" /> Deploy Now
                </Button>
              </div>

              <Separator className="my-4" />

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                  <h3 className="font-semibold mb-2">Build Status</h3>
                  <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                    <div className="h-2 w-2 rounded-full bg-green-600 animate-pulse" />
                    Successful
                  </div>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                  <h3 className="font-semibold mb-2">Webhooks</h3>
                  <p className="text-sm text-muted-foreground">
                    3 active webhooks configured.
                  </p>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                  <h3 className="font-semibold mb-2">Domain</h3>
                  <p className="text-sm font-mono">{projectId}.shipyard.app</p>
                </div>
              </div>

              <div className="mt-8 rounded-xl border p-8 bg-muted/20 flex flex-col items-center justify-center text-center">
                <h3 className="text-xl font-bold mb-2">Deployment History</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't made any deployments yet to this project.
                </p>
                <Button variant="outline">Learn more about deployments</Button>
              </div>
            </>
          )}

          {activeSection === "webhooks" && (
            <>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">Webhooks</h1>
                <p className="text-muted-foreground">
                  Manage webhooks for {projectId}
                </p>
              </div>

              <Separator className="my-4" />

              <div className="rounded-xl border bg-card p-8 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <WebhookIcon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        Create Repository Webhook
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Create a webhook to receive events from this repository.
                        The webhook will be triggered on push and pull request
                        events.
                      </p>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <span className="font-medium">Webhook URL:</span>
                        <code className="ml-2 px-2 py-1 bg-muted rounded text-xs">
                          {process.env.NEXT_PUBLIC_WEBHOOK_URL ||
                            "http://localhost:3000"}
                          /api/webhook
                        </code>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Events:</span>
                        <span className="ml-2 text-muted-foreground">
                          push, pull_request
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={handleCreateWebhook}
                      disabled={creatingWebhook}
                      size="lg"
                    >
                      {creatingWebhook ? "Creating..." : "Create Webhook"}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === "deploy" && (
            <>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">Deploy</h1>
                <p className="text-muted-foreground">
                  Deploy {projectId} to production
                </p>
              </div>

              <Separator className="my-4" />

              <div className="rounded-xl border p-8 bg-muted/20 flex flex-col items-center justify-center text-center">
                <Rocket className="h-12 w-12 mb-4 text-muted-foreground" />
                <h3 className="text-xl font-bold mb-2">Deploy Your Project</h3>
                <p className="text-muted-foreground mb-4">
                  Deploy functionality coming soon.
                </p>
              </div>
            </>
          )}

          {activeSection === "settings" && (
            <>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">
                  Manage settings for {projectId}
                </p>
              </div>

              <Separator className="my-4" />

              <div className="rounded-xl border p-8 bg-muted/20 flex flex-col items-center justify-center text-center">
                <h3 className="text-xl font-bold mb-2">Project Settings</h3>
                <p className="text-muted-foreground mb-4">
                  Settings panel coming soon.
                </p>
              </div>
            </>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
