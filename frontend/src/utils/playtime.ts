/**
 * Formate un temps de jeu (en minutes, tel que renvoyé par Steam).
 * - Moins d'une heure : affiché en minutes (ex: "45 min")
 * - Une heure ou plus : affiché en heures entières, sans décimales (ex: "124h")
 */
export function formatPlaytime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} min`
  }
  const hours = Math.floor(minutes / 60)
  return `${hours}h`
}
