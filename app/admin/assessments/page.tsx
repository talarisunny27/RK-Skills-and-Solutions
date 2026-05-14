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
    X,
    Trash2,
    Loader2
} from "lucide-react";
import { CollegeLevel, Assessment } from "@/app/lib/types";
import {
    getModuleOptions,
    withResolvedModules,
} from "@/app/lib/assessmentModules";

const colleges: CollegeLevel[] = ["KMIT", "CBIT", "MGIT", "ALL"];
const assessmentTypes = ["ASSESSMENT", "PRACTICE"];

export default function AdminAssessments() {
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [dynamicColleges, setDynamicColleges] = useState<string[]>([]);
    const [moduleOptions, setModuleOptions] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        title: "",
        type: "ASSESSMENT",
        module: "English",
        date: new Date().toISOString().split("T")[0],
        duration: 60,
        schedule: "Anytime",
        description: "",
        college: "ALL" as CollegeLevel,
    });

    const fetchAssessments = async () => {
        try {
            const res = await fetch("/api/admin/assessments");
            if (res.ok) {
                const data: Assessment[] = await res.json();
                const resolved = withResolvedModules(data);
                setAssessments(resolved);
                setModuleOptions(getModuleOptions(data));
            }
        } catch (error) {
            console.error("Failed to fetch assessments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssessments();
        fetch("/api/colleges")
            .then(res => res.json())
            .then(data => {
                const unique = Array.from(new Set([...colleges, ...(Array.isArray(data) ? data : [])]));
                setDynamicColleges(unique);
            })
            .catch(console.error);
    }, []);

    const handleOpenCreate = () => {
        setEditingId(null);
        setFormData({
            title: "",
            type: "ASSESSMENT",
            module: moduleOptions[0] || "English",
            date: new Date().toISOString().split("T")[0],
            duration: 60,
            schedule: "Anytime",
            description: "",
            college: "ALL",
        });
        setIsModalOpen(true);
    };

    const handleOpenEdit = (a: Assessment) => {
        setEditingId(a.id);
        setFormData({
            title: a.title,
            type: a.type,
            module: a.module || "Other",
            date: a.date,
            duration: a.duration,
            schedule: a.schedule,
            description: a.description || "",
            college: (a.college as CollegeLevel) || "ALL",
        });
        setIsModalOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this assessment? This cannot be undone.")) return;
        
        try {
            const res = await fetch(`/api/admin/assessments/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchAssessments();
            } else {
                alert("Failed to delete assessment");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        const url = editingId ? `/api/admin/assessments/${editingId}` : "/api/admin/assessments";
        const method = editingId ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchAssessments();
            } else {
                const err = await res.json();
                alert(err.error || "Failed to save assessment");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Assessments &amp; Tests</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Schedule and publish tests for specific colleges.</p>
                </div>
                <button
                    onClick={handleOpenCreate}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200"
                >
                    <Plus className="w-5 h-5" />
                    New Assessment
                </button>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {assessments.map((a) => (
                        <div
                            key={a.id}
                            className="bg-white border border-gray-100 rounded-2xl p-6 hover:border-indigo-200 hover:shadow-md transition-all group relative overflow-hidden shadow-sm flex flex-col"
                        >
                            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600 rounded-l-2xl" />

                            <div className="flex items-start justify-between">
                                <div className="bg-indigo-50 p-2.5 rounded-xl">
                                    <Layout className="w-5 h-5 text-indigo-600" />
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full border
                                        ${a.type === "PRACTICE" ? "bg-amber-50 text-amber-600 border-amber-100" : "bg-emerald-50 text-emerald-600 border-emerald-100"}`}>
                                        <CheckCircle2 className="w-3 h-3" />
                                        {a.type}
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{a.status}</span>
                                </div>
                            </div>

                            <div className="mt-4 flex-1">
                                <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors tracking-tight line-clamp-2" title={a.title}>
                                    {a.title}
                                </h3>
                                <p className="text-xs text-gray-500 mt-2 line-clamp-2" title={a.description}>{a.description}</p>
                            </div>

                            <div className="mt-5 pt-4 border-t border-gray-50 flex flex-col gap-2.5">
                                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                    <Layers className="w-3.5 h-3.5 text-violet-400" />
                                    Module: <span className="text-violet-600 font-bold">{a.module || "Other"}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs font-medium text-gray-500">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                        {a.date}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                                        {a.duration} mins
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
                                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                                    College: <span className="text-indigo-600 font-bold">{a.college}</span>
                                </div>
                            </div>

                            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">ID: {a.id}</span>
                                <div className="flex items-center gap-1">
                                    <button 
                                        onClick={() => handleOpenEdit(a)}
                                        className="p-2 bg-gray-50 hover:bg-indigo-50 rounded-lg text-gray-400 hover:text-indigo-600 transition-all focus:outline-none"
                                        title="Edit Assessment"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(a.id)}
                                        className="p-2 bg-gray-50 hover:bg-rose-50 rounded-lg text-gray-400 hover:text-rose-600 transition-all focus:outline-none"
                                        title="Delete Assessment"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <button
                        onClick={handleOpenCreate}
                        className="border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center p-8 gap-4 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all group min-h-[300px]"
                    >
                        <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center group-hover:scale-110 group-hover:bg-indigo-100 group-hover:shadow-lg group-hover:shadow-indigo-100 transition-all">
                            <Plus className="w-6 h-6 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                        </div>
                        <p className="text-sm font-bold text-gray-400 group-hover:text-indigo-600 transition-colors">Create New Assessment</p>
                    </button>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => !saving && setIsModalOpen(false)} />
                    
                    <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingId ? "Edit Assessment" : "Create New Assessment"}
                            </h2>
                            <button 
                                onClick={() => !saving && setIsModalOpen(false)}
                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 overflow-y-auto">
                            <form id="assessment-form" onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="sm:col-span-2 space-y-1.5">
                                        <label className="text-sm font-bold text-gray-700">Title</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.title}
                                            onChange={e => setFormData({...formData, title: e.target.value})}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                            placeholder="e.g. Java Spring Boot Core Assessment"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-gray-700">Type</label>
                                        <select
                                            value={formData.type}
                                            onChange={e => setFormData({...formData, type: e.target.value})}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white"
                                        >
                                            {assessmentTypes.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-gray-700">Module</label>
                                        <input
                                            required
                                            list="module-options"
                                            value={formData.module}
                                            onChange={e => setFormData({ ...formData, module: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white placeholder:text-gray-300"
                                            placeholder="English, Aptitude, Mathematics..."
                                        />
                                        <datalist id="module-options">
                                            {moduleOptions.map(module => <option key={module} value={module}>{module}</option>)}
                                        </datalist>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-gray-700">Target College</label>
                                        <div className="relative">
                                            <input
                                                required
                                                list="dynamic-colleges"
                                                value={formData.college}
                                                onChange={e => setFormData({...formData, college: e.target.value as CollegeLevel})}
                                                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all bg-white placeholder:text-gray-300"
                                                placeholder="Select or type a new college..."
                                            />
                                            <datalist id="dynamic-colleges">
                                                {dynamicColleges.map(c => <option key={c} value={c}>{c}</option>)}
                                            </datalist>
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-gray-700">Date</label>
                                        <input
                                            required
                                            type="date"
                                            value={formData.date}
                                            onChange={e => setFormData({...formData, date: e.target.value})}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-sm font-bold text-gray-700">Duration (minutes)</label>
                                        <input
                                            required
                                            type="number"
                                            min="5"
                                            step="5"
                                            value={formData.duration}
                                            onChange={e => setFormData({...formData, duration: parseInt(e.target.value) || 0})}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>

                                    <div className="sm:col-span-2 space-y-1.5">
                                        <label className="text-sm font-bold text-gray-700">Schedule Window</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.schedule}
                                            onChange={e => setFormData({...formData, schedule: e.target.value})}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                                            placeholder="e.g. 10:00 AM - 11:30 AM or Anytime"
                                        />
                                    </div>

                                    <div className="sm:col-span-2 space-y-1.5">
                                        <label className="text-sm font-bold text-gray-700">Description</label>
                                        <textarea
                                            rows={3}
                                            value={formData.description}
                                            onChange={e => setFormData({...formData, description: e.target.value})}
                                            className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none"
                                            placeholder="Brief description of what this assessment entails..."
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3 rounded-b-3xl">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                disabled={saving}
                                className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all focus:outline-none"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="assessment-form"
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 focus:outline-none disabled:opacity-70"
                            >
                                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                {saving ? "Saving..." : "Save Assessment"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
