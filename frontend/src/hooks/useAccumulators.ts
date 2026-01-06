import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api, { Accumulator } from '../services/api';

export function useAccumulators(minSelections?: number, maxSelections?: number) {
  return useQuery({
    queryKey: ['accumulators', minSelections, maxSelections],
    queryFn: () => api.getAccumulators(minSelections, maxSelections),
    enabled: false, // Don't auto-fetch
  });
}

export function useStoredAccumulators() {
  return useQuery({
    queryKey: ['accumulators', 'stored'],
    queryFn: () => api.getStoredAccumulators(),
  });
}

export function useBuildAccumulators() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ minSelections, maxSelections }: { minSelections?: number; maxSelections?: number }) =>
      api.getAccumulators(minSelections, maxSelections),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accumulators'] });
    },
  });
}

export function useCalculateAccumulator() {
  return useMutation({
    mutationFn: (selectionIds: string[]) => api.calculateAccumulator(selectionIds),
  });
}

