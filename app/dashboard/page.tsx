"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
    LayoutDashboard,
    ClipboardList,
    BarChart2,
    KeyRound,
    LogOut,
    CalendarDays,
    Trophy,
    GraduationCap,
    Percent,
    FileText,
    CheckCircle2,
    XCircle,
    Target,
    Menu,
    X,
    AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { DashboardStats } from "@/app/lib/types";

const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Assessments", icon: ClipboardList, href: "/assessments" },
    { label: "Results", icon: BarChart2, href: "/results" },
];

export default function DashboardPage() {
    const { user, isLoaded } = useUser();
    const { signOut } = useClerk();
    const router = useRouter();
    const [activeNav, setActiveNav] = useState("Dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);

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

    const handleLogout = async () => {
        await signOut();
        router.push("/");
    };

    if (!isLoaded || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm font-medium text-gray-500 animate-pulse">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
                <div className="bg-white rounded-3xl p-8 shadow-xl max-w-md w-full text-center space-y-4 border border-rose-100">
                    <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
                        <AlertCircle className="w-8 h-8 text-rose-500" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Oops! Something went wrong</h2>
                    <p className="text-gray-500 text-sm">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
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

    const Sidebar = () => (
        <aside className="flex flex-col w-64 min-h-full bg-white border-r border-gray-100 shadow-sm">
            {/* User Info */}
            <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100">
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
                <div className="min-w-0">
                    <p className="font-semibold text-gray-800 text-sm truncate">
                        {user?.fullName ?? user?.username ?? "User"}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                        {user?.primaryEmailAddress?.emailAddress ?? ""}
                    </p>
                </div>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
                {navItems.map(({ label, icon: Icon, href }) => (
                    <Link
                        key={label}
                        href={href}
                        onClick={() => { setActiveNav(label); setSidebarOpen(false); }}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
              ${activeNav === label
                                ? "bg-indigo-50 text-indigo-600"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                    >
                        <Icon className="w-4 h-4 flex-shrink-0" />
                        {label}
                    </Link>
                ))}
            </nav>

            {/* Logout */}
            <div className="px-3 py-4 border-t border-gray-100">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-rose-600 transition-all"
                >
                    <LogOut className="w-4 h-4 flex-shrink-0" />
                    Logout
                </button>
            </div>
        </aside>
    );

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex">
                <Sidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 flex md:hidden">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <div className="relative z-10 flex h-full">
                        <Sidebar />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Navbar */}
                <header className="bg-white border-b border-gray-100 shadow-sm px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        {/* Mobile hamburger */}
                        <button
                            className="md:hidden text-gray-600"
                            onClick={() => setSidebarOpen(true)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <Link href="/" className="flex items-center gap-2 group">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/team/logo.webp" alt="RK Skills Logo" className="w-10 h-10 object-contain rounded-full" />
                            <div className="hidden sm:block">
                                <p className="font-bold text-gray-900 text-sm leading-tight group-hover:text-indigo-600 transition-colors">RK Skills Portal</p>
                                <p className="text-xs text-gray-400">Daily tests • Results • Leaderboard</p>
                            </div>
                        </Link>
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-sm hover:bg-indigo-700 transition-all">
                            <LayoutDashboard className="w-4 h-4" />
                            <span className="hidden sm:inline">Dashboard</span>
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-rose-600 transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </header>

                {/* Page Body */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6">
                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
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
                                className={`${card.bg} rounded-2xl p-5 text-white shadow-md flex flex-col justify-between min-h-[120px]`}
                            >
                                <div className="flex items-start justify-between">
                                    <p className="text-sm font-medium opacity-90">{card.label}</p>
                                    <div className="bg-white/20 rounded-lg p-1.5">{card.icon}</div>
                                </div>
                                <div>
                                    <p className="text-3xl font-extrabold mt-2">{card.value}</p>
                                    <p className="text-xs opacity-80 mt-1">{card.sublabel}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Grid */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Today's Performance */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="font-bold text-gray-900">Today&apos;s Performance</h2>
                                <span className="text-xs text-gray-400">{todayStr}</span>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-3 border-b border-gray-50">
                                    <span className="text-sm text-gray-600">Right answers</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                        <span className="text-sm font-semibold text-gray-800">{stats?.todayRight ?? 0}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-gray-50">
                                    <span className="text-sm text-gray-600">Wrong answers</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                                        <span className="text-sm font-semibold text-gray-800">{stats?.todayWrong ?? 0}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between py-3">
                                    <span className="text-sm text-gray-600">Accuracy</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                                        <span className="text-sm font-semibold text-gray-800">{stats?.todayAccuracy ?? "0%"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Next Test */}
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col">
                            <div className="flex items-center justify-between mb-5">
                                <h2 className="font-bold text-gray-900">Next Test</h2>
                                <span className="text-xs text-gray-400">Next available</span>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center flex-1 py-6 gap-4">
                                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center">
                                    <ClipboardList className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm font-bold text-gray-900">Ready for a challenge?</p>
                                    <p className="text-xs text-gray-500">New assessments are available for your college.</p>
                                </div>
                                <Link
                                    href="/assessments"
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-indigo-100 text-sm font-medium text-indigo-600 bg-indigo-50/50 hover:bg-indigo-50 transition-all shadow-sm"
                                >
                                    View Assessments
                                </Link>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
