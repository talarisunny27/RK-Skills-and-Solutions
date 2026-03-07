import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { API_BASE_URL } from "@/app/lib/api";

async function checkAdmin() {
    const { sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as any)?.role || (sessionClaims as any)?.publicMetadata?.role;

    if (!role && process.env.NODE_ENV === "development") {
        return; // Bypass in dev if no role
    }
    if (role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await checkAdmin();
        const id = (await params).id;
        const body = await request.json();

        const res = await fetch(`${API_BASE_URL}/api/v1/assessments/admin/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (!res.ok) throw new Error(`Backend PUT failed: ${res.status}`);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: error.message.includes("Unauthorized") ? 403 : 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await checkAdmin();
        const id = (await params).id;

        const res = await fetch(`${API_BASE_URL}/api/v1/assessments/admin/${id}`, {
            method: "DELETE",
        });

        if (!res.ok) throw new Error(`Backend DELETE failed: ${res.status}`);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: error.message.includes("Unauthorized") ? 403 : 500 }
        );
    }
}
