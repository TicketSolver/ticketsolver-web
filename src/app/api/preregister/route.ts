// src/app/api/Auth/preregister/route.ts
import { NextRequest, NextResponse } from 'next/server'

const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5271"

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const apiRes = await fetch(`${BACKEND}/api/Auth/preregister`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        })

        const data = await apiRes.json()
        if (!apiRes.ok) {
            return NextResponse.json(data, { status: apiRes.status })
        }
        return NextResponse.json(data)
    } catch (err: any) {
        return NextResponse.json({ success: false, message: err.message }, { status: 500 })
    }
}
