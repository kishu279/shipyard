export type EnvVar = {
  key: string;
  environment: "production" | "preview" | "development";
};

export const environmentVariables: EnvVar[] = [
  { key: "DATABASE_URL",           environment: "production" },
  { key: "NEXT_PUBLIC_API_URL",    environment: "production" },
  { key: "NEXTAUTH_SECRET",        environment: "production" },
  { key: "REDIS_URL",              environment: "production" },
  { key: "GITHUB_CLIENT_ID",       environment: "production" },
  { key: "GITHUB_CLIENT_SECRET",   environment: "production" },
  { key: "NEXT_PUBLIC_WEBHOOK_URL",environment: "production" },
  { key: "NODE_ENV",               environment: "production" },
];
