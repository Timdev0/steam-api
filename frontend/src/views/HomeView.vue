<script setup lang="ts">
import { ref } from 'vue'
import { fetchPlayer, fetchPlayerGames } from '@/services/steam'
import type { PlayerSummary, PlayerGames } from '@/types/steam'

const steamId = ref('')
const player = ref<PlayerSummary | null>(null)
const playerGames = ref<PlayerGames | null>(null)
const loadingPlayerSummary = ref(false)
const loadingPlayerGames = ref(false)
const error = ref('')

async function search() {
  player.value = null
  playerGames.value = null

  if (!steamId.value) return
  loadingPlayerSummary.value = true
  error.value = ''
  player.value = null

  try {
    player.value = await fetchPlayer(steamId.value.trim())
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Erreur inconnue'
  } finally {
    loadingPlayerSummary.value = false
  }

  try {
    loadingPlayerGames.value = true
    playerGames.value = await fetchPlayerGames(steamId.value.trim())
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Erreur inconnue'
  } finally {
    loadingPlayerGames.value = false
  }
}
</script>

<template>
  <main>
    <h2>Research Steam Profile (steamid64)</h2>

    <div class="search">
      <input
        v-model="steamId"
        placeholder="SteamID64 (ex: 76561197960435530)"
        @keyup.enter="search"
      />
      <button @click="search" :disabled="loadingPlayerSummary || loadingPlayerGames">
        {{ loadingPlayerSummary || loadingPlayerGames ? 'Researching...' : 'Research' }}
      </button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="player" class="player">
      <img :src="player.avatarfull" :alt="player.personaname" />
      <div>
        <h3>{{ player.personaname }}</h3>
        <a :href="player.profileurl" target="_blank">See steam Profile</a>
      </div>
    </div>
    <div>
      <h3>Games - {{ playerGames?.game_count ?? 0 }}</h3>
      <p v-if="loadingPlayerGames">Loading games...</p>
      <div v-if="playerGames">
        <h4></h4>
        <ul>
          <li v-for="game in playerGames?.games" :key="game.appid">
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
