<script setup lang="ts">
import { ref } from 'vue'
import { fetchPlayer, type PlayerSummary } from '@/services/steam'

const steamId = ref('')
const player = ref<PlayerSummary | null>(null)
const loading = ref(false)
const error = ref('')

async function search() {
  if (!steamId.value) return
  loading.value = true
  error.value = ''
  player.value = null

  try {
    player.value = await fetchPlayer(steamId.value.trim())
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Erreur inconnue'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <main>
    <h2>Recherche de joueur Steam</h2>

    <div class="search">
      <input
        v-model="steamId"
        placeholder="SteamID64 (ex: 76561197960435530)"
        @keyup.enter="search"
      />
      <button @click="search" :disabled="loading">
        {{ loading ? 'Recherche...' : 'Rechercher' }}
      </button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>

    <div v-if="player" class="player">
      <img :src="player.avatarfull" :alt="player.personaname" />
      <div>
        <h3>{{ player.personaname }}</h3>
        <a :href="player.profileurl" target="_blank">Voir le profil Steam</a>
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
