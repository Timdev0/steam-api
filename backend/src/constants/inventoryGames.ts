export interface InventoryGame {
  appId: number;
  contextId: number;
  label: string;
}

// Steam app IDs and inventory context IDs are fixed, publicly documented
// constants (contextid 2 covers tradable items for most games). To
// support a new game's inventory, add one entry here — no new route or
// controller needed, GET /api/player/:steamId/inventory/:slug picks it
// up automatically.
export const INVENTORY_GAMES: Record<string, InventoryGame> = {
  cs2: { appId: 730, contextId: 2, label: "Counter-Strike 2" },
};

export function getInventoryGame(slug: string): InventoryGame | undefined {
  return INVENTORY_GAMES[slug.toLowerCase()];
}
