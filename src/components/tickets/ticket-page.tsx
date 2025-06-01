'use client'

import { useQuery } from "@tanstack/react-query";
import { TicketAttachments } from "./ticket-attachments";
import { TicketChat } from "./ticket-chat";
import { TicketHeader } from "./ticket-header";
import { fetchTicketById } from "@/services/user-dashboard";
import { Ticket } from "@/types/ticket";
import { TicketTechnicians } from "./ticket-technicians";

export function TicketPage({ ticketId }: { ticketId: string | number }) {
  const { data: ticket, isLoading } = useQuery<Ticket>({
    queryKey: ['ticket', ticketId],
    queryFn: async () => await fetchTicketById(+ticketId),
    refetchOnWindowFocus: false,
  })

  return (
    <div className="space-y-6">
      {isLoading ? (
        <p>Carregando ticket...</p>
      ) : ticket ? (
        <>
          <TicketHeader ticket={ticket} />

          <TicketTechnicians ticketId={ticketId} />

          <TicketAttachments ticket={ticket} />

          {/* <TicketChat ticket={ticket} /> */}
        </>
      ) : (
        <>
          <p>Ticket não encontrado!</p>
        </>
      )}
    </div >
  );
}