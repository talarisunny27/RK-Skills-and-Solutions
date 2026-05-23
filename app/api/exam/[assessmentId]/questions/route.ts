import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { backendUrl, getBackendErrorMessage } from "@/app/lib/server-api";

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
            backendUrl(`/api/v1/exam/${assessmentId}/questions?college=${encodeURIComponent(college)}`),
            { cache: "no-store" }
        );

        if (!response.ok) throw new Error(`Backend returned ${response.status}`);
        return NextResponse.json(await response.json());
    } catch (error: any) {
        const message = getBackendErrorMessage(error, error?.message || "Internal Server Error");
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
