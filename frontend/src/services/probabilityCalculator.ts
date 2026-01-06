// Simple probability calculator for frontend display
// The actual calculation is done on the backend

export function calculateProbabilityFromOdds(decimalOdds: number): number {
  return 1 / decimalOdds;
}

export function formatProbability(probability: number): string {
  return `${Math.round(probability * 100)}%`;
}

const probabilityCalculator = {
  calculateProbabilityFromOdds,
  formatProbability,
};

export default probabilityCalculator;

