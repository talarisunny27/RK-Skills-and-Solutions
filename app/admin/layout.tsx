"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter, usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ClipboardList,
    Users,
    FilePlus,
    LogOut,
    Menu,
    X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const adminNavItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/admin" },
    { label: "Questions", icon: ClipboardList, href: "/admin/questions" },
    { label: "Assessments", icon: FilePlus, href: "/admin/assessments" },
    { label: "Students", icon: Users, href: "/admin/students" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isLoaded } = useUser();
    const { signOut } = useClerk();
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await signOut();
        router.push("/");
    };

    if (!isLoaded) return null;

    const Sidebar = () => (
        <aside className="flex flex-col w-64 min-h-full bg-white border-r border-gray-100 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-100">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-white font-black text-xl">RK</span>
                </div>
                <div>
                    <p className="font-bold text-gray-900 text-sm leading-tight">Admin Panel</p>
                    <p className="text-xs text-gray-400">Portal Management</p>
                </div>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col gap-1 px-3 py-4 flex-1">
                {adminNavItems.map(({ label, icon: Icon, href }) => {
                    const isActive = pathname === href || (href !== '/admin' && pathname.startsWith(href));
                    return (
                        <Link
                            key={label}
                            href={href}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all group
                                ${isActive
                                    ? "bg-indigo-50 text-indigo-600 shadow-sm"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                }`}
                        >
                            <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-indigo-600" : "text-gray-400 group-hover:text-gray-600"}`} />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* User & Logout */}
            <div className="px-3 py-4 border-t border-gray-100">
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        {user?.imageUrl ? (
                            <img src={user.imageUrl} alt="User" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-indigo-600 font-bold text-xs">A</span>
                        )}
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{user?.firstName || 'Admin'}</p>
                        <p className="text-xs text-gray-400 truncate">Administrator</p>
                    </div>
                </div>
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
            <div className="hidden lg:flex sticky top-0 h-screen">
                <Sidebar />
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                    <div className="relative z-10 flex h-full">
                        <Sidebar />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="lg:hidden bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm">
                    <button onClick={() => setSidebarOpen(true)} className="text-gray-600 hover:text-gray-900">
                        <Menu className="w-6 h-6" />
                    </button>
                    <div className="flex items-center gap-2">
                        <img src="/team/logo.webp" alt="Logo" className="w-8 h-8 rounded-full" />
                        <span className="text-sm font-bold text-gray-900 uppercase tracking-widest">RK Admin</span>
                    </div>
                    <div className="w-6" />
                </header>

                <main className="p-4 sm:p-6 lg:p-10 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
