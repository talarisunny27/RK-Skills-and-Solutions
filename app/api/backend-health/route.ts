import { NextResponse } from "next/server";
import {
    API_BASE_URL,
    backendUrl,
    getBackendErrorDetails,
    getBackendErrorMessage,
    readResponsePreview,
} from "@/app/lib/server-api";

export async function GET() {
    const url = backendUrl("/api/v1/leaderboard");

    try {
        const response = await fetch(url, {
            cache: "no-store",
        });

        const body = await readResponsePreview(response);

        return NextResponse.json(
            {
                ok: response.ok,
                baseUrl: API_BASE_URL,
                url,
                status: response.status,
                body,
            },
            { status: response.ok ? 200 : 502 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                ok: false,
                baseUrl: API_BASE_URL,
                url,
                error: getBackendErrorMessage(error, "Backend health check failed"),
                cause: getBackendErrorDetails(error),
            },
            { status: 500 }
        );
    }
}
