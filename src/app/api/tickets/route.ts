import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { parseJwt } from "@/utils/jwt";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://seu-backend-api.com';

export async function GET(request: NextRequest) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_token')?.value;
        
        if (!token) {
            console.log("Token não encontrado na requisição de tickets");
            return NextResponse.json(
                { success: false, message: 'Não autorizado' },
                { status: 401 }
            );
        }
        const decoded = parseJwt(token);
        if (!decoded) {
            console.error("Falha ao decodificar token nos tickets");
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

        const { searchParams } = new URL(request.url);
        const limit = searchParams.get('limit');
        let url = `${API_BASE_URL}/api/Tickets/user/${userId}`;
        if (limit) {
            url += `?limit=${limit}`;
        }
        
        console.log("Chamando API externa para tickets:", url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            next: { revalidate: 60 }
        });

        if (!response.ok) {
            console.error(`API retornou status ${response.status} para tickets`);
            const errorText = await response.text();
            try {
                const errorData = JSON.parse(errorText);
                return NextResponse.json(errorData, { status: response.status });
            } catch {
                return NextResponse.json(
                    {
                        success: false,
                        message: `Erro ao obter tickets: ${response.statusText || `Código ${response.status}`}`,
                        details: errorText.substring(0, 200)
                    },
                    { status: response.status }
                );
            }
        }

        const data = await response.json();
        console.log("Dados de tickets recebidos da API:", data ? `${data.length || 0} tickets` : "nenhum");
        
        return NextResponse.json({
            success: true,
            data: data || []
        });
    } catch (error) {
        console.error("Erro ao processar requisição de tickets:", error);
        return NextResponse.json(
            {
                success: false, 
                message: "Erro ao processar requisição de tickets",
                error: (error instanceof Error) ? error.message : String(error)
            },
            { status: 500 }
        );
    }
}