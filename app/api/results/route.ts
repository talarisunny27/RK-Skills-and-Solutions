import { NextResponse } from "next/server";
import { ResultsData } from "@/app/lib/types";
import { auth } from "@clerk/nextjs/server";
import { API_BASE_URL } from "@/app/lib/api";

export async function GET() {
    try {
        const { userId } = await auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const response = await fetch(`${API_BASE_URL}/api/v1/results/${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Backend returned ${response.status}`);
        }

        const results: ResultsData = await response.json();
        return NextResponse.json(results);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
