'use client'

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TablePagination } from "@/components/ui/table-pagination";
import { TicketPriorityBadge } from "@/components/ui/ticket-priority-badge";
import { TicketStatusBadge } from "@/components/ui/ticket-status-badge";
import { usePagination } from "@/hooks/usePagination";
import { getTechnicianTickets } from "@/services/ticket-service";
import { Ticket } from "@/types/ticket";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface TechTicketsTableProps {
  isHistory?: boolean;
}

export function TechTicketsTable({ isHistory }: TechTicketsTableProps) {
  const {
    page, perPage, total,
    actions: {
      setPage,
      setPerPage,
      updateTotal,
    }
  } = usePagination({
    initialPage: 1,
    initialPerPage: 10,
  });

  const queryKey = isHistory ? ['tech', 'history'] : ['tech', 'tickets'];
  const { data: tickets, isLoading, isRefetching, } = useQuery<PaginatedApiResponse<Ticket>>({
    queryKey,
    queryFn: async () => {
      const result = await getTechnicianTickets({ page, pageSize: perPage }, isHistory)
      updateTotal(result?.data?.count || 0);
      return result;
    },
  });

  return (
    <section className="border-[1px] rounded-md overflow-hidden p-4 flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Prioridade</TableHead>
            <TableHead>Data</TableHead>
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
          ) : tickets?.data?.items?.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">
                Nenhum chamado encontrado.
              </TableCell>
            </TableRow>
          ) : (
            tickets?.data?.items?.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">#{t.id}</TableCell>
                <TableCell>{t.title}</TableCell>
                <TableCell>
                  <TicketStatusBadge status={t.status} />
                </TableCell>
                <TableCell>
                  <TicketPriorityBadge priority={t.priority}/>
                </TableCell>
                <TableCell>
                  {new Date(t.createdAt).toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </TableCell>
                <TableCell>
                  <Link href={`/t/technician/tickets/${t.id}`}>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
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
    </section>
  );
}