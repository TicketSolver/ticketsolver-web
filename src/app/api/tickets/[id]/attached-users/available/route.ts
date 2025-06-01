import { nextAuthConfig } from "@/lib/nextAuth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5271"

export async function GET(req, { params }: { params: Promise<{ id: string }> }) {
  const { id: ticketId } = await params;
  const session = await getServerSession(nextAuthConfig);

  if (!session)
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401, });

  const url = `${BACKEND}/api/tickets/${ticketId}/users/available`;

  const ticketResponse = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${session.user.token}`
    },
  });

  const data = await ticketResponse.json();

  return NextResponse.json(data);
}
