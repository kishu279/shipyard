import type { RedisClientType } from "redis";

const GROUP = "webhook-workers";
const STREAM = "webhooks-stream";

type ReadingJobResponse = {
  [streamName: string]: [[string, string[]]];
};

export async function pickOneJob(redis: RedisClientType) {
  const response = (await redis.sendCommand([
    "XREADGROUP",
    "GROUP",
    GROUP,
    "worker-1",
    "BLOCK",
    "0",
    "COUNT",
    "1",
    "STREAMS",
    STREAM,
    ">",
  ])) as ReadingJobResponse;

  const messages = response[STREAM];

  if (!messages || messages.length === 0) {
    console.log("No messages available");
    return null;
  }

  const [[messageId, fields]] = messages;

  console.log("Message ID:", messageId);
  console.log("Fields:", fields);

  await redis.sendCommand(["XACK", STREAM, GROUP, messageId]);

  return { messageId, fields };
}
