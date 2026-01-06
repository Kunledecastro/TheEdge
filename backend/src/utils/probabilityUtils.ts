import { Odds } from '../models/Odds.model';
import { HistoricalStats } from '../models/Odds.model';

/**
 * Calculate probability from decimal odds
 */
export function decimalToProbability(decimalOdds: number): number {
  return 1 / decimalOdds;
}

/**
 * Calculate probability from American odds
 */
export function americanToProbability(americanOdds: number): number {
  if (americanOdds > 0) {
    return 100 / (americanOdds + 100);
  } else {
    return Math.abs(americanOdds) / (Math.abs(americanOdds) + 100);
  }
}

/**
 * Calculate combined probability for accumulator
 */
export function calculateCombinedProbability(probabilities: number[]): number {
  return probabilities.reduce((acc, prob) => acc * prob, 1);
}

/**
 * Estimate success probability based on historical stats
 * This is a simplified model - in production, you'd use more sophisticated ML models
 */
export function estimateSuccessProbability(
  odds: Odds,
  historicalStats?: HistoricalStats[]
): number {
  // Base probability from odds
  const oddsProbability = decimalToProbability(odds.decimalOdds);

  // If we have historical stats, adjust the probability
  if (historicalStats && historicalStats.length > 0) {
    // Find relevant stats for the team/selection
    const teamStats = historicalStats.find(
      stat => 
        stat.team === odds.homeTeam || 
        stat.team === odds.awayTeam
    );

    if (teamStats) {
      // Weighted average: 70% from odds, 30% from historical performance
      const historicalWeight = teamStats.winRate / 100;
      return oddsProbability * 0.7 + historicalWeight * 0.3;
    }
  }

  // Default: use odds probability with a conservative adjustment
  // For 80% threshold, we want to be more conservative
  return oddsProbability * 0.95; // Slight downward adjustment
}

/**
 * Check if probability meets the 80% threshold
 */
export function meetsThreshold(probability: number, threshold: number = 0.8): boolean {
  return probability >= threshold;
}

/**
 * Calculate form factor (recent performance)
 */
export function calculateFormFactor(form: string): number {
  if (!form || form.length === 0) return 1.0;

  const wins = (form.match(/W/g) || []).length;
  const total = form.length;
  const winRate = wins / total;

  // Convert to multiplier (0.5 = 50% win rate = 0.9x, 1.0 = 100% = 1.1x)
  return 0.9 + (winRate * 0.2);
}

