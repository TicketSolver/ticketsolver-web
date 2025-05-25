import { TicketRequest, Ticket } from "@/types/ticket"
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API === "false"

async function delay(ms: number) {
    return new Promise((r) => setTimeout(r, ms))
}

export async function createTicket(input: TicketRequest): Promise<Ticket> {

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
