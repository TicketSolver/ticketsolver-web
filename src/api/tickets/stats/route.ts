import { NextResponse } from 'next/server'

const API_BASE = process.env.API_BASE_URL!

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const mine = searchParams.get('mine')
    const res = await fetch(`${API_BASE}/api/tickets/stats?mine=${mine}`, {
        headers: { 'Content-Type': 'application/json' }
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
}
