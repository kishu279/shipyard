import type { Socket } from "socket.io";
import { getSession } from "../auth/session";

export async function wsAuth(
  socket: Socket,
  next: (err?: Error) => void,
) {
  const session = await getSession(socket.handshake.headers.cookie);

  if (!session?.user) {
    next(new Error("unauthorized"));
    return;
  }

  socket.data.userId = session.user.id;
  next();
}
