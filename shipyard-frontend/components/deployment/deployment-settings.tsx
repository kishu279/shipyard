"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const settings = [
  { label: "Framework", value: "Next.js" },
  { label: "Node Version", value: "20.x" },
  { label: "Build Command", value: "npm run build" },
  { label: "Output Directory", value: ".next" },
  { label: "Root Directory", value: "/" },
  { label: "Install Command", value: "npm ci" },
  { label: "Package Manager", value: "npm" },
  { label: "Node.js Helper", value: "vercel-node" },
];

export function DeploymentSettings() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        {settings.map((s) => (
          <div
            key={s.label}
            className="rounded-lg border bg-card px-4 py-3 transition-colors hover:bg-muted/30"
          >
            <p className="text-xs text-muted-foreground">{s.label}</p>
            <p className="mt-0.5 font-mono text-sm font-medium">{s.value}</p>
          </div>
        ))}
      </div>

      <Separator />

      <Card size="sm">
        <CardHeader>
          <CardTitle>Build System Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded-lg bg-muted/50 p-3 font-mono text-xs">
            <pre className="text-muted-foreground">
              {`{
  "framework": "nextjs",
  "nodeVersion": "20.x",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm ci"
}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
