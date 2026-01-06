interface FilterPanelProps {
  selectedSport: string;
  onSportChange: (sport: string) => void;
  sports: string[];
  minSelections: number;
  maxSelections: number;
  onMinSelectionsChange: (value: number) => void;
  onMaxSelectionsChange: (value: number) => void;
  onFetchOdds: () => void;
  onBuildAccumulators: () => void;
  isLoading?: boolean;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  selectedSport,
  onSportChange,
  sports,
  minSelections,
  maxSelections,
  onMinSelectionsChange,
  onMaxSelectionsChange,
  onFetchOdds,
  onBuildAccumulators,
  isLoading = false,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sport
          </label>
          <select
            value={selectedSport}
            onChange={(e) => onSportChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isLoading}
          >
            {sports.map((sport) => (
              <option key={sport} value={sport}>
                {sport.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Min Selections
          </label>
          <input
            type="number"
            min="2"
            max="10"
            value={minSelections}
            onChange={(e) => onMinSelectionsChange(parseInt(e.target.value) || 2)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Max Selections
          </label>
          <input
            type="number"
            min="2"
            max="10"
            value={maxSelections}
            onChange={(e) => onMaxSelectionsChange(parseInt(e.target.value) || 4)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isLoading}
          />
        </div>

        <div className="flex items-end gap-2">
          <button
            onClick={onFetchOdds}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Loading...
              </>
            ) : (
              'Fetch Odds'
            )}
          </button>
          <button
            onClick={onBuildAccumulators}
            disabled={isLoading}
            className="flex-1 px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Build
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;

