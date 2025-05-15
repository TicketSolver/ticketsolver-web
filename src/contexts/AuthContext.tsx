"use client";

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode
} from "react";
import { useRouter } from "next/navigation";
import {
    getAuthToken,
    removeAuthToken,
    saveAuthToken,
    isAuthenticated
} from "@/utils/auth";
import { parseJwt, getRoleFromToken } from "@/utils/jwt";
import { User } from "@/types/user";

import { TOKEN_KEY } from "@/utils/auth";
interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
    isTechnician: boolean;
    isUser: boolean;
    login: (token: string, rememberMe?: boolean) => void;
    logout: () => void;
    refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const isAdmin = user?.role?.toLowerCase() === 'admin';
    const isTechnician = user?.role?.toLowerCase() === 'technician' || isAdmin;
    const isUser = !!user; 

const login = (token: string, rememberMe = false) => {
    console.log("Login chamado com token:", token ? token.substring(0, 10) + "..." : "ausente");
    saveAuthToken(token, rememberMe);

    if (typeof window !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
        console.log("Token salvo no localStorage");
    }
    
    refreshUser();
};
    const refreshUser = () => {
        setLoading(true);
        try {
            console.log("Refreshing user...");
            const token = getAuthToken();
            console.log("Token obtido:", token ? "presente" : "ausente");

            if (!token) {
                setUser(null);
                setLoading(false);
                return;
            }

            const decoded = parseJwt(token);
            console.log("Token decodificado:", decoded ? "sucesso" : "falha");

            if (decoded) {
                const roleType = getRoleFromToken(token);
                console.log("Role detectado no token:", roleType);

                const validRole = ['admin', 'technician', 'user'].includes(roleType?.toLowerCase() || '')
                    ? roleType?.toLowerCase() as 'admin' | 'technician' | 'user'
                    : 'user';
                    
                const userObject = {
                    id: decoded.nameid || decoded.sub || '',
                    email: decoded.email || '',
                    roleId: decoded.role || '',
                    role: validRole,
                    name: decoded.name || decoded.given_name || '',
                };
                
                console.log("Configurando usuário:", userObject);
                setUser(userObject);
            } else {
                console.warn("Token inválido ou expirado");
                logout();
            }
        } catch (error) {
            console.error("Erro ao decodificar token:", error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        console.log("Logout chamado");
        removeAuthToken();
        setUser(null);
        router.push("/auth/login");
    };
    useEffect(() => {
        if (typeof window !== 'undefined') {
            refreshUser();
        }
    }, []);
    useEffect(() => {
        console.log("Estado do usuário mudou:", user ? `${user.name} (${user.role})` : "null");
    }, [user]);

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            isAdmin,
            isTechnician,
            isUser,
            login,
            logout,
            refreshUser
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }
    return context;
}
