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
import { Input } from "@/components/ui/input";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { KeyRound, Rocket, Webhook as WebhookIcon } from "lucide-react";
import { useSession } from "@/src/lib/auth-client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type WebhookIntegration = {
  id: string;
  repoName: string;
  status: string;
  [key: string]: unknown;
};

type Credentials = {
  id: string;
  serverId: string;
  serverName: string;
  host: string;
  [key: string]: unknown;
};

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const username = params.username as string;
  const projectId = params.projectId as string;
  const [creatingWebhook, setCreatingWebhook] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("overview");
  const [webhooks, setWebhooks] = useState<WebhookIntegration[]>([]);
  const [credentials, setCredentials] = useState<Credentials[]>([]);
  const [hasWebhook, setHasWebhook] = useState(false);
  const [hasCredentials, setHasCredentials] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth");
    } else {
      // console.log("Session data:", session?.user.name);
    }
  }, [session, isPending, router]);

  useEffect(() => {
    async function fetchData() {
      if (!session) return;

      try {
        const [webhooksRes, credentialsRes] = await Promise.all([
          fetch("/api/webhooks"),
          fetch("/api/credentials"),
        ]);

        if (webhooksRes.ok) {
          const data = (await webhooksRes.json()) as {
            integrations?: WebhookIntegration[];
          };
          const allWebhooks = data.integrations || [];
          setWebhooks(allWebhooks);
          setHasWebhook(allWebhooks.some((w) => w.repoName === projectId));
        }

        if (credentialsRes.ok) {
          const data = (await credentialsRes.json()) as Credentials[];
          setCredentials(data);
          setHasCredentials(data.length > 0);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }

    if (session) {
      fetchData();
    }
  }, [session, projectId]);

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

      const data = (await response.json()) as {
        integration: WebhookIntegration;
      };
      setWebhooks((prev) => [data.integration, ...prev]);
      setHasWebhook(true);
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

  if (isPending) {
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
        onCredentials={() => setActiveSection("credentials")}
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
                    {hasWebhook ? "Webhook configured" : "No webhook configured"}
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
                  You have not made any deployments yet to this project.
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
                      disabled={creatingWebhook || hasWebhook}
                      size="lg"
                    >
                      {hasWebhook
                        ? "Webhook Already Exists"
                        : creatingWebhook
                          ? "Creating..."
                          : "Create Webhook"}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeSection === "credentials" && (
            <>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold tracking-tight">
                  Credentials
                </h1>
                <p className="text-muted-foreground">
                  Manage deployment credentials for {projectId}
                </p>
              </div>

              <Separator className="my-4" />

              <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                  <div className="mb-6 flex items-start gap-4">
                    <div className="rounded-lg bg-primary/10 p-3">
                      <KeyRound className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">Server</h3>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Add the server access details this project will use
                        during deployment.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <label
                        htmlFor="server-id"
                        className="text-sm font-medium"
                      >
                        Server ID
                      </label>
                      <Input
                        id="server-id"
                        placeholder="srv_01"
                        type="text"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="owner-id"
                        className="text-sm font-medium"
                      >
                        Owner ID
                      </label>
                      <Input
                        id="owner-id"
                        placeholder="owner_01"
                        type="text"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="server-name"
                        className="text-sm font-medium"
                      >
                        Server Name
                      </label>
                      <Input
                        id="server-name"
                        placeholder="Production Server"
                        type="text"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="server-host"
                        className="text-sm font-medium"
                      >
                        Host
                      </label>
                      <Input
                        id="server-host"
                        placeholder="192.168.1.10 or example.com"
                        type="text"
                      />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="server-port"
                        className="text-sm font-medium"
                      >
                        Port
                      </label>
                      <Input id="server-port" placeholder="22" type="number" />
                    </div>
                    <div className="space-y-2">
                      <label
                        htmlFor="server-username"
                        className="text-sm font-medium"
                      >
                        Username
                      </label>
                      <Input
                        id="server-username"
                        placeholder="ubuntu"
                        type="text"
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label
                        htmlFor="private-key"
                        className="text-sm font-medium"
                      >
                        Private Key (encrypted)
                      </label>
                      <Input
                        id="private-key"
                        accept=".pem,.key,.txt"
                        type="file"
                      />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <Button disabled>Save Credentials</Button>
                  </div>
                </div>

                <div className="rounded-xl border bg-muted/20 p-6">
                  <h3 className="font-semibold">Server Summary</h3>
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-muted-foreground">Status</span>
                      <Badge variant={hasCredentials ? "default" : "outline"}>
                        {hasCredentials ? `${credentials.length} saved` : "Not saved"}
                      </Badge>
                    </div>
                    {hasCredentials && credentials[0] && (
                      <>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">Server ID</span>
                          <Badge variant="outline">{credentials[0].serverId}</Badge>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">Host</span>
                          <Badge variant="outline">{credentials[0].host}</Badge>
                        </div>
                      </>
                    )}
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
