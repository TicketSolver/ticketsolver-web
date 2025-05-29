'use client'

import { TicketCategory } from "@/types/ticket";
import {
  Calendar, Clock, Tag, Ticket as IconTicket,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { TicketPriorityBadge } from "../ui/ticket-priority-badge";
import { TicketStatusBadge } from "../ui/ticket-status-badge";

export function TicketHeader({ ticket }: { ticket: any }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          #{ticket.id} – {ticket.title}
        </CardTitle>
        <CardDescription>
          {ticket.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div>
          <p className="flex items-center gap-2">
            <Calendar /> Criado:
            <span className="font-medium">
              {new Date(ticket.createdAt).toLocaleString(
                "pt-BR"
              )}
            </span>
          </p>
          {ticket.updatedAt && (
            <p className="flex items-center gap-2">
              <Clock /> Atualizado:
              <span className="font-medium">
                {new Date(
                  ticket.updatedAt
                ).toLocaleString("pt-BR")}
              </span>
            </p>
          )}
        </div>
        <div className="space-y-2">
          <p className="flex items-center gap-2">
            <Tag /> Categoria:
            <span className="font-medium">
              {TicketCategory[ticket.category]}
            </span>
          </p>
          <p className="flex items-center gap-2">
            <Tag /> Prioridade:
            <TicketPriorityBadge priority={ticket.priority} />
          </p>
          <p className="flex items-center gap-2">
            <IconTicket /> Status:
            <TicketStatusBadge status={ticket.status} />
          </p>
        </div>
      </CardContent>
    </Card>
  );
}