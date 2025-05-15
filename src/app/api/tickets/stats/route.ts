import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parseJwt } from "@/utils/jwt";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://seu-backend-api.com';

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;
        
        if (!token) {
            console.log("Token não encontrado nas requisição de estatísticas");
            return NextResponse.json(
                { success: false, message: 'Não autorizado' },
                { status: 401 }
            );
        }
        const decoded = parseJwt(token);
        if (!decoded) {
            console.error("Falha ao decodificar token nas estatísticas");
            return NextResponse.json(
                { success: false, message: 'Token inválido' },
                { status: 401 }
            );
        }
        
        const userId = decoded?.nameid || decoded?.sub;
        console.log("ID do usuário obtido do token:", userId);
        
        if (!userId) {
            return NextResponse.json(
                { success: false, message: 'ID do usuário não encontrado no token' },
                { status: 400 }
            );
        }
        const url = `${API_BASE_URL}/api/Tickets/stats/${userId}`;
        console.log("Chamando API externa:", url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            next: { revalidate: 60 }
        });

        if (!response.ok) {
            console.error(`API retornou status ${response.status} para estatísticas`);
            const errorText = await response.text();
            try {
                const errorData = JSON.parse(errorText);
                return NextResponse.json(errorData, { status: response.status });
            } catch {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Erro ao obter estatísticas: ${response.statusText || `Código ${response.status}`}`,
                        details: errorText.substring(0, 200)
                    },
                    { status: response.status }
                );
            }
        }

        const data = await response.json();
        console.log("Dados de estatísticas recebidos da API");
        
        return NextResponse.json({
            success: true,
            data: {
                openTickets: data.openTickets || 0,
                inProgressTickets: data.inProgressTickets || 0,
                resolvedTickets: data.resolvedTickets || 0,
                totalTickets: data.totalTickets || 0
            }
        });
    } catch (error) {
        console.error("Erro ao processar requisição de estatísticas:", error);
        return NextResponse.json(
            {
                success: false, 
                message: "Erro ao processar requisição de estatísticas",
                error: (error instanceof Error) ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}