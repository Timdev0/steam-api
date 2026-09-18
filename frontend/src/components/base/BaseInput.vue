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
  border: 1px solid #2a475e;
  border-radius: 6px;
  background-color: #1b2838;
  color: #c7d5e0;
  font-size: 1rem;
  width: 100%;

  &::placeholder {
    color: #66788a;
  }

  &:focus {
    outline: none;
    border-color: #66c0f4;
  }
}
</style>
