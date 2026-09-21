<template>
  <img :src="src" :alt="alt" @error="onError" />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  appid: number
  alt: string
}>()

const PLACEHOLDER = '/placeholder-game.svg'
const hasError = ref(false)

const src = computed(() =>
  hasError.value
    ? PLACEHOLDER
    : `https://cdn.cloudflare.steamstatic.com/steam/apps/${props.appid}/header.jpg`,
)

function onError() {
  hasError.value = true
}

watch(
  () => props.appid,
  () => {
    hasError.value = false
  },
)
</script>
