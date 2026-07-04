import { createServer } from "node:http";
import { Server, type Socket } from "socket.io";
import redis from "./redis";
import type { RedisClientType } from "redis";

type ReadingJobResponse = {
  [streamName: string]: [[string, string[]]];
};

const stream = "message-brokers";
const group = "message-workers";
const workerId = "worker-1";

const users = new Map<string, Socket>();

type BetterAuthSession = {
  session: { userId: string };
  user: { id: string };
} | null;

async function getSession(
  cookie: string | undefined,
): Promise<BetterAuthSession> {
  if (!cookie) return null;

  const res = await fetch(
    `${process.env.BETTER_AUTH_URL}/api/auth/get-session`,
    {
      headers: { cookie },
    },
  );

  if (!res.ok) return null;
  return res.json() as Promise<BetterAuthSession>;
}

// create the function for looping with the data
async function getRedisEvents(redis: RedisClientType) {
  while (true) {
    const res = await redis.xReadGroup(
      group,
      workerId,
      [{ key: stream, id: ">" }],
      { BLOCK: 0, COUNT: 1 },
    );

    // if (!res) continue;

    // const [streamData] = res;
    // const [message] = streamData.messages;

    // const userId = message.message.userId as string;
    // const data = message.message.data as string;

    // const socket = users.get(userId);
    // if (socket) {
    //   socket.emit("message", data);
    // }

    console.log(
      "Received Redis event:",
      JSON.stringify(res, null, 2),
    );
    // await redis.xAck(stream, group, message.id);
  }
}

async function main() {
  const httpServer = createServer();
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.BETTER_AUTH_URL,
      credentials: true,
    },
  });

  await redis.connect();

  try {
    await redis.xGroupCreate(stream, group, "$", { MKSTREAM: true });
  } catch (err) {
    if (!(err instanceof Error) || !err.message.includes("BUSYGROUP")) {
      throw err;
    }
  }

  io.use(async (socket, next) => {
    const session = await getSession(socket.handshake.headers.cookie);

    if (!session?.user) {
      next(new Error("unauthorized"));
      return;
    }

    socket.data.userId = session.user.id;
    next();
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId as string;

    users.set(userId, socket);
    console.log("Client connected:", userId);

    socket.emit("message", "Hello, world!");

    socket.on("message", (data) => {
      console.log("Received:", data);
      socket.emit("message", data);
    });

    socket.on("disconnect", () => {
      users.delete(userId);
      console.log("Client disconnected:", userId);
    });
  });

  // runs services
  getRedisEvents(redis).catch((err) => {
    console.error("Error in getRedisEvents:", err);
  });

  httpServer.listen(3800, () => {
    console.log("Socket.IO server listening on ws://localhost:3800");
  });
}

main();
