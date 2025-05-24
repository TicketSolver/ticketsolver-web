export function parseJwt(token: string) {
    try {
        if (!token || !token.includes('.')) {
            console.error("Token inválido fornecido para parseJwt");
            return null;
        }
        const parts = token.split('.');
        if (parts.length !== 3) {
            console.error("Token JWT inválido: não tem 3 partes");
            return null;
        }
        const base64Url = parts[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

        const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');

        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error("Erro ao decodificar JWT:", error);
        return null;
    }
}

export function getRoleFromToken(token: string): string | null {
    try {
        const decoded = parseJwt(token);
        if (!decoded) return null;

        const role =
            decoded.role ||
            decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
            decoded.Role ||
            null;

        if (Array.isArray(role)) {
            return role[0];
        }

        return role;
    } catch (error) {
        console.error("Erro ao extrair role do token:", error);
        return null;
    }
}

export function getUserIdFromToken(token: string): string | null {
    try {
        const decoded = parseJwt(token);
        if (!decoded) return null;


        return decoded.sub || decoded.nameid || decoded.id || null;
    } catch (error) {
        console.error("Erro ao extrair ID do usuário do token:", error);
        return null;
    }
}

export function isTokenExpired(token: string): boolean {

    try {
        const decoded = parseJwt(token);
        if (!decoded || !decoded.exp) return true;

        const currentTime = Math.floor(Date.now() / 1000);
        return decoded.exp < currentTime;
    } catch (error) {
        console.error("Erro ao verificar expiração do token:", error);
        return true;

    }


}