import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import type { PlayerInventory } from '@/types/steam'

vi.mock('@/services/steam', () => ({
  fetchPlayerInventory: vi.fn(),
}))

import { fetchPlayerInventory } from '@/services/steam'
import { useInventoryStore } from './inventory'

function makeInventory(overrides: Partial<PlayerInventory> = {}): PlayerInventory {
  return {
    steamId: '1',
    appId: 730,
    contextId: 2,
    totalCount: 0,
    items: [],
    ...overrides,
  }
}

describe('inventory store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.mocked(fetchPlayerInventory).mockReset()
  })

  it('caches the result per game and does not refetch on a second call', async () => {
    const store = useInventoryStore()
    vi.mocked(fetchPlayerInventory).mockResolvedValueOnce(makeInventory({ totalCount: 3 }))

    await store.loadInventory('76561197960287930', 'cs2')
    await store.loadInventory('76561197960287930', 'cs2')

    expect(fetchPlayerInventory).toHaveBeenCalledTimes(1)
    expect(store.inventories.cs2?.totalCount).toBe(3)
  })

  it('drops the cache when a new player is searched', async () => {
    const store = useInventoryStore()
    vi.mocked(fetchPlayerInventory).mockResolvedValueOnce(makeInventory({ totalCount: 3 }))
    await store.loadInventory('76561197960287930', 'cs2')

    vi.mocked(fetchPlayerInventory).mockResolvedValueOnce(makeInventory({ totalCount: 1 }))
    await store.loadInventory('76561197960111111', 'cs2')

    expect(fetchPlayerInventory).toHaveBeenCalledTimes(2)
    expect(store.inventories.cs2?.totalCount).toBe(1)
  })
})
