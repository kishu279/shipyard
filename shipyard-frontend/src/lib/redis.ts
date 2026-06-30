import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL! || "redis://localhost:6379",
  // token: process.env.REDIS_TOKEN!,
});

export default redis;
