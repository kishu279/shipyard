"use client";

import { Badge } from "@/components/ui/badge";
import { environmentVariables } from "@/data/environmentVariables";
import { Separator } from "@/components/ui/separator";
import { KeyRound, EyeOff } from "lucide-react";

const envColors: Record<string, "default" | "secondary" | "outline"> = {
  production: "default",
  preview: "secondary",
  development: "outline",
};

export function DeploymentEnvVars() {
  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex items-center gap-2 border-b px-4 py-3">
          <div className="rounded-lg bg-primary/10 p-1.5">
            <KeyRound className="h-4 w-4 text-primary" />
          </div>
          <span className="text-sm font-medium">Environment Variables</span>
          <Badge variant="outline" className="ml-auto text-[10px] tabular-nums">
            {environmentVariables.length} variables
          </Badge>
        </div>

        <div className="divide-y">
          {environmentVariables.map((env) => (
            <div
              key={env.key}
              className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-muted/30"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted/50">
                <EyeOff className="h-3 w-3 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium font-mono">{env.key}</p>
              </div>
              <Badge
                variant={envColors[env.environment] || "outline"}
                className="text-[10px] font-mono"
              >
                {env.environment}
              </Badge>
            </div>
          ))}
        </div>

        <Separator />

        <div className="px-4 py-2.5 text-[11px] text-muted-foreground">
          Values are encrypted and not shown for security reasons.
        </div>
      </div>
    </div>
  );
}
