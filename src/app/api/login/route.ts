import { NextResponse } from "next/server"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5271';

export async function POST(req: Request) {
    try {
        const body = await req.json()

        const response = await fetch(`${API_BASE_URL}/api/Auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })

        const data = await response.json()

        return NextResponse.json(data)
    } catch (error) {
        console.error('Erro ao fazer login:', error)
        return NextResponse.json(
            { success: false, message: 'Erro ao processar solicitação de login', data: null, errors: null },
            { status: 500 }
        )
    }
}
