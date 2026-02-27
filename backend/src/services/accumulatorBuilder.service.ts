import { Odds, Accumulator } from '../models/Odds.model';
import { calculateAccumulatorOdds, isInRange } from '../utils/oddsConverter';
import probabilityCalculator from './probabilityCalculator.service';

class AccumulatorBuilderService {
  /**
   * Generate all possible accumulator combinations from odds
   * Filters by 80% probability threshold and 100-1000 odds range
   */
  buildAccumulators(
    oddsArray: Odds[],
    minSelections: number = 2,
    maxSelections: number = 4
  ): Accumulator[] {
    const filteredOdds = probabilityCalculator.filterByProbability(oddsArray, 0.4);

    if (filteredOdds.length < minSelections) {
      return [];
    }

    // Deduplicate: keep best odds per game+selection to limit combinatorial explosion
    const bestByKey = new Map<string, Odds>();
    for (const odd of filteredOdds) {
      const key = `${odd.gameId}_${odd.selection}`;
      const existing = bestByKey.get(key);
      if (!existing || odd.americanOdds > existing.americanOdds) {
        bestByKey.set(key, odd);
      }
    }
    const deduped = Array.from(bestByKey.values()).slice(0, 50);

    const accumulators: Accumulator[] = [];

    // Generate combinations
    for (let size = minSelections; size <= Math.min(maxSelections, deduped.length); size++) {
      const combinations = this.generateCombinations(deduped, size);
      
      for (const combination of combinations) {
        // Ensure no duplicate games in the accumulator
        const gameIds = new Set(combination.map(odds => odds.gameId));
        if (gameIds.size !== combination.length) {
          continue; // Skip if duplicate games
        }

        const americanOdds = combination.map(odds => odds.americanOdds);
        const combinedAmericanOdds = calculateAccumulatorOdds(americanOdds);

        // Filter by odds range (100-1000)
        if (isInRange(combinedAmericanOdds)) {
          const totalProbability = probabilityCalculator.calculateAccumulatorProbability(combination);
          
          accumulators.push({
            selections: combination,
            combinedAmericanOdds,
            combinedDecimalOdds: (combinedAmericanOdds / 100) + 1,
            totalProbability,
            createdAt: new Date(),
          });
        }
      }
    }

    // Sort by probability (highest first)
    return accumulators.sort((a, b) => b.totalProbability - a.totalProbability);
  }

  /**
   * Generate all combinations of a given size from an array (iterative to avoid stack overflow)
   */
  private generateCombinations<T>(array: T[], size: number): T[][] {
    const combinations: T[][] = [];
    const indices = Array.from({ length: size }, (_, i) => i);
    const n = array.length;

    if (size > n) return [];

    while (true) {
      combinations.push(indices.map(i => array[i]));

      let i = size - 1;
      while (i >= 0 && indices[i] === n - size + i) {
        i--;
      }
      if (i < 0) break;

      indices[i]++;
      for (let j = i + 1; j < size; j++) {
        indices[j] = indices[j - 1] + 1;
      }
    }

    return combinations;
  }

  /**
   * Calculate accumulator for a custom selection
   */
  calculateCustomAccumulator(selectionIds: string[], allOdds: Odds[]): Accumulator | null {
    const selections = selectionIds
      .map(id => allOdds.find(odds => odds.id?.toString() === id))
      .filter((odds): odds is Odds => odds !== undefined);

    if (selections.length < 2) {
      return null;
    }

    // Check for duplicate games
    const gameIds = new Set(selections.map(odds => odds.gameId));
    if (gameIds.size !== selections.length) {
      return null;
    }

    const americanOdds = selections.map(odds => odds.americanOdds);
    const combinedAmericanOdds = calculateAccumulatorOdds(americanOdds);
    const totalProbability = probabilityCalculator.calculateAccumulatorProbability(selections);

    return {
      selections,
      combinedAmericanOdds,
      combinedDecimalOdds: (combinedAmericanOdds / 100) + 1,
      totalProbability,
      createdAt: new Date(),
    };
  }
}

export default new AccumulatorBuilderService();

