<!-- components/GameRoulette.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGamesStore } from '@/stores/games'
import type { PlayerGame } from '@/types/steam'
import GameCard from './GameCard.vue'

const gamesStore = useGamesStore()

// reactive state + getters
const { pickHistory, availableGames, rouletteScope, allGames } = storeToRefs(gamesStore)
// actions (direct access)
const { pickRandom, setRouletteScope, resetHistory } = gamesStore

// the last picked game, highlighted
const lastPick = ref<PlayerGame | null>(null)

// can we still pick one?
const canPick = computed(() => availableGames.value.length > 0)

function onPick() {
  const game = pickRandom()
  if (game) lastPick.value = game
}

function onClear() {
  resetHistory()
  lastPick.value = null
}

// scope options for the radio buttons
const scopes = [
  { value: 'all', label: 'All games' },
  { value: 'never-played', label: 'Never played' },
  { value: 'under-5h', label: 'Under 5 hours' },
] as const
</script>

<template>
  <section v-if="allGames.length > 0" class="roulette">
    <h3>Roulette</h3>

    <div class="roulette__scopes">
      <label v-for="scope in scopes" :key="scope.value">
        <input
          type="radio"
          :value="scope.value"
          :checked="rouletteScope === scope.value"
          @change="setRouletteScope(scope.value)"
        />
        {{ scope.label }}
      </label>
    </div>

    <div class="roulette__action">
      <button :disabled="!canPick" @click="onPick">
        {{ canPick ? 'Pick a game' : 'No games left' }}
      </button>
      <button v-if="pickHistory.length > 0" @click="onClear">
        Clear history
      </button>
    </div>

    <div v-if="lastPick" class="roulette__result">
      <p>You should play:</p>
      <GameCard :game="lastPick" />
    </div>

    <div v-if="pickHistory.length > 0" class="roulette__history">
      <h4>History ({{ pickHistory.length }})</h4>
      <ul>
        <li v-for="game in pickHistory" :key="game.appid">{{ game.name }}</li>
      </ul>
    </div>
  </section>
</template>

<style scoped lang="scss">
.roulette {
  margin: 2rem 0;

  &__scopes {
    display: flex;
    gap: 1rem;
    margin: 0.5rem 0;
  }

  &__action {
    display: flex;
    gap: 0.5rem;
    margin: 1rem 0;
  }

  &__result {
    margin: 1rem 0;
  }
}
</style>
