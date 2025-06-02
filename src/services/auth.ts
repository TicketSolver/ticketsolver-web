
import {
    BaseResponse,
    LoginFormData,
    RegisterRequest,
    VerifyInviteResponse,
    PreRegisterPayload,
    PreRegisterResponse
} from "@/types/auth"


interface AuthResponse {
    success: boolean
    message: string
    data: {
        token: string
        user: {
            id: string
            email: string
            name: string
            role?: string
        }
    } | null
    errors: any
}


export async function verifyInviteCode(code: string): Promise<BaseResponse<VerifyInviteResponse>> {
    console.log(`Verificando código de convite: ${code}`);
    const endpoint = "/api/verify";

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tenantKey: code }),
        });
        console.log(`Status da resposta: ${response.status}`);
        if (!response.ok) {
            throw new Error(`Erro ao verificar código: ${response.status}`);
        }
        const data = await response.json();
        console.log("Dados recebidos:", data);
        return data;
    } catch (error) {
        console.error("Erro na verificação:", error);
        throw error;
    }
}


export async function registerUser(data: RegisterRequest): Promise<BaseResponse<any>> {
    const response = await fetch(`/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
    })

    if (!response.ok) {
        throw new Error(`Erro ao registrar usuário: ${response.status}`)
    }

    return response.json()
}



// export async function login(credentials: LoginFormData): Promise<AuthResponse> {
//     const response = await fetch('/api/login', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(credentials)
//     });
//     const data = await response.json();
//     if (data.success && data.data?.token) {
//         console.log("Token recebido no login:", data.data.token.substring(0, 10) + "...");
//         console.log("Comprimento do token:", data.data.token.length);
//         return data;
//     }

//     return { success: false, message: data.message || "Falha no login", data: null, errors: data.errors || null };
// }


// export async function login(credentials: LoginFormData) {
// "use server";
// const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5271';
//     try {

//         const response = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/api/Auth/login`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify(credentials)
//         })

//         return await response.json()
//     } catch (error) {
//         console.error('Erro ao fazer login:', error)
//     }
// }

export function saveAuthToken(token: string, rememberMe: boolean): void {
    if (rememberMe) {
        localStorage.setItem("auth_token", token)
    } else {
        sessionStorage.setItem("auth_token", token)
    }
}

export function getAuthToken(): string | null {
    return sessionStorage.getItem("auth_token") ?? localStorage.getItem("auth_token")
}

export function removeAuthToken(): void {
    localStorage.removeItem("auth_token")
    sessionStorage.removeItem("auth_token")
}

export function isAuthenticated(): boolean {
    return !!getAuthToken()
}

export async function preregisterUser(payload: PreRegisterPayload): Promise<PreRegisterResponse> {
    const res = await fetch('/api/preregister', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
    })

    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || `Erro ${res.status}`)
    }

    return res.json()
}