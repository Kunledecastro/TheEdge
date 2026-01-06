const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Odds {
  id?: number;
  gameId: string;
  sport: string;
  homeTeam: string;
  awayTeam: string;
  selection: string;
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
  recentForm: string;
  headToHead?: Record<string, number>;
  lastUpdated: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  error?: string;
  message?: string;
}

class ApiService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      const data = await response.json();
      return data;
    } catch (error: any) {
      return {
        success: false,
        data: null as any,
        error: error.message || 'Network error',
      };
    }
  }

  // Odds endpoints
  async fetchOdds(sport?: string): Promise<ApiResponse<Odds[]>> {
    const query = sport ? `?sport=${sport}` : '';
    return this.request<Odds[]>(`/odds${query}`);
  }

  async getStoredOdds(): Promise<ApiResponse<Odds[]>> {
    return this.request<Odds[]>('/odds/stored');
  }

  async getSports(): Promise<ApiResponse<string[]>> {
    return this.request<string[]>('/odds/sports');
  }

  // Accumulator endpoints
  async getAccumulators(
    minSelections?: number,
    maxSelections?: number
  ): Promise<ApiResponse<Accumulator[]>> {
    const params = new URLSearchParams();
    if (minSelections) params.append('minSelections', minSelections.toString());
    if (maxSelections) params.append('maxSelections', maxSelections.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return this.request<Accumulator[]>(`/accumulators${query}`);
  }

  async calculateAccumulator(
    selectionIds: string[]
  ): Promise<ApiResponse<Accumulator>> {
    return this.request<Accumulator>('/accumulators/calculate', {
      method: 'POST',
      body: JSON.stringify({ selectionIds }),
    });
  }

  async getStoredAccumulators(): Promise<ApiResponse<Accumulator[]>> {
    return this.request<Accumulator[]>('/accumulators/stored');
  }

  // Stats endpoints
  async getStats(): Promise<ApiResponse<HistoricalStats[]>> {
    return this.request<HistoricalStats[]>('/stats');
  }

  async addStat(stat: Partial<HistoricalStats>): Promise<ApiResponse<HistoricalStats>> {
    return this.request<HistoricalStats>('/stats', {
      method: 'POST',
      body: JSON.stringify(stat),
    });
  }

  async getProbabilityBreakdown(oddsId: string): Promise<ApiResponse<any>> {
    return this.request<any>(`/stats/probability/${oddsId}`);
  }
}

export default new ApiService();

