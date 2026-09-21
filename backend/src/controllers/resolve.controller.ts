import type { Request, Response } from "express";
import { resolveSteamId } from "../services/steam.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const resolve = asyncHandler(async (req: Request, res: Response) => {
  const raw = req.query.input;
  const input = typeof raw === "string" ? raw : undefined;

  if (!input) {
    res.status(400).json({ error: "Missing input" });
    return;
  }

  const steamId = await resolveSteamId(input);
  if (!steamId) {
    res.status(404).json({ error: "Profile not found" });
    return;
  }
  res.json({ steamId });
});
