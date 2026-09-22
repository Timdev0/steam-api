import { describe, expect, it } from 'vitest'
import type { InventoryItem } from '@/types/steam'
import { getInventoryItemImageUrl, groupInventoryItems } from './inventory'

function makeItem(overrides: Partial<InventoryItem> = {}): InventoryItem {
  return {
    assetId: '1',
    classId: 'case-bravo',
    name: 'Operation Bravo Case',
    marketHashName: 'Operation Bravo Case',
    iconUrl: 'abc',
    amount: 1,
    tradable: true,
    marketable: true,
    ...overrides,
  }
}

describe('groupInventoryItems', () => {
  it('merges items sharing the same classId into one entry with a count', () => {
    const items = [
      makeItem({ assetId: '1' }),
      makeItem({ assetId: '2' }),
      makeItem({ assetId: '3' }),
    ]

    const grouped = groupInventoryItems(items)

    expect(grouped).toHaveLength(1)
    expect(grouped[0]).toMatchObject({
      classId: 'case-bravo',
      count: 3,
      assetIds: ['1', '2', '3'],
    })
  })

  it('keeps items with a different classId as separate entries', () => {
    const items = [
      makeItem({ assetId: '1', classId: 'case-bravo' }),
      makeItem({ assetId: '2', classId: 'ak-redline', name: 'AK-47 | Redline' }),
    ]

    const grouped = groupInventoryItems(items)
    expect(grouped).toHaveLength(2)
  })

  it('sorts by count descending, then by name', () => {
    const items = [
      makeItem({ assetId: '1', classId: 'a', name: 'Zebra Case', amount: 1 }),
      makeItem({ assetId: '2', classId: 'b', name: 'Alpha Case', amount: 5 }),
      makeItem({ assetId: '3', classId: 'c', name: 'Beta Case', amount: 5 }),
    ]

    const grouped = groupInventoryItems(items)
    expect(grouped.map((g) => g.name)).toEqual(['Alpha Case', 'Beta Case', 'Zebra Case'])
  })

  it('respects a non-1 amount on a single asset (stackable items)', () => {
    const items = [makeItem({ assetId: '1', amount: 7 })]
    const grouped = groupInventoryItems(items)
    expect(grouped[0]?.count).toBe(7)
  })
})

describe('getInventoryItemImageUrl', () => {
  it('builds the Steam economy CDN URL with a default size', () => {
    expect(getInventoryItemImageUrl('abc123')).toBe(
      'https://community.cloudflare.steamstatic.com/economy/image/abc123/256fx256f',
    )
  })

  it('accepts a custom size', () => {
    expect(getInventoryItemImageUrl('abc123', '128x128')).toBe(
      'https://community.cloudflare.steamstatic.com/economy/image/abc123/128x128',
    )
  })
})
