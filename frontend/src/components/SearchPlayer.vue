<script setup lang="ts">
import { ref } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import BaseInput from '@/components/base/BaseInput.vue'

const emit = defineEmits<{
  search: [input: string, excludeFreeGames: boolean]
}>()

const props = defineProps<{
  disabled?: boolean
  busyLabel?: string
}>()

const searchInput = ref('')
const excludeFreeGames = ref(false)

function onSearch() {
  emit('search', searchInput.value, excludeFreeGames.value)
}
</script>

<template>
  <section class="search">
    <h2>Search Steam Profile</h2>
    <form class="search__form" @submit.prevent="onSearch">
      <label for="searchInput">SteamID64, profile URL, or vanity name</label>
      <BaseInput v-model="searchInput" placeholder="SteamID64, profile URL, or vanity name" id="searchInput" />
      <div class="search__form__options">
        <label class="exclude-free">
          <input type="checkbox" v-model="excludeFreeGames" />
          Exclude free games
        </label>
        <BaseButton type="submit" :disabled="disabled">
          {{ disabled ? 'Researching...' : 'Research' }}
        </BaseButton>

        <BaseButton variant="secondary">
          Pick random
        </BaseButton>
      </div>
    </form>
  </section>
</template>

<style scoped lang="scss">
.search {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 0 1rem 0;

  &__form {
    display: flex;
    gap: 0.5rem;
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  &__form__options {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 0.5rem;
    align-items: center;
  }
}
</style>
