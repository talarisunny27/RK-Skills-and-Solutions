"use client";

import { useEffect, useState } from "react";
import {
    Users,
    ClipboardList,
    FileText,
    TrendingUp,
    ArrowUpRight,
    Clock,
    UserPlus,
    CheckCircle2
} from "lucide-react";

interface AttemptResultDTO {
    id: number;
    title: string;
    date: string;
    submittedAt: string;
    attempt: number;
    accuracy: string;
    score: number;
    rank: number;
}

interface AdminStats {
    totalStudents: number;
    questionsBank: number;
    activeTests: number;
    avgAccuracy: string;
    recentActivity: AttemptResultDTO[];
}

export default function AdminOverview() {
    const [statsData, setStatsData] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/stats")
            .then(res => res.json())
            .then(data => {
                if (data.totalStudents !== undefined) {
                    setStatsData(data);
                } else {
                    console.error("Failed to load admin stats", data);
                }
            })
            .catch(err => console.error("Error fetching stats:", err))
            .finally(() => setLoading(false));
    }, []);

    const stats = [
        {
            label: "Total Students",
            value: statsData?.totalStudents ?? "-",
            icon: Users,
            bg: "bg-gradient-to-br from-blue-400 to-indigo-500",
            trend: "Live"
        },
        {
            label: "Questions Bank",
            value: statsData?.questionsBank ?? "-",
            icon: ClipboardList,
            bg: "bg-gradient-to-br from-emerald-400 to-teal-600",
            trend: "Live"
        },
        {
            label: "Active Tests",
            value: statsData?.activeTests ?? "-",
            icon: FileText,
            bg: "bg-gradient-to-br from-amber-400 to-yellow-500",
            trend: "Live"
        },
        {
            label: "Avg Accuracy",
            value: statsData?.avgAccuracy ?? "-",
            icon: TrendingUp,
            bg: "bg-gradient-to-br from-rose-400 to-rose-600",
            trend: "Global"
        },
    ];

    const recentActivity = statsData?.recentActivity ?? [];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">System Overview</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Real-time engagement and operational metrics</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white shadow-sm text-sm font-medium text-gray-600">
                        <Clock className="w-4 h-4" />
                        Live Updates
                    </div>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                    <div key={stat.label} className={`${stat.bg} rounded-2xl p-5 text-white shadow-md flex flex-col justify-between min-h-[120px] group transition-all hover:scale-[1.02]`}>
                        <div className="flex items-start justify-between">
                            <p className="text-sm font-medium opacity-90">{stat.label}</p>
                            <div className="bg-white/20 rounded-lg p-1.5">
                                <stat.icon className="w-6 h-6 opacity-80" />
                            </div>
                        </div>
                        <div className="flex items-end justify-between mt-2">
                            <div>
                                <p className="text-3xl font-extrabold">{stat.value}</p>
                                <p className="text-xs opacity-80 mt-1">Global stats</p>
                            </div>
                            <span className="flex items-center gap-1 text-white text-[10px] font-bold bg-white/20 px-2 py-1 rounded-lg">
                                {stat.trend}
                                <ArrowUpRight className="w-2.5 h-2.5" />
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Recent Activity Feed */}
                <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                    <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
                        <h2 className="font-bold text-gray-900 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-indigo-600" />
                            Recent Activity
                        </h2>
                        <button className="text-xs text-indigo-600 hover:text-indigo-700 font-bold uppercase tracking-wider">View All</button>
                    </div>
                    <div className="divide-y divide-gray-50 flex-1">
                        {loading ? (
                            <div className="px-6 py-10 text-center flex flex-col items-center gap-3">
                                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                                <p className="text-sm font-medium text-gray-500">Loading activity...</p>
                            </div>
                        ) : recentActivity.length === 0 ? (
                            <div className="px-6 py-10 text-center text-gray-500 text-sm font-medium">
                                No recent activity found.
                            </div>
                        ) : recentActivity.map((item) => (
                            <div key={item.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100 flex-shrink-0">
                                        <span className="text-xs font-bold text-indigo-600">{item.title.charAt(0)}</span>
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-bold text-gray-900 truncate">Test: {item.title}</p>
                                        <p className="text-[11px] text-gray-500 truncate">Submitted on {new Date(item.submittedAt).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="text-right flex-shrink-0">
                                    <p className="text-[10px] text-gray-400 uppercase font-bold text-emerald-600">{item.accuracy} Accuracy</p>
                                    <p className="text-sm font-black text-indigo-600">
                                        {item.score} <span className="text-xs text-gray-400 font-medium">pts</span>
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Status / Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden group shadow-lg">
                        <div className="relative z-10">
                            <h3 className="text-xl font-extrabold tracking-tight">New Assessment?</h3>
                            <p className="text-indigo-100 mt-2 text-sm max-w-[240px] opacity-90 leading-relaxed">Create a new test and assign it to specific colleges with just a few clicks.</p>
                            <button className="mt-6 bg-white text-indigo-600 px-6 py-3 rounded-xl text-sm font-black hover:bg-indigo-50 transition-all shadow-xl hover:scale-105 active:scale-95">
                                Create Now →
                            </button>
                        </div>
                        <FileText className="absolute -bottom-4 -right-4 w-40 h-40 opacity-10 rotate-12 group-hover:scale-110 transition-transform duration-500" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button className="bg-white border border-gray-100 p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all shadow-sm group">
                            <div className="bg-amber-100 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                                <UserPlus className="w-6 h-6 text-amber-600" />
                            </div>
                            <p className="text-sm font-bold text-gray-900">Add Students</p>
                        </button>
                        <button className="bg-white border border-gray-100 p-6 rounded-2xl flex flex-col items-center justify-center text-center gap-3 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all shadow-sm group">
                            <div className="bg-blue-100 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                                <CheckCircle2 className="w-6 h-6 text-blue-600" />
                            </div>
                            <p className="text-sm font-bold text-gray-900">Review Appeals</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
