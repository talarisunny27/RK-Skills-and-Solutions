"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { Building2, ChevronRight, Loader2, CheckCircle2, GraduationCap } from "lucide-react";

const KNOWN_COLLEGES = [
    "KMIT",
    "CBIT",
    "MGIT",
    "TKR College",
    "JNTUH",
    "Vasavi College of Engineering",
    "Osmania University",
    "CVR College",
    "Matrusri Engineering College",
];

export default function CollegeOnboarding() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState("");
    const [custom, setCustom] = useState("");
    const [useCustom, setUseCustom] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");
    const [dynamicColleges, setDynamicColleges] = useState<string[]>(KNOWN_COLLEGES);

    useEffect(() => {
        // Show modal only if user is signed in but has no college set yet
        if (isLoaded && isSignedIn && user) {
            const college = user.publicMetadata?.college as string | undefined;
            if (!college) {
                setOpen(true);
                // Fetch latest dynamic list of colleges
                fetch("/api/colleges")
                    .then(res => res.json())
                    .then(data => {
                        const allColleges = Array.from(new Set([...KNOWN_COLLEGES, ...(Array.isArray(data) ? data : [])]));
                        setDynamicColleges(allColleges);
                    })
                    .catch(console.error);
            }
        }
    }, [isLoaded, isSignedIn, user]);

    if (!open) return null;

    const collegeName = useCustom ? custom.trim() : selected;
    const canSave = collegeName.length > 0;

    const handleSave = async () => {
        if (!canSave) return;
        setSaving(true);
        setError("");
        try {
            const res = await fetch("/api/auth/update-college", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ college: collegeName }),
            });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data?.error || "Failed to save college");
            }
            setSaved(true);
            // Reload user to pick up the new publicMetadata, then close
            await user?.reload();
            setTimeout(() => setOpen(false), 1200);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
                {/* Top accent bar */}
                <div className="h-1.5 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600" />

                <div className="p-8 space-y-6">
                    {/* Header */}
                    <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center flex-shrink-0">
                            <GraduationCap className="w-7 h-7 text-indigo-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-gray-900">
                                Welcome{user?.firstName ? `, ${user.firstName}` : ""}! 👋
                            </h2>
                            <p className="text-sm text-gray-500 mt-0.5">
                                Tell us your college so we can show you relevant assessments and rank you with your peers.
                            </p>
                        </div>
                    </div>

                    {/* College picker */}
                    {!useCustom ? (
                        <div className="space-y-2">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Select your college</p>
                            <div className="grid grid-cols-1 gap-2 max-h-52 overflow-y-auto pr-1">
                                {dynamicColleges.map((college) => (
                                    <button
                                        key={college}
                                        onClick={() => setSelected(college)}
                                        className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-semibold text-left transition-all
                                            ${selected === college
                                                ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200"
                                                : "bg-gray-50 text-gray-700 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/40"}`}
                                    >
                                        <span className="flex items-center gap-2.5">
                                            <Building2 className={`w-4 h-4 flex-shrink-0 ${selected === college ? "text-indigo-200" : "text-gray-400"}`} />
                                            {college}
                                        </span>
                                        {selected === college && <CheckCircle2 className="w-4 h-4 text-indigo-200 flex-shrink-0" />}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => { setUseCustom(true); setSelected(""); }}
                                className="text-xs text-indigo-600 font-bold hover:underline mt-1"
                            >
                                My college isn&apos;t listed →
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Enter your college name</p>
                            <input
                                autoFocus
                                type="text"
                                value={custom}
                                onChange={(e) => setCustom(e.target.value)}
                                placeholder="e.g. St. Mary's College of Engineering"
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all placeholder:text-gray-300"
                                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                            />
                            <button
                                onClick={() => { setUseCustom(false); setCustom(""); }}
                                className="text-xs text-gray-400 hover:text-indigo-600 font-bold hover:underline"
                            >
                                ← Back to list
                            </button>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <p className="text-xs text-rose-600 font-semibold bg-rose-50 px-3 py-2 rounded-xl border border-rose-100">
                            {error}
                        </p>
                    )}

                    {/* Save button */}
                    <button
                        onClick={handleSave}
                        disabled={!canSave || saving || saved}
                        className={`w-full py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all
                            ${saved
                                ? "bg-emerald-500 text-white"
                                : canSave
                                    ? "bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200 active:scale-[0.98]"
                                    : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
                    >
                        {saved ? (
                            <><CheckCircle2 className="w-4 h-4" /> College saved!</>
                        ) : saving ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                        ) : (
                            <>Continue <ChevronRight className="w-4 h-4" /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
