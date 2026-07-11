"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DeploymentItem } from "./deployment-item";
import { Search, Box } from "lucide-react";
import { deployments, type Deployment } from "@/data/deployments";


function getGroupLabel(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const hrs = diff / (1000 * 60 * 60);

  if (hrs < 24) return "Today";
  if (hrs < 48) return "Yesterday";
  return "Older";
}

type GroupedDeployments = Record<string, Deployment[]>;

type Props = {
  selectedId: string | null;
  onSelect: (deployment: Deployment) => void;
};

export function DeploymentSidebar({ selectedId, onSelect }: Props) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return deployments;
    const q = search.toLowerCase();
    return deployments.filter(
      (d) =>
        d.commit.toLowerCase().includes(q) ||
        d.branch.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q) ||
        d.sha.toLowerCase().includes(q)
    );
  }, [search]);

  const grouped = useMemo(() => {
    const groups: GroupedDeployments = {};
    for (const d of filtered) {
      const label = getGroupLabel(d.createdAt);
      if (!groups[label]) groups[label] = [];
      groups[label].push(d);
    }
    return groups;
  }, [filtered]);

  return (
    <div className="flex h-full flex-col">
      <div className="shrink-0 p-3 pb-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search deployments..."
            className="h-8 pl-8 text-xs"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <p className="mt-1.5 text-[11px] text-muted-foreground">
          {filtered.length} deployment{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      <ScrollArea className="flex-1 px-2 pb-3">
        {Object.keys(grouped).length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <Box className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-xs text-muted-foreground">No deployments found</p>
          </div>
        ) : (
          Object.entries(grouped).map(([label, items]) => (
            <div key={label} className="mb-3">
              <div className="flex items-center gap-2 px-1 py-1.5">
                <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                  {label}
                </span>
                <span className="h-px flex-1 bg-border" />
                <span className="text-[10px] text-muted-foreground/60 tabular-nums">
                  {items.length}
                </span>
              </div>
              <div className="space-y-0.5">
                {items.map((d) => (
                  <DeploymentItem
                    key={d.id}
                    deployment={d}
                    selected={d.id === selectedId}
                    onClick={() => onSelect(d)}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </ScrollArea>
    </div>
  );
}
