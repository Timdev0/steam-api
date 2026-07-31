import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PlayerGame } from '@/types/steam'
import { fetchPlayerGames } from '@/services/steam'

export const useGamesStore = defineStore('games', () => {
  // STATE
  const allGames = ref<PlayerGame[]>([])
  const pickHistory = ref<PlayerGame[]>([])
  const includeFreeGames = ref(true)
  const maxPlaytimeFilter = ref<number | null>(null)
  const isLoading = ref(false)

  // GETTERS
  const filteredGames = computed<PlayerGame[]>(() => {
    const maxPlaytime = maxPlaytimeFilter.value
    return maxPlaytime === null
      ? allGames.value
      : allGames.value.filter((game) => game.playtime_forever <= maxPlaytime)
  })

  const availableGames = computed<PlayerGame[]>(() => {
    const pickedAppIds = new Set(pickHistory.value.map((game) => game.appid))
    return filteredGames.value.filter((game) => !pickedAppIds.has(game.appid))
  })

  //ACTIONS
  async function loadGames(steamId: string, freeGames = true) {
    isLoading.value = true
    try {
      includeFreeGames.value = freeGames
      const data = await fetchPlayerGames(steamId, freeGames)
      setGames(data.games)
    } catch (e) {
      reset()
      throw e
    } finally {
      isLoading.value = false
    }
  }

  function setGames(games: PlayerGame[]) {
    allGames.value = games
    pickHistory.value = []
  }

  function reset() {
    allGames.value = []
    resetHistory()
  }

  function pickRandom() {
    // TODO
  }

  function pickRandNeverPlayed() {
    // TODO
  }

  function resetHistory() {
    pickHistory.value = []
  }

  return {
    // STATE
    allGames,
    pickHistory,
    includeFreeGames,
    maxPlaytimeFilter,
    isLoading,

    // GETTERS
    filteredGames,
    availableGames,

    // ACTIONS
    loadGames,
    setGames,
    pickRandom,
    pickRandNeverPlayed,
    resetHistory,
    reset,
  }
})
