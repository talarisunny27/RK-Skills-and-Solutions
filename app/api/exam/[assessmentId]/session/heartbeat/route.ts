import { NextResponse, NextRequest } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ assessmentId: string }> }
) {
    try {
        const { assessmentId } = await params;
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { sessionToken } = await req.json();

        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const sessions = { ...(user.privateMetadata as any)?.examSessions } as Record<
            string,
            { token: string; lastHeartbeatAt: number }
        >;

        const existing = sessions[assessmentId];
        if (!existing || existing.token !== sessionToken) {
            return NextResponse.json(
                { error: "Session ended. This exam was started in another tab or device." },
                { status: 409 }
            );
        }

        sessions[assessmentId] = { token: sessionToken, lastHeartbeatAt: Date.now() };
        await client.users.updateUserMetadata(userId, {
            privateMetadata: { ...user.privateMetadata, examSessions: sessions },
        });

        return NextResponse.json({ ok: true });
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
    }
}
