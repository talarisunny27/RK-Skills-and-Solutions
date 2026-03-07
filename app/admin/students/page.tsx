"use client";

import { useState, useEffect } from "react";
import {
    Search,
    Filter,
    Download,
    User,
    Briefcase,
    ChevronRight,
    SearchX,
} from "lucide-react";
import { CollegeLevel, StudentStat } from "@/app/lib/types";

const colleges: CollegeLevel[] = ["KMIT", "CBIT", "MGIT", "ALL"];

export default function AdminStudents() {
    const [students, setStudents] = useState<StudentStat[]>([]);
    const [selectedCollege, setSelectedCollege] = useState<CollegeLevel>("ALL");
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/admin/students")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setStudents(data);
                } else {
                    console.error("Failed to fetch admin students", data);
                }
            })
            .catch(err => console.error("Error fetching admin students:", err))
            .finally(() => setLoading(false));
    }, []);

    const filteredStudents = students.filter(s => {
        const matchesCollege = selectedCollege === "ALL" || s.college === selectedCollege;
        const matchesSearch =
            s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.email.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCollege && matchesSearch;
    });

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Student Performance</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Monitor progress and rankings across all colleges.</p>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 bg-white text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm">
                    <Download className="w-5 h-5" />
                    Export CSV
                </button>
            </div>

            {/* Filters */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <select
                        className="bg-transparent text-sm text-gray-700 focus:outline-none w-full cursor-pointer"
                        value={selectedCollege}
                        onChange={(e) => setSelectedCollege(e.target.value as CollegeLevel)}
                    >
                        {colleges.map(c => (
                            <option key={c} value={c}>{c === "ALL" ? "All Colleges" : c}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Students Table */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                                <th className="px-6 py-4">Student</th>
                                <th className="px-6 py-4">College</th>
                                <th className="px-6 py-4 text-center">Tests Taken</th>
                                <th className="px-6 py-4 text-center">Avg Accuracy</th>
                                <th className="px-6 py-4 text-center">Score</th>
                                <th className="px-6 py-4 text-center">Rank</th>
                                <th className="px-6 py-4 text-right">Activity</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center gap-3">
                                            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                                            <p className="text-sm font-medium text-gray-500">Loading student data...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-2 text-gray-400">
                                            <SearchX className="w-10 h-10 opacity-30" />
                                            <p className="text-sm font-medium">No students found matching your criteria</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((s) => (
                                    <tr key={s.userId} className="hover:bg-gray-50 transition-colors group">
                                        {/* Student */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100 text-indigo-500 flex-shrink-0">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-gray-900 leading-none">{s.fullName}</p>
                                                    <p className="text-[11px] text-gray-400 mt-1">{s.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        {/* College */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
                                                <Briefcase className="w-3 h-3 text-gray-400" />
                                                {s.college}
                                            </div>
                                        </td>
                                        {/* Tests */}
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm text-gray-700 font-semibold">{s.testsTaken}</span>
                                        </td>
                                        {/* Accuracy */}
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex flex-col items-center gap-1.5">
                                                <span className="text-sm font-black text-emerald-600">{s.avgAccuracy}</span>
                                                <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: s.avgAccuracy }} />
                                                </div>
                                            </div>
                                        </td>
                                        {/* Score */}
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                                                {s.totalScore}
                                            </span>
                                        </td>
                                        {/* Rank */}
                                        <td className="px-6 py-4 text-center">
                                            <span className="text-sm font-black text-amber-600">{s.rank}</span>
                                        </td>
                                        {/* Action */}
                                        <td className="px-6 py-4 text-right">
                                            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 transition-all">
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
