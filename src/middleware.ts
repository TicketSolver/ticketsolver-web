// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const currentPath = request.nextUrl.pathname
    const authToken = request.cookies.get('auth_token')?.value

    const protectedRoutes = [
        '/dashboard',
        '/admin',
        '/user',
        '/technician',
    ]

    const authRoutes = [
        '/auth/login',
        '/auth/register',
        '/auth/forgot-password',
        '/auth/reset-password'
    ]

    const isProtectedRoute = protectedRoutes.some(route =>
        currentPath.startsWith(route)
    )

    const isAuthRoute = authRoutes.some(route =>
        currentPath === route || currentPath === route + '/'
    )

    if (isProtectedRoute && !authToken) {
        return NextResponse.redirect(new URL('/auth/login', request.url))
    }

    if (isAuthRoute && authToken) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/admin/:path*',
        '/user/:path*',
        '/auth/:path*'
    ],
}
