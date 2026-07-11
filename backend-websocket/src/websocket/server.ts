import { Server } from "socket.io";
import type { HttpServer } from "socket.io/dist/index";
import type { RedisClientType } from "redis";
import { wsAuth } from "./auth";
import { registerHandlers } from "./handlers";
import { users } from "./connections";

const stream = "message-brokers";
const group = "message-workers";
const workerId = "worker-1";

type RawStreamResponse = [string, [string, string[]][]][];

async function consumeRedisEvents(redis: RedisClientType) {
  while (true) {
    const res = (await redis.sendCommand([
      "XREADGROUP",
      "GROUP",
      group,
      workerId,
      "BLOCK",
      "0",
      "COUNT",
      "1",
      "STREAMS",
      stream,
      ">",
    ])) as RawStreamResponse | null;

    if (!res) continue;

    const broker = res["message-brokers"][0];
    // console.log(JSON.stringify(broker, null, 2));

    const [messageId, fields] = broker;
    // console.log(`Received message with ID: ${messageId}`);

    const [event, payload] = fields;
    // console.log("payload: ", { payload });

    const payloadJson =
      typeof payload === "string" ? JSON.parse(payload) : payload;
    // console.log(`Received event: ${event} with payload: ${payloadJson}`);

    const objectKeys = Object.keys(payloadJson);
    // console.log("objectKeys: ", { objectKeys });
    console.log(`Received event: ${event} with payload keys: ${payload}}`);

    // TODO: route to user socket once producer sends userId
    // users.get(payload.userId)?.emit(event, payloadJson);

    // acknowledge
    await redis.sendCommand(["XACK", stream, group, messageId]);
  }
}

export async function setupWebSocket(
  httpServer: HttpServer,
  redis: RedisClientType,
) {
  const io = new Server(httpServer, {
    
    cors: {
      origin: process.env.BETTER_AUTH_URL,
      credentials: true
    },
  });

  // io.use(wsAuth);
  io.on("connection", registerHandlers);

  console.log("wired up the sockets");

  consumeRedisEvents(redis).catch((err) => {
    console.error("Redis consumer error:", err);
  });
}
