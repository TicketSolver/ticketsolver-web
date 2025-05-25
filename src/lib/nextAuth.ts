import { login } from "@/actions/authActions";
import { type AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";



export const nextAuthConfig: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Usuário", type: "text", placeholder: "jsmith" },
                password: { label: "Senha", type: "password" },
            },
            async authorize(credentials, req) {
                if (!credentials || !credentials.email || !credentials.password) return null;
                console.log("Tentando fazer login com:", credentials.email);
                const res = await login(
                    {
                        email: credentials.email,
                        password: credentials.password
                    });
                if (!res.success) {
                    throw new Error("Erro ao fazer login");
                }
                const {
                    token,
                    user
                } = res.data!;
                return { ...user, token, role: user.role };
            },
        })
    ],

    callbacks: {

        async redirect({ url, baseUrl }) {

            return "/dashboard";
        },
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = (user as any).token;
                token.user = user;
            }
            return token;
        },
        async session({ session, token }) {
            session.user = token.user as any;
            (session as any).accessToken = token.accessToken;
            return session;
        },
    },

    pages: {

        error: "/",
    },

    secret: process.env.NEXTAUTH_SECRET,
};