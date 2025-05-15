import { NextRequest, NextResponse } from "next/server";
import { getTokenFromRequest } from "@/utils/auth";
import { parseJwt } from "@/utils/jwt";

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
        const response = await fetch(`${API_BASE_URL}/api/Tickets/${userId}/counts`, {
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
        const formattedData = {
            total: data.total || 0,
            inProgress: data.inProgress || 0,
            waiting: data.waiting || 0,
            resolved: data.resolved || 0
        };
        
        return NextResponse.json({
            success: true,
            data: formattedData
        });
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        return NextResponse.json(
            { success: false, message: 'Erro interno ao buscar estatísticas' },
            { status: 500 }
        );
    }
}