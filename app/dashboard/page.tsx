"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
    CalendarDays,
    Trophy,
    GraduationCap,
    Percent,
    FileText,
    Target,
    AlertCircle,
    ClipboardList,
} from "lucide-react";
import Link from "next/link";
import { DashboardStats } from "@/app/lib/types";
import PortalShell from "@/app/components/PortalShell";

export default function DashboardPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();

    // API Data State
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const todayStr = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/dashboard");
                if (!res.ok) throw new Error("Failed to load dashboard stats");
                const data = await res.json();
                setStats(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (isLoaded && user) {
            fetchStats();
        }
    }, [isLoaded, user]);

    if (!isLoaded || loading) {
        return (
            <PortalShell>
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-medium text-gray-500 animate-pulse">Loading your dashboard...</p>
                </div>
            </PortalShell>
        );
    }

    if (error) {
        return (
            <PortalShell>
                <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <div className="bg-rose-50 p-4 rounded-full">
                        <AlertCircle className="w-8 h-8 text-rose-500" />
                    </div>
                    <p className="text-gray-900 font-bold">Failed to load performance data</p>
                    <p className="text-sm text-gray-500 max-w-xs">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
                    >
                        Try Again
                    </button>
                </div>
            </PortalShell>
        );
    }

    const statCards = [
        {
            label: "Tests Taken",
            sublabel: "Attempts",
            value: stats?.testsTaken?.toString() ?? "0",
            bg: "bg-gradient-to-br from-rose-400 to-rose-600",
            icon: <FileText className="w-6 h-6 opacity-80" />,
        },
        {
            label: "Avg Accuracy",
            sublabel: "All tests",
            value: stats?.avgAccuracy ?? "0.0%",
            bg: "bg-gradient-to-br from-amber-400 to-yellow-500",
            icon: <Percent className="w-6 h-6 opacity-80" />,
        },
        {
            label: "Total Score",
            sublabel: "Points",
            value: stats?.totalScore?.toString() ?? "0",
            bg: "bg-gradient-to-br from-emerald-400 to-teal-600",
            icon: <Trophy className="w-6 h-6 opacity-80" />,
        },
        {
            label: "Rank",
            sublabel: "Leaderboard",
            value: stats?.rank ?? "#-",
            bg: "bg-gradient-to-br from-blue-400 to-indigo-500",
            icon: <GraduationCap className="w-6 h-6 opacity-80" />,
        },
    ];

    return (
        <PortalShell>
            <div className="space-y-8">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                        <p className="text-sm text-gray-500 mt-0.5">Your tests, accuracy, rank and progress</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href="/results" className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 bg-white shadow-sm hover:bg-gray-50 transition-all">
                            <FileText className="w-4 h-4" />
                            Results
                        </Link>
                        <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white shadow-sm text-sm font-medium text-gray-600">
                            <CalendarDays className="w-4 h-4" />
                            {new Date().toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                        </div>
                    </div>
                </div>

                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {statCards.map((card) => (
                        <div
                            key={card.label}
                            className={`${card.bg} rounded-3xl p-6 text-white shadow-lg shadow-indigo-100 flex flex-col justify-between min-h-[140px] transition-transform hover:-translate-y-1`}
                        >
                            <div className="flex items-start justify-between">
                                <p className="text-sm font-bold opacity-90 tracking-wide uppercase">{card.label}</p>
                                <div className="bg-white/20 rounded-xl p-2 backdrop-blur-sm">{card.icon}</div>
                            </div>
                            <div>
                                <p className="text-4xl font-black mt-2 tracking-tighter">{card.value}</p>
                                <p className="text-[10px] opacity-80 mt-1 font-bold uppercase tracking-widest">{card.sublabel}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Today's Performance */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-lg font-black text-gray-900 tracking-tight flex items-center gap-2">
                                <Target className="w-5 h-5 text-indigo-500" />
                                Today&apos;s Performance
                            </h2>
                            <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg uppercase tracking-wider">{todayStr}</span>
                        </div>
                        <div className="space-y-6">
                            <div className="flex items-center justify-between py-4 border-b border-gray-50 group hover:bg-gray-50/50 transition-colors px-2 rounded-xl">
                                <span className="text-sm font-bold text-gray-500">Right answers</span>
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-200" />
                                    <span className="text-base font-black text-gray-900">{stats?.todayRight ?? 0}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-4 border-b border-gray-50 group hover:bg-gray-50/50 transition-colors px-2 rounded-xl">
                                <span className="text-sm font-bold text-gray-500">Wrong answers</span>
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-sm shadow-rose-200" />
                                    <span className="text-base font-black text-gray-900">{stats?.todayWrong ?? 0}</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between py-4 group hover:bg-gray-50/50 transition-colors px-2 rounded-xl">
                                <span className="text-sm font-bold text-gray-500">Session Accuracy</span>
                                <div className="flex items-center gap-3">
                                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-200" />
                                    <span className="text-base font-black text-gray-900">{stats?.todayAccuracy ?? "0%"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Next Test */}
                    <div className="bg-indigo-600 rounded-3xl p-8 text-white flex flex-col justify-between shadow-xl shadow-indigo-200 relative overflow-hidden group">
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                        <div className="absolute top-8 right-8">
                            <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                                <ClipboardList className="w-6 h-6 text-indigo-100" />
                            </div>
                        </div>
                        <div className="relative">
                            <h3 className="text-2xl font-black leading-tight tracking-tight">Ready for your<br />next challenge?</h3>
                            <p className="text-sm text-indigo-100 mt-4 opacity-80 max-w-[200px]">New assessments available based on your college curriculum.</p>
                        </div>
                        <Link
                            href="/assessments"
                            className="w-full bg-white text-indigo-600 py-4 rounded-2xl font-black text-sm mt-12 hover:bg-indigo-50 transition-all shadow-lg active:scale-95 text-center block"
                        >
                            VIEW ASSESSMENTS
                        </Link>
                    </div>
                </div>
            </div>
        </PortalShell>
    );
}
