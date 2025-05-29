import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from "next-auth";
import { nextAuthConfig } from "@/lib/nextAuth";

const backendUrl = process.env.NEXT_PUBLIC_API_URl || 'http://localhost:5271'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(nextAuthConfig);

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Sessão não encontrada' },
        { status: 401 }
      )
    }

    const { id: ticketId } = await params;
    const response = await fetch(`${backendUrl}/api/Tickets/${ticketId}`, {
      headers: {
        'Authorization': `Bearer ${session.user.token}`,
      },
    })

    const backendData = await response.json()

    return NextResponse.json(backendData, { status: response.status })

  } catch (error) {
    console.log(error, 'err')
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
