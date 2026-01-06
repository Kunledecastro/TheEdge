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
    // First, filter by 80% probability threshold
    const filteredOdds = probabilityCalculator.filterByProbability(oddsArray, 0.8);

    if (filteredOdds.length < minSelections) {
      return [];
    }

    const accumulators: Accumulator[] = [];

    // Generate combinations
    for (let size = minSelections; size <= Math.min(maxSelections, filteredOdds.length); size++) {
      const combinations = this.generateCombinations(filteredOdds, size);
      
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
   * Generate all combinations of a given size from an array
   */
  private generateCombinations<T>(array: T[], size: number): T[][] {
    if (size === 0) return [[]];
    if (array.length === 0) return [];

    const combinations: T[][] = [];
    const [first, ...rest] = array;

    // Combinations including first element
    const withFirst = this.generateCombinations(rest, size - 1);
    for (const combo of withFirst) {
      combinations.push([first, ...combo]);
    }

    // Combinations excluding first element
    const withoutFirst = this.generateCombinations(rest, size);
    combinations.push(...withoutFirst);

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

