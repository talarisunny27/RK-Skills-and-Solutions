import { NextResponse } from "next/server";
import { Assessment } from "@/app/lib/types";
import { auth } from "@clerk/nextjs/server";
<<<<<<< Updated upstream
import { API_BASE_URL } from "@/app/lib/api";
=======
import { buildApiUrl } from "@/app/lib/api";
>>>>>>> Stashed changes

export async function GET() {
    try {
        const { userId, sessionClaims } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const college = (sessionClaims?.metadata as any)?.college || (sessionClaims as any)?.publicMetadata?.college || "ALL";

<<<<<<< Updated upstream
        const response = await fetch(`${API_BASE_URL}/api/v1/assessments/${userId}?college=${encodeURIComponent(college)}`, {
=======
        const response = await fetch(buildApiUrl(`/api/v1/assessments/${userId}?college=${encodeURIComponent(college)}`), {
>>>>>>> Stashed changes
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
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
