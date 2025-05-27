import { AdminOverview, Ticket, TicketFull } from "@/types/admin";
import { PaginatedResponse } from "@/types/common";
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
): Promise<PaginatedResponse<UserProfile>> {
    const res = await fetch(
        `/api/admin/users?page=${page}&pageSize=${pageSize}`
    );
    if (!res.ok) throw new Error("Falha ao buscar usuarios da empresa");
    return res.json();
}