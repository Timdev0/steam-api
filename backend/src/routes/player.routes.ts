import { Router } from "express";
import { getPlayer, getPlayerGameInventory, getPlayerOwnedGames } from "../controllers/player.controller.js";

export const playerRouter = Router();

playerRouter.get("/:steamId", getPlayer);
playerRouter.get("/:steamId/games", getPlayerOwnedGames);
playerRouter.get("/:steamId/inventory/:game", getPlayerGameInventory);
