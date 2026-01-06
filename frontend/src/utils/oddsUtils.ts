/**
 * Format American odds for display
 */
export function formatAmericanOdds(americanOdds: number): string {
  if (americanOdds > 0) {
    return `+${americanOdds}`;
  }
  return americanOdds.toString();
}

/**
 * Format probability as percentage
 */
export function formatProbability(probability: number): string {
  return `${Math.round(probability * 100)}%`;
}

/**
 * Check if odds are in range (100-1000)
 */
export function isInRange(americanOdds: number): boolean {
  return americanOdds >= 100 && americanOdds <= 1000;
}

