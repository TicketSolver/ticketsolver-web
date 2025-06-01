import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { nextAuthConfig } from "@/lib/nextAuth";

const BACKEND = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5271"

export async function GET(req, { params }: { params: Promise<{ id: string }> }) {
    const { id: ticketId } = await params;
    const session = await getServerSession(nextAuthConfig);

    if (!session)
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401, });

    const url = `${BACKEND}/api/attachments/${ticketId}`;

    const ticketResponse = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${session.user.token}`
        },
    });

    const data = await ticketResponse.json();

    return NextResponse.json(data);
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id: ticketId } = await params;
    const formData = await request.formData();
    const session = await getServerSession(nextAuthConfig);

    if (!session)
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401, });

    const url = `${BACKEND}/api/attachments/ticket/${ticketId}/upload`;

    const ticketResponse = await fetch(url, {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': `Bearer ${session.user.token}`
        },
    });

    const data = await ticketResponse.json();

    return NextResponse.json(data, { status: ticketResponse.status });
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id: attachmentId } = await params;
    const session = await getServerSession(nextAuthConfig);

    if (!session)
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401, });

    const url = `${BACKEND}/api/attachments/${attachmentId}`;

    const ticketResponse = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${session.user.token}`
        },
    });

    const data = await ticketResponse.json();

    return NextResponse.json(data);
}