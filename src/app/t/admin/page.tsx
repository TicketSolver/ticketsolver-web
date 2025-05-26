  "use client"

  import { useEffect, useState } from "react"
  import {
    Ticket,
    UserCheck,
    Clock,
    CheckCircle2,
    AlertTriangle,
    BarChart
  } from "lucide-react"

  import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell"
  import { StatsCard } from "@/components/dashboard/cards/stats-card"
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
  import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import { Badge } from "@/components/ui/badge"
  import { Button } from "@/components/ui/button"

  export default function AdminDashboard() {
    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
      setIsMounted(true)
    }, [])

    if (!isMounted) {
      return null
    }

    return (
      <DashboardShell userRole="admin" userName="Administrador">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Painel de Controle</h1>
          <p className="text-sm text-muted-foreground">
            Última atualização: {new Date().toLocaleString('pt-BR')}
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          <StatsCard
            title="Total de Chamados"
            value="243"
            icon={Ticket}
            trend={{ value: 12, isPositive: true }}
            description="em relação ao mês anterior"
          />
          <StatsCard
            title="Chamados Ativos"
            value="42"
            icon={AlertTriangle}
            trend={{ value: 5, isPositive: false }}
            description="em relação à semana anterior"
          />
          <StatsCard
            title="Tempo Médio"
            value="2h 12min"
            icon={Clock}
            description="para resolução de chamados"
          />
          <StatsCard
            title="Técnicos Ativos"
            value="8"
            icon={UserCheck}
            description="de 10 cadastrados"
          />
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Chamados Recentes</CardTitle>
              <CardDescription>
                Últimos chamados registrados no sistema
              </CardDescription>
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
                  <TableRow>
                    <TableCell className="font-medium">#1234</TableCell>
                    <TableCell>Computador não liga</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                        Em andamento
                      </Badge>
                    </TableCell>
                    <TableCell>João Silva</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#1233</TableCell>
                    <TableCell>Erro ao acessar sistema</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                        Urgente
                      </Badge>
                    </TableCell>
                    <TableCell>Maria Santos</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#1232</TableCell>
                    <TableCell>Instalar software</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        Resolvido
                      </Badge>
                    </TableCell>
                    <TableCell>Carlos Pereira</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">#1231</TableCell>
                    <TableCell>Problema com impressora</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                        Novo
                      </Badge>
                    </TableCell>
                    <TableCell>Não atribuído</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="mt-4 flex justify-end">
                <Button variant="outline" size="sm">Ver todos os chamados</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Desempenho por Departamento</CardTitle>
              <CardDescription>
                Taxa de resolução de chamados por departamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <BarChart className="h-10 w-10" />
                  <p>Gráfico de desempenho por departamento</p>
                  <p className="text-xs">Dados simulados para demonstração</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Atividade Recente</CardTitle>
            <CardDescription>
              Últimas ações realizadas no sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full p-2 bg-green-100">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Chamado #1232 resolvido</p>
                  <p className="text-xs text-muted-foreground">Carlos Pereira resolveu o chamado em 45 minutos</p>
                  <p className="text-xs text-muted-foreground mt-1">Hoje às 14:32</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full p-2 bg-blue-100">
                  <UserCheck className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Novo técnico adicionado</p>
                  <p className="text-xs text-muted-foreground">Ana Oliveira foi adicionada como técnica</p>
                  <p className="text-xs text-muted-foreground mt-1">Hoje às 11:20</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full p-2 bg-yellow-100">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium">Chamado #1234 atualizado</p>
                  <p className="text-xs text-muted-foreground">O status foi alterado para "Em andamento"</p>
                  <p className="text-xs text-muted-foreground mt-1">Hoje às 10:15</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button variant="outline" size="sm">Ver todo histórico</Button>
            </div>
          </CardContent>
        </Card>
      </DashboardShell>
    )
  }
