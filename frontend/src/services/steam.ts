export interface PlayerSummary {
  steamid: string
  personaname: string
  profileurl: string
  avatarfull: string
  personastate: number
}

export async function fetchPlayer(steamId: string): Promise<PlayerSummary> {
  const res = await fetch(`/api/player/${steamId}`)
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.error ?? `Erreur ${res.status}`)
  }
  return res.json()
}
