<!-- components/GameRoulette.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useGamesStore } from '@/stores/games'
import GameCard from './GameCard.vue'
import GameIcon from './GameIcon.vue'
import BaseButton from './base/BaseButton.vue'

const gamesStore = useGamesStore()
const pickHistorySorted = computed(() => [...gamesStore.pickHistory].reverse())

// reactive state + getters
const { pickHistory, availableGames, rouletteScope, allGames, rouletteCurrentGame, isLoading } = storeToRefs(gamesStore)
// actions (direct access)
const { pickRandom, setRouletteScope, resetHistory } = gamesStore

// can we still pick one?
const canPick = computed(() => availableGames.value.length > 0)

function onPick() {
  pickRandom()
}

function onClear() {
  resetHistory()
}

// scope options for the radio buttons
const scopes = [
  { value: 'all', label: 'All games' },
  { value: 'never-played', label: 'Never played' },
  { value: 'under-5h', label: 'Under 5 hours' },
] as const
</script>

<template>
  <section class="roulette">
    <h3>Roulette</h3>

    <p v-if="isLoading">Loading games...</p>
    <template v-else>
      <p v-if="allGames.length === 0">No games found.</p>
      <div v-else>
        <div class="roulette__form">
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
        </div>

        <div class="roulette__results">
          <div v-if="rouletteCurrentGame" class="roulette__results__result">
            <h4>You should play:</h4>
            <GameCard :game="rouletteCurrentGame" />
          </div>

          <div v-if="pickHistory.length > 0" class="roulette__results__history">
            <h4>History ({{ pickHistory.length }})</h4>
            <ul class="roulette__results__history__list">
              <li class="roulette__results__history__list__item" v-for="game in pickHistorySorted" :key="game.appid">
                <GameIcon class="roulette__results__history__list__item__icon" :appid="game.appid"
                  :img-icon-url="game.img_icon_url" :alt="game.name" />
                {{ game.name }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped lang="scss">
.roulette {
  &__form {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    justify-content: space-between;
    align-items: baseline;

    @include respond(tablet) {
      flex-direction: column;
      align-items: center;
      gap: 0;
    }
  }

  &__scopes {
    display: flex;
    gap: 1rem;
    margin: 0.5rem 0;
  }

  &__action {
    display: flex;
    gap: 0.5rem;
    margin: 1rem 0;
    flex-direction: row-reverse;

    @include respond(tablet) {
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
    }

  }

  &__results {
    margin: 1rem 0;
    display: flex;
    flex-direction: row;
    gap: 4rem;

    @include respond(tablet) {
      margin: 0;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

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
