import { NextResponse } from "next/server"
import { mockTickets } from "@/mocks/user-dashboard"

const API_BASE = process.env.API_BASE_URL!

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const id = Number(params.id)
    if (process.env.NODE_ENV === "production") {
        const res = await fetch(`${API_BASE}/api/tickets/${id}`)
        const data = await res.json()
        return NextResponse.json(data, { status: res.status })
    }
    const ticket = mockTickets.find((t) => t.id === id)
    return NextResponse.json(ticket ?? null)
}
