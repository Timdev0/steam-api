<script setup lang="ts">
import { useGamesStore } from '@/stores/games';
import { storeToRefs } from 'pinia'
import { computed } from 'vue';
import { formatPlaytimeFull, formatPlaytime, median } from '@/utils/playtime'

const gamesStore = useGamesStore()
const { allGames, isLoading } = storeToRefs(gamesStore)

const timeSpentAllGamesMinutes = computed(() => allGames.value.reduce((total, game) => total + game.playtime_forever, 0))
const timeSpentAllGamesFull = computed(() => formatPlaytimeFull(timeSpentAllGamesMinutes.value))

const stats = computed(() => {
  const totalGames = allGames.value.length
  const totalPlaytime = timeSpentAllGamesMinutes.value
  const averagePlaytime = formatPlaytime((totalGames > 0 ? totalPlaytime / totalGames : 0))
  const gamesNeverPlayed = allGames.value.filter(game => game.playtime_forever === 0).length
  const gamesPlayedUnder5h = allGames.value.filter(game => game.playtime_forever > 0 && game.playtime_forever < 300).length
  const medianPlaytime = formatPlaytime(median(allGames.value.map(game => game.playtime_forever)))

  return {
    totalGames,
    totalPlaytime,
    averagePlaytime,
    gamesNeverPlayed,
    gamesPlayedUnder5h,
    medianPlaytime
  }
})
</script>

<template>
  <section class="stats-header">
    <h3>Stats</h3>
    <p v-if="isLoading">Loading games...</p>
    <template v-else>
      <p v-if="allGames.length === 0">No games found.</p>
      <ul v-else>
        <li>You've spent {{ timeSpentAllGamesFull }} playing games.</li>
        <li>Total Games: {{ stats.totalGames }}</li>
        <li>Games never played: {{ stats.gamesNeverPlayed }}</li>
        <li>Games played under 5 hours: {{ stats.gamesPlayedUnder5h }}</li>
        <li>Average playtime: {{ stats.averagePlaytime }}</li>
        <li>Median playtime: {{ stats.medianPlaytime }}</li>
      </ul>
    </template>
  </section>
</template>

<style lang="scss" scoped></style>
