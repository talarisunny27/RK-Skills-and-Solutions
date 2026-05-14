import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
<<<<<<< Updated upstream
import { API_BASE_URL } from "@/app/lib/api";
=======
import { buildApiUrl } from "@/app/lib/api";
>>>>>>> Stashed changes

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { email, name, college } = body;

<<<<<<< Updated upstream
        const backendResponse = await fetch(`${API_BASE_URL}/api/v1/users/sync`, {
=======
        const backendResponse = await fetch(buildApiUrl("/api/v1/users/sync"), {
>>>>>>> Stashed changes
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: userId, email, name, college }),
        });

        if (!backendResponse.ok) {
            throw new Error(`Backend sync failed: ${backendResponse.status}`);
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("User sync error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
