import { nextAuthConfig } from "@/lib/nextAuth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const session = await getServerSession(nextAuthConfig);

  if (!session)
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401, });

  const url = `${process.env.NEXT_PUBLIC_API_URl}/api/tickets/technician/${session.user.id}/performance`;

  const ticketResponse = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${session.user.token}`
    },
  });
  
  const data = await ticketResponse.json();

  return NextResponse.json(data);
}