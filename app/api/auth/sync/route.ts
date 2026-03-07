import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { email, name, college } = body;

        const backendResponse = await fetch("http://localhost:8080/api/v1/users/sync", {
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
