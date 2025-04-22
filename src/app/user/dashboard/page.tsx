"use client"

import { useEffect, useState } from "react"
import {
  Ticket as IconTicket,
  Clock,
  CheckCircle2,
  AlertCircle,
  Monitor,
  Plus
} from "lucide-react"
import Link from "next/link"

import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell"
import { StatsCard } from "@/components/dashboard/cards/stats-card"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { fetchTickets, fetchStats, Stats } from "@/services/user-dashboard"
import { Ticket } from "@/types/ticket"

export default function UserDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const [s, t] = await Promise.all([fetchStats(), fetchTickets()])
        setStats(s)
        setTickets(t)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading || !stats) {
    return <DashboardShell userRole="user" userName="Maria Souza">
      <div>Carregando painel…</div>
    </DashboardShell>
  }

  return (
    <DashboardShell userRole="user" userName="Maria Souza">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meu Painel</h1>
        <Button asChild>
          <Link href="/user/new-ticket">
            <Plus className="mr-2 h-4 w-4" /> Novo Chamado
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatsCard
          title="Meus Chamados"
          value={stats.total}
          icon={IconTicket}
          description="total de chamados abertos"
        />
        <StatsCard
          title="Em Andamento"
          value={stats.inProgress}
          icon={Clock}
          description="chamados sendo atendidos"
        />
        <StatsCard
          title="Aguardando"
          value={stats.waiting}
          icon={AlertCircle}
          description="pendentes de atendimento"
        />
        <StatsCard
          title="Resolvidos"
          value={stats.resolved}
          icon={CheckCircle2}
          description="no geral"
        />
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Meus Chamados Recentes</CardTitle>
          <CardDescription>Status dos seus últimos chamados abertos</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Técnico</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">#{t.id}</TableCell>
                  <TableCell>{t.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusClass(t.status)}>
                      {statusText(t.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(t.createdAt).toLocaleString("pt-BR")}</TableCell>
                  <TableCell>{t.assignedToId ? "Técnico #" + t.assignedToId : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" size="sm" asChild>
            <Link href="/user/tickets">
              Ver histórico completo</Link>
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Acesso Remoto</CardTitle>
          <CardDescription>Configuração para suporte remoto ao seu dispositivo</CardDescription>
        </CardHeader>
        <CardContent className="py-6">
          <div className="text-center">
            <Monitor className="h-12 w-12 text-primary mx-auto" />
            { }
            <h3 className="text-lg font-medium my-2">
              Em breve, você poderá ceder o acesso remoto de seu dispositivo
            </h3>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <Button variant="outline" className="w-full" disabled>
            Configurações de Acesso Remoto
          </Button>
        </CardFooter>
      </Card>
    </DashboardShell>
  )
}

function statusText(s: number) {
  return ["Aberto", "Em andamento", "Resolvido", "Fechado"][s] ?? "—"
}
function statusClass(s: number) {
  const map = [
    "bg-blue-100 text-blue-800 border-blue-200",
    "bg-yellow-100 text-yellow-800 border-yellow-200",
    "bg-green-100 text-green-800 border-green-200",
    "bg-gray-100 text-gray-800 border-gray-200",
  ]
  return map[s] || map[0]
}
