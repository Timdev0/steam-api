export interface PlayerSummary {
  steamid: string;
  personaname: string;
  profileurl: string;
  avatarfull: string;
  personastate: number;
}

export interface GetPlayerSummariesResponse {
  response: {
    players: PlayerSummary[];
  };
}

export interface OwnedGame {
  appid: number;
  name: string;
  playtime_forever: number;
  img_icon_url: string;
  img_logo_url: string;
  has_community_visible_stats: boolean;
  rtime_last_played: number;
}

export interface OwnedGames {
  game_count: number;
  games: OwnedGame[];
}

export interface OwnedGamesResponse {
  response: OwnedGames;
}

export interface ResolveVanityResponse {
  response: {
    steamid?: string;
    success: number;
  };
}

// Steam's inventory endpoint (steamcommunity.com/inventory/...) splits
// each item into two separate arrays that must be joined by hand:
// - assets: the instances a player actually owns (assetid, amount...)
// - descriptions: shared metadata for an item type (name, icon...),
//   keyed by the (classid, instanceid) pair, NOT by assetid.
// A private/unavailable inventory comes back as a literal `null` body
// (HTTP 200), or as { success: 0, Error: "..." } — never an HTTP error.
export interface RawInventoryAsset {
  appid: number;
  contextid: string;
  assetid: string;
  classid: string;
  instanceid: string;
  amount: string;
}

export interface RawInventoryDescription {
  appid: number;
  classid: string;
  instanceid: string;
  name: string;
  market_hash_name: string;
  icon_url: string;
  tradable: number;
  marketable: number;
  type?: string;
}

export interface RawInventoryResponse {
  success: number | boolean;
  total_inventory_count?: number;
  assets?: RawInventoryAsset[];
  descriptions?: RawInventoryDescription[];
  error?: string;
  Error?: string;
}

// Our own clean shape, exposed to the frontend: one flat list of items,
// assets and descriptions already merged. The frontend never needs to
// know Steam splits them in the first place.
export interface InventoryItem {
  assetId: string;
  classId: string;
  name: string;
  marketHashName: string;
  iconUrl: string;
  amount: number;
  tradable: boolean;
  marketable: boolean;
}

export interface PlayerInventory {
  steamId: string;
  appId: number;
  contextId: number;
  totalCount: number;
  items: InventoryItem[];
}
