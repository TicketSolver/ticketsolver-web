import { NextResponse, NextRequest } from "next/server";
import { mockMessages } from "@/mocks/chat-messages";
import { Message } from "@/types/message";

interface Params {
    id: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5271";

// GET
export async function GET(
    req: NextRequest,
    context: { params: Params }
) {
    const ticketId = Number(context.params.id);

    if (process.env.NODE_ENV === "production") {
        const res = await fetch(`${API_BASE}/api/tickets/${ticketId}`);
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(mockMessages[ticketId] ?? []);
}

// POST
export async function POST(
    req: NextRequest,
    context: { params: Params }
) {
    const ticketId = Number(context.params.id);
    const body = await req.json() as { sender: string; content: string };

    if (process.env.NODE_ENV === "production") {
        const res = await fetch(
            `${API_BASE}/api/tickets/${ticketId}/messages`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            }
        );
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    }

    const msgs = (mockMessages[ticketId] ||= []);
    const newMsg: Message = {
        id: msgs.length ? msgs[msgs.length - 1].id + 1 : 1,
        ticketId,
        sender: body.sender as any,
        content: body.content,
        timestamp: new Date().toISOString(),
    };
    msgs.push(newMsg);
    return NextResponse.json(newMsg);
}
