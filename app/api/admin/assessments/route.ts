import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
<<<<<<< Updated upstream
import { API_BASE_URL } from "@/app/lib/api";
=======
import { buildApiUrl } from "@/app/lib/api";
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
        const res = await fetch(`${API_BASE_URL}/api/v1/assessments/admin/all`, {
=======
        const res = await fetch(buildApiUrl("/api/v1/assessments/admin/all"), {
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
        const res = await fetch(`${API_BASE_URL}/api/v1/assessments/admin`, {
=======
        const res = await fetch(buildApiUrl("/api/v1/assessments/admin"), {
>>>>>>> Stashed changes
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(`Backend POST failed: ${res.status}`);
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: error.message.includes("Unauthorized") ? 403 : 500 }
        );
    }
}
