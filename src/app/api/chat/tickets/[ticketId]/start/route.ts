import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthConfig } from "@/lib/nextAuth";

export async function POST(
  req: NextRequest,
  context: { params: { ticketId: string } }
) {

  const session = await getServerSession(nextAuthConfig);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }
  const token = (session as any).accessToken;

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
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/chat/tickets/${ticketId}/start`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(content),
    }
  );

  // 3) Leia o corpo apenas uma vez
  const data = await apiRes.json();
  if (!apiRes.ok) {
    console.log("Erro da API:", data);
  }

  return NextResponse.json(data, { status: apiRes.status });
}
