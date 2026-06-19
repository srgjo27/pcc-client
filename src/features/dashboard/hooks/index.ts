import { useQuery } from '@tanstack/react-query';
import { getDashboardData } from '../services';
import type { DashboardData } from '../types';

export const dashboardKeys = {
  all: ['dashboard'] as const,
  overview: () => [...dashboardKeys.all, 'overview'] as const,
};

/**
 * Custom hook to get dashboard overview data with TanStack Query.
 */
export function useDashboard() {
  return useQuery<DashboardData, Error>({
    queryKey: dashboardKeys.overview(),
    queryFn: getDashboardData,
  });
}
