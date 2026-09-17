<script setup lang="ts">
import { ref } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useGamesStore } from '@/stores/games'
import { useSteamSearch } from '@/composables/useSteamSearch'
import GameList from '@/components/GameList.vue'
import PlayerCard from '@/components/PlayerCard.vue'

const playerStore = usePlayerStore()
const gamesStore = useGamesStore()
const { search, resolving, error } = useSteamSearch()

const searchInput = ref('')
const excludeFreeGames = ref(false)
</script>

<template>
  <main>
    <h2>Research Steam Profile</h2>

    <div class="search">
      <input
        v-model="searchInput"
        placeholder="SteamID64, profile URL, or vanity name"
        @keyup.enter="search(searchInput, excludeFreeGames)"
      />
      <label class="exclude-free">
        <input type="checkbox" v-model="excludeFreeGames" />
        Exclude free games
      </label>
      <button
        @click="search(searchInput, excludeFreeGames)"
        :disabled="resolving || playerStore.isLoading || gamesStore.isLoading"
      >
        {{
          resolving || playerStore.isLoading || gamesStore.isLoading ? 'Researching...' : 'Research'
        }}
      </button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>

    <PlayerCard />
    <GameList />
  </main>
</template>

<style scoped lang="scss">
.search {
  display: flex;
  gap: 0.5rem;
  margin: 1rem 0;
}

.error {
  color: #ff6b6b;
}
</style>
