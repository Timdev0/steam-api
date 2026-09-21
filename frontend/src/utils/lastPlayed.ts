/**
 * Formats a Unix timestamp (in seconds, as returned by Steam in
 * rtime_last_played) into a readable date.
 */
export function formatLastPlayed(timestamp: number): string {
  // Never played: Steam returns 0
  if (!timestamp) return 'Never played'

  // Steam gives seconds → JS expects milliseconds
  const date = new Date(timestamp * 1000)

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
