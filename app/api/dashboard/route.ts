import { NextResponse } from "next/server";
import { DashboardStats } from "@/app/lib/types";
import { auth, currentUser } from "@clerk/nextjs/server";

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Sync user details to DB on every dashboard visit (idempotent upsert)
        try {
            const user = await currentUser();
            if (user) {
                const email = user.emailAddresses[0]?.emailAddress ?? "";
                const name = user.fullName ?? user.firstName ?? "Unknown";

                const college = (user.publicMetadata?.college as string) || "TKR College";

                await fetch("http://localhost:8080/api/v1/users/sync", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: userId, email, name, college }),
                });
            }
        } catch (syncError) {
            // Non-fatal: log and continue so dashboard still loads
            console.error("[dashboard] Failed to sync user:", syncError);
        }

        const response = await fetch(
            `http://localhost:8080/api/v1/dashboard/${userId}`,
            {
                method: "GET",
                headers: { "Content-Type": "application/json" },
                cache: "no-store",
            }
        );

        if (!response.ok) {
            throw new Error(`Backend returned ${response.status}`);
        }

        const stats: DashboardStats = await response.json();
        return NextResponse.json(stats);
    } catch (error: any) {
        console.error("[dashboard] Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
