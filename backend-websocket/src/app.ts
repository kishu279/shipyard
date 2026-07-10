import express from "express";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./auth/better-auth";

const app = express();

// app.all("/api/auth/*", toNodeHandler(auth));

export default app;
