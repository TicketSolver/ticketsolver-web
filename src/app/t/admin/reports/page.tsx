"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  CheckCircle,
  AlertTriangle,
  Filter
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export default function ReportsPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState("30")
  const [selectedReport, setSelectedReport] = useState("overview")

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  const overviewStats = [
    {
      title: "Chamados Abertos",
      value: 42,
      change: -8,
      icon: AlertTriangle,
      color: "text-orange-600"
    },
    {
      title: "Chamados Resolvidos",
      value: 187,
      change: 23,
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Tempo Médio Resolução",
      value: "2h 15min",
      change: -15,
      icon: Clock,
      color: "text-blue-600"
    },
    {
      title: "Satisfação Cliente",
      value: "4.8/5.0",
      change: 5,
      icon: TrendingUp,
      color: "text-purple-600"
    }
  ]

  const topTechnicians = [
    { name: "Maria Santos", resolved: 45, avgTime: "1h 30min", satisfaction: 4.9 },
    { name: "Carlos Pereira", resolved: 38, avgTime: "2h 15min", satisfaction: 4.7 },
    { name: "João Silva", resolved: 32, avgTime: "1h 45min", satisfaction: 4.8 },
    { name: "Ana Costa", resolved: 28, avgTime: "2h 30min", satisfaction: 4.6 },
    { name: "Pedro Lima", resolved: 25, avgTime: "2h 00min", satisfaction: 4.5 }
  ]

  const categoryBreakdown = [
    { category: "Hardware", total: 89, resolved: 76, pending: 13, percentage: 85.4 },
    { category: "Software", total: 124, resolved: 108, pending: 16, percentage: 87.1 },
    { category: "Rede", total: 45, resolved: 38, pending: 7, percentage: 84.4 },
    { category: "Email", total: 32, resolved: 30, pending: 2, percentage: 93.8 },
    { category: "Configuração", total: 67, resolved: 55, pending: 12, percentage: 82.1 }
  ]

  const departmentStats = [
    { department: "Financeiro", tickets: 78, avgTime: "2h 10min" },
    { department: "Vendas", tickets: 92, avgTime: "1h 45min" },
    { department: "Marketing", tickets: 45, avgTime: "2h 30min" },
    { department: "RH", tickets: 34, avgTime: "1h 55min" },
    { department: "Operações", tickets: 67, avgTime: "2h 25min" }
  ]

  return (
    <DashboardShell userRole="admin" userName="Administrador">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Relatórios e Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Análise detalhada do desempenho do sistema de chamados
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Últimos 7 dias</SelectItem>
              <SelectItem value="30">Últimos 30 dias</SelectItem>
              <SelectItem value="90">Últimos 90 dias</SelectItem>
              <SelectItem value="365">Último ano</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {overviewStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <div className="flex items-center mt-1">
                    {stat.change > 0 ? (
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                    )}
                    <span className={`text-sm ${stat.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {Math.abs(stat.change)}%
                    </span>
                    <span className="text-xs text-muted-foreground ml-1">vs período anterior</span>
                  </div>
                </div>
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-6">
        {/* Top Técnicos */}
        <Card>
          <CardHeader>
            <CardTitle>Top Técnicos</CardTitle>
            <CardDescription>Desempenho dos técnicos no período selecionado</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Técnico</TableHead>
                  <TableHead>Resolvidos</TableHead>
                  <TableHead>Tempo Médio</TableHead>
                  <TableHead>Satisfação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topTechnicians.map((tech, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-gray-300'}`} />
                        {tech.name}
                      </div>
                    </TableCell>
                    <TableCell>{tech.resolved}</TableCell>
                    <TableCell>{tech.avgTime}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span>{tech.satisfaction}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full ${i < Math.floor(tech.satisfaction) ? 'bg-yellow-400' : 'bg-gray-200'}`}
                            />
                          ))}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Estatísticas por Departamento */}
        <Card>
          <CardHeader>
            <CardTitle>Chamados por Departamento</CardTitle>
            <CardDescription>Volume de chamados por setor</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Chamados</TableHead>
                  <TableHead>Tempo Médio</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departmentStats.map((dept, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{dept.department}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{dept.tickets}</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${(dept.tickets / Math.max(...departmentStats.map(d => d.tickets))) * 100}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{dept.avgTime}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown por Categoria */}
      <Card>
        <CardHeader>
          <CardTitle>Análise por Categoria</CardTitle>
          <CardDescription>Distribuição e taxa de resolução por tipo de chamado</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Categoria</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Resolvidos</TableHead>
                <TableHead>Pendentes</TableHead>
                <TableHead>Taxa de Resolução</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categoryBreakdown.map((category, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{category.category}</TableCell>
                  <TableCell>{category.total}</TableCell>
                  <TableCell className="text-green-600">{category.resolved}</TableCell>
                  <TableCell className="text-orange-600">{category.pending}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{category.percentage.toFixed(1)}%</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full" 
                          style={{ width: `${category.percentage}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {category.percentage >= 90 ? (
                      <Badge className="bg-green-100 text-green-800 border-green-200">Excelente</Badge>
                    ) : category.percentage >= 80 ? (
                      <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Bom</Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 border-red-200">Necessita Atenção</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
