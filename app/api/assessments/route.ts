import { NextResponse } from "next/server";
import { Assessment } from "@/app/lib/types";
import { auth } from "@clerk/nextjs/server";
import {
    API_BASE_URL,
    backendUrl,
    getBackendErrorDetails,
    getBackendErrorMessage,
    readResponsePreview,
} from "@/app/lib/server-api";

export async function GET() {
    try {
        const { userId, sessionClaims } = await auth();
        
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const college = (sessionClaims?.metadata as any)?.college || (sessionClaims as any)?.publicMetadata?.college || "ALL";
        const url = backendUrl(`/api/v1/assessments/${userId}?college=${encodeURIComponent(college)}`);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            return NextResponse.json(
                {
                    error: `Backend returned ${response.status}`,
                    upstream: {
                        url,
                        status: response.status,
                        body: await readResponsePreview(response),
                    },
                },
                { status: 502 }
            );
        }

        const assessments: Assessment[] = await response.json();
        return NextResponse.json(assessments);
    } catch (error: any) {
        return NextResponse.json(
            {
                error: getBackendErrorMessage(error, "Failed to load assessments"),
                upstream: {
                    baseUrl: API_BASE_URL,
                    cause: getBackendErrorDetails(error),
                },
            },
            { status: 500 }
        );
    }
}
