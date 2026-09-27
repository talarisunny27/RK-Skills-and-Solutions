import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";

const STALE_AFTER_MS = 20_000;

export async function POST(
    _req: Request,
    { params }: { params: Promise<{ assessmentId: string }> }
) {
    try {
        const { assessmentId } = await params;
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const sessions = { ...(user.privateMetadata as any)?.examSessions } as Record<
            string,
            { token: string; lastHeartbeatAt: number }
        >;

        const now = Date.now();
        const existing = sessions[assessmentId];
        if (existing && now - existing.lastHeartbeatAt < STALE_AFTER_MS) {
            return NextResponse.json(
                { error: "This exam is already in progress in another browser tab or device." },
                { status: 409 }
            );
        }

        const sessionToken = crypto.randomUUID();
        sessions[assessmentId] = { token: sessionToken, lastHeartbeatAt: now };

        await client.users.updateUserMetadata(userId, {
            privateMetadata: { ...user.privateMetadata, examSessions: sessions },
        });

        return NextResponse.json({ sessionToken });
    } catch (error: any) {
        return NextResponse.json({ error: error?.message || "Internal Server Error" }, { status: 500 });
    }
}
