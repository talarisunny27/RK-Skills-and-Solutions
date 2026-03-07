import { NextResponse, NextRequest } from "next/server";
import { auth, clerkClient, currentUser } from "@clerk/nextjs/server";
import { API_BASE_URL } from "@/app/lib/api";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const { college } = await req.json();
        if (!college || typeof college !== "string" || college.trim().length === 0) {
            return NextResponse.json({ error: "College name is required" }, { status: 400 });
        }

        const collegeName = college.trim();

        // 1. Save to Clerk publicMetadata so it persists for this user
        const client = await clerkClient();
        await client.users.updateUserMetadata(userId, {
            publicMetadata: { college: collegeName },
        });

        // 2. Sync the updated college to our Java DB
        const user = await currentUser();
        if (user) {
            const email = user.emailAddresses[0]?.emailAddress ?? "";
            const name = user.fullName ?? user.firstName ?? "Unknown";
            await fetch(`${API_BASE_URL}/api/v1/users/sync`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: userId, email, name, college: collegeName }),
            });
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("[update-college] Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
