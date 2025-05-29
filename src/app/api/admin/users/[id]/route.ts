import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { nextAuthConfig } from '@/lib/nextAuth';
const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5271";
interface BackendErrorDetail {
    [key: string]: string[];
}
interface BackendErrorResponse {
    type?: string;
    title?: string;
    status?: number;
    detail?: string;
    errors?: BackendErrorDetail;
    message?: string;
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(nextAuthConfig);
    if (!session) {
        return NextResponse.json({ message: 'Unauthorized: No session found' }, { status: 401 });
    }
    if ((session.user as any)?.role !== 'admin') {
        return NextResponse.json({ message: 'Forbidden: Insufficient privileges' }, { status: 403 });
    }
    const token = (session as any).accessToken;
    if (!token) {
        console.error('API Route PATCH Error: accessToken not found in session. Ensure session callback populates it.');
        return NextResponse.json({ message: 'Internal Server Error: Session misconfiguration (missing token)' }, { status: 500 });
    }

    const userId = params.id;
    if (!userId) {
        return NextResponse.json({ message: 'User ID parameter is required' }, { status: 400 });
    }

    const backendBaseUrl = BACKEND;
    if (!backendBaseUrl) {
        console.error('API Route PATCH Error: BACKEND_API_URL environment variable is not set.');
        return NextResponse.json({ message: 'Internal Server Error: Service configuration error (missing backend URL).' }, { status: 500 });
    }

    try {
        const body = await request.json();

        if (Object.keys(body).length === 0) {
            return NextResponse.json({ message: 'No fields to update provided in request body' }, { status: 400 });
        }

        const backendApiUrl = `${backendBaseUrl}/api/Users/${userId}`;

        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };

        console.log(`Enviando para o Backend - URL: ${backendApiUrl}, Payload:`, JSON.stringify(body));
        const backendResponse = await fetch(backendApiUrl, {
            method: 'PATCH',
            headers: headers,
            body: JSON.stringify(body),
        });

        // Handle cases like 204 No Content where there's no JSON body
        if (backendResponse.status === 204) {
            return new NextResponse(null, { status: 204 }); // Successfully updated, no content to return
        }

        const backendResponseData: any | BackendErrorResponse = await backendResponse.json().catch((e) => {
            // This catch is for backendResponse.json() failing, e.g. if backend sent non-JSON response with error status
            console.error('Failed to parse backend JSON response:', e);
            return null; // Allows further checks on backendResponse.ok
        });


        if (!backendResponse.ok) {
            console.error('Backend Error - Status:', backendResponse.status, 'Parsed Response Data:', backendResponseData);
            const errorMessage = backendResponseData?.message ||
                backendResponseData?.title ||
                backendResponseData?.detail ||
                `Error updating user on backend (Status: ${backendResponse.status})`;
            return NextResponse.json(
                { message: errorMessage, details: backendResponseData?.errors || backendResponseData },
                { status: backendResponse.status || 500 }
            );
        }

        // If response is OK and JSON was parsed (or backend sent 200/201 with non-JSON which is unusual for PATCH success)
        return NextResponse.json(backendResponseData || { message: 'User updated successfully' }, { status: backendResponse.status });

    } catch (error: any) {
        console.error('API Route PATCH - Catch Block Error:', error);
        // Handle cases where request.json() itself fails (e.g., malformed JSON from client)
        if (error instanceof SyntaxError && error.message.includes("JSON")) {
            return NextResponse.json({ message: 'Invalid JSON payload provided in request' }, { status: 400 });
        }
        return NextResponse.json({ message: 'Internal Server Error', errorDetails: error.message }, { status: 500 });
    }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const session = await getServerSession(nextAuthConfig);

    if (!session) {
        return NextResponse.json({ message: 'Unauthorized: No session found' }, { status: 401 });
    }
    // Ajuste esta verificação de 'role' conforme a estrutura do seu objeto session.user
    if ((session.user as any)?.role !== 'admin') {
        return NextResponse.json({ message: 'Forbidden: Insufficient privileges' }, { status: 403 });
    }
    const token = (session as any).accessToken;
    if (!token) {
        console.error('API Route DELETE Error: accessToken not found in session.');
        return NextResponse.json({ message: 'Internal Server Error: Session misconfiguration (missing token)' }, { status: 500 });
    }

    const userId = params.id; // Corrigido: sem await
    if (!userId) {
        return NextResponse.json({ message: 'User ID parameter is required' }, { status: 400 });
    }

    if (!BACKEND) {
        console.error('API Route DELETE Error: BACKEND_API_URL environment variable is not set.');
        return NextResponse.json({ message: 'Internal Server Error: Service configuration error (missing backend URL).' }, { status: 500 });
    }

    try {
        const backendApiUrl = `${BACKEND}/api/Users/${userId}`;

        const headers: HeadersInit = {
            'Authorization': `Bearer ${token}`,
            // 'Content-Type' geralmente não é necessário para DELETE se não há corpo
        };

        console.log(`Calling Backend DELETE: ${backendApiUrl}`);

        const backendResponse = await fetch(backendApiUrl, {
            method: 'DELETE',
            headers: headers,
        });

        // O backend retorna um corpo JSON mesmo para DELETE, segundo seu exemplo
        const backendResponseData = await backendResponse.json().catch((e) => {
            console.error('Failed to parse backend JSON response for DELETE:', e);
            // Se falhar o parse e o status for OK (ex: 200 ou 204), pode ser um delete sem corpo de resposta JSON
            if (backendResponse.ok) return { success: true, message: "Usuário deletado com sucesso (sem corpo de resposta JSON do backend)." };
            return null;
        });

        if (!backendResponse.ok) {
            console.error('Backend DELETE Error - Status:', backendResponse.status, 'Parsed Response Data:', backendResponseData);
            const errorMessage = backendResponseData?.message ||
                `Error deleting user on backend (Status: ${backendResponse.status})`;
            return NextResponse.json(
                { message: errorMessage, details: backendResponseData?.errors || backendResponseData },
                { status: backendResponse.status || 500 }
            );
        }

        // Encaminha a resposta de sucesso do backend (que inclui success: true)
        return NextResponse.json(backendResponseData, { status: backendResponse.status });

    } catch (error: any) {
        console.error('API Route DELETE - Catch Block Error:', error);
        return NextResponse.json({ message: 'Internal Server Error', errorDetails: error.message }, { status: 500 });
    }
}