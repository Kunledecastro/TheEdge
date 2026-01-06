import axios from 'axios';
import { Odds } from '../models/Odds.model';
import { americanToDecimal } from '../utils/oddsConverter';

interface OddsApiResponse {
  sport_key: string;
  sport_nice: string;
  teams: string[];
  commence_time: number;
  home_team: string;
  sites: Array<{
    site_key: string;
    site_nice: string;
    last_update: number;
    odds: {
      h2h?: number[];
      h2h_lay?: number[];
      spreads?: {
        points: number[];
        odds: number[];
      };
      totals?: {
        points: number[];
        odds: number[];
      };
    };
  }>;
}

class OddsScraperService {
  private apiKey: string;
  private baseUrl = 'https://api.the-odds-api.com/v4';
  private requestCount = 0;
  private monthlyLimit = 500; // Free tier limit
  private lastRequestTime = 0;
  private minRequestInterval = 1000; // 1 second between requests

  constructor() {
    this.apiKey = process.env.ODDS_API_KEY || '';
    if (!this.apiKey) {
      console.warn('ODDS_API_KEY not set. Using mock data mode.');
    }
  }

  /**
   * Rate limiting to respect API limits
   */
  private async rateLimit(): Promise<void> {
    if (this.requestCount >= this.monthlyLimit) {
      throw new Error('Monthly API limit reached');
    }

    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minRequestInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest)
      );
    }
    this.lastRequestTime = Date.now();
  }

  /**
   * Fetch odds from The Odds API
   */
  async fetchOdds(sport: string = 'soccer_epl'): Promise<Odds[]> {
    if (!this.apiKey) {
      // Return mock data for development
      return this.getMockOdds();
    }

    try {
      await this.rateLimit();
      
      const response = await axios.get<OddsApiResponse[]>(
        `${this.baseUrl}/sports/${sport}/odds`,
        {
          params: {
            apiKey: this.apiKey,
            regions: 'us',
            markets: 'h2h',
            oddsFormat: 'american',
          },
        }
      );

      this.requestCount++;
      return this.parseOddsResponse(response.data, sport);
    } catch (error) {
      console.error('Error fetching odds:', error);
      // Fallback to mock data on error
      return this.getMockOdds();
    }
  }

  /**
   * Parse API response into Odds model
   */
  private parseOddsResponse(data: OddsApiResponse[], sport: string): Odds[] {
    const odds: Odds[] = [];

    for (const game of data) {
      const homeTeam = game.home_team || game.teams[0];
      const awayTeam = game.teams.find(t => t !== homeTeam) || game.teams[1];

      for (const site of game.sites) {
        if (site.odds.h2h && site.odds.h2h.length >= 2) {
          // Home win
          odds.push({
            gameId: `${game.sport_key}_${game.commence_time}`,
            sport: game.sport_nice,
            homeTeam,
            awayTeam,
            selection: 'home_win',
            americanOdds: site.odds.h2h[0],
            decimalOdds: americanToDecimal(site.odds.h2h[0]),
            bookmaker: site.site_nice,
            timestamp: new Date(site.last_update * 1000),
          });

          // Away win
          odds.push({
            gameId: `${game.sport_key}_${game.commence_time}`,
            sport: game.sport_nice,
            homeTeam,
            awayTeam,
            selection: 'away_win',
            americanOdds: site.odds.h2h[1],
            decimalOdds: americanToDecimal(site.odds.h2h[1]),
            bookmaker: site.site_nice,
            timestamp: new Date(site.last_update * 1000),
          });

          // Draw (if available)
          if (site.odds.h2h.length >= 3) {
            odds.push({
              gameId: `${game.sport_key}_${game.commence_time}`,
              sport: game.sport_nice,
              homeTeam,
              awayTeam,
              selection: 'draw',
              americanOdds: site.odds.h2h[2],
              decimalOdds: americanToDecimal(site.odds.h2h[2]),
              bookmaker: site.site_nice,
              timestamp: new Date(site.last_update * 1000),
            });
          }
        }
      }
    }

    return odds;
  }

  /**
   * Mock data for development/testing
   */
  private getMockOdds(): Odds[] {
    return [
      {
        gameId: 'mock_1',
        sport: 'Soccer',
        homeTeam: 'Manchester United',
        awayTeam: 'Liverpool',
        selection: 'home_win',
        americanOdds: 150,
        decimalOdds: 2.5,
        bookmaker: 'Mock Bookmaker',
        timestamp: new Date(),
      },
      {
        gameId: 'mock_1',
        sport: 'Soccer',
        homeTeam: 'Manchester United',
        awayTeam: 'Liverpool',
        selection: 'away_win',
        americanOdds: 180,
        decimalOdds: 2.8,
        bookmaker: 'Mock Bookmaker',
        timestamp: new Date(),
      },
      {
        gameId: 'mock_2',
        sport: 'Basketball',
        homeTeam: 'Lakers',
        awayTeam: 'Warriors',
        selection: 'home_win',
        americanOdds: 120,
        decimalOdds: 2.2,
        bookmaker: 'Mock Bookmaker',
        timestamp: new Date(),
      },
      {
        gameId: 'mock_2',
        sport: 'Basketball',
        homeTeam: 'Lakers',
        awayTeam: 'Warriors',
        selection: 'away_win',
        americanOdds: 110,
        decimalOdds: 2.1,
        bookmaker: 'Mock Bookmaker',
        timestamp: new Date(),
      },
    ];
  }

  /**
   * Get available sports
   */
  async getAvailableSports(): Promise<string[]> {
    if (!this.apiKey) {
      return ['soccer_epl', 'basketball_nba'];
    }

    try {
      await this.rateLimit();
      const response = await axios.get(`${this.baseUrl}/sports`, {
        params: { apiKey: this.apiKey },
      });
      this.requestCount++;
      return response.data.map((sport: any) => sport.key);
    } catch (error) {
      console.error('Error fetching sports:', error);
      return ['soccer_epl', 'basketball_nba'];
    }
  }
}

export default new OddsScraperService();

