import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { backendUrl, getBackendErrorMessage } from "@/app/lib/server-api";

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const response = await fetch(backendUrl(`/api/v1/leaderboard`), {
            cache: "no-store",
        });

        if (!response.ok) {
            throw new Error(`Backend leaderboard fetch failed: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Leaderboard proxy error:", error);
        const message = getBackendErrorMessage(error, error?.message || "Internal Server Error");
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
