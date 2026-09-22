export interface PlayerSummary {
  steamid: string
  personaname: string
  profileurl: string
  avatarfull: string
  personastate: number
}

export interface PlayerGame {
  appid: number
  name: string
  playtime_forever: number
  img_icon_url: string
  img_logo_url: string
  has_community_visible_stats: boolean
  rtime_last_played: number
}

export interface PlayerGames {
  game_count: number
  games: PlayerGame[]
}

export interface InventoryItem {
  assetId: string
  classId: string
  name: string
  marketHashName: string
  iconUrl: string
  amount: number
  tradable: boolean
  marketable: boolean
}

export interface PlayerInventory {
  steamId: string
  appId: number
  contextId: number
  totalCount: number
  items: InventoryItem[]
}
