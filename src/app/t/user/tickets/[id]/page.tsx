"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { DashboardShell } from "@/components/dashboard/layout/dashboard-shell"
import { fetchTickets } from "@/services/user-dashboard"
import { TicketPage } from "@/components/tickets/ticket-page"

export default function TicketDetailPage() {
    const { id } = useParams()
    const ticketId = Number(id)
    const [ticket, setTicket] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function load() {
            setLoading(true)
            try {
                const t = await fetchTickets(ticketId)
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
        >
            {loading || !ticket ? (
                <p>Carregando ticket…</p>
            ) : (
                <TicketPage ticket={ticket} />
            )}
        </DashboardShell>
    )
}
