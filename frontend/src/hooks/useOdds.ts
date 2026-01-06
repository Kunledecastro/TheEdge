import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

export function useOdds(sport?: string) {
  return useQuery({
    queryKey: ['odds', sport],
    queryFn: () => api.fetchOdds(sport),
    enabled: false, // Don't auto-fetch, user must click button
  });
}

export function useStoredOdds() {
  return useQuery({
    queryKey: ['odds', 'stored'],
    queryFn: () => api.getStoredOdds(),
  });
}

export function useSports() {
  return useQuery({
    queryKey: ['sports'],
    queryFn: () => api.getSports(),
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
}

export function useFetchOdds() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sport?: string) => api.fetchOdds(sport),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['odds'] });
    },
  });
}

