"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { GitBranch, CheckCircle2, XCircle, Loader2, Ban } from "lucide-react";
import type { Deployment } from "@/data/deployments";

export function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const statusMeta = {
  success:   { icon: CheckCircle2, color: "text-green-500",  label: "Ready"     },
  building:  { icon: Loader2,      color: "text-blue-500",   label: "Building"  },
  failed:    { icon: XCircle,      color: "text-red-500",    label: "Failed"    },
  cancelled: { icon: Ban,          color: "text-zinc-400",   label: "Cancelled" },
} as const;

type Props = {
  deployment: Deployment;
  selected: boolean;
  onClick: () => void;
};

export function DeploymentItem({ deployment, selected, onClick }: Props) {
  const { icon: Icon, color, label } = statusMeta[deployment.status];

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left px-3 py-2.5 rounded-lg transition-colors",
        selected ? "bg-accent" : "hover:bg-muted/60"
      )}
    >
      <div className="flex items-start gap-2.5">
        <Icon
          className={cn(
            "mt-0.5 h-4 w-4 shrink-0",
            color,
            deployment.status === "building" && "animate-spin"
          )}
        />
        <div className="min-w-0 flex-1 space-y-1">
          <p className="truncate text-sm font-medium leading-tight">
            {deployment.commit}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <GitBranch className="h-3 w-3 shrink-0" />
            <span className="truncate font-mono">{deployment.branch}</span>
          </div>
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <Badge variant="outline" className={cn("text-[10px] h-4 px-1.5", color)}>
              {label}
            </Badge>
            <span className="text-[11px] text-muted-foreground whitespace-nowrap">
              {relativeTime(deployment.createdAt)} · {deployment.duration}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
