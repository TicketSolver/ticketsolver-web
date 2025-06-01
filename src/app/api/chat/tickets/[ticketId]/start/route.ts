import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthConfig } from "@/lib/nextAuth"

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5271"

export async function POST(
  req: NextRequest,
  context: { params: { ticketId: string } }
) {

  const session = await getServerSession(nextAuthConfig);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const token = (session.user as any).accessToken;
  console.log("Token enviado:", token);
  const { ticketId } = await context.params

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

  // 2) Envia o JSON correto para a API externa
  const apiRes = await fetch(
    `${BACKEND}/api/chat/tickets/${ticketId}/start`,
    {
      method: "POST",
      headers: {
        // "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    }
  );

  console.log(apiRes)

  if (!apiRes.ok) {
    return NextResponse.json({ message: 'Erro interno' }, { status: 500 })
  }
  return NextResponse.json(await apiRes.json(), { status: apiRes.status });

}
