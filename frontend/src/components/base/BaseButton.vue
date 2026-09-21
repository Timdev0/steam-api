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
    background-color: $accent;
    color: $bg;

    &:hover:not(:disabled) {
      background-color: $accent-light;
    }
  }

  &--secondary {
    background-color: $bg-light;
    color: $text;

    &:hover:not(:disabled) {
      background-color: $bg-dark;
    }
  }
}
</style>
