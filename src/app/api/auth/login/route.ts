// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server"
import { cookies } from "next/headers"

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

        if (data.success && data.data?.token) {

            const cookieStore = await cookies()
            cookieStore.set({
                name: 'auth_token',
                value: data.data.token,
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                maxAge: 12 * 60 * 60,
                path: '/'
            })
        }

        return NextResponse.json(data)
    } catch (error) {
        console.error('Erro ao fazer login:', error)
        return NextResponse.json(
            { success: false, message: 'Erro ao processar solicitação de login', data: null, errors: null },
            { status: 500 }
        )
    }
}
