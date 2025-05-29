'use client'

import { TicketIcon, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { TicketPriorityBadge } from "../ui/ticket-priority-badge";
import { TicketStatusBadge } from "../ui/ticket-status-badge";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Ticket } from "@/types/ticket";
import { getUserTickets } from "@/services/ticket-service";

export function UserRecentTickets() {
  const { data: tickets, isLoading } = useQuery({
    queryKey: ['user', 'tickets', 'recent'],
    queryFn: () => getUserTickets({ page: 1, pageSize: 5 }),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Chamados Recentes</CardTitle>
        <CardDescription>
          Seus últimos chamados abertos no sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        {tickets?.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <UsertTicketItem ticket={ticket} key={ticket.id} />
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            <TicketIcon className="mx-auto h-12 w-12 opacity-20 mb-2" />
            <p>{isLoading ? 'Carregando tickets...' : 'Nenhum chamado encontrado'}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">

        <Button variant="outline" asChild>
          <Link href="/t/user/tickets">Ver todos os chamados</Link>
        </Button>

        <Button asChild>
          <Link href="/t/user/new-ticket/">
            <Plus className="mr-2 h-4 w-4" /> Novo Chamado
          </Link>
        </Button>

      </CardFooter>
    </Card>
  );
}

function UsertTicketItem({ ticket }: { ticket: Ticket }) {
  return (
    <TableRow key={ticket.id}>
      <TableCell className="font-medium">
        <Link href={`/t/user/tickets/${ticket.id}`} className="hover:underline">
          {ticket.title}
        </Link>
      </TableCell>
      <TableCell>
        <TicketStatusBadge status={ticket.status} />
      </TableCell>
      <TableCell>
        <TicketPriorityBadge priority={ticket.priority} />
      </TableCell>
      <TableCell className="text-muted-foreground">
        {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
      </TableCell>
    </TableRow>
  );
}