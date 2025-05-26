"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell"
import { fetchTickets } from "@/services/user-dashboard"
import { TicketPage } from "@/components/tickets/ticket-page"

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

    return (
        <DashboardShell
            userRole="user"
        >
            {loading || !ticket ? (
                <p>Carregando ticket…</p>
            ) : (
                <TicketPage ticket={ticket} />
            )}
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
