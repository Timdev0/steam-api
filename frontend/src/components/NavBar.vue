<template>
  <header class="header">
    <nav class="header__nav">
      <h1>
        <RouterLink to="/">Spin Steam</RouterLink>
      </h1>
    </nav>

    <div v-if="player" class="header__player">
      <div class="header__player__info">
        <h3 class="header__player__info__name">{{ player.personaname }}</h3>
        <a class="header__player__info__link" :href="player.profileurl" target="_blank" alt="See steam Profile">
          <Icon icon="mdi:steam" :width="32" :height="32" />
        </a>
      </div>
      <img class="header__player__avatar" :src="player.avatarfull" :alt="player.personaname" />

    </div>
  </header>

</template>


<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/stores/player'
import { Icon } from '@iconify/vue'

const playerStore = usePlayerStore()
const { player } = storeToRefs(playerStore)
</script>

<style scoped lang="scss">
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  padding: 1rem 2rem;

  @media (max-width: 768px) {
    padding-right: 1rem;
    padding-left: 1rem;
  }

  &__player {
    display: flex;
    gap: 1rem;
    height: auto;

    &__avatar {

      width: 100%;
      height: auto;
      object-fit: contain;
      max-width: 4rem;
    }

    &__info {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      justify-content: space-between;

      &__name {
        text-align: right;
      }

      &__link {
        width: fit-content;
        height: fit-content;
        display: flex;
        flex-direction: row;
        justify-content: right;
        width: 100%;
      }
    }
  }
}
</style>
