import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {
    API_BASE_URL,
    backendUrl,
    getBackendErrorDetails,
    getBackendErrorMessage,
    readResponsePreview,
} from "@/app/lib/server-api";

export async function POST(req: NextRequest) {
    try {
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();
        const { email, name, college } = body;
        const url = backendUrl("/api/v1/users/sync");

        const backendResponse = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: userId, email, name, college }),
        });

        if (!backendResponse.ok) {
            return NextResponse.json(
                {
                    error: `Backend sync failed: ${backendResponse.status}`,
                    upstream: {
                        url,
                        status: backendResponse.status,
                        body: await readResponsePreview(backendResponse),
                    },
                },
                { status: 502 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error: any) {
        const message = getBackendErrorMessage(error, "Failed to sync user");
        const details = getBackendErrorDetails(error);

        if (details?.code === "ECONNREFUSED") {
            console.warn("User sync skipped because backend is unavailable:", error);
            return NextResponse.json({
                success: true,
                synced: false,
                warning: message,
            });
        }

        console.error("User sync error:", error);
        return NextResponse.json(
            {
                error: message,
                upstream: {
                    baseUrl: API_BASE_URL,
                    cause: details,
                },
            },
            { status: 500 }
        );
    }
}
