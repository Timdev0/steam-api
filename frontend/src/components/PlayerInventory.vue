<script setup lang="ts">
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { usePlayerStore } from '@/stores/player'
import { useInventoryStore } from '@/stores/inventory'
import { getInventoryItemImageUrl, groupInventoryItems } from '@/utils/inventory'

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
      <ul v-else class="inventory-list">
        <li v-for="item in groupedItems" :key="item.classId" class="inventory-item">
          <img :src="getInventoryItemImageUrl(item.iconUrl)" :alt="item.name" />
          <span>{{ item.marketHashName }}</span>
          <span v-if="item.count > 1">x{{ item.count }}</span>
        </li>
      </ul>
    </template>
  </section>
</template>
