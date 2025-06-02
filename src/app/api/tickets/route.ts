import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth";
import { nextAuthConfig } from "@/lib/nextAuth";

const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5271'

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

        console.log('Buscando tickets do usuário...')
        const response = await fetch(`${backendUrl}/api/Tickets/user`, {
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

        const data = await response.json()
        console.log('Tickets recebidos do backend:', data?.length || 0)
        return NextResponse.json({
            success: true,
            data: data
        })

    } catch (error) {
        console.error('Erro na API route:', error)
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
    
}
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(nextAuthConfig);
        
        if (!session) {
            console.error('Sessão não encontrada')
            return NextResponse.json(
                { error: 'Sessão não encontrada' },
                { status: 401 }
            )
        }

        const accessToken = await session.user.token;
        if (!accessToken) {
            return NextResponse.json(
                { error: 'Token de acesso não encontrado' },
                { status: 401 }
            )
        }

        const body = await request.json()
        console.log('Criando novo ticket:', body)
        const response = await fetch(`${backendUrl}/api/Tickets`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },
            body: JSON.stringify(body)
        })

        console.log('Response status:', response.status)

        if (!response.ok) {
            const errorData = await response.text()
            console.error('Erro do backend:', errorData)

            try {
                const errorJson = JSON.parse(errorData)
                return NextResponse.json(
                    { error: errorJson.message || 'Falha ao criar ticket' },
                    { status: response.status }
                )
            } catch {
                return NextResponse.json(
                    { error: 'Falha ao criar ticket no servidor' },
                    { status: response.status }
                )
            }
        }

        const data = await response.json()
        console.log('Ticket criado:', data)

        return NextResponse.json({
            success: true,
            data: data
        })

    } catch (error) {
        console.error('Erro na API route POST:', error)
        return NextResponse.json(
            { error: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}
