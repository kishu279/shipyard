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
  ExternalLink,
  RotateCcw,
  MoreHorizontal,
} from "lucide-react";
import type { Deployment } from "@/data/deployments";
import { cn } from "@/lib/utils";

const statusMeta = {
  success: {
    icon: CheckCircle2,
    color: "text-green-500",
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    label: "Ready",
  },
  building: {
    icon: Loader2,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    label: "Building",
  },
  failed: {
    icon: XCircle,
    color: "text-red-500",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    label: "Failed",
  },
  cancelled: {
    icon: Ban,
    color: "text-zinc-400",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/20",
    label: "Cancelled",
  },
} as const;

type Props = {
  deployment: Deployment;
};

export function DeploymentHeader({ deployment }: Props) {
  const { icon: Icon, color, bg, border, label } = statusMeta[deployment.status];

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "rounded-lg p-2.5 ring-1 ring-inset",
              bg,
              border
            )}
          >
            <Icon
              className={cn(
                "h-5 w-5",
                color,
                deployment.status === "building" && "animate-spin"
              )}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight">
                {deployment.id}
              </h2>
              <Badge
                variant="outline"
                className={cn("font-mono text-[10px]", color)}
              >
                {label}
              </Badge>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <GitCommit className="h-3 w-3" />
                <span className="font-mono">{deployment.sha}</span>
              </span>
              <span className="flex items-center gap-1">
                <GitBranch className="h-3 w-3" />
                <span className="font-mono">{deployment.branch}</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {relativeTime(deployment.createdAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled>
            <ExternalLink className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Open</span>
          </Button>
          <Button variant="outline" size="sm" disabled>
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Redeploy</span>
          </Button>
          <Button variant="ghost" size="icon-sm" disabled>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator />

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-2.5 text-xs text-muted-foreground">
        <span>
          Duration: <span className="font-medium text-foreground">{deployment.duration}</span>
        </span>
        <span>
          Author: <span className="font-medium text-foreground">{deployment.author}</span>
        </span>
        <span>
          Branch:{" "}
          <span className="font-mono font-medium text-foreground">
            {deployment.branch}
          </span>
        </span>
      </div>
    </div>
  );
}
