<template>
  <section>
    <h3>Games - {{ filteredGames.length }}</h3>
    <p v-if="isLoading">Loading games...</p>
    <div v-else>
      <p v-if="filteredGames.length === 0">No games found.</p>
      <ul class="games-list">
        <GameCard v-for="game in filteredGames" :key="game.appid" :game="game" />
      </ul>
    </div>
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
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  gap: 2rem;
}
</style>
