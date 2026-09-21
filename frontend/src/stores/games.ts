import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { PlayerGame } from '@/types/steam'
import { fetchPlayerGames } from '@/services/steam'

type RouletteScope = 'all' | 'never-played' | 'under-5h'

export const useGamesStore = defineStore('games', () => {
  // STATE
  const allGames = ref<PlayerGame[]>([])
  const pickHistory = ref<PlayerGame[]>([])
  const includeFreeGames = ref(true)
  const rouletteScope = ref<RouletteScope>('all')
  const isLoading = ref(false)

  // GETTERS
  const filteredGames = computed<PlayerGame[]>(() => {
    // list display (TODO: handle free games one day)
    return allGames.value
  })

  const rouletteEligibleGames = computed<PlayerGame[]>(() => {
    switch (rouletteScope.value) {
      case 'never-played':
        return filteredGames.value.filter((g) => g.playtime_forever === 0)
      case 'under-5h':
        return filteredGames.value.filter((g) => g.playtime_forever < 300)
      case 'all':
      default:
        return filteredGames.value
    }
  })

  const availableGames = computed<PlayerGame[]>(() => {
    const pickedAppIds = new Set(pickHistory.value.map((g) => g.appid))
    return rouletteEligibleGames.value.filter((g) => !pickedAppIds.has(g.appid))
  })

  // ACTIONS
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

  function setRouletteScope(scope: RouletteScope) {
    rouletteScope.value = scope
  }

  function pickRandom(): PlayerGame | null {
    const pool = availableGames.value
    if (pool.length === 0) return null
    const game = pool[Math.floor(Math.random() * pool.length)]!
    pickHistory.value.push(game)
    return game
  }

  function resetHistory() {
    pickHistory.value = []
  }

  return {
    // STATE
    allGames,
    pickHistory,
    includeFreeGames,
    rouletteScope,
    isLoading,
    // GETTERS
    filteredGames,
    rouletteEligibleGames,
    availableGames,
    // ACTIONS
    loadGames,
    setGames,
    setRouletteScope,
    pickRandom,
    resetHistory,
    reset,
  }
})
