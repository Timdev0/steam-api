<script setup lang="ts">
import { computed } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useGamesStore } from '@/stores/games'
import { useSteamSearch } from '@/composables/useSteamSearch'
import GameList from '@/components/GameList.vue'
import SearchPlayer from '@/components/SearchPlayer.vue'
import GameRoulette from '@/components/GameRoulette.vue'

const playerStore = usePlayerStore()
const gamesStore = useGamesStore()
const { search, resolving, error } = useSteamSearch()


const isBusy = computed(
  () => resolving.value || playerStore.isLoading || gamesStore.isLoading
)
</script>

<template>
  <main>
    <SearchPlayer :disabled="isBusy" @search="search" />

    <p v-if="error" class="error">{{ error }}</p>

    <GameRoulette />
    <GameList />
  </main>
</template>

<style scoped lang="scss">
.error {
  color: #ff6b6b;
}
</style>
