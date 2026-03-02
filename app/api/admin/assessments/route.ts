import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Assessment } from "@/app/lib/types";

async function checkAdmin() {
    const { sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as any)?.role || (sessionClaims as any)?.publicMetadata?.role;

    // Temporarily allowing access for debugging if role is not found
    if (!role && process.env.NODE_ENV === "development") {
        console.log("Admin check bypassed in development");
        return;
    }

    if (role !== "admin") {
        throw new Error("Unauthorized: Admin access required");
    }
}

const MOCK_ASSESSMENTS: Assessment[] = [
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
        id: 3,
        title: "Python Programming Basics",
        type: "ASSESSMENT",
        date: "2026-03-12",
        duration: 60,
        schedule: "02:00 PM - 03:00 PM",
        status: "Upcoming",
        description: "Introduction to Python syntax and data structures.",
        college: "CBIT"
    }
];

export async function GET() {
    try {
        await checkAdmin();
        return NextResponse.json(MOCK_ASSESSMENTS);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.message.includes("Unauthorized") ? 403 : 500 });
    }
}

export async function POST(request: Request) {
    try {
        await checkAdmin();
        const body = await request.json();
        const newAssessment = { ...body, id: Date.now() };
        return NextResponse.json(newAssessment);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.message.includes("Unauthorized") ? 403 : 500 });
    }
}
