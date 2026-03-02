import { NextResponse } from "next/server";
import { DashboardStats } from "@/app/lib/types";

export async function GET() {
    try {
        const stats: DashboardStats = {
            testsTaken: 25,
            avgAccuracy: "82%",
            totalScore: 2450,
            rank: "78/1200",
            todayRight: 12,
            todayWrong: 3,
            todayAccuracy: "80%"
        };
        return NextResponse.json(stats);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
