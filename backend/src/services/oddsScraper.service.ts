import axios from 'axios';
import { Odds } from '../models/Odds.model';
import { americanToDecimal } from '../utils/oddsConverter';

interface OddsApiOutcome {
  name: string;
  price: number;
  point?: number;
}

interface OddsApiMarket {
  key: string;
  last_update: string;
  outcomes: OddsApiOutcome[];
}

interface OddsApiBookmaker {
  key: string;
  title: string;
  last_update: string;
  markets: OddsApiMarket[];
}

interface OddsApiResponse {
  id: string;
  sport_key: string;
  sport_title: string;
  commence_time: string;
  home_team: string;
  away_team: string;
  bookmakers: OddsApiBookmaker[];
}

class OddsScraperService {
  private baseUrl = 'https://api.the-odds-api.com/v4';
  private requestCount = 0;
  private monthlyLimit = 500; // Free tier limit
  private lastRequestTime = 0;
  private minRequestInterval = 1000; // 1 second between requests

  private get apiKey(): string {
    return process.env.ODDS_API_KEY || '';
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
            markets: 'h2h,totals',
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
      const homeTeam = game.home_team;
      const awayTeam = game.away_team;

      for (const bookmaker of game.bookmakers) {
        const h2hMarket = bookmaker.markets.find(m => m.key === 'h2h');
        if (h2hMarket && h2hMarket.outcomes.length >= 2) {
          for (const outcome of h2hMarket.outcomes) {
            let selection: string;
            if (outcome.name === homeTeam) {
              selection = 'home_win';
            } else if (outcome.name === awayTeam) {
              selection = 'away_win';
            } else {
              selection = 'draw';
            }

            odds.push({
              gameId: `${game.sport_key}_${game.commence_time}`,
              sport: game.sport_title,
              homeTeam,
              awayTeam,
              selection,
              americanOdds: outcome.price,
              decimalOdds: americanToDecimal(outcome.price),
              bookmaker: bookmaker.title,
              timestamp: new Date(bookmaker.last_update),
            });
          }
        }

        const totalsMarket = bookmaker.markets.find(m => m.key === 'totals');
        if (totalsMarket && totalsMarket.outcomes.length >= 2) {
          for (const outcome of totalsMarket.outcomes) {
            const selection = outcome.name === 'Over' ? 'over' : 'under';

            odds.push({
              gameId: `${game.sport_key}_${game.commence_time}`,
              sport: game.sport_title,
              homeTeam,
              awayTeam,
              selection,
              point: outcome.point,
              americanOdds: outcome.price,
              decimalOdds: americanToDecimal(outcome.price),
              bookmaker: bookmaker.title,
              timestamp: new Date(bookmaker.last_update),
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
      {
        gameId: 'mock_1',
        sport: 'Soccer',
        homeTeam: 'Manchester United',
        awayTeam: 'Liverpool',
        selection: 'over',
        point: 2.5,
        americanOdds: -110,
        decimalOdds: 1.91,
        bookmaker: 'Mock Bookmaker',
        timestamp: new Date(),
      },
      {
        gameId: 'mock_1',
        sport: 'Soccer',
        homeTeam: 'Manchester United',
        awayTeam: 'Liverpool',
        selection: 'under',
        point: 2.5,
        americanOdds: -105,
        decimalOdds: 1.95,
        bookmaker: 'Mock Bookmaker',
        timestamp: new Date(),
      },
      {
        gameId: 'mock_2',
        sport: 'Basketball',
        homeTeam: 'Lakers',
        awayTeam: 'Warriors',
        selection: 'over',
        point: 220.5,
        americanOdds: -115,
        decimalOdds: 1.87,
        bookmaker: 'Mock Bookmaker',
        timestamp: new Date(),
      },
      {
        gameId: 'mock_2',
        sport: 'Basketball',
        homeTeam: 'Lakers',
        awayTeam: 'Warriors',
        selection: 'under',
        point: 220.5,
        americanOdds: -105,
        decimalOdds: 1.95,
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

