"use client";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { DeploymentSettings } from "./deployment-settings";
import { DeploymentConsole } from "./deployment-console";
import { DeploymentEnvVars } from "./deployment-env-vars";
import { DeploymentBuildInfo } from "./deployment-build-info";
import { DeploymentSummary } from "./deployment-summary";
import type { Deployment } from "@/data/deployments";
import {
  Settings2,
  Terminal,
  KeyRound,
  Info,
  FileText,
} from "lucide-react";

const sections = [
  {
    id: "settings",
    label: "Deployment Settings",
    icon: Settings2,
    component: DeploymentSettings,
  },
  {
    id: "console",
    label: "Build Console",
    icon: Terminal,
    component: DeploymentConsole,
    requiresProjectId: true as const,
  },
  {
    id: "env-vars",
    label: "Environment Variables",
    icon: KeyRound,
    component: DeploymentEnvVars,
  },
  {
    id: "build-info",
    label: "Build Information",
    icon: Info,
    component: DeploymentBuildInfo,
  },
  {
    id: "summary",
    label: "Deployment Summary",
    icon: FileText,
    component: DeploymentSummary,
    requiresDeployment: true as const,
  },
] as const;

type Props = {
  deployment: Deployment;
  projectId: string;
};

export function DeploymentAccordion({ deployment, projectId }: Props) {
  return (
    <Accordion type="multiple" defaultValue={["console"]} className="w-full">
      {sections.map((section) => {
        const Icon = section.icon;

        if ("requiresProjectId" in section && section.requiresProjectId) {
          const Component = section.component as React.ComponentType<{ projectId: string }>;
          return (
            <AccordionItem key={section.id} value={section.id}>
              <AccordionTrigger className="px-1">
                <span className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span>{section.label}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="px-1">
                  <Component projectId={projectId} />
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        }

        if ("requiresDeployment" in section && section.requiresDeployment) {
          const Component = section.component as React.ComponentType<{ deployment: Deployment }>;
          return (
            <AccordionItem key={section.id} value={section.id}>
              <AccordionTrigger className="px-1">
                <span className="flex items-center gap-2.5">
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span>{section.label}</span>
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="px-1">
                  <Component deployment={deployment} />
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        }

        const Component = section.component as React.ComponentType<{}>;
        return (
          <AccordionItem key={section.id} value={section.id}>
            <AccordionTrigger className="px-1">
              <span className="flex items-center gap-2.5">
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span>{section.label}</span>
              </span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="px-1">
                <Component />
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
