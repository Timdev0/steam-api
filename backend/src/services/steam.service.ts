import { env } from "../config/env.js";
import type { 
  GetPlayerSummariesResponse,
  OwnedGames,
  OwnedGamesResponse,
  PlayerSummary,
  ResolveVanityResponse
} from "../types/steam.js";
import { parseSteamInput } from "../utils/steam.js";

const STEAM_API = env.steamApiUrl;

export async function resolveVanityUrl(vanity: string): Promise<string | null> {
  const url = new URL(`${STEAM_API}/ISteamUser/ResolveVanityURL/v1/`);
  url.searchParams.set("key", env.steamApiKey);
  url.searchParams.set("vanityurl", vanity);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Steam API error: ${res.status}`);
  }

  const data = (await res.json()) as ResolveVanityResponse;
  return data.response.success === 1 ? (data.response.steamid ?? null) : null;
}

export async function resolveSteamId(input: string): Promise<string | null> {
  const parsed = parseSteamInput(input);
  if (!parsed) return null;

  // Déjà un SteamID64 → rien à faire, pas d'appel réseau
  if (parsed.type === "steamid") return parsed.value;

  // Vanity → on interroge Steam
  return resolveVanityUrl(parsed.value);
}

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

export async function getOwnedGames(steamId: string, includeFreeGames: boolean = true): Promise<OwnedGames| null> {
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
  return data.response.games ? data.response : null;
}