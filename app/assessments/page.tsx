"use client";

import { useState } from "react";
import PortalShell from "@/app/components/PortalShell";
import {
    Search,
    Clock,
    Zap,
    CircleDot,
    CheckCircle2,
    CalendarDays,
    ClipboardList,
    Play,
    ChevronLeft,
} from "lucide-react";
import Link from "next/link";

type Filter = "All" | "Upcoming" | "Not Attempted" | "Attempted";

const tests = [
    {
        id: 1,
        title: "Day 1 CRT",
        type: "ASSESSMENT",
        date: "2026-01-11",
        duration: 25,
        schedule: "Anytime",
        status: "Not Attempted" as Filter,
        image: "/team/crt-exam.webp",
        description: "Ready when you are start now.",
    },
    {
        id: 2,
        title: "Day 2 Aptitude",
        type: "ASSESSMENT",
        date: "2026-01-12",
        duration: 30,
        schedule: "Anytime",
        status: "Not Attempted" as Filter,
        image: "/team/crt-exam.webp",
        description: "Quantitative aptitude — shortcuts & patterns.",
    },
    {
        id: 3,
        title: "Day 3 Verbal",
        type: "ASSESSMENT",
        date: "2026-01-13",
        duration: 20,
        schedule: "Anytime",
        status: "Upcoming" as Filter,
        image: "/team/crt-exam.webp",
        description: "Reading comprehension and grammar.",
    },
];

const filterTabs: Filter[] = ["All", "Upcoming", "Not Attempted", "Attempted"];

const filterIcons: Record<Filter, React.ReactNode> = {
    All: <ClipboardList className="w-4 h-4" />,
    Upcoming: <CalendarDays className="w-4 h-4" />,
    "Not Attempted": <CircleDot className="w-4 h-4" />,
    Attempted: <CheckCircle2 className="w-4 h-4" />,
};

const statusColors: Record<string, string> = {
    "Not Attempted": "bg-gray-100 text-gray-600 border-gray-200",
    Upcoming: "bg-blue-50 text-blue-600 border-blue-200",
    Attempted: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export default function AssessmentsPage() {
    const [activeFilter, setActiveFilter] = useState<Filter>("All");
    const [search, setSearch] = useState("");

    const filtered = tests.filter((t) => {
        const matchFilter = activeFilter === "All" || t.status === activeFilter;
        const matchSearch =
            !search ||
            t.title.toLowerCase().includes(search.toLowerCase()) ||
            t.type.toLowerCase().includes(search.toLowerCase());
        return matchFilter && matchSearch;
    });

    return (
        <PortalShell>
            <div className="space-y-6">
                {/* Page Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Tests</h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Start a new test or open your completed results.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search tests by title or type..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-300 w-56 transition-all"
                            />
                        </div>

                        {/* Back */}
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 shadow-sm hover:bg-gray-50 transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back
                        </Link>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 flex-wrap">
                    {filterTabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveFilter(tab)}
                            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-medium border transition-all
                ${activeFilter === tab
                                    ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                }`}
                        >
                            {filterIcons[tab]}
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Test Cards Grid */}
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
                        <ClipboardList className="w-12 h-12 opacity-30" />
                        <p className="text-base font-medium">No tests found</p>
                        <p className="text-sm">Try a different filter or search term.</p>
                    </div>
                ) : (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                        {filtered.map((test) => (
                            <div
                                key={test.id}
                                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-indigo-200 transition-all group"
                            >
                                {/* Card Image */}
                                <div className="relative h-44 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 overflow-hidden">
                                    {/* Decorative text overlay like the screenshot */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center select-none pointer-events-none">
                                        <span className="text-white/20 font-black text-6xl tracking-tight leading-none">CRT</span>
                                        <span className="text-white/30 font-black text-4xl tracking-tight -mt-2">EXAM</span>
                                        <span className="text-white/15 text-xs mt-1 tracking-widest uppercase">Campus Recruitment Training</span>
                                    </div>

                                    {/* Badges */}
                                    <div className="absolute top-3 left-3 right-3 flex justify-between items-start">
                                        <span className="flex items-center gap-1 bg-white/90 backdrop-blur-sm text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-lg shadow-sm">
                                            <ClipboardList className="w-3 h-3" />
                                            {test.type}
                                        </span>
                                        <span className="flex items-center gap-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm">
                                            <CalendarDays className="w-3 h-3" />
                                            {test.date}
                                        </span>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-4 space-y-3">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-base">{test.title}</h3>
                                        <p className="text-xs text-gray-500 mt-0.5">
                                            {test.duration} min • {test.schedule}
                                        </p>
                                    </div>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-1.5">
                                        <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border bg-gray-50 text-gray-600 border-gray-200">
                                            <Clock className="w-3 h-3" />
                                            {test.duration} min
                                        </span>
                                        <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border bg-gray-50 text-gray-600 border-gray-200">
                                            <Zap className="w-3 h-3" />
                                            {test.schedule}
                                        </span>
                                        <span className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border ${statusColors[test.status]}`}>
                                            <CircleDot className="w-3 h-3" />
                                            {test.status}
                                        </span>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                                        <p className="text-xs text-gray-400">{test.description}</p>
                                        <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm group-hover:shadow-md">
                                            <Play className="w-3.5 h-3.5 fill-white" />
                                            Start
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </PortalShell>
    );
}
