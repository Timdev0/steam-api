<script setup lang="ts">
import { ref } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useGamesStore } from '@/stores/games'
import { useSteamSearch } from '@/composables/useSteamSearch'

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

    <div v-if="playerStore.player" class="player">
      <img :src="playerStore.player.avatarfull" :alt="playerStore.player.personaname" />
      <div>
        <h3>{{ playerStore.player.personaname }}</h3>
        <a :href="playerStore.player.profileurl" target="_blank">See steam Profile</a>
      </div>
    </div>

    <div>
      <h3>Games - {{ gamesStore.filteredGames.length }}</h3>
      <p v-if="gamesStore.isLoading">Loading games...</p>
      <div v-else>
        <p v-if="gamesStore.filteredGames.length === 0">No games found.</p>
        <ul>
          <li v-for="game in gamesStore.filteredGames" :key="game.appid">
            {{ game.name }}
          </li>
        </ul>
      </div>
    </div>
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

.player {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 1.5rem;
}
</style>
