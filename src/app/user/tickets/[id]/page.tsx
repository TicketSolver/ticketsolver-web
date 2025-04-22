"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import {
    Ticket as IconTicket,
    Calendar,
    Clock,
    Tag,
} from "lucide-react"
import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { fetchTicket } from "@/services/user-dashboard"
import { Chat } from "@/components/chat"
import { TicketStatus, TicketPriority, TicketCategory } from "@/types/ticket"

export default function TicketDetailPage() {
    const { id } = useParams()
    const ticketId = Number(id)
    const [ticket, setTicket] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            setLoading(true)
            try {
                const t = await fetchTicket(ticketId)
                setTicket(t)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [ticketId])

    return (
        <DashboardShell
            userRole="user"
            userName="Maria Souza"
        >
            {loading || !ticket ? (
                <p>Carregando ticket…</p>
            ) : (
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                #{ticket.id} – {ticket.title}
                            </CardTitle>
                            <CardDescription>
                                {ticket.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="flex items-center gap-2">
                                    <Calendar /> Criado:
                                    <span className="font-medium">
                                        {new Date(ticket.createdAt).toLocaleString(
                                            "pt-BR"
                                        )}
                                    </span>
                                </p>
                                {ticket.updatedAt && (
                                    <p className="flex items-center gap-2">
                                        <Clock /> Atualizado:
                                        <span className="font-medium">
                                            {new Date(
                                                ticket.updatedAt
                                            ).toLocaleString("pt-BR")}
                                        </span>
                                    </p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <p className="flex items-center gap-2">
                                    <Tag /> Categoria:
                                    <span className="font-medium">
                                        {TicketCategory[ticket.category]}
                                    </span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <Tag /> Prioridade:
                                    <span className="font-medium">
                                        {TicketPriority[ticket.priority]}
                                    </span>
                                </p>
                                <p className="flex items-center gap-2">
                                    <IconTicket /> Status:
                                    <span className="font-medium">
                                        {TicketStatus[ticket.status]}
                                    </span>
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Chat de Atendimento</CardTitle>
                            <CardDescription>
                                Converse com o técnico ou o Agente IA
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Chat ticketId={ticketId} />
                        </CardContent>
                    </Card>
                </div>
            )}
        </DashboardShell>
    )
}
