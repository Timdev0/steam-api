import type { PlayerGames, PlayerSummary } from '@/types/steam'

export async function fetchPlayer(steamId: string): Promise<PlayerSummary> {
  const res = await fetch(`/api/player/${steamId}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? `Erreur ${res.status}`)
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
  const url = `/api/player/${steamId}/games${query ? `?${query}` : ''}`

  const res = await fetch(url)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? `Erreur ${res.status}`)
  }
  return res.json()
}
