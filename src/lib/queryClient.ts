import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5 min — no refetch on tab switch
      gcTime: 30 * 60 * 1000,        // 30 min cache retention
      refetchOnWindowFocus: false,   // don't refetch when user returns to tab
      refetchOnMount: false,         // don't refetch on remount (kills the reload loop)
      retry: 1,
    },
  },
});