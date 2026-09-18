<script setup lang="ts">
const model = defineModel<string>()

defineProps<{
  placeholder?: string
  id?: string
}>()
</script>

<template>
  <input
    :id="id"
    v-model="model"
    :placeholder="placeholder"
    class="base-input"
  />
</template>

<style scoped lang="scss">
.base-input {
  padding: 0.6rem 0.9rem;
  border: 1px solid $bg-light;
  border-radius: 6px;
  background-color: $bg;
  color: $text;
  font-size: 1rem;
  width: 100%;

  &::placeholder {
    color: $accent-dark;
  }

  &:focus {
    outline: none;
    border-color: $accent;
  }
}
</style>
