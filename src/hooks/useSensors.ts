import { useQuery } from '@tanstack/react-query';
import { mockSensors, generateForecastData } from '@/data/mockData';
import { Sensor, ForecastData } from '@/types';

/**
 * Hook to fetch real-time sensor data
 * Currently using mock data - replace with API calls when backend is ready
 */
export function useSensors() {
  return useQuery<Sensor[]>({
    queryKey: ['sensors', 'realtime'],
    queryFn: async () => {
      // TODO: Replace with actual API call
      // return await sensorApi.getRealtime();
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return mockSensors;
    },
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });
}

/**
 * Hook to fetch a single sensor's data
 */
export function useSensor(sensorId: string) {
  return useQuery<Sensor | undefined>({
    queryKey: ['sensor', sensorId],
    queryFn: async () => {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockSensors.find(s => s.id === sensorId);
    },
    enabled: !!sensorId,
  });
}

/**
 * Hook to fetch forecast data for a sensor
 */
export function useSensorForecast(sensorId: string, hours: number = 24) {
  return useQuery<ForecastData[]>({
    queryKey: ['sensor', sensorId, 'forecast', hours],
    queryFn: async () => {
      // TODO: Replace with actual API call
      // return await sensorApi.getForecast(sensorId, hours);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      return generateForecastData(hours);
    },
    enabled: !!sensorId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch historical data for a sensor
 */
export function useSensorHistory(sensorId: string, hours: number = 24) {
  return useQuery<ForecastData[]>({
    queryKey: ['sensor', sensorId, 'history', hours],
    queryFn: async () => {
      // TODO: Replace with actual API call
      // return await sensorApi.getHistory(sensorId, hours);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      return generateForecastData(hours);
    },
    enabled: !!sensorId,
  });
}
