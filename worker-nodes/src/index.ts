import type { RedisClientType } from "redis";
import redis from "./redis";
import { connectSSH, disconnectSSH, getDeviceInfo } from "./ssh";
import { pickOneJob } from "./worker";

async function main() {
  console.log("Worker is starting...");

  await redis.connect();
  await connectSSH();

  console.log("Worker is started...");

  try {
    const deviceInfo = await getDeviceInfo();
    console.log("Device Info:", deviceInfo);

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
