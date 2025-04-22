
import { mockMessages } from "@/mocks/chat-messages"
import { Message, Sender } from "@/types/message"

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_API === "true"
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function fetchMessages(
    ticketId: number
): Promise<Message[]> {
    if (USE_MOCK) {
        await delay(200)
        return mockMessages[ticketId] ?? []
    }
    const res = await fetch(`/api/tickets/${ticketId}/messages`)
    if (!res.ok) {
        throw new Error("Falha ao buscar mensagens")
    }
    return res.json()
}

export async function sendMessage(
    ticketId: number,
    sender: Sender,
    content: string
): Promise<Message> {
    if (USE_MOCK) {
        await delay(100)
        const msgs = mockMessages[ticketId] ||= []
        const newMsg: Message = {
            id: msgs.length ? msgs[msgs.length - 1].id + 1 : 1,
            ticketId,
            sender,
            content,
            timestamp: new Date().toISOString(),
        }
        msgs.push(newMsg)
        return newMsg
    }
    const res = await fetch(`/api/tickets/${ticketId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sender, content }),
    })
    if (!res.ok) {
        throw new Error("Falha ao enviar mensagem")
    }
    return res.json()
}
