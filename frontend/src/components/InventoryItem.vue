<template>
  <div class="item">
    <img class="item__image" :src="getInventoryItemImageUrl(item.iconUrl)" :alt="item.name" />
    <p class="item__name" :title="item.marketHashName">{{ item.marketHashName }}
      <span v-if="item.count > 1"> - x{{ item.count }}</span>
    </p>

  </div>
</template>

<script setup lang="ts">
import { getInventoryItemImageUrl } from '@/utils/inventory'
import type { GroupedInventoryItem } from '@/utils/inventory'
defineProps<{
  item: GroupedInventoryItem
}>()

</script>

<style lang="scss" scoped>
.item {
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: $bg-light;
  border-radius: 0.5rem;
  padding: 0.75rem;
  justify-content: space-between;

  &__image {
    width: 100%;
    aspect-ratio: 1 / 1;
    object-fit: contain;
  }

  &__desc {
    flex: 1;
    min-height: 0;
    display: flex;
  }

  &__name {
    overflow: hidden;
  }
}
</style>
