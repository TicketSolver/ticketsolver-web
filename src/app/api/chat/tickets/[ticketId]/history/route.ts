import { NextRequest, NextResponse } from 'next/server'

const API_BASE = process.env.API_BASE_URL || 'http://localhost:5271'

interface Params {
    ticketId: string
}

export async function GET(
    request: NextRequest,
    { params }: { params: Params }
) {
    try {
        const { searchParams } = new URL(request.url)
        const page = searchParams.get('page') || '1'
        const pageSize = searchParams.get('pageSize') || '50'
        const authHeader = request.headers.get('authorization')

        const response = await fetch(
            `${API_BASE}/api/chat/tickets/${params.ticketId}/history?page=${page}&pageSize=${pageSize}`,
            {
                method: 'GET',
                headers: {
                    'Authorization': authHeader || '',
                },
            }
        )

        const data = await response.json()
        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        return NextResponse.json(
            { message: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}
