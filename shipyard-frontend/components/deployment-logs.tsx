"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollText } from "lucide-react";

type LogEntry = {
  timestamp: string;
  level: "info" | "success" | "error" | "warn";
  message: string;
};

const STATIC_LOGS: LogEntry[] = [
  { timestamp: "2025-07-10 14:32:01", level: "info",    message: "Starting deployment pipeline..." },
  { timestamp: "2025-07-10 14:32:03", level: "info",    message: "Cloning repository: main branch" },
  { timestamp: "2025-07-10 14:32:08", level: "info",    message: "Installing dependencies (npm ci)" },
  { timestamp: "2025-07-10 14:32:45", level: "warn",    message: "Deprecated package detected: lodash@3.x" },
  { timestamp: "2025-07-10 14:32:46", level: "info",    message: "Running build: next build" },
  { timestamp: "2025-07-10 14:33:20", level: "success", message: "Build completed successfully" },
  { timestamp: "2025-07-10 14:33:21", level: "info",    message: "Uploading artifacts to server..." },
  { timestamp: "2025-07-10 14:33:35", level: "info",    message: "Restarting application service" },
  { timestamp: "2025-07-10 14:33:38", level: "success", message: "Deployment finished — app is live" },
];

const levelStyles: Record<LogEntry["level"], string> = {
  info:    "text-muted-foreground",
  success: "text-green-500",
  error:   "text-red-500",
  warn:    "text-yellow-500",
};

const levelBadgeVariant: Record<LogEntry["level"], "outline" | "default" | "destructive" | "secondary"> = {
  info:    "outline",
  success: "default",
  error:   "destructive",
  warn:    "secondary",
};

export function DeploymentLogs({ projectId }: { projectId: string }) {
  return (
    <>
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Deployment Logs</h1>
        <p className="text-muted-foreground">Live logs for {projectId}</p>
      </div>

      <Separator className="my-4" />

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex items-center gap-3 border-b px-6 py-4">
          <div className="rounded-lg bg-primary/10 p-2">
            <ScrollText className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-semibold">Latest Deployment</p>
            <p className="text-xs text-muted-foreground">2025-07-10 14:32:01 UTC</p>
          </div>
          <Badge variant="default" className="bg-green-600 hover:bg-green-600">Success</Badge>
        </div>

        <div className="h-[420px] overflow-y-auto rounded-b-xl bg-zinc-950">
          <div className="p-4 font-mono text-xs space-y-1">
            {STATIC_LOGS.map((log, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="shrink-0 text-zinc-500">{log.timestamp}</span>
                <Badge
                  variant={levelBadgeVariant[log.level]}
                  className="shrink-0 uppercase text-[10px] px-1.5 py-0"
                >
                  {log.level}
                </Badge>
                <span className={levelStyles[log.level]}>{log.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
