<script setup lang="ts">
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/stores/player'
import { useInventoryStore } from '@/stores/inventory'
import { groupInventoryItems } from '@/utils/inventory'
import InventoryItem from './InventoryItem.vue'

const GAME = 'cs2'

const playerStore = usePlayerStore()
const { player } = storeToRefs(playerStore)

const inventoryStore = useInventoryStore()
const { inventories, isLoading } = storeToRefs(inventoryStore)

const groupedItems = computed(() => groupInventoryItems(inventories.value[GAME]?.items ?? []))

console.log('groupedItems', groupedItems.value)

watch(
  () => player.value?.steamid,
  (steamId) => {
    if (steamId) inventoryStore.loadInventory(steamId, GAME)
  },
  { immediate: true },
)
</script>

<template>
  <section class="inventory">
    <p v-if="isLoading">Loading inventory...</p>
    <template v-else>
      <p v-if="groupedItems.length === 0">No items found in inventory.</p>
      <ul v-else class="inventory__list">
        <li v-for="item in groupedItems" :key="item.classId" class="inventory__list__item">
          <InventoryItem :item="item" />
        </li>
      </ul>
    </template>
  </section>
</template>

<style lang="scss" scoped>
.inventory {
  &__list {
    margin: 0;
    padding: 1rem 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr));
    gap: 2rem;

    &__item {
      list-style: none;
    }
  }
}
</style>
