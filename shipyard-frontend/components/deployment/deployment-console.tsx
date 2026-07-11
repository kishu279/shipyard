"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LogLine } from "./log-line";
import type { LogEntry, LogLevel } from "@/data/buildLogs";
import {
  Search,
  Terminal,
  X,
  Download,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SOCKET_URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:3800";

function formatPayload(raw: unknown): string {
  if (typeof raw !== "object" || raw === null) {
    return String(raw ?? "{}");
  }
  try {
    const lines: string[] = [];
    for (const [key, value] of Object.entries(raw as Record<string, unknown>)) {
      const str = typeof value === "object" ? JSON.stringify(value, null, 2) : String(value);
      lines.push(`${key}: ${str}`);
    }
    return lines.join("\n");
  } catch {
    return JSON.stringify(raw);
  }
}

type Props = {
  projectId: string;
};

export function DeploymentConsole({ projectId }: Props) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [connected, setConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const logCounterRef = useRef(0);
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000,
    });

    socket.on("connect", () => {
      setConnected(true);
      setConnectionError(null);

      const entry: LogEntry = {
        id: ++logCounterRef.current,
        timestamp: new Date().toLocaleTimeString(),
        message: `[system] Connected to deployment server (socket id: ${socket.id})`,
        level: "success",
      };
      setLogs((prev) => [...prev, entry]);
    });

    socket.on("disconnect", (reason) => {
      setConnected(false);
      const entry: LogEntry = {
        id: ++logCounterRef.current,
        timestamp: new Date().toLocaleTimeString(),
        message: `[system] Disconnected from server: ${reason}`,
        level: "warning",
      };
      setLogs((prev) => [...prev, entry]);
    });

    socket.on("connect_error", (err) => {
      setConnectionError(err.message);
      const entry: LogEntry = {
        id: ++logCounterRef.current,
        timestamp: new Date().toLocaleTimeString(),
        message: `[system] Connection error: ${err.message}`,
        level: "error",
      };
      setLogs((prev) => [...prev, entry]);
    });

    socket.onAny((eventName: string, ...args: unknown[]) => {
      const formatted = formatPayload(args[0]);

      const entry: LogEntry = {
        id: ++logCounterRef.current,
        timestamp: new Date().toLocaleTimeString(),
        message: `[${eventName}]\n${formatted}`,
        level: "info",
      };
      setLogs((prev) => [...prev, entry]);
    });

    socketRef.current = socket;

    return () => {
      socket.disconnect();
      socketRef.current = null;
      logCounterRef.current = 0;
    };
  }, []);

  const handleClear = useCallback(() => {
    setLogs([]);
    logCounterRef.current = 0;
  }, []);

  const filteredLogs = useMemo(() => {
    if (!searchQuery.trim()) return logs;
    const q = searchQuery.toLowerCase();
    return logs.filter(
      (log) =>
        log.message.toLowerCase().includes(q) ||
        log.timestamp.toLowerCase().includes(q) ||
        log.level.toLowerCase().includes(q)
    );
  }, [logs, searchQuery]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    setAutoScroll(isAtBottom);
  }, []);

  useEffect(() => {
    if (autoScroll && viewportRef.current) {
      const el = viewportRef.current;
      el.scrollTop = el.scrollHeight;
    }
  }, [filteredLogs, autoScroll]);

  return (
    <div className="rounded-xl border bg-card shadow-sm">
      <div className="flex items-center gap-3 border-b px-4 py-3">
        <div className="rounded-lg bg-primary/10 p-1.5">
          <Terminal className="h-4 w-4 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Build Console</span>
            <div
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                connected
                  ? "bg-green-500 animate-pulse"
                  : connectionError
                    ? "bg-red-500"
                    : "bg-yellow-500"
              )}
            />
            <span className="text-[11px] text-muted-foreground">
              {connected ? "Connected" : connectionError ? "Error" : "Connecting..."}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <Badge variant="outline" className="text-[10px] tabular-nums">
            {logs.length} events
          </Badge>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={handleClear}
            disabled={logs.length === 0}
            title="Clear console"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            disabled
            title="Download logs"
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 border-b bg-muted/20 px-4 py-2">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Filter logs..."
            className="h-7 pl-7 text-xs"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        <span className="text-[11px] text-muted-foreground tabular-nums">
          {filteredLogs.length} / {logs.length}
        </span>
        {!autoScroll && filteredLogs.length > 0 && (
          <Button
            variant="outline"
            size="xs"
            className="gap-1 text-[11px] h-6"
            onClick={() => {
              setAutoScroll(true);
              if (viewportRef.current) {
                viewportRef.current.scrollTop = viewportRef.current.scrollHeight;
              }
            }}
          >
            <AlertCircle className="h-3 w-3" />
            Scroll to bottom
          </Button>
        )}
      </div>

      <div
        ref={viewportRef}
        onScroll={handleScroll}
        className="h-[420px] overflow-auto bg-black"
      >
        {filteredLogs.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-zinc-600">
            <Terminal className="h-8 w-8" />
            <span className="font-mono text-xs">
              {searchQuery
                ? "No matching logs found"
                : "Waiting for deployment events..."}
            </span>
            {!searchQuery && (
              <span className="font-mono text-[11px] text-zinc-700">
                Connect to ws://localhost:3800 to receive live events
              </span>
            )}
          </div>
        ) : (
          <div className="p-3 font-mono text-xs leading-relaxed">
            {filteredLogs.map((log) => (
              <LogLine key={log.id} log={log} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
