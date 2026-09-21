<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGamesStore } from '@/stores/games'
import GameCard from '@/components/GameCard.vue'

const gamesStore = useGamesStore()
const { allGames, isLoading } = storeToRefs(gamesStore)

type SortKey = 'name-asc' | 'name-desc' | 'playtime-asc' | 'playtime-desc'
const sortBy = ref<SortKey>('name-asc')

const sortedGames = computed(() => {
  const games = [...allGames.value]

  switch (sortBy.value) {
    case 'name-asc':
      return games.sort((a, b) => a.name.localeCompare(b.name))
    case 'name-desc':
      return games.sort((a, b) => b.name.localeCompare(a.name))
    case 'playtime-asc':
      return games.sort((a, b) => a.playtime_forever - b.playtime_forever)
    case 'playtime-desc':
      return games.sort((a, b) => b.playtime_forever - a.playtime_forever)
    default:
      return games
  }
})
</script>

<template>
  <section>
    <div class="games-header">
      <h3>Games - {{ allGames.length }}</h3>
      <select v-model="sortBy" class="sort-select">
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
        <option value="playtime-desc">Playtime (most played)</option>
        <option value="playtime-asc">Playtime (least played)</option>
      </select>
    </div>

    <p v-if="isLoading">Loading games...</p>
    <template v-else>
      <p v-if="sortedGames.length === 0">No games found.</p>
      <ul v-else class="games-list">
        <GameCard v-for="game in sortedGames" :key="game.appid" :game="game" />
      </ul>
    </template>
  </section>
</template>

<style lang="scss" scoped>
.games-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.games-list {
  padding: 1rem 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
  justify-items: center;
  gap: 2rem;
}
</style>
