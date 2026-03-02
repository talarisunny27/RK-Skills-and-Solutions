import { NextResponse } from "next/server";
import { Assessment } from "@/app/lib/types";

export async function GET() {
    try {
        const assessments: Assessment[] = [
            {
                id: 1,
                title: "Full Stack Development Assessment",
                type: "ASSESSMENT",
                date: "2026-03-10",
                duration: 90,
                schedule: "10:00 AM - 11:30 AM",
                status: "Upcoming",
                description: "A comprehensive assessment covering React, Node.js, and Database design.",
                college: "ALL"
            },
            {
                id: 2,
                title: "Mock Interview Practice",
                type: "PRACTICE",
                date: "2026-03-05",
                duration: 45,
                schedule: "Anytime",
                status: "Not Attempted",
                description: "Practice your interview skills with common technical questions.",
                college: "KMIT"
            },
            {
                id: 4,
                title: "JavaScript Advanced Concepts",
                type: "ASSESSMENT",
                date: "2026-03-08",
                duration: 60,
                schedule: "09:00 AM - 10:00 AM",
                status: "Attempted",
                description: "Advanced JavaScript topics including Closures, Promises, and Prototypes.",
                college: "CBIT"
            }
        ];
        return NextResponse.json(assessments);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
