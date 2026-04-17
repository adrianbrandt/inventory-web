// inventory-web/src/hooks/useStats.ts
import { useQuery } from '@tanstack/react-query';
import { getStats } from '../api/stats';

export function useStats() {
  return useQuery({ queryKey: ['stats'], queryFn: getStats, staleTime: 5 * 60 * 1000 });
}
