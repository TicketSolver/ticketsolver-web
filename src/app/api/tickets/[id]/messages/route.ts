import { NextResponse } from "next/server"
import { mockMessages } from "@/mocks/chat-messages"
import { Message } from "@/types/message"

const API_BASE = process.env.API_BASE_URL!

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const ticketId = Number(params.id)
    if (process.env.NODE_ENV === "production") {
        const res = await fetch(`${API_BASE}/api/tickets/${ticketId}/messages`)
        const data = await res.json()
        return NextResponse.json(data, { status: res.status })
    }
    return NextResponse.json(mockMessages[ticketId] ?? [])
}

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    const ticketId = Number(params.id)
    const body = (await req.json()) as {
        sender: string
        content: string
    }
    if (process.env.NODE_ENV === "production") {
        const res = await fetch(
            `${API_BASE}/api/tickets/${ticketId}/messages`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            }
        )
        const data = await res.json()
        return NextResponse.json(data, { status: res.status })
    }

    const msgs = mockMessages[ticketId] ||= []
    const newMsg: Message = {
        id: msgs.length ? msgs[msgs.length - 1].id + 1 : 1,
        ticketId,
        sender: body.sender as Message["sender"],
        content: body.content,
        timestamp: new Date().toISOString(),
    }
    msgs.push(newMsg)
    return NextResponse.json(newMsg)
}
