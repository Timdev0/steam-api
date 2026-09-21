/**
 * Formats a playtime duration (in minutes, as returned by Steam).
 * - Under one hour: shown in minutes (e.g. "45 min")
 * - One hour or more: shown as whole hours, no decimals (e.g. "124h")
 */
export function formatPlaytime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  return `${hours}h`
}
