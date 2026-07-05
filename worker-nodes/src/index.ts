import type { RedisClientType } from "redis";
import redis, { publishEvent } from "./redis";
import {
  checkDockerInstalled,
  cloneOrPullRepository,
  buildDockerImage,
  runDockerContainer,
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

    while (true) {
      const deviceInfo = await getDeviceInfo();
      await publishEvent(stream, "deviceInfo", deviceInfo);
      console.log("deviceInfo:", deviceInfo);

      const dockerInfo = await checkDockerInstalled();
      await publishEvent(stream, "dockerInfo", dockerInfo);
      console.log("dockerInfo:", dockerInfo);

      const repoUrl = process.env.REPO_URL!;
      const cloneResult = await cloneOrPullRepository(repoUrl);
      await publishEvent(stream, "cloneRepository", { repoUrl, output: cloneResult.output });
      console.log("cloneRepository:", cloneResult);

      const imageName = process.env.DOCKER_IMAGE_NAME!;
      const buildResult = await buildDockerImage(cloneResult.repoPath, imageName);
      await publishEvent(stream, "buildDockerImage", { imageName, output: buildResult });
      console.log("buildDockerImage:", buildResult);

      const containerName = process.env.CONTAINER_NAME!;
      const runResult = await runDockerContainer(imageName, containerName);
      await publishEvent(stream, "runDockerContainer", { containerName, output: runResult });
      console.log("runDockerContainer:", runResult);

      break;
    }
  } catch (error) {
    console.error(error);
  } finally {
    await redis.disconnect();
    await disconnectSSH();
  }
}

main();
