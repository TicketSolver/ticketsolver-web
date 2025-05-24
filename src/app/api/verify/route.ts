import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5271';

export async function POST(request: NextRequest) {

    try {
        const body = await request.json();
        const backendUrl = `${API_BASE_URL}/api/Auth/verify`;
        const backendResponse = await fetch(backendUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = await backendResponse.json();
        return NextResponse.json(data, { status: backendResponse.status });
    } catch (error) {
        console.error(' Erro no proxy para o backend:', error);
        return NextResponse.json(
            { success: false, message: 'Erro interno ao processar a solicitação' },
            { status: 500 }
        );
    }
}
