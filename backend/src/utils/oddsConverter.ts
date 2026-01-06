/**
 * Utility functions for converting and calculating American odds
 */

/**
 * Convert American odds to decimal odds
 * @param americanOdds - American odds (e.g., +150, -200)
 * @returns Decimal odds (e.g., 2.50, 1.50)
 */
export function americanToDecimal(americanOdds: number): number {
  if (americanOdds > 0) {
    return (americanOdds / 100) + 1;
  } else {
    return (100 / Math.abs(americanOdds)) + 1;
  }
}

/**
 * Convert decimal odds to American odds
 * @param decimalOdds - Decimal odds (e.g., 2.50, 1.50)
 * @returns American odds (e.g., +150, -200)
 */
export function decimalToAmerican(decimalOdds: number): number {
  if (decimalOdds >= 2.0) {
    return Math.round((decimalOdds - 1) * 100);
  } else {
    return Math.round(-100 / (decimalOdds - 1));
  }
}

/**
 * Calculate combined accumulator odds from multiple selections
 * @param americanOddsArray - Array of American odds for each selection
 * @returns Combined American odds
 */
export function calculateAccumulatorOdds(americanOddsArray: number[]): number {
  if (americanOddsArray.length === 0) {
    return 0;
  }

  // Convert all to decimal, multiply, then convert back to American
  const decimalOdds = americanOddsArray.map(americanToDecimal);
  const combinedDecimal = decimalOdds.reduce((acc, odds) => acc * odds, 1);
  
  return decimalToAmerican(combinedDecimal);
}

/**
 * Check if odds are in the specified range (100-1000 American format)
 * @param americanOdds - American odds to check
 * @returns True if odds are between +100 and +1000
 */
export function isInRange(americanOdds: number): boolean {
  return americanOdds >= 100 && americanOdds <= 1000;
}

/**
 * Format American odds for display
 * @param americanOdds - American odds
 * @returns Formatted string (e.g., "+150" or "-200")
 */
export function formatAmericanOdds(americanOdds: number): string {
  if (americanOdds > 0) {
    return `+${americanOdds}`;
  }
  return americanOdds.toString();
}

