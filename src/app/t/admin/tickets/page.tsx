"use client"

import { useEffect, useState, useMemo } from "react"
import {
  Ticket as TicketIcon,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Clock,
  User,
  Calendar,
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

import { usePagination } from "@/hooks/usePagination"
import { useAdminTickets } from "@/hooks/useAdminTickets"
import { TicketPriority, TicketStatus } from "@/types/ticket"

interface TicketUI {
  id: string | number
  title: string
  category: string
  requesterName: string
  department: string
  status: TicketStatus
  priority: TicketPriority
  technician: string | null
  created: string
}

export default function TicketsPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<TicketStatus | "all">("all")
  const [priorityFilter, setPriorityFilter] = useState<TicketPriority| "all">("all")

  const {
    page,
    perPage,
    total,
    actions: { setPage, setPerPage, updateTotal },
  } = usePagination({ initialPage: 1, initialPerPage: 10 })

  const { data: rawData, isLoading, isError } = useAdminTickets(page, perPage)

  useEffect(() => {
    setIsMounted(true)
  }, [])

 const ticketsData = useMemo(() => {
  const count = rawData?.count ?? 0
  const itemsArray = Array.isArray(rawData?.items) ? rawData.items : []
  const items: TicketUI[] = itemsArray.map((t) => ({
    id: t.id,
    title: t.title,
    category: t.category.toString(),
    requesterName:
      typeof t.createdBy === "string" ? t.createdBy : t.createdBy.name,
    department: "",
    status: mapStatusCode(t.status as TicketStatus),
    priority: t.priority,
    technician: t.assignedby?.name ?? null,
    created: t.createdAt,
  }))

  return { count, items }
}, [rawData])

  useEffect(() => {
    updateTotal(ticketsData.count)
  }, [ticketsData.count, updateTotal])

  const filteredItems = useMemo(() => {
    return ticketsData.items.filter((ticket) => {
      const mSearch =
        ticket.id.toString().includes(searchTerm) ||
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.requesterName.toLowerCase().includes(searchTerm.toLowerCase())

      const mStatus = statusFilter === "all" || ticket.status === statusFilter
      const mPrio = priorityFilter === "all" || ticket.priority === priorityFilter

      return mSearch && mStatus && mPrio
    })
  }, [ticketsData.items, searchTerm, statusFilter, priorityFilter])

  if (!isMounted || isLoading) return <p>Carregando...</p>
  if (isError) return <p>Erro ao carregar chamados</p>

  type UIStatus = "new" | "in_progress" | "waiting" | "resolved" | "urgent" | "closed" | "reopened" | "unknown";

  const getStatusBadge = (status: UIStatus) => {
    switch (status) {
      case "new":
        return <Badge className="bg-blue-100 text-blue-800">Novo</Badge>
      case "in_progress":
        return <Badge className="bg-yellow-100 text-yellow-800">Em andamento</Badge>
      case "waiting":
        return <Badge className="bg-orange-100 text-orange-800">Aguardando</Badge>
      case "resolved":
        return <Badge className="bg-green-100 text-green-800">Resolvido</Badge>
      case "urgent":
        return <Badge className="bg-red-100 text-red-800">Urgente</Badge>
      case "closed":
        return <Badge className="bg-gray-100 text-gray-800">Fechado</Badge>
      case "reopened":
        return <Badge className="bg-purple-100 text-purple-800">Reaberto</Badge>
      case "unknown":
        return <Badge className="bg-gray-200 text-gray-600">Desconhecido</Badge>
    }
  }

  type UIPriority = "urgent" | "critical" | "high" | "medium" | "low";

  const getPriorityBadge = (priority: UIPriority) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive">Urgente</Badge>
      case "critical":
        return <Badge className="bg-red-700 text-white">Crítico</Badge>
      case "high":
        return <Badge className="bg-orange-100 text-orange-800">Alta</Badge>
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Média</Badge>
      case "low":
        return <Badge variant="outline">Baixa</Badge>
    }
  }

  return (
    <DashboardShell userRole="admin">
      {/* Header + Actions */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Gerenciar Chamados</h1>
          <p className="text-sm text-muted-foreground">
            Visualize e gerencie todos os chamados do sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" /> Filtros Avançados
          </Button>
          <Button>
            <TicketIcon className="h-4 w-4 mr-2" /> Novo Chamado
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por ID, título ou usuário..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={statusFilter.toString()}
              onValueChange={(v) => setStatusFilter(v as TicketStatus | "all")}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="new">Novos</SelectItem>
                <SelectItem value="in_progress">Em andamento</SelectItem>
                <SelectItem value="waiting">Aguardando</SelectItem>
                <SelectItem value="resolved">Resolvidos</SelectItem>
                <SelectItem value="urgent">Urgentes</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter.toString()} onValueChange={(v) => setPriorityFilter(v as TicketPriority | "all")}>
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

      {/* Tabela de Chamados */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Chamados</CardTitle>
          <CardDescription>
            {filteredItems.length} de {total} encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
  {filteredItems.length === 0 ? (
    <div className="py-10 text-center text-gray-500">
      Não há tickets criados no momento.
    </div>
  ) : (
    <>
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
                <TableHead className="w-12" />
              </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.map((ticket) => (
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
                      <p className="font-medium">{ticket.requesterName}</p>
                      <p className="text-xs text-muted-foreground">{ticket.department}</p>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(ticket.status as any)}</TableCell>
                  <TableCell>{getPriorityBadge(mapPriorityCode(ticket.priority))}</TableCell>
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
                      {new Date(ticket.created).toLocaleDateString("pt-BR")}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3" />
                      {new Date(ticket.created).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
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
                          <Eye className="h-4 w-4 mr-2" /> Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <User className="h-4 w-4 mr-2" /> Atribuir Técnico
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Paginação */}
      <div className="mt-4 flex items-center justify-between">
        <p>
          Mostrando {filteredItems.length} de {total}
        </p>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Anterior
          </Button>
          <span>Página {page}</span>
          <Button
            size="sm"
            disabled={page * perPage >= total}
            onClick={() => setPage(page + 1)}
          >
            Próxima
          </Button>
          <Select
            value={perPage.toString()}
            onValueChange={(v) => setPerPage(Number(v))}
          >
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((n) => (
                <SelectItem key={n} value={n.toString()}>
                  {n} / página
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </>
  )}
</CardContent>
      </Card>
    </DashboardShell>
  )
}
function mapStatusCode(arg0: TicketStatus): any {
  switch (arg0) {
    case TicketStatus.New:
      return "new"
    case TicketStatus.InProgress:
      return "in_progress"
    case TicketStatus.Resolved:
      return "resolved"
    case TicketStatus.Closed:
      return "closed"
    case TicketStatus.Reopened:
      return "reopened"
    default:
      return "unknown"
  }
}

function mapPriorityCode(priority: string | TicketPriority): "critical" | "high" | "medium" | "low" {
  switch (priority) {
    case "Critical":
    case TicketPriority.Critical:
      return "critical"
    case "high":
    case TicketPriority.High:
      return "high"
    case "medium":
    case TicketPriority.Medium:
      return "medium"
    case "low":
    case TicketPriority.Low:
      return "low"
    default:
      return "low"
  }
}

