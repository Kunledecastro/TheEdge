export interface Odds {
  id?: number;
  gameId: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  selection: string; // e.g., "home_win", "away_win", "over_2.5"
  americanOdds: number;
  decimalOdds: number;
  bookmaker: string;
  timestamp: Date;
}

export interface Accumulator {
  id?: number;
  selections: Odds[];
  combinedAmericanOdds: number;
  combinedDecimalOdds: number;
  totalProbability: number;
  createdAt: Date;
}

export interface HistoricalStats {
  id?: number;
  team: string;
  sport: string;
  winRate: number;
  recentForm: string; // e.g., "WWLWW"
  headToHead?: Record<string, number>; // win rate against specific opponents
  lastUpdated: Date;
}

