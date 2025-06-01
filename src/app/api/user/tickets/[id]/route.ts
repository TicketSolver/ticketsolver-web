// app/api/user/tickets/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { nextAuthConfig } from '@/lib/nextAuth'


const backendUrl = process.env.NEXT_PUBLIC_API_BASE_URL!

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  const { id: ticketId } = await context.params
  const session = await getServerSession(nextAuthConfig)
  if (!session) {
    return NextResponse.json({ success: false, error: 'Não autorizado' }, { status: 401 })
  }
  const token = (session as any).accessToken
  if (!token) {
    return NextResponse.json({ success: false, error: 'Token não encontrado' }, { status: 401 })
  }

  try {
    const res = await fetch(`${backendUrl}/api/Tickets/${ticketId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) {
      const txt = await res.text()
      console.error('Erro do backend:', txt)
      return NextResponse.json({ success: false, error: 'Ticket não encontrado' }, { status: res.status })
    }
    const json = await res.json()
    return NextResponse.json({ success: true, data: json.data })
  } catch (err) {
    console.error('Erro interno:', err)
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 })
  }
}
