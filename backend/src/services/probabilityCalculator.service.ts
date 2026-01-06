import { Odds, HistoricalStats } from '../models/Odds.model';
import {
  estimateSuccessProbability,
  meetsThreshold,
  calculateCombinedProbability,
} from '../utils/probabilityUtils';

class ProbabilityCalculatorService {
  private historicalStats: Map<string, HistoricalStats> = new Map();

  /**
   * Load historical stats (in production, this would come from a database)
   */
  loadHistoricalStats(stats: HistoricalStats[]): void {
    this.historicalStats.clear();
    stats.forEach(stat => {
      this.historicalStats.set(stat.team, stat);
    });
  }

  /**
   * Calculate probability for a single selection
   */
  calculateSelectionProbability(odds: Odds): number {
    const statsArray = Array.from(this.historicalStats.values());
    return estimateSuccessProbability(odds, statsArray);
  }

  /**
   * Filter odds to only those with 80%+ success probability
   */
  filterByProbability(oddsArray: Odds[], threshold: number = 0.8): Odds[] {
    return oddsArray.filter(odds => {
      const probability = this.calculateSelectionProbability(odds);
      return meetsThreshold(probability, threshold);
    });
  }

  /**
   * Calculate total probability for an accumulator
   */
  calculateAccumulatorProbability(selections: Odds[]): number {
    const probabilities = selections.map(odds => 
      this.calculateSelectionProbability(odds)
    );
    return calculateCombinedProbability(probabilities);
  }

  /**
   * Get probability breakdown for display
   */
  getProbabilityBreakdown(odds: Odds): {
    oddsProbability: number;
    historicalAdjustment: number;
    finalProbability: number;
    meetsThreshold: boolean;
  } {
    const statsArray = Array.from(this.historicalStats.values());
    const finalProbability = estimateSuccessProbability(odds, statsArray);
    const oddsProbability = 1 / odds.decimalOdds;
    
    const teamStats = statsArray.find(
      stat => stat.team === odds.homeTeam || stat.team === odds.awayTeam
    );
    const historicalAdjustment = teamStats ? teamStats.winRate / 100 : oddsProbability;

    return {
      oddsProbability,
      historicalAdjustment,
      finalProbability,
      meetsThreshold: meetsThreshold(finalProbability, 0.8),
    };
  }

  /**
   * Initialize with default mock stats for development
   */
  initializeMockStats(): void {
    const mockStats: HistoricalStats[] = [
      {
        team: 'Manchester United',
        sport: 'Soccer',
        winRate: 65,
        recentForm: 'WWLWW',
        lastUpdated: new Date(),
      },
      {
        team: 'Liverpool',
        sport: 'Soccer',
        winRate: 70,
        recentForm: 'WLWWW',
        lastUpdated: new Date(),
      },
      {
        team: 'Lakers',
        sport: 'Basketball',
        winRate: 60,
        recentForm: 'WWLWL',
        lastUpdated: new Date(),
      },
      {
        team: 'Warriors',
        sport: 'Basketball',
        winRate: 75,
        recentForm: 'WWWWL',
        lastUpdated: new Date(),
      },
    ];

    this.loadHistoricalStats(mockStats);
  }
}

export default new ProbabilityCalculatorService();

