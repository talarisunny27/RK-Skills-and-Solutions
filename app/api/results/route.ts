import { NextResponse } from "next/server";
import { ResultsData } from "@/app/lib/types";

export async function GET() {
    try {
        const results: ResultsData = {
            stats: {
                totalScore: 4500,
                submittedTests: 12,
                avgAccuracy: "85%",
                bestScore: 98,
                rank: "45/1500",
                testsTaken: 15
            },
            achievements: [
                { label: "Top 10%", status: "Earned", color: "bg-yellow-500" },
                { label: "Consistent Learner", status: "Earned", color: "bg-green-500" },
                { label: "Speed Demon", status: "In Progress", color: "bg-blue-500" }
            ],
            activityFeed: [
                {
                    id: 1,
                    title: "JavaScript Basics",
                    date: "2026-02-28",
                    submittedAt: "2026-02-28T14:30:00Z",
                    attempt: 1,
                    accuracy: "90%",
                    score: 90,
                    rank: 12
                },
                {
                    id: 2,
                    title: "React Fundamentals",
                    date: "2026-03-01",
                    submittedAt: "2026-03-01T10:15:00Z",
                    attempt: 1,
                    accuracy: "85%",
                    score: 85,
                    rank: 24
                }
            ]
        };
        return NextResponse.json(results);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
