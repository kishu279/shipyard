"use client"

import { Home, KeyRound, Rocket, ScrollText, Settings, Webhook } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { useParams } from "next/navigation"

export function ProjectSidebar({ 
  onCreateWebhook, 
  onDeploy,
  onCredentials,
  onSettings,
  onLogs,
}: { 
  onCreateWebhook: () => void; 
  onDeploy: () => void;
  onCredentials: () => void;
  onSettings: () => void;
  onLogs: () => void;
}) {
  const params = useParams();
  const username = params.username as string;

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-4 border-b">
          <div className="flex h-8 w-8 items-center justify-center rounded bg-primary text-primary-foreground font-bold">
            S
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-none">Shipyard</span>
            <span className="text-xs text-muted-foreground">Console</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Overview</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={`/dashboard/${username}`}>
                    <Home className="size-4" />
                    <span>Back to Projects</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Project Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onDeploy}>
                  <Rocket className="size-4" />
                  <span>Deploy</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onCreateWebhook}>
                  <Webhook className="size-4" />
                  <span>Create Webhooks</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onCredentials}>
                  <KeyRound className="size-4" />
                  <span>Credentials</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onLogs}>
                  <ScrollText className="size-4" />
                  <span>Deployment Logs</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={onSettings}>
                  <Settings className="size-4" />
                  <span>Settings</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
