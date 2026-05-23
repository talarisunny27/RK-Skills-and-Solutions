"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PortalShell from "@/app/components/PortalShell";
import {
    AlertCircle,
    ArrowRight,
    BrainCircuit,
    CalendarDays,
    CheckCircle2,
    ChevronLeft,
    CircleDot,
    ClipboardList,
    Hash,
    Layers3,
    Play,
    Search,
    Sparkles,
    Type,
} from "lucide-react";
import { Assessment, Filter } from "@/app/lib/types";
import {
    ASSESSMENT_MODULES,
    AssessmentModule,
    DEFAULT_ASSESSMENT_MODULE,
    getSubmodulesForModule,
    normalizeAssessmentModule,
} from "@/app/lib/assessment-modules";

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

type AssessmentWithHierarchy = Assessment & {
    module: AssessmentModule;
    submodule: string;
};

const moduleThemes: Record<
    AssessmentModule,
    {
        icon: React.ReactNode;
        shell: string;
        card: string;
        border: string;
        glow: string;
        badge: string;
        levelActive: string;
        paperHero: string;
        paperChip: string;
        accent: string;
        eyebrow: string;
    }
> = {
    "VERBAL ABILITY": {
        icon: <Type className="w-5 h-5" />,
        shell: "from-rose-100 via-amber-50 to-white",
        card: "from-rose-600 via-orange-500 to-amber-400",
        border: "border-rose-200",
        glow: "shadow-rose-200/70",
        badge: "bg-rose-100 text-rose-700 border-rose-200",
        levelActive: "border-rose-500 bg-rose-600 text-white shadow-rose-200",
        paperHero: "from-rose-700 via-orange-500 to-amber-300",
        paperChip: "bg-rose-100 text-rose-700 border-rose-200",
        accent: "text-rose-700",
        eyebrow: "text-rose-500",
    },
    "QUANTITATIVE APTITUDE": {
        icon: <Hash className="w-5 h-5" />,
        shell: "from-emerald-100 via-teal-50 to-white",
        card: "from-emerald-700 via-teal-500 to-cyan-400",
        border: "border-emerald-200",
        glow: "shadow-emerald-200/70",
        badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
        levelActive: "border-emerald-500 bg-emerald-600 text-white shadow-emerald-200",
        paperHero: "from-emerald-800 via-teal-600 to-cyan-400",
        paperChip: "bg-emerald-100 text-emerald-700 border-emerald-200",
        accent: "text-emerald-700",
        eyebrow: "text-emerald-500",
    },
    "LOGICAL REASONING": {
        icon: <BrainCircuit className="w-5 h-5" />,
        shell: "from-sky-100 via-indigo-50 to-white",
        card: "from-sky-700 via-indigo-600 to-violet-500",
        border: "border-sky-200",
        glow: "shadow-sky-200/70",
        badge: "bg-sky-100 text-sky-700 border-sky-200",
        levelActive: "border-sky-500 bg-sky-600 text-white shadow-sky-200",
        paperHero: "from-sky-800 via-indigo-700 to-violet-500",
        paperChip: "bg-sky-100 text-sky-700 border-sky-200",
        accent: "text-sky-700",
        eyebrow: "text-sky-500",
    },
};

