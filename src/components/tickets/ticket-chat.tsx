'use client'

import { Chat } from "../chat";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";

export function TicketChat({ ticket }: { ticket: any }) {
  console.log("TicketChat component rendered with ticket:", ticket);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Chat de Atendimento</CardTitle>
        <CardDescription>
          Converse com o técnico ou o Agente IA
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Chat ticketId={ticket.id} />
      </CardContent>
    </Card>
  );
}