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
  r_time_last_played: number;
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
