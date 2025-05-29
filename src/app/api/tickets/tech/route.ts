import { nextAuthConfig } from "@/lib/nextAuth";
import { getPagination } from "@/utils/pagination";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";
export async function GET(request: NextRequest) {
  const session = await getServerSession(nextAuthConfig);
  const { searchParams } = new URL(request.url);

  if (!session)
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401, });

  const history = searchParams.get('history');
  const pagination = getPagination({
    page: +searchParams.get('page'),
    pageSize: +searchParams.get('pageSize'),
  })
  const url = `${BACKEND}/api/tickets/technician/?${pagination}${history ? 'history=true' : ''}`;

  const ticketResponse = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${session.user.token}`
    },
  });

  const data = await ticketResponse.json();

  return NextResponse.json(data, { status: ticketResponse.status });
}