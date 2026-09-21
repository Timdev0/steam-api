<template>
  <img :src="src" :alt="alt" @error="onError" />
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  appid: number
  imgIconUrl?: string
  alt: string
}>()

const PLACEHOLDER_ICON = '/placeholder-icon.svg'
const hasError = ref(false)

const src = computed(() =>
  hasError.value || !props.imgIconUrl
    ? PLACEHOLDER_ICON
    : `https://media.steampowered.com/steamcommunity/public/images/apps/${props.appid}/${props.imgIconUrl}.jpg`,
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
