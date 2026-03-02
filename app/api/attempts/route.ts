import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const body = await request.json();

        // Simulate a successful submission
        return NextResponse.json({
            success: true,
            message: "Attempt submitted successfully",
            attemptId: Date.now()
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
