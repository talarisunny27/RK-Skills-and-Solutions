import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { Question, CollegeLevel } from "@/app/lib/types";

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

const MOCK_QUESTIONS: Question[] = [
    {
        id: 1,
        text: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: "Paris",
        difficulty: "Easy",
        college: "ALL"
    },
    {
        id: 2,
        text: "Which programming language is known as the language of the web?",
        options: ["Python", "Java", "JavaScript", "C++"],
        correctAnswer: "JavaScript",
        difficulty: "Medium",
        college: "KMIT"
    },
    {
        id: 3,
        text: "What does CSS stand for?",
        options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
        correctAnswer: "Cascading Style Sheets",
        difficulty: "Easy",
        college: "CBIT"
    }
];

export async function GET(request: Request) {
    try {
        await checkAdmin();
        const { searchParams } = new URL(request.url);
        const collegeLevel = searchParams.get("collegeLevel") as CollegeLevel | null;

        let questions = MOCK_QUESTIONS;
        if (collegeLevel && collegeLevel !== "ALL") {
            questions = MOCK_QUESTIONS.filter(q => q.college === collegeLevel || q.college === "ALL");
        }

        return NextResponse.json(questions);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.message.includes("Unauthorized") ? 403 : 500 });
    }
}

export async function POST(request: Request) {
    try {
        await checkAdmin();
        const body = await request.json();
        // Simulate saving
        const newQuestion = { ...body, id: Date.now() };
        return NextResponse.json(newQuestion);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.message.includes("Unauthorized") ? 403 : 500 });
    }
}
