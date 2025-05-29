import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthConfig } from "@/lib/nextAuth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://seu-backend-api.com';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(nextAuthConfig);
        
        if (!session) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 401 }
            );
        }
        const url = `${API_BASE_URL}/api/Tickets/stats/${session.user.id}`;
        console.log("Chamando API externa:", url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.user.token}`
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