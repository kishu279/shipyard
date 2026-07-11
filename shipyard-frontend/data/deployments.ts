export type DeploymentStatus = "success" | "building" | "failed" | "cancelled";

export type Deployment = {
  id: string;
  commit: string;
  branch: string;
  status: DeploymentStatus;
  createdAt: string;
  duration: string;
  author: string;
  sha: string;
};

export const deployments: Deployment[] = [
  // Today
  {
    id: "dpl_Aa1bCc2dEe3f",
    commit: "fix: resolve hydration mismatch on dashboard page",
    branch: "main",
    status: "success",
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString(),
    duration: "1m 12s",
    author: "kishu",
    sha: "a3f9c12",
  },
  {
    id: "dpl_Bb2cDd3eFf4g",
    commit: "feat: add deployment logs streaming via websocket",
    branch: "feat/logs-streaming",
    status: "building",
    createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    duration: "—",
    author: "kishu",
    sha: "b7e2d45",
  },
  {
    id: "dpl_Cc3dEe4fGg5h",
    commit: "chore: bump next.js to 16.2.9 and audit deps",
    branch: "main",
    status: "failed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    duration: "0m 43s",
    author: "kishu",
    sha: "c1a8f67",
  },
  // Yesterday
  {
    id: "dpl_Dd4eEf5gHh6i",
    commit: "refactor: extract project sidebar into reusable component",
    branch: "main",
    status: "success",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
    duration: "1m 05s",
    author: "kishu",
    sha: "d4b3e89",
  },
  {
    id: "dpl_Ee5fFg6hIi7j",
    commit: "fix: credentials form validation edge case on empty host",
    branch: "fix/credentials",
    status: "success",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 30).toISOString(),
    duration: "58s",
    author: "kishu",
    sha: "e9c7a23",
  },
  {
    id: "dpl_Ff6gGh7iJj8k",
    commit: "feat: webhook creation with real-time status polling",
    branch: "feat/webhooks",
    status: "failed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 34).toISOString(),
    duration: "1m 22s",
    author: "kishu",
    sha: "f2d5b01",
  },
  // Older
  {
    id: "dpl_Gg7hHi8jKk9l",
    commit: "init: scaffold project with create-next-app and shadcn",
    branch: "main",
    status: "success",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    duration: "2m 01s",
    author: "kishu",
    sha: "g6e1c34",
  },
  {
    id: "dpl_Hh8iIj9kLl0m",
    commit: "ci: add github actions workflow for preview deployments",
    branch: "ci/preview",
    status: "success",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    duration: "1m 48s",
    author: "kishu",
    sha: "h8f4d56",
  },
  {
    id: "dpl_Ii9jJk0lMm1n",
    commit: "style: apply global design tokens from shadcn theme config",
    branch: "main",
    status: "cancelled",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
    duration: "0m 18s",
    author: "kishu",
    sha: "i3a9e78",
  },
];
