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

/**
 * Returns the median of a list of numbers. Assumes the list is not sorted
 * and does not mutate it. Returns 0 for an empty list.
 */
export function median(values: number[]): number {
  if (values.length === 0) return 0

  const sorted = [...values].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 !== 0 ? sorted[mid]! : (sorted[mid - 1]! + sorted[mid]!) / 2
}

const MINUTES_PER_HOUR = 60
const MINUTES_PER_DAY = MINUTES_PER_HOUR * 24
const MINUTES_PER_YEAR = MINUTES_PER_DAY * 365

function pluralize(value: number, unit: string): string {
  return `${value} ${unit}${value === 1 ? '' : 's'}`
}

/**
 * Formats a playtime duration (in minutes, as returned by Steam) into a full
 * breakdown, e.g. "1 year, 22 days, 11 hours and 55 minutes".
 * Always shows all four units, down to "0 years, 0 days, 0 hours and 0 minutes".
 */
export function formatPlaytimeFull(minutes: number): string {
  const totalMinutes = Math.floor(minutes)

  const years = Math.floor(totalMinutes / MINUTES_PER_YEAR)
  const afterYears = totalMinutes % MINUTES_PER_YEAR
  const days = Math.floor(afterYears / MINUTES_PER_DAY)
  const afterDays = afterYears % MINUTES_PER_DAY
  const hours = Math.floor(afterDays / MINUTES_PER_HOUR)
  const mins = afterDays % MINUTES_PER_HOUR

  return `${pluralize(years, 'year')}, ${pluralize(days, 'day')}, ${pluralize(hours, 'hour')} and ${pluralize(mins, 'minute')}`
}
