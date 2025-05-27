"use client"
import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell"
import { useAdminStats } from "@/hooks/useAdminStats";
import { useAdminRecentTickets } from "@/hooks/useAdminRecentTickets";
import { StatsCard,} from "@/components/dashboard/cards/stats-card";
import { Button } from "@/components/ui/button";
import {Table,  TableBody ,TableCell, TableHead, TableHeader, TableRow} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, UserCheck, Clock, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { TicketStatusBadge } from "@/components/ui/ticket-status-badge";

export default function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: recent, isLoading: ticketsLoading } =
    useAdminRecentTickets(1, 4);
  const router = useRouter();

  if (statsLoading || ticketsLoading) return <p>Carregando...</p>;

  return (
    <DashboardShell userRole="admin">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatsCard
          title="Total de Chamados"
          value={stats?.totalTickets}
          icon={Ticket}
          description=""
        />
        <StatsCard
          title="Chamados Ativos"
          value={stats?.activeTickets}
          icon={AlertTriangle}
          description=""
        />
        <StatsCard
          title="Concluidos Hoje"
          value={stats?.avgResolutionTime}
          icon={Clock}
          description=""
        />
        <StatsCard
          title="Técnicos Ativos"
          value={stats?.activeTechnicians}
          icon={UserCheck}
          description=""
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Chamados Recentes</CardTitle>
          <CardDescription>Últimos chamados registrados no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Técnico</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recent?.items?.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">#{t.id}</TableCell>
                  <TableCell>{t.title}</TableCell>
                  <TableCell>
                    <TicketStatusBadge status={+t.status} />
                  </TableCell>
                  <TableCell>{t.technicianName ?? "Não atribuído"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/t/admin/tickets")}
            >
              Ver todos os chamados
            </Button>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
