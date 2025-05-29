import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { nextAuthConfig } from '@/lib/nextAuth'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL!

export async function GET(
  request: NextRequest,
  context: { params: { ticketId: string } }
) {
  const { ticketId } = await context.params

  const session = await getServerSession(nextAuthConfig)
  if (!session) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }
  const token = (session as any).accessToken

  const url = new URL(request.url)
  const page = url.searchParams.get('page') || '1'
  const pageSize = url.searchParams.get('pageSize') || '50'

  try {
    const res = await fetch(
      `${API_BASE}/api/chat/tickets/${ticketId}/history?page=${page}&pageSize=${pageSize}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const ct = res.headers.get('content-type') || ''
    if (ct.includes('application/json')) {
      const data = await res.json()
      return NextResponse.json(data, { status: res.status })
    } else {
      const txt = await res.text()
      console.error('Resposta não-JSON do histórico:', txt)
      return NextResponse.json(
        { error: 'Resposta inválida do servidor' },
        { status: 502 }
      )
    }
  } catch (err) {
    console.error('Erro interno ao buscar histórico:', err)
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 })
  }
}
