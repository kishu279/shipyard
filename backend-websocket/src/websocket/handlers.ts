import type { Socket } from "socket.io";
import { users } from "./connections";

export function registerHandlers(socket: Socket) {
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
}
