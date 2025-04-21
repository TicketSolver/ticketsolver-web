import { mockTickets, mockStats } from "@/mocks/user-dashboard"
import { Ticket } from "@/types/ticket"

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API === "true"

async function delay(ms: number) {
    return new Promise((r) => setTimeout(r, ms))
}

export type Stats = {
    total: number
    inProgress: number
    waiting: number
    resolved: number
}

export async function fetchTickets(): Promise<Ticket[]> {
    if (USE_MOCK) {
        await delay(300)
        return mockTickets
    }
    const res = await fetch(`/api/tickets?mine=true`)
    if (!res.ok) {
        throw new Error("Falha ao buscar tickets")
    }
    return res.json()
}

export async function fetchStats(): Promise<Stats> {
    if (USE_MOCK) {
        await delay(200)
        return mockStats
    }
    const res = await fetch(`/api/tickets/stats?mine=true`)
    if (!res.ok) {
        throw new Error("Falha ao buscar estatísticas")
    }
    return res.json()
}
