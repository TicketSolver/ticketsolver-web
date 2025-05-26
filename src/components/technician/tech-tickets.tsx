'use client'

import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { Badge } from "../ui/badge";
import { useTechTickets } from "./hooks/use-tech-tickets";
import { Ticket } from "@/types/ticket";
import { TicketPriorityBadge } from "../ui/ticket-priority-badge";

export function TechTickets() {
  const { tickets } = useTechTickets();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meus Chamados Ativos</CardTitle>
        <CardDescription>
          Chamados atribuídos a você que precisam de atenção
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Prioridade</TableHead>
              <TableHead>Ação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets?.length > 0 ? tickets.map((ticket) => (
              <TechTicketTableItem ticket={ticket} key={ticket.id} />
            )) : (
              <TableRow>
                <TableCell>Nenhum ticket registrado!</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            )}

          </TableBody>
        </Table>
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm">Ver todos os chamados</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TechTicketTableItem({ ticket }: { ticket: Ticket }) {
  return (
    <TableRow>
      <TableCell className="font-medium">#{ticket.id}</TableCell>
      <TableCell>{ticket.title}</TableCell>
      <TableCell>
        <TicketPriorityBadge priority={ticket.priority} />
      </TableCell>
      <TableCell>
        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
          <ArrowRight className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  )
}