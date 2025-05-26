"use client"

import { useEffect, useState } from "react"
import {
  Ticket,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Clock,
  User,
  Calendar
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell"
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
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function TicketsPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }
  const tickets = [
    {
      id: "#1234",
      title: "Computador não liga",
      user: "João Silva",
      department: "Financeiro",
      status: "in_progress",
      priority: "high",
      technician: "Maria Santos",
      created: "2025-01-20 09:30",
      updated: "2025-01-20 14:15",
      category: "Hardware"
    },
    {
      id: "#1233",
      title: "Erro ao acessar sistema ERP",
      user: "Ana Costa",
      department: "Vendas",
      status: "urgent",
      priority: "urgent",
      technician: "Carlos Pereira",
      created: "2025-01-20 10:45",
      updated: "2025-01-20 16:30",
      category: "Software"
    },
    {
      id: "#1232",
      title: "Instalar software de design",
      user: "Pedro Santos",
      department: "Marketing",
      status: "resolved",
      priority: "low",
      technician: "Maria Santos",
      created: "2025-01-19 14:20",
      updated: "2025-01-20 08:45",
      category: "Software"
    },
    {
      id: "#1231",
      title: "Problema com impressora",
      user: "Laura Oliveira",
      department: "RH",
      status: "new",
      priority: "medium",
      technician: null,
      created: "2025-01-20 16:00",
      updated: "2025-01-20 16:00",
      category: "Hardware"
    },
    {
      id: "#1230",
      title: "Configurar email corporativo",
      user: "Roberto Lima",
      department: "Vendas",
      status: "waiting",
      priority: "medium",
      technician: "João Silva",
      created: "2025-01-20 11:30",
      updated: "2025-01-20 15:20",
      category: "Configuração"
    }
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Novo</Badge>
      case "in_progress":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Em Andamento</Badge>
      case "waiting":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Aguardando</Badge>
      case "resolved":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Resolvido</Badge>
      case "urgent":
        return <Badge className="bg-red-100 text-red-800 border-red-200">Urgente</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive">Urgente</Badge>
      case "high":
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Alta</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Média</Badge>
      case "low":
        return <Badge variant="outline">Baixa</Badge>
      default:
        return <Badge variant="outline">{priority}</Badge>
    }
  }

  return (
    <DashboardShell userRole="admin" userName="Administrador">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Chamados</h1>
          <p className="text-sm text-muted-foreground">
            Visualize e gerencie todos os chamados do sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros Avançados
          </Button>
          <Button>
            <Ticket className="h-4 w-4 mr-2" />
            Novo Chamado
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar por ID, título ou usuário..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="new">Novos</SelectItem>
                <SelectItem value="in_progress">Em Andamento</SelectItem>
                <SelectItem value="waiting">Aguardando</SelectItem>
                <SelectItem value="resolved">Resolvidos</SelectItem>
                <SelectItem value="urgent">Urgentes</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as prioridades</SelectItem>
                <SelectItem value="urgent">Urgente</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="low">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Chamados</CardTitle>
          <CardDescription>
            {tickets.length} chamados encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Técnico</TableHead>
                <TableHead>Criado em</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell className="font-medium">{ticket.id}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{ticket.title}</p>
                      <p className="text-xs text-muted-foreground">{ticket.category}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p>{ticket.user}</p>
                      <p className="text-xs text-muted-foreground">{ticket.department}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                  <TableCell>{getPriorityBadge(ticket.priority)}</TableCell>
                  <TableCell>
                    {ticket.technician ? (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{ticket.technician}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">Não atribuído</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(ticket.created).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {new Date(ticket.created).toLocaleTimeString('pt-BR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <User className="h-4 w-4 mr-2" />
                          Atribuir Técnico
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
