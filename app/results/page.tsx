"use client";

import { useState, useEffect } from "react";
import PortalShell from "@/app/components/PortalShell";
import {
    Trophy,
    Target,
    Zap,
    History,
    ChevronLeft,
    ArrowUpRight,
    Calendar,
    BarChart3,
    CheckCircle2,
    AlertCircle,
    FileText,
    Medal,
    Star,
} from "lucide-react";
import Link from "next/link";
import { ResultsData, AttemptResult } from "@/app/lib/types";

export default function ResultsPage() {
    const [resultsData, setResultsData] = useState<ResultsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await fetch("/api/results");
                if (!res.ok) throw new Error("Failed to load results");
                const data = await res.json();
                // Backend returns ResultsDataDTO: { stats, achievements, activityFeed }
                setResultsData(data);
            } catch (err: any) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    if (loading) {
        return (
            <PortalShell>
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-medium text-gray-500 animate-pulse">Fetching your results...</p>
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

    const stats = resultsData?.stats;
    const activityFeed: AttemptResult[] = (resultsData?.activityFeed as any) ?? [];
    const achievements = resultsData?.achievements ?? [];

    return (
        <PortalShell>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Performance &amp; Activity</h1>
                        <p className="text-sm text-gray-500 mt-0.5">Track your progress and review past attempts.</p>
                    </div>
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 transition-all self-start sm:self-auto"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back to Dashboard
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-5 shadow-sm">
                        <div className="bg-indigo-50 p-3 rounded-2xl">
                            <Trophy className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Total Score</p>
                            <p className="text-2xl font-black text-gray-900">{stats?.totalScore ?? 0}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-5 shadow-sm">
                        <div className="bg-emerald-50 p-3 rounded-2xl">
                            <Target className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Avg Accuracy</p>
                            <p className="text-2xl font-black text-gray-900">{stats?.avgAccuracy ?? "0%"}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-5 shadow-sm">
                        <div className="bg-amber-50 p-3 rounded-2xl">
                            <Zap className="w-6 h-6 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Tests Taken</p>
                            <p className="text-2xl font-black text-gray-900">{stats?.testsTaken ?? 0}</p>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-5 shadow-sm">
                        <div className="bg-purple-50 p-3 rounded-2xl">
                            <Medal className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Your Rank</p>
                            <p className="text-2xl font-black text-gray-900">{stats?.rank ?? "--"}</p>
                        </div>
                    </div>
                </div>

                {/* Achievements */}
                {achievements.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Star className="w-5 h-5 text-amber-500" />
                            <h2 className="font-bold text-gray-900">Achievements</h2>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {achievements.map((a, i) => (
                                <div
                                    key={i}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl border text-sm font-bold
                                        ${a.status === "Earned"
                                            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                                            : "bg-gray-50 border-gray-200 text-gray-400"}`}
                                >
                                    <CheckCircle2 className={`w-4 h-4 ${a.status === "Earned" ? "text-emerald-500" : "text-gray-300"}`} />
                                    {a.label}
                                    <span className={`text-[10px] font-black uppercase ${a.status === "Earned" ? "text-emerald-500" : "text-gray-300"}`}>
                                        {a.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Recent Activity Table */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <History className="w-5 h-5 text-indigo-600" />
                        <h2 className="font-bold text-gray-900">Recent Activity</h2>
                    </div>
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 text-gray-400 text-[10px] sm:text-xs font-bold uppercase tracking-widest border-b border-gray-100">
                                        <th className="px-6 py-4">Test Title</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">Accuracy</th>
                                        <th className="px-6 py-4">Score</th>
                                        <th className="px-6 py-4">Rank</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {activityFeed.length === 0 ? (
                                        <tr>
                                            <td colSpan={7} className="px-6 py-20 text-center">
                                                <div className="flex flex-col items-center gap-2 text-gray-400">
                                                    <BarChart3 className="w-10 h-10 opacity-20" />
                                                    <p className="text-sm font-medium">No test attempts recorded yet</p>
                                                    <Link href="/assessments" className="text-xs text-indigo-600 font-bold hover:underline mt-2">
                                                        Take your first test
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        activityFeed.map((r) => {
                                            const pct = parseInt(r.accuracy) || 0;
                                            const passed = pct >= 50;
                                            return (
                                                <tr key={r.id} className="hover:bg-gray-50/50 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 flex-shrink-0">
                                                                <FileText className="w-4 h-4" />
                                                            </div>
                                                            <span className="text-sm font-bold text-gray-900">{r.title}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                                            <Calendar className="w-3.5 h-3.5" />
                                                            {r.date}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col gap-1.5 w-24">
                                                            <span className="text-[10px] font-bold text-gray-500">{r.accuracy}</span>
                                                            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full rounded-full ${pct > 80 ? "bg-emerald-500" : "bg-amber-500"}`}
                                                                    style={{ width: r.accuracy }}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-black text-gray-900">{r.score}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="text-sm font-bold text-purple-600">#{r.rank}</span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full border
                                                            ${passed
                                                                ? "text-emerald-600 bg-emerald-50 border-emerald-100"
                                                                : "text-rose-600 bg-rose-50 border-rose-100"}`}>
                                                            <CheckCircle2 className="w-3 h-3" />
                                                            {passed ? "Pass" : "Fail"}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100">
                                                            <ArrowUpRight className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Score Progress + Rank Analysis */}
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-bold text-gray-900">Score Progress</h2>
                            <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1.5 rounded-lg">Recent Tests</span>
                        </div>
                        {activityFeed.length === 0 ? (
                            <div className="h-48 flex items-center justify-center text-gray-300">
                                <div className="text-center">
                                    <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-20" />
                                    <p className="text-sm">Complete tests to see your score trend</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="h-48 flex items-end justify-between gap-2 px-2">
                                    {[...activityFeed].reverse().slice(0, 10).map((r, i, arr) => {
                                        const pct = Math.min(100, Math.max(5, parseInt(r.accuracy) || 0));
                                        const isLast = i === arr.length - 1;
                                        return (
                                            <div key={r.id} className="flex-1 group relative" title={`${r.title}: ${r.score} pts`}>
                                                <div
                                                    className={`w-full rounded-t-lg transition-all cursor-pointer ${isLast ? "bg-indigo-600 shadow-lg shadow-indigo-200" : "bg-indigo-100 hover:bg-indigo-200"}`}
                                                    style={{ height: `${pct}%` }}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="flex justify-between mt-4 px-2">
                                    <span className="text-[10px] font-bold text-gray-400">Previous</span>
                                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">Recent</span>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="bg-indigo-600 rounded-3xl p-6 text-white flex flex-col justify-between shadow-xl shadow-indigo-200 relative overflow-hidden">
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                        <div>
                            <div className="bg-white/20 w-10 h-10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
                                <Medal className="w-5 h-5 text-indigo-100" />
                            </div>
                            <h3 className="text-xl font-bold leading-tight">Rank Analysis</h3>
                            <p className="text-4xl font-black mt-2">{stats?.rank ?? "--"}</p>
                            <p className="text-sm text-indigo-100 mt-3 opacity-80">
                                {stats?.testsTaken ?? 0} tests completed · {stats?.avgAccuracy ?? "0%"} avg accuracy · Best: {stats?.bestScore ?? 0} pts
                            </p>
                        </div>
                        <button className="w-full bg-white text-indigo-600 py-3 rounded-2xl font-bold text-sm mt-8 hover:bg-indigo-50 transition-all shadow-lg active:scale-95">
                            Share ScoreCard
                        </button>
                    </div>
                </div>
            </div>
        </PortalShell>
    );
}
