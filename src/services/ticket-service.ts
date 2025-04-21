import { mockTickets } from "@/mocks/user-dashboard"
import { Ticket, TicketStatus } from "@/types/ticket"

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API === "true"

async function delay(ms: number) {
    return new Promise((r) => setTimeout(r, ms))
}

export type NewTicketInput = {
    title: string
    description?: string
    category: number
    priority: number
    createdById: number
}

export async function createTicket(input: NewTicketInput): Promise<Ticket> {
    if (USE_MOCK) {
        await delay(500)
        const newTicket: Ticket = {
            id: mockTickets.length
                ? Math.max(...mockTickets.map((t) => t.id)) + 1
                : 1,
            title: input.title,
            description: input.description,
            status: TicketStatus.Open,
            priority: input.priority,
            category: input.category,
            createdAt: new Date().toISOString(),
            updatedAt: undefined,
            createdById: input.createdById,
            assignedToId: undefined,
        }
        mockTickets.unshift(newTicket)
        return newTicket
    }

    const res = await fetch(`/api/tickets`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
    })
    if (!res.ok) {
        throw new Error("Falha ao criar ticket")
    }
    return res.json()
}
