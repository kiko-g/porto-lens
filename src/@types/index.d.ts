export type Season = {
  first_year: number;
  last_year: number;
  season_span: string;
  season_url_matchdays: string;
  season_url_highlight: string;
  season_url_standings: string;
  matchdays: Matchday[];
};

export type Matchday = {
  number: number;
  number: number;
  matchday_url: string;
  game_urls: string[];
  porto_game_url: string;
  games: Game[];
  porto_game: Game;
};

export type Game = {
  game_url: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  date: string;
  videos: Video[];
  goals: Video[];
};

export type Video = {
  type: string;
  title: string;
  description: string;
  share_url: string;
  embed: string;
};

export type ClubSeasonGames = {
  season: string;
  club: string;
  games: Game[];
};
