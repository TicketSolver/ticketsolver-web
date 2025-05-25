import { NextRequest, NextResponse } from 'next/server'

const API_BASE = process.env.API_BASE_URL || 'http://localhost:5271'

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()
        const authHeader = request.headers.get('authorization')

        const response = await fetch(`${API_BASE}/api/chat/messages/mark-read`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authHeader || '',
            },
            body: JSON.stringify(body),
        })

        const data = await response.json()
        return NextResponse.json(data, { status: response.status })
    } catch (error) {
        return NextResponse.json(
            { message: 'Erro interno do servidor' },
            { status: 500 }
        )
    }
}
