import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { backendUrl, getBackendErrorMessage } from "../../lib/server-api";

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

export async function GET() {
    try {
        await checkAdmin();
        const res = await fetch(backendUrl(`/api/v1/assessments/admin/all`), {
            cache: "no-store",
        });
        if (!res.ok) throw new Error(`Backend returned ${res.status}`);
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: error.message.includes("Unauthorized") ? 403 : 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        await checkAdmin();
        const body = await request.json();
        const res = await fetch(backendUrl(`/api/v1/assessments/admin`), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(`Backend POST failed: ${res.status}`);
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        const message = getBackendErrorMessage(error, error?.message || "Internal Server Error");
        return NextResponse.json({ error: message }, { status: message.includes("Unauthorized") ? 403 : 500 });
    }
}
