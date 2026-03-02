export type CollegeLevel = "KMIT" | "CBIT" | "MGIT" | "ALL";

export interface DashboardStats {
    testsTaken: number;
    avgAccuracy: string;
    totalScore: number;
    rank: string;
    todayRight: number;
    todayWrong: number;
    todayAccuracy: string;
}

export interface Assessment {
    id: number;
    title: string;
    type: "ASSESSMENT" | "PRACTICE";
    date: string;
    duration: number;
    schedule: "Anytime" | string;
    status: Filter;
    image?: string;
    description: string;
    college: CollegeLevel;
}

export interface Question {
    id?: number;
    text: string;
    options: string[];
    correctAnswer: string;
    difficulty: "Easy" | "Medium" | "Hard";
    college: CollegeLevel;
    assessmentId?: number;
}

export interface AttemptResult {
    id: number;
    title: string;
    date: string;
    submittedAt: string;
    attempt: number;
    accuracy: string;
    score: number;
    rank: number;
}

export interface StudentStat {
    userId: string;
    fullName: string;
    email: string;
    college: CollegeLevel;
    testsTaken: number;
    totalScore: number;
    avgAccuracy: string;
    rank: string;
}

export interface ResultsData {
    stats: {
        totalScore: number;
        submittedTests: number;
        avgAccuracy: string;
        bestScore: number;
        rank: string;
        testsTaken: number;
    };
    achievements: Array<{
        label: string;
        status: string;
        color: string;
    }>;
    activityFeed: AttemptResult[];
}
export type Filter = "All" | "Upcoming" | "Not Attempted" | "Attempted";
