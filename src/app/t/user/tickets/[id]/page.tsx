"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import {
    Ticket as IconTicket,
    Calendar,
    Clock,
    Tag,
    ArrowLeft,
    Loader2,
    AlertCircle,
} from "lucide-react"
import Link from "next/link"

import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { fetchTicketById } from "@/services/user-dashboard"
import { Chat } from "@/components/chat"
import { Ticket, TicketStatus, TicketPriority, TicketCategory } from "@/types/ticket"

export default function TicketDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const ticketId = Number(id)
    const [ticket, setTicket] = useState<Ticket | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function load() {
            if (!id) {
                setError("ID do ticket não fornecido")
                setLoading(false)
                return
            }

            if (!ticketId || isNaN(ticketId)) {
                setError("ID do ticket inválido")
                setLoading(false)
                return
            }

            setLoading(true)
            setError(null)
            
            try {
                console.log(`Carregando ticket ${ticketId}...`)
                const ticketData = await fetchTicketById(ticketId)
                
                if (ticketData) {
                    setTicket(ticketData)
                    console.log(`Ticket ${ticketId} carregado com sucesso`)
                } else {
                    setError("Ticket não encontrado")
                }
            } catch (err) {
                console.error("Erro ao carregar ticket:", err)
                setError("Erro ao carregar ticket. Tente novamente.")
            } finally {
                setLoading(false)
            }
        }
        
        load()
    }, [id, ticketId])

    if (loading) {
        return (
            <DashboardShell userRole="user" userName="Maria Souza">
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-32" />
                    </div>
                    
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                                <div className="space-y-3">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-48" />
                            <Skeleton className="h-4 w-64" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-64 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </DashboardShell>
        )
    }

    if (error || !ticket) {
        return (
            <DashboardShell userRole="user" userName="Maria Souza">
                <div className="space-y-6">
                    <Link href="/t/user/tickets">
                        <Button variant="ghost" className="mb-4">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar aos Chamados
                        </Button>
                    </Link>
                    
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                            {error || "Ticket não encontrado"}
                        </AlertDescription>
                    </Alert>
                    
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center py-10">
                                <IconTicket className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">
                                    Oops! Algo deu errado
                                </h3>
                                <p className="text-muted-foreground mb-4">
                                    {error || "O ticket solicitado não pôde ser carregado."}
                                </p>
                                <div className="flex justify-center gap-2">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => window.location.reload()}
                                    >
                                        <Loader2 className="mr-2 h-4 w-4" />
                                        Tentar Novamente
                                    </Button>
                                    <Link href="/t/user/tickets">
                                        <Button>
                                            Ver Todos os Tickets
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </DashboardShell>
        )
    }
    return (
        <DashboardShell userRole="user" userName="Maria Souza">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <Link href="/t/user/tickets">
                        <Button variant="ghost">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar aos Chamados
                        </Button>
                    </Link>
                    
                    {}
                    <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => window.location.reload()}
                    >
                        <Loader2 className="mr-2 h-4 w-4" />
                        Atualizar
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <IconTicket className="h-5 w-5" />
                            #{ticket.id} – {ticket.title}
                        </CardTitle>
                        <CardDescription>
                            {ticket.description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                Informações Gerais
                            </h4>
                            <div className="space-y-2">
                                <p className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Criado:</span>
                                    <span className="font-medium">
                                        {new Date(ticket.createdAt).toLocaleDateString("pt-BR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit"
                                        })}
                                    </span>
                                </p>
                                {ticket.updatedAt && ticket.updatedAt !== ticket.createdAt && (
                                    <p className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">Atualizado:</span>
                                        <span className="font-medium">
                                            {new Date(ticket.updatedAt).toLocaleDateString("pt-BR", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                                Classificação
                            </h4>
                            <div className="space-y-2">
                                <p className="flex items-center gap-2">
                                    <Tag className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Status:</span>
                                    <span className="font-medium">
                                        {statusText(ticket.status)}
                                    </span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Tag className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Prioridade:</span>
                                    <span className="font-medium">
                                        {priorityText(ticket.priority)}
                                    </span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Tag className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">Categoria:</span>
                                    <span className="font-medium">
                                        {categoryText(ticket.category)}
                                    </span>
                                </p>
                                {ticket.assignedToId && (
                                    <p className="flex items-center gap-2">
                                        <IconTicket className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm text-muted-foreground">Técnico:</span>
                                        <span className="font-medium">
                                            Técnico #{ticket.assignedToId}
                                        </span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {}
                <Card id="chat">
                    <CardHeader>
                        <CardTitle>Chat de Atendimento</CardTitle>
                        <CardDescription>
                            Converse com o técnico ou o Agente IA
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Chat ticketId={ticketId} />
                    </CardContent>
                </Card>
            </div>
        </DashboardShell>
    )
}
function statusText(status: number): string {
    switch (status) {
        case TicketStatus.Open:
            return "Aberto"
        case TicketStatus.InProgress:
            return "Em andamento"
        case TicketStatus.Resolved:
            return "Resolvido"
        case TicketStatus.Closed:
            return "Fechado"
        default:
            return "Desconhecido"
    }
}

function priorityText(priority: number): string {
    switch (priority) {
        case 1:
            return "Baixa"
        case 2:
            return "Média"
        case 3:
            return "Alta"
        case 4:
            return "Crítica"
        default:
            return "Não definida"
    }
}

function categoryText(category: number): string {
    switch (category) {
        case 1:
            return "Hardware"
        case 2:
            return "Software"
        case 3:
            return "Rede"
        case 4:
            return "Outros"
        default:
            return "Não definida"
    }
}
