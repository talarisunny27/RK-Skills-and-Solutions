"use client";

import { useUser } from "@clerk/nextjs";
import PortalShell from "@/app/components/PortalShell";
import {
    ClipboardList,
    LayoutDashboard,
    Trophy,
    Target,
    TrendingUp,
    CalendarDays,
    Clock,
    Play,
    CheckCircle2,
} from "lucide-react";
import Link from "next/link";

// ── Static placeholder data ────────────────────────────────────────────────
const stats = {
    totalScore: 3,
    submittedTests: 1,
    avgAccuracy: "30.0%",
    bestScore: 3,
    rank: "#2",
    testsTaken: 1,
};

const achievements = [
    { label: "Overall level", status: "Needs Focus", color: "bg-rose-500" },
    { label: "Consistency", status: "Start building", color: "bg-blue-400" },
    { label: "Best moment", status: "3", color: "bg-emerald-500" },
    { label: "Last attempt", status: "#19", color: "bg-amber-400" },
];

const activityFeed = [
    {
        id: 1,
        title: "Day 1 CRT",
        date: "2026-01-11",
        submittedAt: "2026-01-21 13:45:16",
        attempt: 19,
        accuracy: "30.0%",
        score: 3,
        rank: 3,
    },
];

export default function ResultsPage() {
    const { user, isLoaded } = useUser();

    const today = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });

    if (!isLoaded) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <PortalShell>
            <div className="space-y-5">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Results</h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            A &quot;profile + activity feed&quot; view of your performance
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 transition-all"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                        </Link>
                        <Link
                            href="/assessments"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 transition-all"
                        >
                            <Play className="w-4 h-4" />
                            Take Test
                        </Link>
                    </div>
                </div>

                {/* Two-Panel Layout */}
                <div className="grid lg:grid-cols-[340px_1fr] gap-5 items-start">

                    {/* ── LEFT: Student Profile Panel ────────────────────────────── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        {/* Student header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
                            <span className="font-bold text-gray-800">Student</span>
                            <span className="text-xs text-gray-400">{today}</span>
                        </div>

                        <div className="p-5 space-y-4">
                            {/* User info */}
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                                    {user?.imageUrl ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img
                                            src={user.imageUrl}
                                            alt="avatar"
                                            className="w-10 h-10 rounded-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-indigo-600 font-bold text-lg">
                                            {user?.firstName?.charAt(0) ?? "U"}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <p className="font-semibold text-gray-800 text-sm">
                                        {user?.fullName ?? user?.username ?? "Student"}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {user?.primaryEmailAddress?.emailAddress}
                                    </p>
                                </div>
                            </div>

                            {/* Total Score card */}
                            <div className="rounded-xl bg-gradient-to-br from-blue-400 to-blue-600 text-white p-5">
                                <p className="text-sm font-medium opacity-90">Total Score</p>
                                <p className="text-5xl font-extrabold mt-2">{stats.totalScore}</p>
                                <p className="text-xs opacity-80 mt-2">
                                    From {stats.submittedTests} submitted test{stats.submittedTests !== 1 ? "s" : ""}
                                </p>
                            </div>

                            {/* Stat grid */}
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { label: "Average accuracy", value: stats.avgAccuracy },
                                    { label: "Best score", value: stats.bestScore },
                                    { label: "Rank", value: stats.rank },
                                    { label: "Tests taken", value: stats.testsTaken },
                                ].map(({ label, value }) => (
                                    <div key={label} className="rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                                        <p className="text-xs text-gray-400 mb-1">{label}</p>
                                        <p className="text-lg font-bold text-gray-800">{value}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Achievements */}
                            <div className="rounded-xl border border-gray-100 bg-gray-50 overflow-hidden">
                                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                    <span className="text-sm font-bold text-gray-800">Achievements</span>
                                    <span className="text-xs text-gray-400">Status</span>
                                </div>
                                {achievements.map(({ label, status, color }) => (
                                    <div
                                        key={label}
                                        className="flex items-center justify-between px-4 py-3 border-b last:border-0 border-gray-100 bg-white"
                                    >
                                        <span className="text-sm text-gray-600">{label}</span>
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-2.5 h-2.5 rounded-full ${color}`} />
                                            <span className="text-sm font-medium text-gray-700">{status}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT: Activity Feed ───────────────────────────────────── */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
                            <span className="font-bold text-gray-800">Activity Feed</span>
                            <span className="text-xs text-gray-400">Attempts timeline</span>
                        </div>

                        <div className="divide-y divide-gray-50">
                            {activityFeed.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                                    <ClipboardList className="w-10 h-10 opacity-30" />
                                    <p className="text-sm font-medium">No attempts yet</p>
                                    <p className="text-xs">Complete a test to see your activity here.</p>
                                </div>
                            ) : (
                                activityFeed.map((item) => (
                                    <div key={item.id} className="px-6 py-5">
                                        <div className="flex items-start justify-between gap-4">
                                            {/* Timeline dot */}
                                            <div className="mt-1 w-3 h-3 rounded-full bg-blue-400 flex-shrink-0" />

                                            <div className="flex-1 min-w-0 space-y-3">
                                                {/* Title row */}
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <p className="font-bold text-gray-900">{item.title}</p>
                                                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-gray-400">
                                                            <span className="flex items-center gap-1">
                                                                <CalendarDays className="w-3 h-3" />
                                                                {item.date}
                                                            </span>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="w-3 h-3" />
                                                                {item.submittedAt}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-gray-400 mt-0.5">Attempt #{item.attempt}</p>
                                                    </div>
                                                    <div className="flex items-center gap-1 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1 flex-shrink-0">
                                                        <Trophy className="w-3.5 h-3.5 text-gray-500" />
                                                        <span className="text-sm font-bold text-gray-700">{item.rank}</span>
                                                    </div>
                                                </div>

                                                {/* Stats chips */}
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-100 bg-gray-50 text-sm">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                                        <span className="font-semibold text-gray-700">{item.accuracy}</span>
                                                        <span className="text-gray-400">Accuracy</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-100 bg-gray-50 text-sm">
                                                        <TrendingUp className="w-3.5 h-3.5 text-gray-500" />
                                                        <span className="text-gray-400">Score</span>
                                                        <span className="font-semibold text-gray-700">{item.score}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </PortalShell>
    );
}
