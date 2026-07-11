import type { RedisClientType } from "redis";
import redis, { publishEvent } from "./redis";
import {
  checkDockerInstalled,
  cloneOrPullRepository,
  buildDockerImage,
  runDockerContainer,
  installNginx,
  configureNginx,
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
      await publishEvent(stream, "cloneRepository", { repoUrl, output: cloneResult.output, userId: "Kishu279" });
      console.log("cloneRepository:", cloneResult);

      const imageName = process.env.DOCKER_IMAGE_NAME!;
      const buildResult = await buildDockerImage(cloneResult.repoPath, imageName);
      await publishEvent(stream, "buildDockerImage", { imageName, output: buildResult , userId: "Kishu279" });
      console.log("buildDockerImage:", buildResult);

      const containerName = process.env.CONTAINER_NAME!;
      const runResult = await runDockerContainer(imageName, containerName);
      await publishEvent(stream, "runDockerContainer", { containerName, output: runResult, userId: "Kishu279" });
      console.log("runDockerContainer:", runResult);

      const nginxInstallResult = await installNginx();
      await publishEvent(stream, "installNginx", { output: nginxInstallResult, userId: "Kishu279" });
      console.log("installNginx:", nginxInstallResult);

      const serverName = process.env.SSH_HOST!;
      const nginxConfigResult = await configureNginx(serverName);
      await publishEvent(stream, "configureNginx", { serverName, output: nginxConfigResult, userId: "Kishu279" });
      console.log("configureNginx:", nginxConfigResult);

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
