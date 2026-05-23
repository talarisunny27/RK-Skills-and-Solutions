import { NextResponse } from "next/server";
import { DashboardStats } from "@/app/lib/types";
import { auth, currentUser } from "@clerk/nextjs/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

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

                await fetch(`${API_BASE_URL}/api/v1/users/sync`, {
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
            `${API_BASE_URL}/api/v1/dashboard/${userId}`,
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
        const message =
            error?.cause?.code === "ECONNREFUSED"
                ? `Backend unavailable at ${API_BASE_URL}`
                : error?.message || "Unknown dashboard error";

        console.error("[dashboard] Error:", error);
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
