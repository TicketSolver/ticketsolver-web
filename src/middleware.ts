import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

function decodeJwt(token: string) {
  try {
    return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
  } catch (error) {
    console.error("Error decoding JWT:", error)
    return null
  }
}
function extractRole(decoded: any): string {
  if (!decoded) return ""

  let role =
    decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || decoded.roleType || ""

  if (Array.isArray(role)) {
    role = role[0]
  }

  return String(role)
}
function mapNumericRole(role: string): string {
  switch (role) {
    case "1":
      return "admin"
    case "2":
      return "technician"
    case "3":
      return "user"
    default:
      return role.toLowerCase() 
  }
}

export function middleware(request: NextRequest) {
  const currentPath = request.nextUrl.pathname
  const authToken = request.cookies.get("auth_token")?.value

  const protectedRoutes = ["/admin", "/user", "/technician", "/dashboard"]
  const authRoutes = ["/auth/login", "/auth/register", "/auth/forgot-password", "/auth/reset-password"]

  const isProtectedRoute = protectedRoutes.some((route) => currentPath.startsWith(route))
  const isAuthRoute = authRoutes.some((route) => currentPath === route || currentPath === route + "/")

  console.log("Path:", currentPath, "Protected:", isProtectedRoute, "Auth:", isAuthRoute)

  if (isProtectedRoute && !authToken) {
    console.log("No auth token, redirecting to login")
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  if (isAuthRoute && authToken) {
    console.log("User already authenticated, redirecting from auth page")
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  if (authToken && isProtectedRoute) {
    const decoded = decodeJwt(authToken)
    if (!decoded) {
      console.error("Failed to decode token")
      const response = NextResponse.redirect(new URL("/auth/login", request.url))
      response.cookies.delete("auth_token")
      return response
    }

    const numericRole = extractRole(decoded)
    const userRole = mapNumericRole(numericRole)

    console.log("User numeric role:", numericRole, "Mapped to:", userRole)
    if (currentPath === "/dashboard") {
      console.log("On dashboard route, redirecting based on role:", userRole)
      let redirectUrl

      if (userRole === "admin") {
        redirectUrl = "/admin/dashboard"
      } else if (userRole === "technician") {
        redirectUrl = "/technician/dashboard"
      } else if (userRole === "user") {
        redirectUrl = "/user/dashboard"
      } else {
        redirectUrl = "/user/dashboard"
      }

      console.log("Redirecting to:", redirectUrl)
      return NextResponse.redirect(new URL(redirectUrl, request.url))
    }
    if (
      currentPath === "/user/dashboard" ||
      currentPath === "/admin/dashboard" ||
      currentPath === "/technician/dashboard"
    ) {
      console.log("Already on a role-specific dashboard, no redirect needed")
      return NextResponse.next()
    }
    if (currentPath.startsWith("/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    if (currentPath.startsWith("/technician") && userRole !== "technician" && userRole !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }

    if (currentPath.startsWith("/user") && userRole !== "user" && userRole !== "technician" && userRole !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/dashboard", "/admin/:path*", "/user/:path*", "/technician/:path*", "/auth/:path*"],
}
