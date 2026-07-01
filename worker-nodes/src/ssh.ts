import { NodeSSH } from "node-ssh";
import fs from "fs";
import os from "os";
import path from "path";

const ssh = new NodeSSH();

export async function connectSSH() {
  await ssh.connect({
    host: process.env.SSH_HOST!,
    username: process.env.SSH_USER!,
    privateKey: fs.readFileSync(path.resolve(process.env.SSH_KEY_PATH!.replace(/^~/, os.homedir())), 'utf-8'),
  });
  return ssh;
}

export async function disconnectSSH() {
  ssh.dispose();
}

export async function runCommand(command: string, cwd = "/home") {
  const result = await ssh.execCommand(command, { cwd });
  if (result.stderr) throw new Error(result.stderr);
  return result.stdout;
}

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
