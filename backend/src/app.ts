import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { steamApiLimiter } from "./middleware/rateLimiter.js";
import { playerRouter } from "./routes/player.routes.js";
import { resolveRouter } from "./routes/resolve.routes.js";

export function createApp() {
  const app = express();

  app.use(cors({ origin: env.frontendUrls }));
  app.use(express.json());

  app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

  // Rate limit only the routes that consume the Steam API quota.
  app.use("/api", steamApiLimiter);
  app.use("/api/player", playerRouter);
  app.use("/api/resolve", resolveRouter);

  app.use(errorHandler);

  return app;
}
