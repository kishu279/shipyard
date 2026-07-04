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
  if (result.stderr) throw new Error(result.stderr);
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
