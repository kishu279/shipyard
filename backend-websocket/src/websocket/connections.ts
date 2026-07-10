import type { Socket } from "socket.io";

export const users = new Map<string, Socket>();
