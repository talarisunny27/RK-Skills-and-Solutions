import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
<<<<<<< Updated upstream
import { API_BASE_URL } from "@/app/lib/api";
=======
import { buildApiUrl } from "@/app/lib/api";
>>>>>>> Stashed changes

export async function GET() {
    try {
        const { sessionClaims } = await auth();
        const role = (sessionClaims?.metadata as any)?.role || (sessionClaims as any)?.publicMetadata?.role;

        if (!role && process.env.NODE_ENV !== "development") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }
        if (role !== "admin" && process.env.NODE_ENV !== "development") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

<<<<<<< Updated upstream
        const res = await fetch(`${API_BASE_URL}/api/v1/users/admin/all`, {
=======
        const res = await fetch(buildApiUrl("/api/v1/users/admin/all"), {
>>>>>>> Stashed changes
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch students: ${res.status}`);
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Error in /api/admin/students:", error);
        return NextResponse.json({ error: "Failed to fetch students data" }, { status: 500 });
    }
}
