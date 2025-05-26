"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
    Ticket as IconTicket,
    ChevronRight,
} from "lucide-react"

import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell"
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { fetchTickets } from "@/services/user-dashboard"
import { Ticket, TicketStatus } from "@/types/ticket"

export default function EmployeeTicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")

    useEffect(() => {
        async function load() {
            setLoading(true)
            try {
                const data = await fetchTickets()
                setTickets(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [])

    const filtered = tickets.filter((t) =>
        t.title.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <DashboardShell userRole="user" >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Meus Chamados</h1>
                    <p className="text-sm text-muted-foreground">
                        Acompanhe o status dos seus chamados abertos
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Input
                        placeholder="Buscar por título…"
                        value={search}
                        onChange={(e) => setSearch(e.currentTarget.value)}
                    />
                    <Link href="/dashboard/employee/new-ticket">
                        <Button>
                            <IconTicket className="mr-2 h-4 w-4" /> Novo Chamado
                        </Button>
                    </Link>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Listagem de Chamados</CardTitle>
                    <CardDescription>
                        {loading
                            ? "Carregando…"
                            : `Total de chamados encontrados: ${filtered.length}`}
                    </CardDescription>
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
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10">
                                        Carregando…
                                    </TableCell>
                                </TableRow>
                            ) : filtered.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-10">
                                        Nenhum chamado encontrado.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filtered.map((t) => (
                                    <TableRow key={t.id}>
                                        <TableCell className="font-medium">#{t.id}</TableCell>
                                        <TableCell>{t.title}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={statusClass(t.status)}>
                                                {statusText(t.status)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(t.createdAt).toLocaleDateString("pt-BR", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            {t.assignedToId
                                                ? `Técnico #${t.assignedToId}`
                                                : "—"}
                                        </TableCell>
                                        <TableCell>
                                            <Link href={`/user/tickets/${t.id}`}>
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
                </CardContent>
            </Card>
        </DashboardShell>
    )
}

// helpers para status
function statusText(s: TicketStatus) {
    switch (s) {
        case TicketStatus.New:
            return "Novo"
        case TicketStatus.InProgress:
            return "Em andamento"
        case TicketStatus.Reopened:
            return "Reaberto"
        case TicketStatus.Resolved:
            return "Resolvido"
        case TicketStatus.Closed:
            return "Fechado"
        default:
            return "—"
    }
}

function statusClass(s: TicketStatus) {
    switch (s) {
        case TicketStatus.New:
            return "bg-blue-100 text-blue-800 border-blue-200"
        case TicketStatus.InProgress:
            return "bg-yellow-100 text-yellow-800 border-yellow-200"
        case TicketStatus.Resolved:
            return "bg-green-100 text-green-800 border-green-200"
        case TicketStatus.Closed:
            return "bg-gray-100 text-gray-800 border-gray-200"
        default:
            return ""
    }
}
