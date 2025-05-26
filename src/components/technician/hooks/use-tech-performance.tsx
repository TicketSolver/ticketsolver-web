'use client'

import { getTechnicianPerformance } from "@/services/ticket-service";
import { useQuery } from "@tanstack/react-query";

export const techPerformanceQueryKey = ['tech', 'performance'] as const;

type TechPerformance = {
  solvingPercentage: number;
  satisfaction: number;
  anwserTime: number;
}

export function useTechPerformance() {
  const { data: performance, isLoading, isRefetching, isError, error } = useQuery<ApiResponse<TechPerformance>>({
    queryKey: techPerformanceQueryKey,
    queryFn: getTechnicianPerformance
  });
  
  return {
    performance,
    isLoading: isLoading || isRefetching,
    isError,
    error,
  };
}