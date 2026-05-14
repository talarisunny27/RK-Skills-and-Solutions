import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
<<<<<<< Updated upstream
import { API_BASE_URL } from "@/app/lib/api";
=======
import { buildApiUrl } from "@/app/lib/api";
>>>>>>> Stashed changes

// Admin uploads a question paper (Excel or PDF) for a specific assessment.
// Streams the file directly to the Java backend.
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ assessmentId: string }> }
) {
    try {
        const { assessmentId } = await params;
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const formData = await req.formData();
        const backendResponse = await fetch(
<<<<<<< Updated upstream
            `${API_BASE_URL}/api/v1/exam/${assessmentId}/upload`,
=======
            buildApiUrl(`/api/v1/exam/${assessmentId}/upload`),
>>>>>>> Stashed changes
            {
                method: "POST",
                body: formData, // forward the multipart file as-is
            }
        );

        const data = await backendResponse.json();
        return NextResponse.json(data, { status: backendResponse.status });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
