<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'secondary'
  type?: 'button' | 'submit'
  disabled?: boolean
}>()
</script>

<template>
  <button
    :type="type ?? 'button'"
    :disabled="disabled"
    :class="['btn', `btn--${variant ?? 'primary'}`]"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
.btn {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s, opacity 0.2s;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &--primary {
    background-color: #66c0f4;
    color: #1b2838;

    &:hover:not(:disabled) {
      background-color: #8ed0f7;
    }
  }

  &--secondary {
    background-color: #2a475e;
    color: #c7d5e0;

    &:hover:not(:disabled) {
      background-color: #375a75;
    }
  }
}
</style>
