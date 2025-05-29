'use client'

import { TicketAttachments } from "./ticket-attachments";
import { TicketChat } from "./ticket-chat";
import { TicketHeader } from "./ticket-header";

export function TicketPage({ ticket }: { ticket: any }) {
  return (
    <div className="space-y-6">
      <TicketHeader ticket={ticket} />

      <TicketAttachments ticket={ticket} />
      
      <TicketChat ticket={ticket} />
    </div>
  );
}