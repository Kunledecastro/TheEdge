import type { Odds } from '../services/api';
import ProbabilityIndicator from './ProbabilityIndicator';
import { formatAmericanOdds } from '../utils/oddsUtils';

interface OddsCardProps {
  odds: Odds;
  probability?: number;
  onClick?: () => void;
  selected?: boolean;
}

const OddsCard: React.FC<OddsCardProps> = ({
  odds,
  probability,
  onClick,
  selected = false,
}) => {
  const getSelectionLabel = (selection: string, point?: number) => {
    switch (selection) {
      case 'home_win':
        return 'Home Win';
      case 'away_win':
        return 'Away Win';
      case 'draw':
        return 'Draw';
      case 'over':
        return `Over ${point ?? ''}`;
      case 'under':
        return `Under ${point ?? ''}`;
      default:
        return selection.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const isOverUnder = odds.selection === 'over' || odds.selection === 'under';

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg border-2 p-4 cursor-pointer transition-all hover:shadow-lg ${
        selected
          ? 'border-primary shadow-md'
          : 'border-gray-200 dark:border-gray-700 hover:border-primary/50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
            {odds.sport}
          </div>
          <div className="font-semibold text-sm text-gray-900 dark:text-white">
            {odds.homeTeam} vs {odds.awayTeam}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1 flex items-center gap-1">
            {isOverUnder && (
              <span className={`inline-block w-2 h-2 rounded-full ${odds.selection === 'over' ? 'bg-green-500' : 'bg-red-500'}`} />
            )}
            {getSelectionLabel(odds.selection, odds.point)}
          </div>
        </div>
        {probability !== undefined && (
          <ProbabilityIndicator probability={probability} size="sm" />
        )}
      </div>

      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div>
          <div className="text-xs text-gray-500 dark:text-gray-400">Odds</div>
          <div className="font-mono font-bold text-lg text-primary">
            {formatAmericanOdds(odds.americanOdds)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500 dark:text-gray-400">Bookmaker</div>
          <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {odds.bookmaker}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OddsCard;

