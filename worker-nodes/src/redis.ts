import { createClient } from "redis";

const redis = createClient({
  url: process.env.REDIS_URL! || "redis://localhost:6379",
  // token: process.env.REDIS_TOKEN!,
});

/**
 * Push an event onto a Redis stream via XADD.
 * @param stream the stream key to push to
 * @param eventType the field name identifying the event kind (e.g. "deviceInfo")
 * @param data the payload; objects are JSON-stringified, strings are sent as-is
 */
export async function publishEvent(
  stream: string,
  eventType: string,
  data: unknown,
) {
  const payload = typeof data === "string" ? data : JSON.stringify(data);

  return redis.sendCommand(["XADD", stream, "*", eventType, payload]);
}

export default redis;
