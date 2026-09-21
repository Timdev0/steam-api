<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  tabs: { value: string; label: string }[]
  modelValue?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const active = computed(() => props.modelValue ?? props.tabs[0]?.value)

function select(value: string) {
  emit('update:modelValue', value)
}

</script>

<template>
  <div class="base-tabs">
    <div class="base-tabs__list" role="tablist">
      <button v-for="tab in tabs" :key="tab.value" type="button" role="tab" :aria-selected="tab.value === active"
        class="base-tabs__tab" :class="{ 'is-active': tab.value === active }" @click="select(tab.value)">
        {{ tab.label }}
      </button>

    </div>
    <div class="base-tabs__panel">
      <slot :active="active" />
    </div>
  </div>
</template>


<style scoped lang="scss">
.base-tabs {
  &__list {
    display: flex;
    gap: 0.5rem;
    border-bottom: 1px solid $bg-light;
    margin-bottom: 1rem;
  }

  &__tab {
    padding: 0.6rem 1.2rem;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    color: $text;
    font-weight: 600;
    cursor: pointer;
    opacity: 0.6;

    &:hover {
      opacity: 0.85;
    }

    &.is-active {
      opacity: 1;
      border-bottom-color: $accent;
      color: $accent;
    }
  }
}
</style>
