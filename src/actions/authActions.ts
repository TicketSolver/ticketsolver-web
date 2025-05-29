"use server";

import { LoginFormData } from "@/types/auth";

interface AuthResponse {
    success: boolean;
    message: string;
    data: {
        token: string;
        user: {
            id: string;
            email: string;
            name: string;
            role?: string;
            tenantId: string;
        },
        
    } | null;
    errors: any;
}

export async function login(credentials: LoginFormData): Promise<AuthResponse> {
    const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5271";

    try {
        const response = await fetch(`${NEXT_PUBLIC_API_BASE_URL}/api/Auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            throw new Error(`Login failed: ${response.status}`);
        }

        const data = await response.json();
        console.log("Token received during login:", data.data?.token?.substring(0, 10) + "...");

        return data;
    } catch (error) {
        console.error("Error during login:", error);
        return {
            success: false,
            message: "Failed to log in. Please try again.",
            data: null,
            errors: error instanceof Error ? error.message : "Unknown error",
        };
    }
}