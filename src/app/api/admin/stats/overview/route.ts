import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthConfig } from "@/lib/nextAuth";

const BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5271";

export async function GET(req: NextRequest) {
  const session = await getServerSession(nextAuthConfig);
  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const tenantId = await session.user.tenantId;
  const token    =  await session.user.token;
  const url      = `${BACKEND}/api/Admin/overview/${tenantId}/stats/`;
  
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` }
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Falha ao buscar overview" },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
