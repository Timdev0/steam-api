import express from "express";
import cors from "cors";
import { playerRouter } from "./routes/player.routes.js";
import { resolveRouter } from "./routes/resolve.routes.js";

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
  app.use("/api/player", playerRouter);
  app.use("/api/resolve", resolveRouter);
  
  return app;
}