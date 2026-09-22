<script setup lang="ts">
import { computed, ref } from 'vue'
import { usePlayerStore } from '@/stores/player'
import { useGamesStore } from '@/stores/games'
import { useSteamSearch } from '@/composables/useSteamSearch'
import GameList from '@/components/GameList.vue'
import SearchPlayer from '@/components/SearchPlayer.vue'
import GameRoulette from '@/components/GameRoulette.vue'
import BaseTabs from '@/components/base/BaseTabs.vue'
import GameStats from '@/components/GameStats.vue'

const playerStore = usePlayerStore()
const gamesStore = useGamesStore()
const { search, resolving, error } = useSteamSearch()

const isBusy = computed(
  () => resolving.value || playerStore.isLoading || gamesStore.isLoading
)

const activeTab = ref('games')
const tabs = [
  { value: 'games', label: 'Games List' },
  { value: 'roulette', label: 'Roulette' },
  { value: 'stats', label: 'Stats' }
]

</script>

<template>
  <main>
    <SearchPlayer :disabled="isBusy" @search="search" />

    <p v-if="error" class="error">{{ error }}</p>

    <BaseTabs v-model="activeTab" :tabs="tabs">
      <template #default="{ active }">
        <GameRoulette v-if="active === 'roulette'" />
        <GameList v-else-if="active === 'games'" />
        <GameStats v-else-if="active === 'stats'" />
      </template>
    </BaseTabs>
  </main>
</template>

<style scoped lang="scss">
.error {
  color: #ff6b6b;
}
</style>
