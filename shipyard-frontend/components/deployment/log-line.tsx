import { cn } from "@/lib/utils";
import type { LogEntry } from "@/data/buildLogs";

const levelColor: Record<LogEntry["level"], string> = {
  info:    "text-zinc-300",
  success: "text-green-400",
  warning: "text-yellow-400",
  error:   "text-red-400",
};

export function LogLine({ log }: { log: LogEntry }) {
  if (!log.message.trim()) return <div className="h-2.5" />;

  return (
    <div className="flex gap-4 leading-5 hover:bg-white/5 px-1 rounded">
      <span className="shrink-0 select-none tabular-nums text-zinc-600 w-16">
        {log.timestamp}
      </span>
      <span className={cn("whitespace-pre-wrap break-all", levelColor[log.level])}>
        {log.message}
      </span>
    </div>
  );
}
