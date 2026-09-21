import type { PlayerGames, PlayerSummary } from '@/types/steam'

// Unset in dev: relative /api calls go through Vite's proxy (vite.config.ts).
// Set in production builds to the deployed backend's URL.
const API_BASE_URL = import.meta.env.VITE_API_URL ?? ''

export async function resolveSteamId(input: string): Promise<string> {
  const res = await fetch(`${API_BASE_URL}/api/resolve?input=${encodeURIComponent(input)}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? `Error ${res.status}`)
  }
  const data = await res.json()
  return data.steamId
}

export async function fetchPlayer(steamId: string): Promise<PlayerSummary> {
  const res = await fetch(`${API_BASE_URL}/api/player/${steamId}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? `Error ${res.status}`)
  }
  return res.json()
}

export async function fetchPlayerGames(
  steamId: string,
  includeFreeGames = true,
): Promise<PlayerGames> {
  const params = new URLSearchParams()
  if (!includeFreeGames) params.set('includeFreeGames', 'false')

  const query = params.toString()
  const url = `${API_BASE_URL}/api/player/${steamId}/games${query ? `?${query}` : ''}`

  const res = await fetch(url)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? `Error ${res.status}`)
  }
  return res.json()
}
