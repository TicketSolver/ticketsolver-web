import { getServerSession } from "next-auth";
import { nextAuthConfig } from "@/lib/nextAuth";
import { redirect } from "next/navigation";


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(nextAuthConfig);
  
  if (!session) {
    redirect("/");
  }
    return children
}

