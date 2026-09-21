import type { Request, Response } from "express";
import { getOwnedGames, getPlayerSummary } from "../services/steam.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getPlayer = asyncHandler(async (req: Request, res: Response) => {
  const raw = req.params.steamId;
  const steamId = Array.isArray(raw) ? raw[0] : raw;

  if (!steamId) {
    res.status(400).json({ error: "SteamID missing" });
    return;
  }

  const player = await getPlayerSummary(steamId);
  if (!player) {
    res.status(404).json({ error: "Player not found" });
    return;
  }
  res.json(player);
});

export const getPlayerOwnedGames = asyncHandler(async (req: Request, res: Response) => {
  const raw = req.params.steamId;
  const steamId = Array.isArray(raw) ? raw[0] : raw;

  if (!steamId) {
    res.status(400).json({ error: "SteamID missing" });
    return;
  }

  const includeFreeGames = req.query.includeFreeGames !== "false";

  const ownedGames = await getOwnedGames(steamId, includeFreeGames);
  if (!ownedGames) {
    res.status(404).json({ error: "Owned games not found" });
    return;
  }
  res.json(ownedGames);
});
