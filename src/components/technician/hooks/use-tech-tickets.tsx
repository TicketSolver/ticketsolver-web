'use client'

import { getTechnicianTickets } from "@/services/ticket-service";
import { useQuery } from "@tanstack/react-query";

export const techTicketsQueryKey = ['tech', 'tickets'] as const;

export function useTechTickets() {
  const { data: tickets, isLoading, isRefetching, isError, error } = useQuery({
    queryKey: techTicketsQueryKey,
    queryFn: () => getTechnicianTickets({page: 1, pageSize: 5})
  });
  
  return {
    tickets,
    isLoading: isLoading || isRefetching,
    isError,
    error,
  };
}