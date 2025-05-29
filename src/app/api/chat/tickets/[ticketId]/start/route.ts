import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthConfig } from "@/lib/nextAuth";

export async function POST(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  const session = await getServerSession(nextAuthConfig);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const token = (session as any).accessToken;

    let ticketId = 6;

  let content: string;
  try {
    const body = await req.json();
    content = body.content;
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  if (typeof content !== "string" || content.trim().length === 0) {
    return NextResponse.json(
      { error: "O campo 'content' não pode ser vazio" },
      { status: 400 }
    );
  }
  const apiRes = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat/tickets/${ticketId}/start`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    }
  );
  const data = await apiRes.json();
  return NextResponse.json(data, { status: apiRes.status });
}
