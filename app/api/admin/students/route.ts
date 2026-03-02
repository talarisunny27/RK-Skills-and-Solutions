import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { StudentStat } from "@/app/lib/types";

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

const MOCK_STUDENTS: StudentStat[] = [
    {
        userId: "user_1",
        fullName: "John Doe",
        email: "john@example.com",
        college: "KMIT",
        testsTaken: 12,
        totalScore: 1150,
        avgAccuracy: "88%",
        rank: "15/500"
    },
    {
        userId: "user_2",
        fullName: "Jane Smith",
        email: "jane@example.com",
        college: "CBIT",
        testsTaken: 8,
        totalScore: 780,
        avgAccuracy: "75%",
        rank: "112/500"
    },
    {
        userId: "user_3",
        fullName: "Robert Johnson",
        email: "robert@example.com",
        college: "MGIT",
        testsTaken: 15,
        totalScore: 1420,
        avgAccuracy: "94%",
        rank: "2/500"
    }
];

export async function GET() {
    try {
        await checkAdmin();
        return NextResponse.json(MOCK_STUDENTS);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: error.message.includes("Unauthorized") ? 403 : 500 });
    }
}
