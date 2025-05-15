export const TOKEN_KEY = 'auth_token';

export function saveAuthToken(token: string, rememberMe: boolean = false) {
    try {
        if (typeof window === 'undefined') return false;
        const expiryDays = rememberMe ? 30 : 1;
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + expiryDays);

        document.cookie = `${TOKEN_KEY}=${token};path=/;expires=${expiryDate.toUTCString()}`;
        localStorage.setItem(TOKEN_KEY, token);

        return true;
    } catch (error) {
        console.error("Erro ao salvar token:", error);
        return false;
    }
}


export function getAuthToken(): string | null {
    try {
        if (typeof window === 'undefined') return null;
        const cookies = document.cookie.split(';');
        for (const element of cookies) {
            const cookie = element.trim();
            if (cookie.startsWith(`${TOKEN_KEY}=`)) {
                return cookie.substring(TOKEN_KEY.length + 1);
            }
        }

        return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
        console.error("Erro ao obter token:", error);
        return null;
    }
}
export function removeAuthToken() {
    try {
    
    if (typeof window === 'undefined') {
      return false;
    };
        document.cookie = `${TOKEN_KEY}=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        localStorage.removeItem(TOKEN_KEY);

        return true;
    } catch (error) {
        console.error("Erro ao remover token:", error);
        return false;
    }
}
export function isAuthenticated(): boolean {
    return !!getAuthToken();
}