export default function AssessmentsPage() {
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState<Filter>("All");
    const [search, setSearch] = useState("");
    const [tests, setTests] = useState<Assessment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedModule, setSelectedModule] = useState<AssessmentModule>(DEFAULT_ASSESSMENT_MODULE);
    const [selectedLevel, setSelectedLevel] = useState<string>(getSubmodulesForModule(DEFAULT_ASSESSMENT_MODULE)[0]);

    useEffect(() => {
        const fetchTests = async () => {
            try {
                const res = await fetch("/api/assessments");
                if (!res.ok) throw new Error("Failed to load assessments");
                const data = await res.json();
                setTests(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTests();
    }, []);

    const normalizedTests: AssessmentWithHierarchy[] = tests.map((test) => {
        const module = normalizeAssessmentModule(test.module || DEFAULT_ASSESSMENT_MODULE);
        const validLevels = getSubmodulesForModule(module);
        const submodule = validLevels.includes(test.submodule) ? test.submodule : validLevels[0];

        return {
            ...test,
            module,
            submodule,
        };
    });

    const levelsForSelectedModule = getSubmodulesForModule(selectedModule);
    const selectedTheme = moduleThemes[selectedModule];

    const filtered = normalizedTests.filter((test) => {
        const matchModule = test.module === selectedModule;
        const matchLevel = test.submodule === selectedLevel;
        const matchFilter = activeFilter === "All" || test.status === activeFilter;
        const searchValue = search.toLowerCase();
        const matchSearch =
            !search ||
            test.title.toLowerCase().includes(searchValue) ||
            test.type.toLowerCase().includes(searchValue) ||
            test.module.toLowerCase().includes(searchValue) ||
            test.submodule.toLowerCase().includes(searchValue);

        return matchModule && matchLevel && matchFilter && matchSearch;
    });

    const getModuleCount = (moduleName: AssessmentModule) =>
        normalizedTests.filter((test) => test.module === moduleName).length;

    const getLevelCount = (moduleName: AssessmentModule, level: string) =>
        normalizedTests.filter((test) => test.module === moduleName && test.submodule === level).length;

    const handleModuleSelect = (moduleName: AssessmentModule) => {
        const nextLevels = getSubmodulesForModule(moduleName);
        setSelectedModule(moduleName);
        setSelectedLevel(nextLevels[0]);
    };

    if (loading) {
        return (
            <PortalShell>
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-medium text-gray-500 animate-pulse">Fetching assessments...</p>
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
                    <p className="text-gray-900 font-bold">Failed to load tests</p>
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

    return (
        <PortalShell>
            <div className="space-y-8">
                <div className={`relative overflow-hidden rounded-[2rem] border ${selectedTheme.border} bg-gradient-to-br ${selectedTheme.shell} p-6 sm:p-8 shadow-xl ${selectedTheme.glow}`}>
                    <div className="absolute -right-12 top-0 h-40 w-40 rounded-full bg-white/50 blur-3xl" />
                    <div className="absolute bottom-0 right-20 h-28 w-28 rounded-full bg-white/40 blur-2xl" />
                    <div className="absolute left-1/2 top-10 h-20 w-20 rounded-full border border-white/60" />
                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="max-w-2xl">
                            <div className={`mb-3 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.28em] ${selectedTheme.badge}`}>
                                <Sparkles className="w-3.5 h-3.5" />
                                Assessment Studio
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-gray-950">
                                Learn by module,
                                <span className={`block ${selectedTheme.accent}`}>practice by level.</span>
                            </h1>
                            <p className="mt-3 max-w-xl text-sm sm:text-base text-gray-600">
                                Move through the portal the way a real prep track should feel: choose the skill family,
                                lock into a level, and open only the papers that belong there.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search papers, topics, levels..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-9 pr-4 py-3 rounded-2xl border border-white/70 bg-white/85 text-sm text-gray-700 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-white w-full sm:w-72 transition-all backdrop-blur"
                                />
                            </div>

                            <Link
                                href="/dashboard"
                                className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-2xl border border-white/70 bg-white/80 text-sm font-semibold text-gray-700 shadow-sm hover:bg-white transition-all"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Back
                            </Link>
                        </div>
                    </div>
                    <div className="relative mt-6 grid gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl border border-white/60 bg-white/75 p-4 backdrop-blur">
                            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-gray-400">Active module</p>
                            <p className="mt-2 text-lg font-black text-gray-950">{selectedModule}</p>
                        </div>
                        <div className="rounded-2xl border border-white/60 bg-white/75 p-4 backdrop-blur">
                            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-gray-400">Selected level</p>
                            <p className="mt-2 text-lg font-black text-gray-950">{selectedLevel}</p>
                        </div>
                        <div className="rounded-2xl border border-white/60 bg-white/75 p-4 backdrop-blur">
                            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-gray-400">Visible papers</p>
                            <p className="mt-2 text-lg font-black text-gray-950">{filtered.length}</p>
                        </div>
                    </div>
                </div>

                <section className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${selectedTheme.card} text-white shadow-lg`}>
                            <Layers3 className="w-5 h-5" />
                        </div>
                        <div>
                            <p className={`text-[11px] font-black uppercase tracking-[0.28em] ${selectedTheme.eyebrow}`}>Pathways</p>
                            <h2 className="text-xl font-black text-gray-950">Choose Your Module</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(Object.keys(ASSESSMENT_MODULES) as AssessmentModule[]).map((moduleName) => {
                            const isActive = moduleName === selectedModule;
                            const total = getModuleCount(moduleName);
                            const theme = moduleThemes[moduleName];

                            return (
                                <button
                                    key={moduleName}
                                    onClick={() => handleModuleSelect(moduleName)}
                                    className={`group relative overflow-hidden text-left rounded-[1.75rem] border p-5 transition-all ${
                                        isActive
                                            ? `${theme.border} bg-gradient-to-br ${theme.card} text-white shadow-2xl ${theme.glow}`
                                            : `${theme.border} bg-white hover:-translate-y-0.5 hover:shadow-xl`
                                    }`}
                                >
                                    <div className={`absolute -right-8 -top-8 h-28 w-28 rounded-full ${isActive ? "bg-white/15" : "bg-gray-100"} transition-all`} />
                                    <div className="relative">
                                    <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl ${
                                        isActive ? "bg-white/15 text-white" : `bg-gradient-to-br ${theme.card} text-white`
                                    }`}>
                                        {theme.icon}
                                    </div>
                                    <p className={`mt-4 text-xs font-black uppercase tracking-[0.24em] ${isActive ? "text-white/75" : "text-gray-400"}`}>
                                        Module
                                    </p>
                                    <h3 className={`mt-2 text-xl font-black leading-tight ${isActive ? "text-white" : "text-gray-950"}`}>
                                        {moduleName}
                                    </h3>
                                    <p className={`mt-3 text-sm ${isActive ? "text-white/80" : "text-gray-500"}`}>
                                        {total} paper{total === 1 ? "" : "s"} waiting inside this track.
                                    </p>
                                    <div className={`mt-5 inline-flex items-center gap-2 text-sm font-bold ${isActive ? "text-white" : theme.accent}`}>
                                        Explore module
                                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </section>

                <section className={`rounded-[1.75rem] border ${selectedTheme.border} bg-white p-6 shadow-sm`}>
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-4">
                            <div className={`flex h-14 w-14 items-center justify-center rounded-3xl bg-gradient-to-br ${selectedTheme.card} text-white shadow-lg`}>
                                {selectedTheme.icon}
                            </div>
                            <div>
                                <p className={`text-[11px] font-black uppercase tracking-[0.28em] ${selectedTheme.eyebrow}`}>Levels</p>
                                <h2 className="text-2xl font-black text-gray-950">{selectedModule}</h2>
                                <p className="text-sm text-gray-500">Choose the level you want to practice.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap">
                            {levelsForSelectedModule.map((level) => {
                                const isActive = level === selectedLevel;
                                const total = getLevelCount(selectedModule, level);

                                return (
                                    <button
                                        key={level}
                                        onClick={() => setSelectedLevel(level)}
                                        className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-all ${
                                            isActive
                                                ? selectedTheme.levelActive
                                                : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                                        }`}
                                    >
                                        <span className="block text-left">{level}</span>
                                        <span className={`block text-[11px] ${isActive ? "text-white/80" : "text-gray-400"}`}>{total} papers</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="mt-5 flex items-center gap-2 flex-wrap">
                        {filterTabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveFilter(tab)}
                                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium border transition-all ${
                                    activeFilter === tab
                                        ? "bg-gray-950 text-white border-gray-950 shadow-sm"
                                        : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                                }`}
                            >
                                {filterIcons[tab]}
                                {tab}
                            </button>
                        ))}
                    </div>
                </section>

                <section className="space-y-4">
                    <div>
                        <p className={`text-[11px] font-black uppercase tracking-[0.28em] ${selectedTheme.eyebrow}`}>Collection</p>
                        <h2 className="text-2xl font-black text-gray-950">Question Papers</h2>
                        <p className="text-sm text-gray-500 mt-1">
                            {selectedModule} / {selectedLevel}
                        </p>
                    </div>

                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white py-20 text-gray-400 gap-3 text-center">
                            <ClipboardList className="w-12 h-12 opacity-30" />
                            <div>
                                <p className="text-base font-medium text-gray-600">No question papers found</p>
                                <p className="text-sm">
                                    Try another level, filter, or search term.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {filtered.map((test) => (
                                <div
                                    key={test.id}
                                    className="group overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-2xl"
                                >
                                    <div className={`relative h-52 overflow-hidden bg-gradient-to-br ${selectedTheme.paperHero}`}>
                                        <div className="absolute -right-10 top-6 h-28 w-28 rounded-full border border-white/20" />
                                        <div className="absolute left-6 top-12 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.25),transparent_35%)]" />
                                        <div className="absolute inset-0 p-5 flex flex-col justify-between">
                                            <div className="flex items-start justify-between gap-3">
                                                <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-gray-800 shadow-sm">
                                                    <ClipboardList className="w-3 h-3" />
                                                    {test.type}
                                                </span>
                                                <span className="inline-flex items-center gap-1 rounded-full bg-black/20 px-3 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                                                    <CalendarDays className="w-3 h-3" />
                                                    {test.date}
                                                </span>
                                            </div>

                                            <div>
                                                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-white/70">
                                                    {test.submodule}
                                                </p>
                                                <h3 className="mt-2 text-xl font-black leading-tight text-white">
                                                    {test.title}
                                                </h3>
                                                <p className="mt-2 max-w-[18rem] text-xs text-white/70">
                                                    Timed practice designed for {test.module.toLowerCase()} progression.
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 p-5">
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-gray-400">Session</p>
                                                <p className="mt-1 text-sm font-semibold text-gray-700">
                                                    {test.duration} min - {test.schedule}
                                                </p>
                                            </div>
                                            <div className={`rounded-2xl border px-3 py-2 text-right ${selectedTheme.paperChip}`}>
                                                <p className="text-[10px] font-black uppercase tracking-wider">Track</p>
                                                <p className="mt-1 text-xs font-bold">{test.module}</p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider border ${selectedTheme.paperChip}`}>
                                                {test.submodule}
                                            </span>
                                            <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[10px] font-bold tracking-wide text-gray-600">
                                                {test.college}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-2">
                                            <span className={`flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border ${statusColors[test.status]}`}>
                                                <CircleDot className="w-3 h-3" />
                                                {test.status}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-4">
                                            <p className="text-xs text-gray-500 line-clamp-2 flex-1">
                                                {test.description || "Focused practice paper tailored to this module and level."}
                                            </p>
                                            <button
                                                disabled={test.status === "Attempted" || test.status === "Upcoming"}
                                                onClick={() => {
                                                    if (test.status === "Not Attempted") router.push(`/exam/${test.id}`);
                                                }}
                                                className={`flex items-center gap-1.5 rounded-2xl px-4 py-3 text-xs font-black transition-all shadow-sm
                                                    ${test.status === "Attempted"
                                                        ? "bg-emerald-500 text-white"
                                                        : test.status === "Upcoming"
                                                            ? "bg-slate-300 text-white"
                                                            : "bg-gray-950 text-white hover:bg-black active:scale-95 hover:shadow-lg"
                                                    }`}
                                            >
                                                {test.status === "Attempted" ? "Done" : test.status === "Upcoming" ? "Locked" : <>
                                                    <Play className="w-3 h-3 fill-white" />
                                                    Start
                                                </>}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </PortalShell>
    );
}
