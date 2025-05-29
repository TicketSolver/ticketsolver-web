import { AdminOverview, Ticket, TicketFull } from "@/types/admin";
import { PaginatedResponse, ApiResponse } from "@/types/common";
import { User, UserProfile } from "@/types/user";

export async function getAdminOverview(): Promise<AdminOverview> {
    const res = await fetch("/api/admin/stats/overview");
    if (!res.ok) throw new Error("Falha ao buscar overview");
    return res.json();
}

export async function getAdminRecentTickets(
    page = 1,
    pageSize = 5
): Promise<PaginatedResponse<Ticket>> {
    const res = await fetch(
        `/api/admin/tickets/recent?page=${page}&pageSize=${pageSize}`
    );
    if (!res.ok) throw new Error("Falha ao buscar tickets recentes");
    return res.json();
}

export async function getAdminTickets(
    page = 1,
    pageSize = 50
): Promise<PaginatedResponse<TicketFull>> {
    const res = await fetch(
        `/api/admin/tickets?page=${page}&pageSize=${pageSize}`
    );
    if (!res.ok) throw new Error("Falha ao buscar tickets da empresa");
    return res.json();
}

export async function getAdminUsers(
    page = 1,
    pageSize = 50
): Promise<ApiResponse<PaginatedResponse<UserProfile>>> {
    const res = await fetch(
        `/api/admin/users?page=${page}&pageSize=${pageSize}`
    );
    if (!res.ok) {
        const errorBody = await res.json().catch(() => ({ message: 'Erro desconhecido ao buscar usuários' }));
        throw new Error(`Falha ao buscar usuários da empresa: ${res.status} - ${errorBody.message}`);
    }
    return res.json();
}