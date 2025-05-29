import { mockTickets } from "@/mocks/user-dashboard"
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

export async function getTechnicianTickets(pagination: PaginatedQuery, isHistory?: boolean) {
    if (USE_MOCK) {
        await delay(500)
        return { data: { items: mockTickets, count: 4 }, success: true };
    }

    return await getTickets('tech', pagination, isHistory ? '&history=true' : '');
}


export async function getUserTickets(pagination: PaginatedQuery, isHistory?: boolean) {
    if (USE_MOCK) {
        await delay(500)
        return { data: { items: mockTickets, count: 4 }, success: true };
    }

    return await getTickets('user', pagination, isHistory ? '&history=true' : '');
}


export type TicketFetchType = 'tech' | 'user' | 'admin';

export async function getTickets(type: TicketFetchType, pagination: PaginatedQuery, query?: string){
    const res = await fetch(`/api/tickets/${type}?page=${pagination.page}&pageSize=${pagination.pageSize}${query ? query : ''}`)
    if (!res.ok) {
        throw new Error("Falha ao obter tickets")
    }
    return res.json();
}

export async function getTechnicianPerformance() {
    const res = await fetch(`/api/tickets/tech/performance`)
    if (!res.ok) {
        throw new Error("Falha ao obter tickets")
    }
    return res.json();
}

export async function getTechnicianCounters() {
    return await getEntityCounters('tech');
}

export async function getUserCounters() {
    return await getEntityCounters('user');
}

export async function getEntityCounters(type: TicketFetchType) {
    const res = await fetch(`/api/tickets/${type}/counters`)
    if (!res.ok) {
        throw new Error("Falha ao obter tickets")
    }
    return res.json();
}

export async function getTicketAttachments(ticketId: string | number) {
    const res = await fetch(`/api/tickets/${ticketId}/attachments`)
    if (!res.ok) {
        throw new Error("Falha ao obter anexos de ticket")
    }
    return res.json();
}

export async function deleteAttachment(attachmentId: string | number) {
    const res = await fetch(`/api/tickets/${attachmentId}/attachments`, { method: 'DELETE' });
    if (!res.ok) {
        throw new Error("Falha ao obter anexos de ticket")
    }
    return res.json();
}

export async function uploadAttachment(ticketId: string | number, file: File) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch(`/api/tickets/${ticketId}/attachments`, {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        throw new Error("Falha ao enviar anexo do ticket");
    }

    return res.json();
}
