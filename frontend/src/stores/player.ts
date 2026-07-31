import { defineStore } from 'pinia'
import { ref } from 'vue'
import { fetchPlayer } from '@/services/steam'
import type { PlayerSummary } from '@/types/steam'

export const usePlayerStore = defineStore('player', () => {
  // STATE
  const player = ref<PlayerSummary | null>(null)
  const isLoading = ref(false)

  // ACTIONS
  async function loadPlayer(steamId: string) {
    if (player.value?.steamid === steamId) return
    isLoading.value = true
    try {
      player.value = await fetchPlayer(steamId)
    } catch (e) {
      reset()
      throw e
    } finally {
      isLoading.value = false
    }
  }

  function reset() {
    player.value = null
  }

  return {
    // STATE
    player,
    isLoading,

    // ACTIONS
    loadPlayer,
    reset,
  }
})
