import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthConfig } from "@/lib/nextAuth";

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5271";

export async function POST(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {

  const session = await getServerSession(nextAuthConfig);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const token =  await session.user.token;
  const { ticketId } = params;

  // parse do body
  let payload: any;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }
  const { content } = payload;
  if (typeof content !== "string" || content.trim() === "") {
    return NextResponse.json(
      { error: "O campo 'content' não pode ser vazio" },
      { status: 400 }
    );
  }
  const apiRes = await fetch(
    `${BACKEND}/api/chat/tickets/${ticketId}/start`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    }
  );

  if (!apiRes.ok) {
    const errBody = await apiRes.text().catch(() => null);
    console.error("Erro da API externa:", errBody);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }

  const result = await apiRes.json();
  return NextResponse.json(result, { status: apiRes.status });
}
