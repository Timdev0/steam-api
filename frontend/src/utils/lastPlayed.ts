/**
 * Formate un timestamp Unix (en secondes, tel que renvoyé par Steam
 * dans rtime_last_played) en date lisible.
 */
export function formatLastPlayed(timestamp: number): string {
  // Jamais joué : Steam renvoie 0
  if (!timestamp) return 'Never played'

  // Steam donne des secondes → JS attend des millisecondes
  const date = new Date(timestamp * 1000)

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
