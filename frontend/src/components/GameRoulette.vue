<!-- components/GameRoulette.vue -->
<script setup lang="ts">
import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGamesStore } from '@/stores/games'
import type { PlayerGame } from '@/types/steam'
import GameCard from './GameCard.vue'
import GameIcon from './GameIcon.vue'
import BaseButton from './base/BaseButton.vue'

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
        <input type="radio" :value="scope.value" :checked="rouletteScope === scope.value"
          @change="setRouletteScope(scope.value)" />
        {{ scope.label }}
      </label>
    </div>

    <div class="roulette__action">
      <BaseButton variant="primary" :disabled="!canPick" @click="onPick">
        {{ canPick ? 'Pick a game' : 'No games left' }}
      </BaseButton>
      <BaseButton variant="secondary" v-if="pickHistory.length > 0" @click="onClear">
        Clear history
      </BaseButton>
    </div>

    <div class="roulette__results">

      <div v-if="lastPick" class="roulette__results__result">
        <h4>You should play:</h4>
        <GameCard :game="lastPick" />
      </div>

      <div v-if="pickHistory.length > 0" class="roulette__results__history">
        <h4>History ({{ pickHistory.length }})</h4>
        <ul class="roulette__results__history__list">
          <li class="roulette__results__history__list__item" v-for="game in pickHistory" :key="game.appid">
            <GameIcon class="roulette__results__history__list__item__icon" :appid="game.appid"
              :img-icon-url="game.img_icon_url" :alt="game.name" />
            {{ game.name }}
          </li>
        </ul>
      </div>
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

  &__results {
    margin: 1rem 0;
    display: flex;
    flex-direction: row;
    gap: 4rem;

    &__result {
      flex: 1;
    }

    &__history {
      flex: 1;

      &__list {
        list-style: none;
        padding: 0;
        margin: 0;

        &__item {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 0.5rem;
          justify-content: start;

          &__icon {
            width: 32px;
            height: 32px;
            flex-shrink: 0;
            border-radius: 0.25rem;
          }
        }
      }
    }
  }
}
</style>
