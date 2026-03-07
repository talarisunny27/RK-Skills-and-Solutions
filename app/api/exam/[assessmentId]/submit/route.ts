import { NextResponse, NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ assessmentId: string }> }
) {
    try {
        const { assessmentId } = await params;
        const { userId } = await auth();
        if (!userId) return new NextResponse("Unauthorized", { status: 401 });

        const body = await req.json();

        const response = await fetch(
            `http://localhost:8080/api/v1/exam/${assessmentId}/submit`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...body, userId }),
            }
        );

        if (!response.ok) throw new Error(`Backend returned ${response.status}`);
        return NextResponse.json(await response.json());
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
