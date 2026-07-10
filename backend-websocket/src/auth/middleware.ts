import type { Request, Response, NextFunction } from "express";
import { getSession } from "./session";

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const session = await getSession(req.headers.cookie);
  if (!session?.user) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  (req as any).user = session.user;
  next();
}
