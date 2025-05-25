import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth";
import { nextAuthConfig } from "@/lib/nextAuth";

const backendUrl = process.env.BACKEND_URL || 'http://localhost:5271'

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(nextAuthConfig);
        
        if (!session) {
            return NextResponse.json(
                { error: 'Sessão não encontrada' },
                { status: 401 }
            )
        }

        const accessToken = (session as any).accessToken;
        if (!accessToken) {
            return NextResponse.json(
                { error: 'Token de acesso não encontrado' },
                { status: 401 }
            )
        }

        const { searchParams } = new URL(request.url)
        const limit = searchParams.get('limit')

        console.log('Buscando tickets do usuário...', limit ? `(limite: ${limit})` : '')


        let backendUrl_final = `${backendUrl}/api/Tickets/user`
        if (limit) {
            backendUrl_final += `?limit=${limit}`
        }

        const response = await fetch(backendUrl_final, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
        })

        console.log('Response status:', response.status)

        if (!response.ok) {
            const errorData = await response.text()
            console.error('Erro do backend:', errorData)
            return NextResponse.json(
                { error: 'Falha ao buscar tickets do servidor' },
                { status: response.status }
            )
        }

        const backendData = await response.json()
        console.log('Dados recebidos do backend:', {
            success: backendData.success,
            ticketsCount: backendData.data?.length || 0
        })

        return NextResponse.json({
            success: true,
            data: backendData.data || [] 
        })

    } catch (error) {
        console.error('Erro na API route:', error)
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}
