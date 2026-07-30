import { Router } from "express";
import { getPlayer, getPlayerOwnedGames } from "../controllers/player.controller.js";

export const playerRouter = Router();

playerRouter.get("/:steamId", getPlayer);
playerRouter.get("/:steamId/games", getPlayerOwnedGames);
