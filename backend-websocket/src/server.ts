import { createServer } from "node:http";
import app from "./app";
import redis from "./redis";
import { setupWebSocket } from "./websocket/server";

const httpServer = createServer(app);

async function main() {
  await redis.connect();
  console.log("Connected to Redis");

  try {
    await redis.xGroupCreate("message-brokers", "message-workers", "$", {
      MKSTREAM: true,
    });
    console.log("Created Redis consumer group");
  } catch (err) {
    if (!(err instanceof Error) || !err.message.includes("BUSYGROUP")) {
      throw err;
    }
  }

  await setupWebSocket(httpServer, redis as any);

  httpServer.listen(3800, () => {
    console.log("Server listening on http://localhost:3800");
  });
}

main();
