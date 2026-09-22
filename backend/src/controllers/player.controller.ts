import type { Request, Response } from "express";
import { getInventoryGame, INVENTORY_GAMES } from "../constants/inventoryGames.js";
import { getInventory, getOwnedGames, getPlayerSummary } from "../services/steam.service.js";
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

// GET /:steamId/inventory/:game (e.g. "cs2"). Looks the slug up in the
// INVENTORY_GAMES registry — add a game there and it's available here
// immediately, no new route or controller.
export const getPlayerGameInventory = asyncHandler(async (req: Request, res: Response) => {
  const raw = req.params.steamId;
  const steamId = Array.isArray(raw) ? raw[0] : raw;

  if (!steamId) {
    res.status(400).json({ error: "SteamID missing" });
    return;
  }

  const rawGame = req.params.game;
  const gameSlug = (Array.isArray(rawGame) ? rawGame[0] : rawGame) ?? "";
  const game = getInventoryGame(gameSlug);

  if (!game) {
    res.status(404).json({
      error: `Unknown game "${gameSlug}". Known games: ${Object.keys(INVENTORY_GAMES).join(", ")}`,
    });
    return;
  }

  const inventory = await getInventory(steamId, game.appId, game.contextId);
  res.json(inventory);
});
