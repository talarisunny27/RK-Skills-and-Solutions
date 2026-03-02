"use client";

import { useState, useEffect } from "react";
import {
    Plus,
    Calendar,
    Clock,
    Edit2,
    CheckCircle2,
    Layers,
    Layout,
    XCircle,
} from "lucide-react";
import { CollegeLevel, Assessment } from "@/app/lib/types";

const colleges: CollegeLevel[] = ["KMIT", "CBIT", "MGIT", "ALL"];

export default function AdminAssessments() {
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        setAssessments([
            { id: 1, title: "Day 1 CRT", type: "ASSESSMENT", date: "2026-03-05", duration: 30, schedule: "Anytime", status: "Upcoming", description: "Logical reasoning and quantitative aptitude.", college: "KMIT" },
            { id: 2, title: "Day 2 Technical", type: "ASSESSMENT", date: "2026-03-08", duration: 45, schedule: "Anytime", status: "Upcoming", description: "Java programming and Data Structures.", college: "CBIT" },
        ]);
    }, []);

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Assessments & Tests</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Schedule and publish tests for specific colleges.</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200"
                >
                    <Plus className="w-5 h-5" />
                    New Assessment
                </button>
            </div>

            {/* Assessment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {assessments.map((a) => (
                    <div
                        key={a.id}
                        className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-md transition-all group relative overflow-hidden shadow-sm"
                    >
                        {/* Accent bar */}
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600 rounded-l-2xl" />

                        <div className="flex items-start justify-between">
                            <div className="bg-indigo-50 p-2.5 rounded-xl">
                                <Layout className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border border-emerald-100">
                                <CheckCircle2 className="w-3 h-3" />
                                {a.status}
                            </div>
                        </div>

                        <div className="mt-5">
                            <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{a.title}</h3>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{a.description}</p>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                <Calendar className="w-3.5 h-3.5" />
                                {a.date}
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                <Clock className="w-3.5 h-3.5" />
                                {a.duration} mins
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                <Layers className="w-3.5 h-3.5" />
                                {a.college}
                            </div>
                        </div>

                        <div className="mt-8 pt-5 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-indigo-100" />
                                    ))}
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">128 Enrolled</span>
                            </div>
                            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 transition-all">
                                <Edit2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Create New Placeholder */}
                <button
                    onClick={() => setIsAdding(true)}
                    className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 gap-3 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all group"
                >
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-100 transition-all">
                        <Plus className="w-6 h-6 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <p className="text-sm font-bold text-gray-400 group-hover:text-gray-700 transition-colors">Create New Assessment</p>
                </button>
            </div>
        </div>
    );
}
