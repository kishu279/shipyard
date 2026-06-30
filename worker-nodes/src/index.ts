import type { RedisClientType } from "redis";
import redis from "./redis";

function doJob() {}

const GROUP = "webhook-workers";
const CONSUMER = "worker-1";
const STREAM = "webhooks-stream";

type ReadingJobResponse = {
  [streamName: string]: [[string, string[]]];
};

async function pickOneJob(redis: RedisClientType) {
  // pick that job
  const response = (await redis.sendCommand([
    "XREADGROUP",
    "GROUP",
    "webhook-workers",
    "worker-1",
    "BLOCK",
    "0",
    "COUNT",
    "1",
    "STREAMS",
    "webhooks-stream",
    ">",
  ])) as ReadingJobResponse;

  // Response is an object like: { "webhooks-stream": [[messageId, [field1, value1, ...]]] }
  const messages = response[STREAM];

  if (!messages || messages.length === 0) {
    console.log("No messages available");
    return null;
  }

  const [message] = messages;
  const [messageId, fields] = message;

  console.log("Message ID:", messageId);
  console.log("Fields:", fields);

  // ack that job
  await redis.sendCommand([
    "XACK",
    "webhooks-stream",
    "webhook-workers",
    messageId,
  ]);

  return response;
}

async function main() {
  // initialize the application
  console.log("Worker is starting...");
  await redis.connect();

  console.log("Worker is started...");

  try {
    while (true) {
      // pick one job
      const jobPicked = await pickOneJob(redis as unknown as RedisClientType);
      console.log(jobPicked);

      // process one job
      // ...
    }
  } catch (error) {
    console.log(error);
  } finally {
    await redis.disconnect();
  }
}

main();
