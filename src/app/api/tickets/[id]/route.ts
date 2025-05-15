import { NextResponse, NextRequest } from "next/server"
import { getAuthToken } from "@/services/auth";
import { parseJwt } from "@/utils/jwt";
import { cookies } from "next/headers";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5271';

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const cookieStore = cookies();
        const token = (await cookieStore).get('auth_token')?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Não autorizado' },
                { status: 401 }
            );
        }

        const ticketId = params.id;

        const response = await fetch(`${API_BASE_URL}/api/Tickets/${ticketId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            try {
                const errorData = JSON.parse(errorText);
                return NextResponse.json(errorData, { status: response.status });
            } catch {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Erro do servidor: ${response.statusText || `Código ${response.status}`}`,
                        details: errorText.substring(0, 200)
                    },
                    { status: response.status }
                );
            }
        }

        const data = await response.json();
        return NextResponse.json({
            success: true,
            data: data
        });
    } catch (error) {
        console.error(`Erro ao buscar ticket ${params.id}:`, error);
        return NextResponse.json(
            { success: false, message: 'Erro interno ao buscar detalhes do ticket' },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const token = getAuthToken();

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Não autorizado' },
                { status: 401 }
            );
        }

        const ticketId = params.id;
        const body = await request.json();

        const response = await fetch(`${API_BASE_URL}/api/Tickets/${ticketId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            const errorText = await response.text();
            try {
                const errorData = JSON.parse(errorText);
                return NextResponse.json(errorData, { status: response.status });
            } catch {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Erro do servidor: ${response.statusText || `Código ${response.status}`}`,
                        details: errorText.substring(0, 200)
                    },
                    { status: response.status }
                );
            }
        }

        const data = await response.json();
        return NextResponse.json({
            success: true,
            data: data
        });
    } catch (error) {
        console.error(`Erro ao atualizar ticket ${params.id}:`, error);
        return NextResponse.json(
            { success: false, message: 'Erro interno ao atualizar ticket' },
            { status: 500 }
        );
    }
}