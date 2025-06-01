import { nextAuthConfig } from "@/lib/nextAuth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5271"

export async function GET(req, { params }: { params: Promise<{ id: string }> }) {
  const { id: ticketId } = await params;
  const session = await getServerSession(nextAuthConfig);

  if (!session)
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401, });

  const url = `${BACKEND}/api/tickets/${ticketId}/users`;

  const ticketResponse = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${session.user.token}`
    },
  });

  const data = await ticketResponse.json();

  return NextResponse.json(data);
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: ticketId } = await params;
  const body = await request.json();
  const session = await getServerSession(nextAuthConfig);

  if (!session)
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401, });

  if (!body.userIds)
    return NextResponse.json({ success: false, message: "Usuário não encontrado!" }, { status: 400, });

  const url = `${BACKEND}/api/tickets/${ticketId}/assign/users`;

  const ticketResponse = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(body.userIds),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.user.token}`
    },
  });

  console.log(ticketResponse, body, 'res')

  if (!ticketResponse.ok) {
    const res = { success: false, data: JSON.parse(await ticketResponse.text()) };
    return NextResponse.json(res, { status: ticketResponse.status });
  }

  const data = await ticketResponse.json();

  return NextResponse.json(data, { status: ticketResponse.status });
}
