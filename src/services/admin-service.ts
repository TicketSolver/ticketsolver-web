import { AdminOverview, Ticket, TicketFull } from "@/types/admin";
import { PaginatedResponse, ApiResponse } from "@/types/common";
import { User, UserUpdatePayload, UserProfile } from '@/types/user';

export async function getAdminOverview(): Promise<AdminOverview> {
    const res = await fetch("/api/admin/stats/overview");
    if (!res.ok) throw new Error("Falha ao buscar overview");
    return res.json();
}
interface ApiUpdateSuccessResponse extends UserProfile {
    message?: string;
}
interface ApiErrorResponse {
    success: boolean;
    message: string;
    details?: any;
    errorDetails?: string;
}


export async function updateUserViaApi(
    userId: string,
    payload: UserUpdatePayload
): Promise<ApiUpdateSuccessResponse> {

    const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    const responseData: ApiUpdateSuccessResponse | ApiErrorResponse = await response.json();

    if (!response.ok) {
        const apiErrorMessage = (responseData as ApiErrorResponse)?.message ||
            (responseData as ApiErrorResponse)?.errorDetails ||
            `API Error: ${response.status}`;
        const error = new Error(apiErrorMessage);
        (error as any).status = response.status;
        (error as any).details = (responseData as ApiErrorResponse)?.details;
        throw error;
    }

    return responseData as ApiUpdateSuccessResponse;
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

interface ApiDeleteSuccessResponse { // Baseado no seu exemplo de resposta do backend
    success: boolean;
    message: string;
    data: object; // ou {}
    errors: null | any;
}

export async function deleteUserViaApi(userId: string): Promise<ApiDeleteSuccessResponse> {
    const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
            // 'Content-Type': 'application/json', // Geralmente não necessário para DELETE sem corpo
        },
    });

    const responseData: ApiDeleteSuccessResponse | ApiErrorResponse = await response.json();

    if (!response.ok || !responseData.success) {
        const apiErrorMessage = (responseData as ApiErrorResponse)?.message ||
            (responseData as ApiDeleteSuccessResponse)?.message || // caso success seja false
            `API Error: ${response.status}`;
        const error = new Error(apiErrorMessage);
        (error as any).status = response.status;
        (error as any).details = (responseData as ApiErrorResponse)?.details || (responseData as ApiDeleteSuccessResponse)?.errors;
        throw error;
    }
    return responseData as ApiDeleteSuccessResponse;
}