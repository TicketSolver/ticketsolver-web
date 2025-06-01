import { login } from "@/actions/authActions";
import { User, type AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";



export const nextAuthConfig: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Usuário", type: "text", placeholder: "jsmith" },
                password: { label: "Senha", type: "password" },
            },
            authorize: async (credentials, _req) => {
            if (!credentials?.email || !credentials?.password) return null;

            const res = await login({ email: credentials.email, password: credentials.password });
            if (!res.success || !res.data) return null;

            const { token, user } = res.data;

            return {
                ...user,
                token,               // necessário para jwt callback
                role: user.role,     // campos adicionais
                tenantId: user.tenantId,
            } satisfies User;
            }


        })
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = (user as any).token;
                token.user = user;
            }
            return token;
        },
            async session({ session, token }) {
        session.user = {
            ...(token.user as any),
            accessToken: token.accessToken,
        };
        return session;},
    },

    pages: {

        error: "/",
    },

    secret: process.env.NEXTAUTH_SECRET,
};