import type { RedisClientType } from "redis";
import redis from "./redis";
import {
  checkDockerInstalled,
  connectSSH,
  disconnectSSH,
  getDeviceInfo,
} from "./ssh";
import { pickOneJob } from "./worker";

async function main() {
  console.log("Worker is starting...");

  await redis.connect();
  await connectSSH();

  console.log("Worker is started...");

  try {
    const stream = "message-brokers";

    const deviceInfo = await getDeviceInfo();
    console.log("Device Info:", deviceInfo);
    // emit an event to the server with the device info
    let message = await redis.sendCommand([
      "XADD",
      stream,
      "*",
      "deviceInfo",
      JSON.stringify(deviceInfo),
    ]);
    console.log("Message sent to Redis stream:", message);

    const response = await redis.sendCommand(["PING"]);
    console.log("Redis PING response:", response);

    let message1 = await redis.sendCommand([
      "XADD",
      stream,
      "*",
      "message",
      "Hello from the worker!",
    ]);
    console.log("Message sent to Redis stream:", message1);

    const dockerInfo = await checkDockerInstalled();
    console.log("Docker Info:", dockerInfo);
    // emit an event to the server with the docker info

    const response1 = await redis.sendCommand(["PING"]);
    console.log("Redis PING response:", response1);

    // while (true) {
    //   const job = await pickOneJob(redis as unknown as RedisClientType);
    //   console.log(job);
    // }
  } catch (error) {
    console.error(error);
  } finally {
    await redis.disconnect();
    await disconnectSSH();
  }
}

main();
