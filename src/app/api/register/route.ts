import { NextRequest, NextResponse } from "next/server";

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5271';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        
        const response = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/api/Auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorData;
            try {
                errorData = JSON.parse(errorText);
                return NextResponse.json(errorData, { status: response.status });
            } catch {
                return NextResponse.json(
                    { 
                        success: false, 
                        message: "Erro do servidor: " + (response.statusText || `Código ${response.status}`),
                        details: errorText.substring(0, 200)
                    }, 
                    { status: response.status }
                );
            }
        }
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Erro ao registrar usuário:', error);
        return NextResponse.json(
            { success: false, message: 'Erro interno ao processar o registro' },
            { status: 500 }
        );
    }
}
