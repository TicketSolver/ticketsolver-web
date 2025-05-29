import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth";
import { nextAuthConfig } from "@/lib/nextAuth";

const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5271'

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(nextAuthConfig);
        
        if (!session) {
            return NextResponse.json(
                { success: false, error: 'Sessão não encontrada' },
                { status: 401 }
            )
        }

        const accessToken = (session as any).accessToken;
        if (!accessToken) {
            return NextResponse.json(
                { success: false, error: 'Token de acesso não encontrado' },
                { status: 401 }
            )
        }

        const ticketId = params.id;
        console.log(`Buscando ticket específico: ${ticketId}`)
        const response = await fetch(`${backendUrl}/api/Tickets/${ticketId}`, {
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
                { success: false, error: 'Ticket não encontrado' },
                { status: response.status }
            )
        }

        const backendData = await response.json()
        console.log('Ticket recebido:', backendData.success ? 'Sucesso' : 'Falha')

        return NextResponse.json({
            success: true,
            data: backendData.data || null
        })

    } catch (error) {
        console.error('Erro na API route:', error)
        return NextResponse.json(
            { success: false, error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}
