import { getTechnicianTickets, getTicketAttachments } from "@/services/ticket-service";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export const techTicketsQueryKey = (ticketId: string | number) => ['ticket', ticketId, 'attachments'];

export type TicketAttachmentProps = {
  id: number;
  url: string;
  fileName: string;
}

export function useTicketAttachments(ticketId: string | number) {
  const [isUpdatingCache, setIsUpdatingCache] = useState(false);
  const queryClient = useQueryClient();
  const queryKey = techTicketsQueryKey(ticketId);

  const {
    data: attachments, isLoading, isRefetching, isError, error, refetch
  } = useQuery<ApiResponse<TicketAttachmentProps[]>>({
    queryKey,
    queryFn: () => getTicketAttachments(ticketId),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 10000000,
  });

  function onDeleteAttachment(attachmentId: number | string) {
    const cachedData = queryClient.getQueryData(queryKey) as ApiResponse<TicketAttachmentProps[]>;
    if ((cachedData?.data?.length || -1) === 0) return;

    setIsUpdatingCache(true);
    
    const newData = { ...cachedData };
    const newAttachments = newData.data.filter(a => a.id !== attachmentId);
    newData.data = newAttachments;
    
    queryClient.setQueryData(queryKey, newData);
    setIsUpdatingCache(false);
  }

  return {
    attachments,
    isLoading: isLoading || isRefetching,
    isError,
    isUpdatingCache,
    refetch,
    error,
    onDeleteAttachment,
  };
}