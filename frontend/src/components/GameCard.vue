<template>
  <li class="game-card">
    <div class="game-card__header">
      <GameBanner :appid="game.appid" :alt="game.name" />
    </div>

    <div class="game-card__body">
      <div class="game-card__head">
        <GameIcon
          class="game-card__icon"
          :appid="game.appid"
          :img-icon-url="game.img_icon_url"
          :alt="game.name"
        />
        <span class="game-card__name">{{ game.name }}</span>
      </div>

      <div class="game-card__stats">
        <span class="game-card__stat">
          <span class="label">Total Playtime</span>
          <span class="value">{{ formatPlaytime(game.playtime_forever) }}</span>
        </span>
        <span class="game-card__stat">
          <span class="label">Last Played</span>
          <span class="value">{{ formatLastPlayed(game.rtime_last_played) }}</span>
        </span>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import type { PlayerGame } from '@/types/steam'
import { formatLastPlayed } from '@/utils/lastPlayed'
import { formatPlaytime } from '@/utils/playtime'
import GameBanner from './GameBanner.vue'
import GameIcon from './GameIcon.vue'

defineProps<{
  game: PlayerGame
}>()
</script>

<style scoped lang="scss">
.game-card {
  list-style: none;
  display: flex;
  flex-direction: column;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: $bg-light;
  flex: 1;
  max-width: 460px;

  &__header {
    height: auto;
    aspect-ratio: 460 / 215;

    img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__body {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 0.5rem;
    padding: 0.75rem;
  }

  &__head {
    display: flex;
    flex-direction: row;
    gap: 0.75rem;
    align-items: flex-start;
  }

  &__icon {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    border-radius: 0.25rem;
  }

  &__name {
    font-weight: 600;
    font-size: 1.1rem;
    min-height: 2.6em;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__stats {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  &__stat {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;

    .label {
      opacity: 0.6;
    }

    .value {
      font-weight: 600;
      color: $accent;
    }
  }
}
</style>
