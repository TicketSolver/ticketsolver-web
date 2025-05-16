import { getServerSession } from 'next-auth'
import { nextAuthConfig } from '@/lib/nextAuth'
import { redirect } from 'next/navigation'

export default async function Redirect() {
    const session = await getServerSession(nextAuthConfig)

    if (!session) {
        redirect('/')
    }
    const role = (session?.user as any).defUserTypeId as number;
    const URLs: { [key: number]: string } = {
        1: "/t/admin",
        2: "/t/technician",
        3: "/t/user",
    };
    const redirectUrl = URLs[role] || "/";
    return redirect(redirectUrl)
}

