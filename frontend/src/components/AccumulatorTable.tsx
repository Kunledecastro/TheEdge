import React, { useState } from 'react';
import { Accumulator } from '../services/api';
import ProbabilityIndicator from './ProbabilityIndicator';
import { formatAmericanOdds, formatProbability } from '../utils/oddsUtils';

interface AccumulatorTableProps {
  accumulators: Accumulator[];
  onAccumulatorClick?: (accumulator: Accumulator) => void;
}

const AccumulatorTable: React.FC<AccumulatorTableProps> = ({
  accumulators,
  onAccumulatorClick,
}) => {
  const [sortBy, setSortBy] = useState<'odds' | 'probability' | 'selections'>('probability');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedAccumulators = [...accumulators].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'odds':
        comparison = a.combinedAmericanOdds - b.combinedAmericanOdds;
        break;
      case 'probability':
        comparison = a.totalProbability - b.totalProbability;
        break;
      case 'selections':
        comparison = a.selections.length - b.selections.length;
        break;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSort = (column: typeof sortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const getSortIcon = (column: typeof sortBy) => {
    if (sortBy !== column) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  if (accumulators.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
        <p className="text-gray-500 dark:text-gray-400">
          No accumulators found. Fetch odds first to generate combinations.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => handleSort('selections')}
              >
                Selections {getSortIcon('selections')}
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => handleSort('odds')}
              >
                Combined Odds {getSortIcon('odds')}
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
                onClick={() => handleSort('probability')}
              >
                Success Probability {getSortIcon('probability')}
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {sortedAccumulators.map((accumulator, index) => (
              <tr
                key={accumulator.id || index}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors"
                onClick={() => onAccumulatorClick?.(accumulator)}
              >
                <td className="px-4 py-3">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {accumulator.selections.length} games
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {accumulator.selections
                      .map(s => `${s.homeTeam} vs ${s.awayTeam}`)
                      .join(', ')}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-mono font-bold text-primary text-lg">
                    {formatAmericanOdds(accumulator.combinedAmericanOdds)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <ProbabilityIndicator
                    probability={accumulator.totalProbability}
                    size="sm"
                  />
                </td>
                <td className="px-4 py-3">
                  <button className="text-primary hover:text-primary-dark text-sm font-medium">
                    View Details →
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccumulatorTable;

