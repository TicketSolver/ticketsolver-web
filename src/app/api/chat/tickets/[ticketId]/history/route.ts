import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { nextAuthConfig } from '@/lib/nextAuth'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5271"
 
export async function GET(
  request: NextRequest,
  context: { params: { ticketId: string } }
) {
  const { ticketId } = await context.params

  const session = await getServerSession(nextAuthConfig)
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  const token = await session.user.token

  const url = new URL(request.url)
  const page = url.searchParams.get('page') || '1'
  const pageSize = url.searchParams.get('pageSize') || '50'

  try {
    const res = await fetch(
      `${API_BASE}/api/chat/tickets/${ticketId}/history?page=${page}&pageSize=${pageSize}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )

    if(!res.ok)
      return NextResponse.json({ message: 'Erro interno' }, { status: 500 })
    return NextResponse.json(await res.json());

  } catch (err) {
    console.error('Erro interno ao buscar histórico:', err)
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 })
  }
}
