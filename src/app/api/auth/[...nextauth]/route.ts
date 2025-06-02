import { nextAuthConfig } from "@/lib/nextAuth";
import NextAuth from "next-auth";

const Handler = NextAuth(nextAuthConfig);

export { Handler as GET, Handler as POST };
export const dynamic = "force-dynamic";


