import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/utils/auth";
import { parseJwt } from "@/utils/jwt";
import { getAuthToken } from "@/services/auth";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5271';

export async function GET(request: NextRequest) {
    try {

        const token = request.cookies.get('token')?.value || getTokenFromRequest(request);
        
        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Não autorizado' },
                { status: 401 }
            );
        }
        const decoded = parseJwt(token);
        const userId = decoded?.nameid || decoded?.sub;
        
        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'ID do usuário não encontrado no token' },
                { status: 400 }
            );
        }

        const { searchParams } = new URL(request.url);
        const limit = searchParams.get('limit');
        let url = `${API_BASE_URL}/api/Tickets/user/${userId}`;
        if (limit) {
            url += `?limit=${limit}`;
        }

        const response = await fetch(url, {
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
        console.error('Erro ao buscar tickets:', error);
        return NextResponse.json(
            { success: false, message: 'Erro interno ao buscar tickets' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = getAuthToken();
        
        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Não autorizado' },
                { status: 401 }
            );
        }

        const body = await request.json();
        
        const response = await fetch(`${API_BASE_URL}/api/Tickets`, {
            method: 'POST',
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
        console.error('Erro ao criar ticket:', error);
        return NextResponse.json(
            { success: false, message: 'Erro interno ao criar ticket' },
            { status: 500 }
        );
    }
}