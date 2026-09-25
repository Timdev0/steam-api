import type { InventoryItem } from '@/types/steam'

export interface GroupedInventoryItem {
  classId: string
  name: string
  marketHashName: string
  iconUrl: string
  count: number
  tradable: boolean
  marketable: boolean
  assetIds: string[]
}

/**
 * Groups identical items together (same classId = same skin/case/sticker,
 * Steam gives each physical instance its own assetId even when they're
 * visually and functionally identical). "13 Operation Bravo Case" becomes
 * one entry with count: 13 instead of 13 separate cards.
 *
 * Sorted by count desc, then name, so stacks of duplicates surface first.
 */
export function groupInventoryItems(items: InventoryItem[]): GroupedInventoryItem[] {
  const groups = new Map<string, GroupedInventoryItem>()

  for (const item of items) {
    const existing = groups.get(item.classId)
    if (existing) {
      existing.count += item.amount
      existing.assetIds.push(item.assetId)
      continue
    }
    groups.set(item.classId, {
      classId: item.classId,
      name: item.name,
      marketHashName: item.marketHashName,
      iconUrl: item.iconUrl,
      count: item.amount,
      tradable: item.tradable,
      marketable: item.marketable,
      assetIds: [item.assetId],
    })
  }

  return [...groups.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

/**
 * Builds the Steam CDN URL for an inventory item's image from its
 * iconUrl hash (same CDN family as the game headers in GameCard.vue).
 * No API key needed, it's a static asset URL.
 */
export function getInventoryItemImageUrl(iconUrl: string, size = '256fx256f'): string {
  return `https://community.cloudflare.steamstatic.com/economy/image/${iconUrl}/${size}`
}
