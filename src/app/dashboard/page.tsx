"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
    const router = useRouter()

    useEffect(() => {
    const userRole = new URLSearchParams(window.location.search).get('role')
    
    if (userRole === 'admin') {
        router.push('/admin/dashboard')
    } else if (userRole === 'technician') {
        router.push('technician/dashboard')
    } else {
        router.push('user/dashboard')
    }
}, [router])

return (
    <div className="flex items-center justify-center min-h-screen">
    <p className="text-lg">Redirecionando para seu painel...</p>
    </div>
)
}
