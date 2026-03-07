"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import {
    LayoutDashboard,
    ClipboardList,
    BarChart2,
    KeyRound,
    LogOut,
    GraduationCap,
    Menu,
    Trophy,
} from "lucide-react";
import Link from "next/link";

const navItems = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Assessments", icon: ClipboardList, href: "/assessments" },
    { label: "Results", icon: BarChart2, href: "/results" },
    { label: "Leaderboard", icon: Trophy, href: "/leaderboard" },
];

export default function PortalShell({ children }: { children: React.ReactNode }) {
    const { user } = useUser();
    const { signOut } = useClerk();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await signOut();
        router.push("/");
    };

    const Sidebar = () => (
        <aside className="flex flex-col w-64 min-h-full bg-white border-r border-gray-100 shadow-sm">
            {/* User Info */}
            <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    {user?.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={user.imageUrl} alt="avatar" className="w-10 h-10 rounded-full object-cover" />
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
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
              ${pathname === href
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

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Navbar */}
                <header className="bg-white border-b border-gray-100 shadow-sm px-4 sm:px-8 py-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button className="md:hidden text-gray-600" onClick={() => setSidebarOpen(true)}>
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
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold shadow-sm hover:bg-indigo-700 transition-all"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            <span className="hidden sm:inline">Dashboard</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-rose-600 transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Logout</span>
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
