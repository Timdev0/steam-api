import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PlayerInventory } from '@/types/steam'
import { fetchPlayerInventory } from '@/services/steam'

export const useInventoryStore = defineStore('inventory', () => {
  // STATE
  // Cached per game slug (e.g. "cs2"), so switching tabs doesn't refetch.
  // Tied to steamId: a new player invalidates the whole cache below.
  const steamId = ref<string | null>(null)
  const inventories = ref<Record<string, PlayerInventory>>({})
  const isLoading = ref(false)

  // ACTIONS
  async function loadInventory(newSteamId: string, game: string) {
    if (steamId.value !== newSteamId) {
      steamId.value = newSteamId
      inventories.value = {}
    }

    if (inventories.value[game]) return

    isLoading.value = true
    try {
      inventories.value[game] = await fetchPlayerInventory(newSteamId, game)
    } finally {
      isLoading.value = false
    }
  }

  function reset() {
    steamId.value = null
    inventories.value = {}
  }

  return {
    // STATE
    steamId,
    inventories,
    isLoading,

    // ACTIONS
    loadInventory,
    reset,
  }
})
