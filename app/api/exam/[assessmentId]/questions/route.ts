import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
<<<<<<< Updated upstream
import { API_BASE_URL } from "@/app/lib/api";
=======
import { buildApiUrl } from "@/app/lib/api";
>>>>>>> Stashed changes

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ assessmentId: string }> }
) {
    try {
        const { assessmentId } = await params;
        const { userId, sessionClaims } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const college = (sessionClaims?.metadata as any)?.college || (sessionClaims as any)?.publicMetadata?.college || "ALL";

        const response = await fetch(
<<<<<<< Updated upstream
            `${API_BASE_URL}/api/v1/exam/${assessmentId}/questions?college=${encodeURIComponent(college)}`,
=======
            buildApiUrl(`/api/v1/exam/${assessmentId}/questions?college=${encodeURIComponent(college)}`),
>>>>>>> Stashed changes
            { cache: "no-store" }
        );

        if (!response.ok) throw new Error(`Backend returned ${response.status}`);
        return NextResponse.json(await response.json());
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
