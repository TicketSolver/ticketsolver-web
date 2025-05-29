"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function MainPage() {
    const router = useRouter()

    useEffect(() => {
        router.push('auth/login')
    }, [router])

    return (
        <div className="flex items-center justify-center min-h-screen">
        </div>
    )
}
