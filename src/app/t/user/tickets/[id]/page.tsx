'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { DashboardShell } from '@/components/dashboard/layout/dashboard-shell'
import { TicketPage } from '@/components/tickets/ticket-page'
import { fetchTicketById } from '@/services/user-dashboard'
import { Ticket, TicketStatus } from '@/types/ticket'

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
            if (isNaN(ticketId)) {
                setError("ID do ticket inválido")
                setLoading(false)
                return
            }

            setLoading(true)
            setError(null)
            try {
                console.log(`Carregando ticket ${ticketId}...`)
                const data = await fetchTicketById(ticketId)
                if (data) {
                    setTicket(data)
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
        <DashboardShell userRole="user">
            {loading ? (
                <p>Carregando ticket…</p>
            ) : error ? (
                <p className="text-red-600">{error}</p>
            ) : ticket ? (
                <>
                    <button
                        className="mb-4 text-sm text-blue-600 hover:underline"
                        onClick={() => router.back()}
                    >
                        ← Voltar
                    </button>
                    <TicketPage ticket={ticket} />
                </>
            ) : null}
        </DashboardShell>
    )
}

function statusText(status: TicketStatus): string {
    switch (status) {
        case TicketStatus.New: return "Aberto"
        case TicketStatus.InProgress: return "Em andamento"
        case TicketStatus.Resolved: return "Resolvido"
        case TicketStatus.Closed: return "Fechado"
        default: return "Desconhecido"
    }
}

function priorityText(priority: number): string {
    switch (priority) {
        case 1: return "Baixa"
        case 2: return "Média"
        case 3: return "Alta"
        case 4: return "Crítica"
        default: return "Não definida"
    }
}

function categoryText(category: number): string {
    switch (category) {
        case 1: return "Hardware"
        case 2: return "Software"
        case 3: return "Rede"
        case 4: return "Outros"
        default: return "Não definida"
    }
}
