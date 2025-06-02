import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthConfig } from "@/lib/nextAuth";

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5271";

export async function GET(
  req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  const session = await getServerSession(nextAuthConfig);
  if (!session) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const token = await session.user.token;
  const { ticketId } = await params;

  const url = new URL(req.url);
  const page = url.searchParams.get("page") || "1";
  const pageSize = url.searchParams.get("pageSize") || "50";

  const apiRes = await fetch(
    `${BACKEND}/api/chat/tickets/${ticketId}/history?page=${page}&pageSize=${pageSize}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  if (!apiRes.ok) {
    const err = await apiRes.text().catch(() => null);
    console.error("History error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }

  const data = await apiRes.json();
  return NextResponse.json(data, { status: apiRes.status });
}
