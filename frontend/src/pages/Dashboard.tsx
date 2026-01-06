import React, { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import FilterPanel from '../components/FilterPanel';
import AccumulatorTable from '../components/AccumulatorTable';
import OddsCard from '../components/OddsCard';
import DarkModeToggle from '../components/DarkModeToggle';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { useStoredOdds, useFetchOdds, useSports } from '../hooks/useOdds';
import { useStoredAccumulators, useBuildAccumulators } from '../hooks/useAccumulators';
import { Accumulator, Odds } from '../services/api';

const Dashboard: React.FC = () => {
  const queryClient = useQueryClient();
  const [selectedSport, setSelectedSport] = useState('soccer_epl');
  const [minSelections, setMinSelections] = useState(2);
  const [maxSelections, setMaxSelections] = useState(4);
  const [selectedAccumulator, setSelectedAccumulator] = useState<Accumulator | null>(null);

  const { data: sportsData } = useSports();
  const sports = sportsData?.data || ['soccer_epl', 'basketball_nba'];

  const { data: oddsData, isLoading: oddsLoading } = useStoredOdds();
  const odds = oddsData?.data || [];

  const { data: accumulatorsData, isLoading: accumulatorsLoading } = useStoredAccumulators();
  const accumulators = accumulatorsData?.data || [];

  const fetchOddsMutation = useFetchOdds();
  const buildAccumulatorsMutation = useBuildAccumulators();

  const handleFetchOdds = () => {
    fetchOddsMutation.mutate(selectedSport);
  };

  const handleBuildAccumulators = () => {
    buildAccumulatorsMutation.mutate(
      { minSelections, maxSelections },
      {
        onSuccess: (response) => {
          if (response.success) {
            queryClient.setQueryData(['accumulators', 'stored'], response);
          }
        },
      }
    );
  };

  const isLoading = oddsLoading || accumulatorsLoading || fetchOddsMutation.isPending || buildAccumulatorsMutation.isPending;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Odds Scraper - Accumulator Finder
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Find accumulator combinations with odds between +100 and +1000, each with 80%+ success probability
            </p>
          </div>
          <DarkModeToggle />
        </header>

        <FilterPanel
          selectedSport={selectedSport}
          onSportChange={setSelectedSport}
          sports={sports}
          minSelections={minSelections}
          maxSelections={maxSelections}
          onMinSelectionsChange={setMinSelections}
          onMaxSelectionsChange={setMaxSelections}
          onFetchOdds={handleFetchOdds}
          onBuildAccumulators={handleBuildAccumulators}
          isLoading={isLoading}
        />

        {fetchOddsMutation.isError && (
          <ErrorMessage
            message={fetchOddsMutation.error?.message || 'Failed to fetch odds'}
            onRetry={handleFetchOdds}
          />
        )}

        {buildAccumulatorsMutation.isError && (
          <ErrorMessage
            message={buildAccumulatorsMutation.error?.message || 'Failed to build accumulators'}
            onRetry={handleBuildAccumulators}
          />
        )}

        {selectedAccumulator && (
          <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Accumulator Details
              </h2>
              <button
                onClick={() => setSelectedAccumulator(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Combined Odds</div>
                <div className="text-2xl font-mono font-bold text-primary">
                  {selectedAccumulator.combinedAmericanOdds > 0 ? '+' : ''}
                  {selectedAccumulator.combinedAmericanOdds}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Success Probability</div>
                <div className="text-2xl font-bold">
                  {Math.round(selectedAccumulator.totalProbability * 100)}%
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedAccumulator.selections.map((selection, index) => (
                <OddsCard
                  key={index}
                  odds={selection}
                  probability={1 / selection.decimalOdds}
                />
              ))}
            </div>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Accumulator Combinations ({accumulators.length})
          </h2>
          {buildAccumulatorsMutation.isPending ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
              <LoadingSpinner size="lg" className="mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Building accumulator combinations...</p>
            </div>
          ) : (
            <AccumulatorTable
              accumulators={accumulators}
              onAccumulatorClick={setSelectedAccumulator}
            />
          )}
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Available Odds ({odds.length})
          </h2>
          {fetchOddsMutation.isPending ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
              <LoadingSpinner size="lg" className="mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400">Fetching odds...</p>
            </div>
          ) : odds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {odds.slice(0, 12).map((odd) => (
                <OddsCard
                  key={odd.id}
                  odds={odd}
                  probability={1 / odd.decimalOdds}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400">
                No odds available. Click "Fetch Odds" to retrieve current betting odds.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

