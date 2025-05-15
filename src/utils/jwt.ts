// src/utils/jwt.ts
export function parseJwt(token: string): any {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            window.atob(base64)
                .split('')
                .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('Erro ao decodificar token JWT', e);
        return null;
    }
}

export function getRoleFromToken(token: string): 'admin' | 'technician' | 'user' | null {
    const decoded = parseJwt(token);
    if (!decoded) return null;

    let role = decoded.role;

    if (!role && decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) {
        role = decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    }

    if (!role) {
        console.warn('Não foi possível encontrar o role no token JWT', decoded);
        return null;
    }

    if (Array.isArray(role)) {
        role = role[0];
    }

    switch (role) {
        case '0':
            return 'admin';
        case '1':
            return 'technician';
        case '2':
            return 'user';
        default:
            console.warn('Role desconhecido encontrado no token:', role);
            return null;
    }
}

export function debugJwtToken(token: string): void {
    try {
        const decoded = parseJwt(token);
        console.group('Detalhes do JWT Token');
        console.log('Token completo decodificado:', decoded);

        console.log('Subject (nameid):', decoded.nameid);
        console.log('Email:', decoded.email);
        console.log('Role:', decoded.role);
        console.log('Issued At:', new Date(decoded.iat * 1000).toLocaleString());
        console.log('Expires At:', new Date(decoded.exp * 1000).toLocaleString());
        console.log('Todas as claims:');
        Object.keys(decoded).forEach(key => {
            console.log(`  ${key}: ${decoded[key]}`);
        });

        console.groupEnd();
    } catch (e) {
        console.error('Erro ao debugar token JWT', e);
    }
}
