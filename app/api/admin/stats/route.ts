import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

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

        const res = await fetch("http://localhost:8080/api/v1/dashboard/admin", {
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch admin stats: ${res.status}`);
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Error in /api/admin/stats:", error);
        return NextResponse.json({ error: "Failed to fetch admin stats" }, { status: 500 });
    }
}
