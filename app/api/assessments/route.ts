import { NextResponse } from "next/server";
import { Assessment } from "@/app/lib/types";
import { auth } from "@clerk/nextjs/server";
import { backendUrl, getBackendErrorMessage } from "@/app/lib/server-api";

export async function GET() {
    try {
        const { userId, sessionClaims } = await auth();
        
        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const college = (sessionClaims?.metadata as any)?.college || (sessionClaims as any)?.publicMetadata?.college || "ALL";

        const response = await fetch(backendUrl(`/api/v1/assessments/${userId}?college=${encodeURIComponent(college)}`), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Backend returned ${response.status}`);
        }

        const assessments: Assessment[] = await response.json();
        return NextResponse.json(assessments);
    } catch (error: any) {
        return NextResponse.json(
            { error: getBackendErrorMessage(error, "Failed to load assessments") },
            { status: 500 }
        );
    }
}
