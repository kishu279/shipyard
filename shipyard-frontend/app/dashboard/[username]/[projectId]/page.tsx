"use client"

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
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
import { Rocket } from "lucide-react";
import { useSession } from "@/src/lib/auth-client";
import { useEffect } from "react";

export default function ProjectDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const username = params.username as string;
  const projectId = params.projectId as string;

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <SidebarProvider>
      <ProjectSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/${username}`}>Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{projectId}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold tracking-tight">{projectId}</h1>
              <div className="flex items-center gap-2">
                <Badge variant="outline">Production</Badge>
                <span className="text-sm text-muted-foreground">Last deployed 2 hours ago</span>
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
              <p className="text-sm text-muted-foreground">3 active webhooks configured.</p>
            </div>
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h3 className="font-semibold mb-2">Domain</h3>
              <p className="text-sm font-mono">{projectId}.shipyard.app</p>
            </div>
          </div>
          
          <div className="mt-8 rounded-xl border p-8 bg-muted/20 flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-bold mb-2">Deployment History</h3>
            <p className="text-muted-foreground mb-4">You haven't made any deployments yet to this project.</p>
            <Button variant="outline">Learn more about deployments</Button>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
