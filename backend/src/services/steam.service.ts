import { env } from "../config/env.js";
import type { GetPlayerSummariesResponse, OwnedGame, OwnedGamesResponse, PlayerSummary } from "../types/steam.js";

const STEAM_API = "https://api.steampowered.com";

export async function getPlayerSummary(
  steamId: string
): Promise<PlayerSummary | null> {
  const url = new URL(`${STEAM_API}/ISteamUser/GetPlayerSummaries/v2/`);
  url.searchParams.set("key", env.steamApiKey);
  url.searchParams.set("steamids", steamId);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Steam API error: ${res.status}`);
  }

  const data = (await res.json()) as GetPlayerSummariesResponse;
  return data.response.players[0] ?? null;
}

export async function getOwnedGames(steamId: string, includeFreeGames: boolean = true): Promise<OwnedGame[] | null> {
  const url = new URL(`${STEAM_API}/IPlayerService/GetOwnedGames/v1/`);
  url.searchParams.set("key", env.steamApiKey);
  url.searchParams.set("steamid", steamId);
  url.searchParams.set("include_appinfo", "true");
  url.searchParams.set("include_played_free_games", includeFreeGames.toString());

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Steam API error: ${res.status}`);
  }

  const data = (await res.json()) as OwnedGamesResponse;
  return data.response.games ?? null;
}