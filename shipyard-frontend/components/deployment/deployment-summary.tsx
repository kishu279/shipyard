"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { relativeTime } from "./deployment-item";
import {
  CheckCircle2,
  XCircle,
  Loader2,
  Ban,
  GitBranch,
  GitCommit,
  Clock,
  Calendar,
  ExternalLink,
  Timer,
  Globe,
} from "lucide-react";
import type { Deployment } from "@/data/deployments";
import { cn } from "@/lib/utils";

const statusMeta = {
  success: { icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10", label: "Ready" },
  building: { icon: Loader2, color: "text-blue-500", bg: "bg-blue-500/10", label: "Building" },
  failed: { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10", label: "Failed" },
  cancelled: { icon: Ban, color: "text-zinc-400", bg: "bg-zinc-500/10", label: "Cancelled" },
} as const;

type Props = {
  deployment: Deployment;
};

export function DeploymentSummary({ deployment }: Props) {
  const { icon: Icon, color, bg, label } = statusMeta[deployment.status];

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className={cn("rounded-lg p-1.5", bg)}>
          <Icon className={cn("h-4 w-4", color, deployment.status === "building" && "animate-spin")} />
        </div>
        <span className="text-sm font-medium">Deployment Summary</span>
        <Badge variant="outline" className={cn("ml-auto text-[10px]", color)}>
          {label}
        </Badge>
      </div>

      <Separator />

      <div className="divide-y">
        <div className="flex items-center justify-between px-4 py-2.5 text-sm">
          <span className="text-muted-foreground">Status</span>
          <div className="flex items-center gap-1.5">
            <Icon className={cn("h-3.5 w-3.5", color, deployment.status === "building" && "animate-spin")} />
            <span className={cn("font-medium", color)}>{label}</span>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 text-sm">
          <span className="text-muted-foreground">Deployment URL</span>
          <a
            href={`https://${deployment.id}.shipyard.app`}
            className="flex items-center gap-1 font-mono text-xs text-primary hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            <Globe className="h-3 w-3" />
            {deployment.id}.shipyard.app
          </a>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 text-sm">
          <span className="text-muted-foreground">Branch</span>
          <span className="flex items-center gap-1 font-mono text-xs">
            <GitBranch className="h-3 w-3 text-muted-foreground" />
            {deployment.branch}
          </span>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 text-sm">
          <span className="text-muted-foreground">Commit</span>
          <span className="flex items-center gap-1 font-mono text-xs">
            <GitCommit className="h-3 w-3 text-muted-foreground" />
            {deployment.sha}
          </span>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 text-sm">
          <span className="text-muted-foreground">Duration</span>
          <div className="flex items-center gap-1">
            <Timer className="h-3 w-3 text-muted-foreground" />
            <span className="font-mono text-xs">{deployment.duration}</span>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 text-sm">
          <span className="text-muted-foreground">Created</span>
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs">{new Date(deployment.createdAt).toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center justify-between px-4 py-2.5 text-sm">
          <span className="text-muted-foreground">Last Updated</span>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span className="text-xs">{relativeTime(deployment.createdAt)}</span>
          </div>
        </div>
      </div>

      <Separator />

      <div className="flex items-center gap-2 px-4 py-3">
        <Button variant="outline" size="sm" className="w-full" disabled>
          <ExternalLink className="h-3.5 w-3.5" />
          Open Deployment
        </Button>
      </div>
    </div>
  );
}
