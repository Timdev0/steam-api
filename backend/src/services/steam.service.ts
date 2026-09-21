import { env } from "../config/env.js";
import { SteamApiError } from "../errors/SteamApiError.js";
import { createTtlCache } from "../utils/cache.js";
import type {
  GetPlayerSummariesResponse,
  OwnedGames,
  OwnedGamesResponse,
  PlayerSummary,
  ResolveVanityResponse,
} from "../types/steam.js";
import { parseSteamInput } from "../utils/steam.js";

// Tolerate a trailing slash in the env var to avoid double "//" in URLs.
const STEAM_API = env.steamApiUrl.replace(/\/$/, "");

const CACHE_TTL_MS = 5 * 60_000;
const playerCache = createTtlCache<PlayerSummary | null>(CACHE_TTL_MS);
const ownedGamesCache = createTtlCache<OwnedGames | null>(CACHE_TTL_MS);

async function steamFetch<T>(url: URL): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    // Distinguish Steam's own rate-limit (429) from other failures, so the
    // frontend can eventually show a different message for it.
    const status = res.status === 429 ? 429 : 502;
    throw new SteamApiError(`Steam API error: ${res.status}`, status);
  }
  return (await res.json()) as T;
}

export async function resolveVanityUrl(vanity: string): Promise<string | null> {
  const url = new URL(`${STEAM_API}/ISteamUser/ResolveVanityURL/v1/`);
  url.searchParams.set("key", env.steamApiKey);
  url.searchParams.set("vanityurl", vanity);

  const data = await steamFetch<ResolveVanityResponse>(url);
  return data.response.success === 1 ? (data.response.steamid ?? null) : null;
}

export async function resolveSteamId(input: string): Promise<string | null> {
  const parsed = parseSteamInput(input);
  if (!parsed) return null;

  // Already a SteamID64 → nothing to do, no network call
  if (parsed.type === "steamid") return parsed.value;

  // Vanity name → ask Steam to resolve it
  return resolveVanityUrl(parsed.value);
}

export async function getPlayerSummary(steamId: string): Promise<PlayerSummary | null> {
  const cached = playerCache.get(steamId);
  if (cached !== undefined) return cached;

  const url = new URL(`${STEAM_API}/ISteamUser/GetPlayerSummaries/v2/`);
  url.searchParams.set("key", env.steamApiKey);
  url.searchParams.set("steamids", steamId);

  const data = await steamFetch<GetPlayerSummariesResponse>(url);
  const player = data.response.players[0] ?? null;
  playerCache.set(steamId, player);
  return player;
}

export async function getOwnedGames(
  steamId: string,
  includeFreeGames: boolean = true,
): Promise<OwnedGames | null> {
  const cacheKey = `${steamId}:${includeFreeGames}`;
  const cached = ownedGamesCache.get(cacheKey);
  if (cached !== undefined) return cached;

  const url = new URL(`${STEAM_API}/IPlayerService/GetOwnedGames/v1/`);
  url.searchParams.set("key", env.steamApiKey);
  url.searchParams.set("steamid", steamId);
  url.searchParams.set("include_appinfo", "true");
  url.searchParams.set("include_played_free_games", includeFreeGames.toString());

  const data = await steamFetch<OwnedGamesResponse>(url);
  const result = data.response.games ? data.response : null;
  ownedGamesCache.set(cacheKey, result);
  return result;
}
