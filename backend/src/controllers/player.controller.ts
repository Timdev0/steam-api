import type { Request, Response } from "express";
import { getOwnedGames, getPlayerSummary } from "../services/steam.service.js";

export async function getPlayer(req: Request, res: Response) {
  const raw = req.params.steamId;
  const steamId = Array.isArray(raw) ? raw[0] : raw;

  if (!steamId) {
    return res.status(400).json({ error: "SteamID missing" });
  }

  try {
    const player = await getPlayerSummary(steamId);
    if (!player) {
      return res.status(404).json({ error: "Player not found" });
    }
    res.json(player);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

export async function getPlayerOwnedGames(req: Request, res: Response,) {
    const raw = req.params.steamId;
    const steamId = Array.isArray(raw) ? raw[0] : raw;

    if (!steamId) {
        return res.status(400).json({ error: "SteamID missing" });
    }

    const includeFreeGames = req.query.includeFreeGames !== "false";

    try {
        const ownedGames = await getOwnedGames(steamId, includeFreeGames);
        if (!ownedGames) {
            return res.status(404).json({ error: "Owned games not found" });
        }
        res.json(ownedGames);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
}
