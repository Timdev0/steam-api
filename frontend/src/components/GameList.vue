<template>
  <section>
    <h3>Games - {{ filteredGames.length }}</h3>
    <p v-if="isLoading">Loading games...</p>
      <ul v-else class="games-list">
        <p v-if="filteredGames.length === 0">No games found.</p>
        <GameCard v-for="game in filteredGames" :key="game.appid" :game="game" />
      </ul>
  </section>
</template>

<script setup lang="ts">
import { useGamesStore } from '@/stores/games'
import GameCard from '@/components/GameCard.vue'

import { storeToRefs } from 'pinia'
const gamesStore = useGamesStore()
const { filteredGames, isLoading } = storeToRefs(gamesStore)

</script>

<style lang="scss" scoped>
.games-list {
  padding: 1rem 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  gap: 2rem;
}
</style>
