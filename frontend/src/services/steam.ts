import type { PlayerGames, PlayerSummary } from '@/types/steam'

export async function fetchPlayer(steamId: string): Promise<PlayerSummary> {
  const res = await fetch(`/api/player/${steamId}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? `Erreur ${res.status}`)
  }
  return res.json()
}

export async function fetchPlayerGames(steamId: string): Promise<PlayerGames> {
  const res = await fetch(`/api/player/${steamId}/games`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? `Erreur ${res.status}`)
  }
  return res.json()
}
