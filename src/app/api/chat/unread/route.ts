import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthConfig } from "@/lib/nextAuth";

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5271";

export async function GET() {
  const session = await getServerSession(nextAuthConfig);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const token = await session.user.token;

  const apiRes = await fetch(`${BACKEND}/api/chat/unread`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!apiRes.ok) {
    const err = await apiRes.text().catch(() => null);
    console.error("UnreadChats error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }

  const data = await apiRes.json();
  return NextResponse.json(data, { status: apiRes.status });
}
