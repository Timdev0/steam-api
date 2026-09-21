import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { PlayerGame } from '@/types/steam'

vi.mock('@/services/steam', () => ({
  fetchPlayerGames: vi.fn(),
}))

import { fetchPlayerGames } from '@/services/steam'
import { useGamesStore } from './games'

function makeGame(overrides: Partial<PlayerGame> = {}): PlayerGame {
  return {
    appid: 1,
    name: 'Game',
    playtime_forever: 0,
    img_icon_url: '',
    img_logo_url: '',
    has_community_visible_stats: false,
    rtime_last_played: 0,
    ...overrides,
  }
}

describe('games store - roulette state on a new player search', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.mocked(fetchPlayerGames).mockReset()
  })

  it('clears rouletteCurrentGame and pickHistory when setGames runs again', () => {
    const store = useGamesStore()
    store.setGames([makeGame({ appid: 1 }), makeGame({ appid: 2 })])

    store.pickRandom()
    expect(store.rouletteCurrentGame).not.toBeNull()
    expect(store.pickHistory).toHaveLength(1)

    // Simulates what happens when a new player's game list arrives
    store.setGames([makeGame({ appid: 3 }), makeGame({ appid: 4 })])

    expect(store.rouletteCurrentGame).toBeNull()
    expect(store.pickHistory).toHaveLength(0)
  })

  it('clears rouletteCurrentGame through the real loadGames flow (search a new player)', async () => {
    const store = useGamesStore()

    vi.mocked(fetchPlayerGames).mockResolvedValueOnce({
      game_count: 2,
      games: [makeGame({ appid: 1 }), makeGame({ appid: 2 })],
    })
    await store.loadGames('76561197960287930')
    store.pickRandom()
    expect(store.rouletteCurrentGame).not.toBeNull()

    // A second player is searched: loadGames runs again with a fresh list
    vi.mocked(fetchPlayerGames).mockResolvedValueOnce({
      game_count: 1,
      games: [makeGame({ appid: 99 })],
    })
    await store.loadGames('76561197960111111')

    expect(store.rouletteCurrentGame).toBeNull()
    expect(store.pickHistory).toHaveLength(0)
  })
})
