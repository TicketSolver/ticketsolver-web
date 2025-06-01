import { nextAuthConfig } from "@/lib/nextAuth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }: { params: Promise<{ id: string }> }) {
  const { id: ticketId } = await params;
  const body = await req.json();
  const session = await getServerSession(nextAuthConfig);

  if (!session)
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401, });
  
  if (!body.userId)
    return NextResponse.json({ success: false, message: "Usuário não encontrado!" }, { status: 400, });
  
  const url = `${process.env.NEXT_PUBLIC_API_URl}/api/tickets/${ticketId}/unassign/${body.userId}`;

  const ticketResponse = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${session.user.token}`
    },
  });

  console.log(ticketResponse)

  const data = await ticketResponse.json();

  return NextResponse.json(data);
}