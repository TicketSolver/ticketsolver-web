import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';

import { NextRequest } from "next/server";

export function getTokenFromRequest(request: NextRequest): string | null {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader?.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7);
}

export function saveAuthToken(token: string, rememberMe: boolean = false): void {
    if (rememberMe) {

        localStorage.setItem(TOKEN_KEY, token);
        Cookies.set(TOKEN_KEY, token, { expires: 7 });
    } else {
        Cookies.set(TOKEN_KEY, token);
    }
}

export function getAuthToken(): string | null {
    const localToken = localStorage.getItem(TOKEN_KEY);
    if (localToken) {
        return localToken;
    }
    return Cookies.get(TOKEN_KEY) || null;
}

export function removeAuthToken(): void {
    localStorage.removeItem(TOKEN_KEY);
    Cookies.remove(TOKEN_KEY);
}


export function isAuthenticated(): boolean {
    return !!getAuthToken();
}
