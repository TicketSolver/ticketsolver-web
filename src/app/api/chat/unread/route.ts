import { NextRequest, NextResponse } from 'next/server'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5271'

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')

    const response = await fetch(`${API_BASE}/api/chat/unread`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader || '',
      },
    })

    const data = await response.json()
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    return NextResponse.json(
      { message: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
