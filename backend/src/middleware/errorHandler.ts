import type { NextFunction, Request, Response } from "express";
import { SteamApiError } from "../errors/SteamApiError.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- Express requires a 4-argument signature to recognize this as an error handler
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof SteamApiError) {
    console.error(`[SteamApiError] ${err.message}`);
    res.status(err.status).json({ error: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ error: "Server error" });
}
