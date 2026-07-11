export type LogLevel = "info" | "success" | "warning" | "error";

export type LogEntry = {
  id: number;
  timestamp: string;
  message: string;
  level: LogLevel;
};

export const buildLogs: LogEntry[] = [
  { id: 1,  timestamp: "17:39:01", level: "info",    message: "Cloning github.com/shipyard/app (branch: main)" },
  { id: 2,  timestamp: "17:39:02", level: "info",    message: "Detected framework: Next.js" },
  { id: 3,  timestamp: "17:39:02", level: "info",    message: "Installing dependencies using npm ci..." },
  { id: 4,  timestamp: "17:39:08", level: "warning", message: "Deprecated package detected: lodash@3.10.1" },
  { id: 5,  timestamp: "17:39:09", level: "info",    message: "Dependencies installed in 7.2s" },
  { id: 6,  timestamp: "17:39:09", level: "info",    message: "Running build command: next build" },
  { id: 7,  timestamp: "17:39:10", level: "info",    message: "  ▲ Next.js 16.2.9" },
  { id: 8,  timestamp: "17:39:10", level: "info",    message: "  - Environments: .env" },
  { id: 9,  timestamp: "17:39:11", level: "info",    message: "   Creating an optimized production build ..." },
  { id: 10, timestamp: "17:39:11", level: "info",    message: "   Generating static pages using 1 worker (2/6)" },
  { id: 11, timestamp: "17:39:11", level: "info",    message: "   Generating static pages using 1 worker (4/6)" },
  { id: 12, timestamp: "17:39:11", level: "info",    message: "   Finalizing page optimization..." },
  { id: 13, timestamp: "17:39:11", level: "info",    message: "   Running onBuildComplete from Vercel" },
  { id: 14, timestamp: "17:39:12", level: "info",    message: "" },
  { id: 15, timestamp: "17:39:12", level: "info",    message: "Route (app)                              Size     First Load JS" },
  { id: 16, timestamp: "17:39:12", level: "info",    message: "┌ ○ /                                    5.2 kB         102 kB" },
  { id: 17, timestamp: "17:39:12", level: "info",    message: "├ ○ /_not-found                          977 B         97.2 kB" },
  { id: 18, timestamp: "17:39:12", level: "info",    message: "├ ƒ /api/send                            0 B                0 B" },
  { id: 19, timestamp: "17:39:12", level: "info",    message: "└ ○ /home                                3.1 kB         99.3 kB" },
  { id: 20, timestamp: "17:39:12", level: "info",    message: "" },
  { id: 21, timestamp: "17:39:13", level: "success", message: "Build Completed in /vercel/output [16s]" },
  { id: 22, timestamp: "17:39:13", level: "info",    message: "Deploying outputs..." },
  { id: 23, timestamp: "17:39:14", level: "info",    message: "Assigning custom domains..." },
  { id: 24, timestamp: "17:39:15", level: "success", message: "Deployment completed" },
  { id: 25, timestamp: "17:39:15", level: "info",    message: "Creating build cache..." },
  { id: 26, timestamp: "17:39:34", level: "info",    message: "Created build cache: 19s" },
  { id: 27, timestamp: "17:39:34", level: "info",    message: "Uploading build cache [159 MB]" },
  { id: 28, timestamp: "17:39:38", level: "success", message: "Build cache uploaded: 3.7s" },
];
