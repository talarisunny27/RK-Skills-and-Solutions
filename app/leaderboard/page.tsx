"use client";

import { useState, useEffect } from "react";
import PortalShell from "@/app/components/PortalShell";
import {
    Trophy,
    Medal,
    Search,
    ChevronUp,
    ChevronDown,
    Activity,
    Target,
    Award,
    School,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface LeaderboardEntry {
    rank: number;
    name: string;
    college: string;
    totalTests: number;
    avgAccuracy: string;
    totalScore: number;
}

export default function LeaderboardPage() {
    const { user } = useUser();
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch("/api/leaderboard");
                const data = await res.json();
                setLeaderboard(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to fetch leaderboard:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboard();
    }, []);

    const filtered = leaderboard.filter(entry =>
        entry.name.toLowerCase().includes(search.toLowerCase()) ||
        entry.college.toLowerCase().includes(search.toLowerCase())
    );

    const topThree = filtered.slice(0, 3);
    const rest = filtered.slice(3);

    const Podium = ({ entry, rank }: { entry: LeaderboardEntry; rank: number }) => {
        const colors = [
            "from-yellow-400 to-yellow-600 shadow-yellow-200",
            "from-slate-300 to-slate-500 shadow-slate-200",
            "from-amber-600 to-amber-800 shadow-amber-200",
        ];
        const iconClasses = [
            "text-yellow-500 bg-yellow-50",
            "text-slate-500 bg-slate-50",
            "text-amber-700 bg-amber-50",
        ];

        return (
            <div className={`flex flex-col items-center gap-3 p-6 rounded-3xl bg-white border border-gray-100 shadow-xl transition-all hover:-translate-y-1 relative
                ${rank === 1 ? 'scale-110 z-10' : 'scale-95 opacity-90'}`}>
                {rank === 1 && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-500 text-white p-2 rounded-full shadow-lg">
                        <Trophy className="w-6 h-6" />
                    </div>
                )}
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${colors[rank - 1]} flex items-center justify-center text-white text-2xl font-black shadow-lg`}>
                    {entry.name.charAt(0)}
                </div>
                <div className="text-center">
                    <p className="font-bold text-gray-900 truncate max-w-[120px]">{entry.name}</p>
                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{entry.college}</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                    <p className="text-2xl font-black text-indigo-600">{entry.totalScore}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Points</p>
                </div>
                <div className={`px-4 py-1.5 rounded-xl text-xs font-black shadow-inner flex items-center gap-2 ${iconClasses[rank - 1]}`}>
                    <Medal className="w-3 h-3" />
                    Rank #{rank}
                </div>
            </div>
        );
    };

    return (
        <PortalShell>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                            <Trophy className="w-8 h-8 text-yellow-500" />
                            Global Leaderboard
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">Recognizing excellence across all assessment partners</p>
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Find student or college..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-11 pr-6 py-3 bg-white border border-gray-200 rounded-2xl w-full md:w-80 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm text-gray-700"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="h-96 flex flex-col items-center justify-center gap-4">
                        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-gray-500 font-medium italic animate-pulse">Calculating rankings...</p>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="h-96 flex flex-col items-center justify-center text-center gap-4 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                        <Award className="w-16 h-16 text-gray-200" />
                        <div>
                            <p className="text-lg font-bold text-gray-900">No Champions Found</p>
                            <p className="text-sm text-gray-400">Try searching with a different keyword</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Podium Display */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 max-w-4xl mx-auto py-8">
                            {topThree[1] && <div className="mt-8 order-2 md:order-1"><Podium entry={topThree[1]} rank={2} /></div>}
                            {topThree[0] && <div className="order-1 md:order-2"><Podium entry={topThree[0]} rank={1} /></div>}
                            {topThree[2] && <div className="mt-8 order-3 md:order-3"><Podium entry={topThree[2]} rank={3} /></div>}
                        </div>

                        {/* Detailed Rankings Table */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-widest border-b border-gray-100">
                                            <th className="px-8 py-5">Rank</th>
                                            <th className="px-8 py-5">Champion</th>
                                            <th className="px-8 py-5">Performance</th>
                                            <th className="px-8 py-5 text-right">Total Score</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {rest.map((entry) => {
                                            const isMe = entry.name === user?.fullName;
                                            return (
                                                <tr key={entry.rank} className={`group transition-colors hover:bg-indigo-50/30 ${isMe ? 'bg-indigo-50/50' : ''}`}>
                                                    <td className="px-8 py-6">
                                                        <span className="text-lg font-black text-gray-300 group-hover:text-indigo-200 transition-colors">#{entry.rank}</span>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-bold text-gray-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                                                                {entry.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                                                    {entry.name}
                                                                    {isMe && <span className="bg-indigo-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-md uppercase">ME</span>}
                                                                </p>
                                                                <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
                                                                    <School className="w-3 h-3" />
                                                                    {entry.college}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <div className="flex items-center gap-6">
                                                            <div className="space-y-0.5">
                                                                <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                                                                    <Activity className="w-3.5 h-3.5 text-indigo-500" />
                                                                    {entry.totalTests}
                                                                </p>
                                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Attempts</p>
                                                            </div>
                                                            <div className="space-y-0.5">
                                                                <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                                                                    <Target className="w-3.5 h-3.5 text-emerald-500" />
                                                                    {entry.avgAccuracy}
                                                                </p>
                                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Accuracy</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6 text-right">
                                                        <div className="inline-flex flex-col items-end gap-1">
                                                            <p className="text-lg font-black text-indigo-600 group-hover:scale-110 transition-transform origin-right">{entry.totalScore}</p>
                                                            <div className="flex items-center gap-1 text-[8px] text-emerald-600 font-black bg-emerald-50 px-1.5 py-0.5 rounded-md">
                                                                <ChevronUp className="w-2 h-2" />
                                                                TOP LIST
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </PortalShell>
    );
}
