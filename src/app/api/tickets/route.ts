import { NextResponse } from 'next/server'

const API_BASE = process.env.API_BASE_URL!

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const mine = searchParams.get('mine')
    const res = await fetch(`${API_BASE}/api/tickets?mine=${mine}`, {
        headers: { 'Content-Type': 'application/json' }
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
}

export async function POST(req: Request) {
    const body = await req.json()
    const res = await fetch(`${API_BASE}/api/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    })
    const data = await res.json()
    return NextResponse.json(data, { status: res.status })
}
