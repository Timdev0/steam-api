<template>
  <section v-if="player" class="player">
    <img :src="player.avatarfull" :alt="player.personaname" />
    <div>
      <h3>{{ player.personaname }}</h3>
      <a :href="player.profileurl" target="_blank">See steam Profile</a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/stores/player'

const playerStore = usePlayerStore()
const { player } = storeToRefs(playerStore)

</script>

<style scoped lang="scss">
.player {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 1.5rem;
}
</style>
