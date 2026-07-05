import { NodeSSH } from "node-ssh";
import fs from "fs";
import os from "os";
import path from "path";

const ssh = new NodeSSH();

/**
 * connect to the remote server via SSH using the provided credentials.
 * @returns
 */
export async function connectSSH() {
  await ssh.connect({
    host: process.env.SSH_HOST!,
    username: process.env.SSH_USER!,
    privateKey: fs.readFileSync(
      path.resolve(process.env.SSH_KEY_PATH!.replace(/^~/, os.homedir())),
      "utf-8",
    ),
  });
  return ssh;
}

/**
 * disconnect from the remote server via SSH.
 * @returns
 */
export async function disconnectSSH() {
  ssh.dispose();
}

export async function runCommand(command: string, cwd = "/home") {
  const result = await ssh.execCommand(command, { cwd });
  if (result.code !== 0) throw new Error(result.stderr || result.stdout);
  return result.stdout;
}

/**
 * Check the device information by running commands on the remote server via SSH.
 * @returns
 */
export async function getDeviceInfo() {
  const [hostname, os, cpu, memory, disk] = await Promise.all([
    runCommand("hostname"),
    runCommand("cat /etc/os-release | grep PRETTY_NAME"),
    runCommand("lscpu | grep 'Model name'"),
    runCommand("free -h | grep Mem"),
    runCommand("df -h /"),
  ]);

  return { hostname, os, cpu, memory, disk };
}

export async function updatePackages() {
  await runCommand("sudo apt-get update -y");
}

export async function installDocker() {
  const commands = [
    "sudo apt-get update -y",
    "sudo apt-get install -y ca-certificates curl gnupg",
    "sudo install -m 0755 -d /etc/apt/keyrings",
    "curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg",
    "sudo chmod a+r /etc/apt/keyrings/docker.gpg",
    `echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null`,
    "sudo apt-get update -y",
    "sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin",
    "sudo systemctl start docker",
    "sudo systemctl enable docker",
    "docker run hello-world",
  ];

  for (const cmd of commands) {
    console.log(`Running: ${cmd}`);
    const output = await runCommand(cmd);
    if (output) console.log(output);
  }
}

/**
 * check docker is present or not by running commands on the remote server via SSH.
 * @returns
 */
export async function checkDockerInstalled() {
  try {
    const dockerPresent = await runCommand("which docker");
    const dockerVersion = await runCommand("docker --version");

    return {
      dockerPresent: !!dockerPresent.trim(),
      dockerVersion: dockerVersion.trim(),
    };
  } catch (error) {
    throw new Error("Docker is not installed on the remote server.");
  }
}

const CLONE_DIR = "/home/ubuntu";

function getRepoPath(repoUrl: string) {
  const repoName = repoUrl.split("/").pop()?.replace(".git", "") ?? "repo";
  return `${CLONE_DIR}/${repoName}`;
}

/**
 * check if the repo has already been cloned on the remote server.
 * @param repoPath
 * @returns
 */
export async function checkRepoExists(repoPath: string) {
  const result = await ssh.execCommand(`test -d ${repoPath}/.git`);
  return result.code === 0;
}

/**
 * cloning the repo on the aws console
 * @param repoUrl
 * @returns
 */
export async function cloneRepository(repoUrl: string) {
  const repoPath = getRepoPath(repoUrl);
  try {
    const result = await ssh.execCommand(`git clone ${repoUrl}`, {
      cwd: CLONE_DIR,
    });

    if (result.code === 0) {
      console.log(`Repository cloned successfully to ${repoPath}`);
      return { output: result.stdout, repoPath };
    }

    throw new Error(result.stderr);
  } catch (error) {
    throw new Error(`Failed to clone repository: ${error}`);
  }
}

/**
 * pulling the latest changes for an already cloned repo on the remote server.
 * @param repoPath
 * @returns
 */
export async function pullRepository(repoPath: string) {
  try {
    const result = await ssh.execCommand("git pull", { cwd: repoPath });

    if (result.code === 0) {
      console.log(`Repository pulled successfully at ${repoPath}`);
      return { output: result.stdout, repoPath };
    }

    throw new Error(result.stderr);
  } catch (error) {
    throw new Error(`Failed to pull repository: ${error}`);
  }
}

/**
 * clone the repo if it doesn't exist yet on the remote server, otherwise pull the latest changes.
 * @param repoUrl
 * @returns
 */
export async function cloneOrPullRepository(repoUrl: string) {
  const repoPath = getRepoPath(repoUrl);
  const exists = await checkRepoExists(repoPath);

  if (exists) {
    return pullRepository(repoPath);
  }

  return cloneRepository(repoUrl);
}

/**
 * docker build the image on the remote server via SSH.
 * @param dockerfilePath
 * @param imageName
 * @returns
 */
export async function buildDockerImage(repoPath: string, imageName: string) {
  try {
    const response = await runCommand(
      `docker build -t ${imageName} .`,
      repoPath,
    );
    return response;
  } catch (error) {
    throw new Error(`Failed to build docker image: ${error}`);
  }
}

export async function runDockerContainer(
  imageName: string,
  containerName: string,
) {
  try {
    const response = await runCommand(
      `docker run -d -p 3000:3000 --name ${containerName} ${imageName}`,
    );
    return response;
  } catch (error) {
    throw new Error(`Failed to run docker container: ${error}`);
  }
}
