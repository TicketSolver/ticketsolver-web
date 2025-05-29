'use client'

import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "../ui/table";
import { TicketStatusBadge } from "../ui/ticket-status-badge";
import Link from "next/link";
import { TablePagination } from "../ui/table-pagination";
import { usePagination } from "@/hooks/usePagination";
import { getUserTickets } from "@/services/ticket-service";
import { useQuery } from "@tanstack/react-query";
import { Ticket } from "@/types/ticket";

export function UserTicketsTable() {
  const {
    page, perPage, total,
    actions: {
      setPage,
      setPerPage,
    }
  } = usePagination({
    initialPage: 1,
    initialPerPage: 10,
  });

  const { data: tickets, isLoading } = useQuery<PaginatedApiResponse<Ticket>>({
    queryKey: ['user', 'tickets', page, perPage],
    queryFn: () => getUserTickets({ page, pageSize: perPage }),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Listagem de Chamados</CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Título</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Técnico</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Carregando…
                </TableCell>
              </TableRow>
            ) : tickets?.data.items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-10">
                  Nenhum chamado encontrado.
                </TableCell>
              </TableRow>
            ) : (
              tickets?.data.items.map((t) => (
                <UserTicketItem ticket={t} key={t.id} />
              ))
            )}
          </TableBody>
        </Table>

        <TablePagination
          count={total}
          page={page}
          perPage={perPage}
          onPageChange={setPage}
          onPerPageChange={setPerPage}
        />
      </CardContent>
    </Card>
  );
}

function UserTicketItem({ ticket }: { ticket: Ticket }) {
  return (
    <TableRow key={ticket.id}>
      <TableCell className="font-medium">#{ticket.id}</TableCell>
      <TableCell>{ticket.title}</TableCell>
      <TableCell>
        <TicketStatusBadge status={ticket.status} />
      </TableCell>
      <TableCell>
        {new Date(ticket.createdAt).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })}
      </TableCell>
      <TableCell>
        {ticket.assignedToId
          ? `Técnico #${ticket.assignedToId}`
          : "—"}
      </TableCell>
      <TableCell>
        <Link href={`/t/user/tickets/${ticket.id}`}>
          <Button variant="ghost" size="icon">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  );
}