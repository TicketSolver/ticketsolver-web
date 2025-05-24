import { NextResponse, NextRequest } from "next/server";
import { getAuthToken } from "@/services/auth";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5271";

// GET
export async function GET(request: NextRequest, { params }) {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get("auth_token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Não autorizado" },
                { status: 401 }
            );
        }

        const response = await fetch(
            `${API_BASE_URL}/api/Tickets/${params.id}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        return handleApiResponse(response);
    } catch (error) {
        return handleServerError(params.id, error);
    }
}

// PUT
export async function PUT(request: NextRequest, { params }) {
    try {
        const token = getAuthToken();

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Não autorizado" },
                { status: 401 }
            );
        }

        const body = await request.json();
        const response = await fetch(
            `${API_BASE_URL}/api/Tickets/${params.id}`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            }
        );

        return handleApiResponse(response);
    } catch (error) {
        return handleServerError(params.id, error, "atualizar");
    }
}

// Funções auxiliares
async function handleApiResponse(response: Response) {
    if (!response.ok) {
        const errorText = await response.text();
        try {
            const errorData = JSON.parse(errorText);
            return NextResponse.json(errorData, { status: response.status });
        } catch {
            return NextResponse.json(
                {
                    success: false,
                    message: `Erro: ${response.statusText || `Código ${response.status}`}`,
                },
                { status: response.status }
            );
        }
    }

    const data = await response.json();
    return NextResponse.json({ success: true, data });
}

function handleServerError(
    ticketId: string,
    error: any,
    action: string = "buscar"
) {
    console.error(`Erro ao ${action} ticket ${ticketId}:`, error);
    return NextResponse.json(
        {
            success: false,
            message: `Erro interno ao ${action} ticket`,
        },
        { status: 500 }
    );
}
