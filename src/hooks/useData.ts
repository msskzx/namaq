import useSWR from 'swr';
import { fetcher } from '@/lib/swr';

// Generic data fetching hook
export const useData = <T>(url: string | null) => {
  const { data, error, isLoading, mutate } = useSWR<T>(
    url,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  return {
    data,
    error,
    isLoading,
    mutate,
    isError: error,
  };
};

// Hook for fetching user preferences
export const useUserPreferences = () => {
  return useData('/api/user/preferences');
};

// Hook for fetching analytics data (if needed)
export const useAnalytics = () => {
  return useData('/api/analytics');
}; 