"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Cpu,
  Globe,
  Timer,
  HardDrive,
  Database,
  CheckCircle2,
} from "lucide-react";

const buildInfoItems = [
  {
    label: "Framework",
    value: "Next.js 16.2.9",
    icon: Cpu,
    description: "React-based web framework",
  },
  {
    label: "Runtime",
    value: "Node.js 20.x",
    icon: Database,
    description: "JavaScript runtime environment",
  },
  {
    label: "Region",
    value: "us-east-1",
    icon: Globe,
    description: "AWS US East (N. Virginia)",
  },
  {
    label: "Build Duration",
    value: "1m 12s",
    icon: Timer,
    description: "Total build time",
  },
  {
    label: "Cache Status",
    value: "Hit (restored)",
    icon: HardDrive,
    description: "Build cache from previous deployment",
  },
  {
    label: "Deployment Size",
    value: "159 MB",
    icon: HardDrive,
    description: "Total artifact size",
  },
];

export function DeploymentBuildInfo() {
  return (
    <div className="space-y-4">
      <Card size="sm">
        <CardHeader>
          <CardTitle>Build Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {buildInfoItems.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 rounded-lg border bg-card px-3 py-2.5 transition-colors hover:bg-muted/30"
              >
                <div className="mt-0.5 rounded-md bg-muted/50 p-1.5">
                  <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="text-sm font-medium">{item.value}</p>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Build Checks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            { label: "TypeScript Check", status: "passed" },
            { label: "ESLint", status: "passed" },
            { label: "Unit Tests", status: "passed" },
            { label: "Bundle Analysis", status: "passed" },
          ].map((check) => (
            <div
              key={check.label}
              className="flex items-center justify-between rounded-lg bg-muted/30 px-3 py-2"
            >
              <span className="text-sm">{check.label}</span>
              <Badge
                variant="outline"
                className="gap-1 text-green-500 bg-green-500/5 border-green-500/20 text-[10px]"
              >
                <CheckCircle2 className="h-3 w-3" />
                {check.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
