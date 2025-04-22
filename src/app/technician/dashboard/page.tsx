// src/app/dashboard/technician/page.tsx
"use client"

import { useEffect, useState } from "react"
import { 
  Ticket, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  BarChart,
  ArrowRight
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

export default function TechnicianDashboard() {
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  
  if (!isMounted) {
    return null
  }
  
  return (
    <DashboardShell userRole="technician" userName="João Silva">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Painel do Técnico</h1>
        <p className="text-sm text-muted-foreground">
          Última atualização: {new Date().toLocaleString('pt-BR')}
        </p>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <StatsCard 
          title="Chamados Atribuídos" 
          value="12" 
          icon={Ticket}
          description="atualmente em aberto"
        />
        <StatsCard 
          title="Resolvidos Hoje" 
          value="5" 
          icon={CheckCircle2}
          trend={{ value: 20, isPositive: true }}
          description="em relação a ontem"
        />
        <StatsCard 
          title="Tempo Médio" 
          value="1h 45min" 
          icon={Clock}
          description="para resolução"
        />
        <StatsCard 
          title="Prioridade Alta" 
          value="3" 
          icon={AlertCircle}
          description="exigem atenção imediata"
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 mb-6">
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
                <TableRow>
                  <TableCell className="font-medium">#1234</TableCell>
                  <TableCell>Computador não liga</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
                      Alta
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">#1238</TableCell>
                  <TableCell>Problema com email</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      Média
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">#1240</TableCell>
                  <TableCell>Atualização de software</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">
                      Baixa
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
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
            <CardTitle>Meu Desempenho</CardTitle>
            <CardDescription>
              Estatísticas da semana atual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Taxa de Resolução</span>
                  <span className="font-medium">86%</span>
                </div>
                <Progress value={86} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Satisfação do Cliente</span>
                  <span className="font-medium">92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tempo de Resposta</span>
                  <span className="font-medium">78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
              
              <div className="pt-4">
                <div className="h-[120px] flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <BarChart className="h-8 w-8" />
                    <p className="text-sm">Dados de desempenho detalhados</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Próximos Atendimentos</CardTitle>
          <CardDescription>
            Chamados agendados para atendimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>MR</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Manutenção do Computador</p>
                  <p className="text-xs text-muted-foreground">Maria Rodrigues - Financeiro</p>
                </div>
              </div>
              <div className="text-sm text-right">
                <p className="font-medium">Hoje</p>
                <p className="text-muted-foreground">15:30</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>PL</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Instalação de Software</p>
                  <p className="text-xs text-muted-foreground">Paulo Lima - Marketing</p>
                </div>
              </div>
              <div className="text-sm text-right">
                <p className="font-medium">Amanhã</p>
                <p className="text-muted-foreground">10:00</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>JA</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Configuração de Rede</p>
                  <p className="text-xs text-muted-foreground">Juliana Alves - Vendas</p>
                </div>
              </div>
              <div className="text-sm text-right">
                <p className="font-medium">Amanhã</p>
                <p className="text-muted-foreground">14:15</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
