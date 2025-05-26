'use client'

import { getTechnicianCounters, getTechnicianPerformance } from "@/services/ticket-service";
import { useQuery } from "@tanstack/react-query";

export const techPerformanceQueryKey = ['tech', 'counters'] as const;

type TechCounters = {
  currentlyWorking: number;
  solvedToday: number;
  highPriority: number;
  critical: number;
}

export function useTechCounters() {
  const { data: counters, isLoading, isRefetching, isError, error } = useQuery<ApiResponse<TechCounters>>({
    queryKey: techPerformanceQueryKey,
    queryFn: getTechnicianCounters
  });
  
  return {
    counters,
    isLoading: isLoading || isRefetching,
    isError,
    error,
  };
}