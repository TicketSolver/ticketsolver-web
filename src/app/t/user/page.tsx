"use client"

import { useEffect, useState } from "react"
import {
  TicketIcon,
  Clock,
  CheckCircle2,
  AlertCircle,
  Monitor,
  Plus
} from "lucide-react"
import Link from "next/link"
import { nextAuthConfig } from "@/lib/nextAuth"
import { getServerSession } from 'next-auth'
import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell"
import { StatsCard } from "@/components/dashboard/cards/stats-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { fetchTickets, fetchStats, type Stats } from "@/services/user-dashboard"
import type { Ticket } from "@/types/ticket"
import { useSession } from "next-auth/react"

export default function UserDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const { data: session } = useSession();
  const user = session?.user;
  console.log(user?.id, user?.fullName, user?.role);

  useEffect(() => {
    async function loadDashboardData() {
      if (!user) return;

      setDataLoading(true);
      try {
        console.log("Carregando dados do dashboard para usuário:", user.id);
        const [statsData, ticketsData] = await Promise.all([
          fetchStats(),
          fetchTickets(5)
        ]);

        setStats(statsData);
        setTickets(ticketsData);
        console.log("Dados carregados com sucesso");
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
      } finally {
        setDataLoading(false);
      }
    }

    loadDashboardData();

  },[]);


  return (
    <DashboardShell userRole={user?.role ?? "user"} userName={user?.fullName ?? ""}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/user/tickets/new">
            <Plus className="mr-2 h-4 w-4" /> Novo Chamado
          </Link>
        </Button>
      </div>

      {dataLoading ? (
        <div className="flex justify-center my-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          {/* Estatísticas */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <StatsCard
              title="Chamados Abertos"
              value={stats?.openTickets || 0}
              icon={AlertCircle}
              description="Aguardando atendimento"
            />
            <StatsCard
              title="Em Andamento"
              value={stats?.inProgressTickets || 0}
              icon={Clock}
              description="Sendo atendidos"
            />
            <StatsCard
              title="Resolvidos"
              value={stats?.resolvedTickets || 0}
              icon={CheckCircle2}
              description="Neste mês"
            />
            <StatsCard
              title="Total"
              value={stats?.totalTickets || 0}
              icon={Monitor}
              description="Todos os chamados"
            />
          </div>

          {/* Chamados Recentes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Chamados Recentes</CardTitle>
              <CardDescription>
                Seus últimos chamados abertos no sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {tickets.length > 0 ? (
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
                      <TableRow key={ticket.id}>
                        <TableCell className="font-medium">
                          <Link href={`/user/tickets/${ticket.id}`} className="hover:underline">
                            {ticket.title}
                          </Link>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            ticket.status === 0 ? "outline" :
                              ticket.status === 1 ? "secondary" :
                                ticket.status === 2 ? "default" : "outline"
                          }>
                            {ticket.status === 0 ? "Aberto" :
                              ticket.status === 1 ? "Em andamento" :
                                ticket.status === 2 ? "Resolvido" : "Desconhecido"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            ticket.priority === 1 ? "default" :
                              ticket.priority === 2 ? "secondary" :
                                ticket.priority === 3 ? "destructive" : "outline"
                          }>
                            {ticket.priority === 1 ? "Baixa" :
                              ticket.priority === 2 ? "Média" :
                                ticket.priority === 3 ? "Alta" : "Desconhecida"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {new Date(ticket.createdAt).toLocaleDateString('pt-BR')}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <TicketIcon className="mx-auto h-12 w-12 opacity-20 mb-2" />
                  <p>Nenhum chamado encontrado</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="ghost" asChild>
                <Link href="/user/tickets">Ver todos os chamados</Link>
              </Button>
              <Button asChild>
                <Link href="/user/tickets/new">
                  <Plus className="mr-2 h-4 w-4" /> Novo Chamado
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </>
      )}
    </DashboardShell>
  )
}