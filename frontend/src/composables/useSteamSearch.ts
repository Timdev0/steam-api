import { ref } from 'vue'
import { resolveSteamId } from '@/services/steam'
import { usePlayerStore } from '@/stores/player'
import { useGamesStore } from '@/stores/games'

export function useSteamSearch() {
  const playerStore = usePlayerStore()
  const gamesStore = useGamesStore()

  const resolving = ref(false)
  const error = ref('')

  async function search(input: string, excludeFreeGames: boolean) {
    const trimmed = input.trim()
    if (!trimmed) return

    error.value = ''
    resolving.value = true

    try {
      const id = await resolveSteamId(trimmed)
      resolving.value = false

      await Promise.all([playerStore.loadPlayer(id), gamesStore.loadGames(id, !excludeFreeGames)])
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Erreur inconnue'
    } finally {
      resolving.value = false
    }
  }

  return { search, resolving, error }
}
