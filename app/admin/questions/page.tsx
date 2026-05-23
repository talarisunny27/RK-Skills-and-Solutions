"use client";

import { useState, useEffect, useRef } from "react";
import {
    Search, Filter, Trash2, Edit2, UploadCloud, FileSpreadsheet,
    CheckCircle2, AlertCircle, X, RefreshCw, FileText, ChevronDown
} from "lucide-react";
import { Assessment, ExamQuestion } from "@/app/lib/types";
import {
    ASSESSMENT_MODULES,
    AssessmentModule,
    DEFAULT_ASSESSMENT_MODULE,
    getSubmodulesForModule,
} from "@/app/lib/assessment-modules";

export default function AdminQuestions() {
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [selectedAssessmentId, setSelectedAssessmentId] = useState<number | null>(null);
    const [selectedModule, setSelectedModule] = useState<AssessmentModule>(DEFAULT_ASSESSMENT_MODULE);
    const [selectedSubmodule, setSelectedSubmodule] = useState<string>(getSubmodulesForModule(DEFAULT_ASSESSMENT_MODULE)[0]);
    const [questions, setQuestions] = useState<ExamQuestion[]>([]);
    const [loadingQ, setLoadingQ] = useState(false);

    // Upload state
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState<{ success: boolean; message: string } | null>(null);
    const [dragOver, setDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Filter
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetch("/api/admin/assessments")
            .then(r => r.json())
            .then((data: Assessment[]) => {
                setAssessments(Array.isArray(data) ? data : []);
            })
            .catch(() => {});
    }, []);

    const filteredAssessments = assessments.filter(
        (assessment) =>
            assessment.module === selectedModule &&
            assessment.submodule === selectedSubmodule
    );

    useEffect(() => {
        if (!selectedAssessmentId) return;
        setLoadingQ(true);
        fetch(`/api/exam/${selectedAssessmentId}/questions`)
            .then(r => r.json())
            .then(data => setQuestions(Array.isArray(data) ? data : []))
            .catch(() => setQuestions([]))
            .finally(() => setLoadingQ(false));
    }, [selectedAssessmentId]);

    useEffect(() => {
        setSelectedAssessmentId(null);
        setQuestions([]);
        setUploadResult(null);
    }, [selectedModule, selectedSubmodule]);

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault(); setDragOver(false);
        const f = e.dataTransfer.files[0];
        if (f) setFile(f);
    };

    const handleUpload = async () => {
        if (!file || !selectedAssessmentId) return;
        setUploading(true); setUploadResult(null);
        const formData = new FormData();
        formData.append("file", file);
        try {
            const res = await fetch(`/api/admin/exam/${selectedAssessmentId}/upload`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            setUploadResult(data);
            if (data.success) {
                setFile(null);
                // Refresh question list
                const q = await fetch(`/api/exam/${selectedAssessmentId}/questions`).then(r => r.json());
                setQuestions(Array.isArray(q) ? q : []);
            }
        } catch (e: any) {
            setUploadResult({ success: false, message: e.message });
        } finally {
            setUploading(false);
        }
    };

    const filtered = questions.filter(q =>
        !search || q.text.toLowerCase().includes(search.toLowerCase()) || q.section.toLowerCase().includes(search.toLowerCase())
    );

    const diffColor = (d: string) =>
        d === "Easy" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
        d === "Hard" ? "bg-rose-50 text-rose-600 border border-rose-100" :
        "bg-amber-50 text-amber-600 border border-amber-100";

    const handleModuleChange = (moduleName: AssessmentModule) => {
        const nextSubmodules = getSubmodulesForModule(moduleName);
        setSelectedModule(moduleName);
        setSelectedSubmodule(nextSubmodules[0] || "");
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Question Bank</h1>
                <p className="text-sm text-gray-500 mt-0.5">Upload question papers (Excel/PDF) per assessment. Students see only the uploaded questions.</p>
            </div>

            {/* Upload Section */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-3">
                    <div className="bg-indigo-100 p-2 rounded-xl">
                        <UploadCloud className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900 text-sm">Upload Question Paper</h2>
                        <p className="text-xs text-gray-400">Excel (.xlsx) or PDF. Existing questions will be replaced.</p>
                    </div>
                </div>

                <div className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">1. Choose Module</label>
                            <div className="relative">
                                <select
                                    value={selectedModule}
                                    onChange={e => handleModuleChange(e.target.value as AssessmentModule)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                                >
                                    {Object.keys(ASSESSMENT_MODULES).map(moduleName => (
                                        <option key={moduleName} value={moduleName}>{moduleName}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">2. Choose Submodule</label>
                            <div className="relative">
                                <select
                                    value={selectedSubmodule}
                                    onChange={e => setSelectedSubmodule(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                                >
                                    {getSubmodulesForModule(selectedModule).map(submodule => (
                                        <option key={submodule} value={submodule}>{submodule}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                        </div>
                    </div>

                    {/* Assessment Selector */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">3. Select Assessment</label>
                        <div className="relative">
                            <select
                                value={selectedAssessmentId ?? ""}
                                onChange={e => { setSelectedAssessmentId(Number(e.target.value)); setUploadResult(null); }}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 appearance-none"
                            >
                                <option value="">-- Choose an assessment --</option>
                                {filteredAssessments.map(a => (
                                    <option key={a.id} value={a.id}>{a.title} ({a.type})</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                        {filteredAssessments.length === 0 && (
                            <p className="text-xs text-amber-600">
                                No assessments found for {selectedModule} / {selectedSubmodule}. Create or edit an assessment first.
                            </p>
                        )}
                    </div>

                    {/* File Drop Zone */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">4. Choose File</label>
                        <div
                            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                            onDragLeave={() => setDragOver(false)}
                            onDrop={handleDrop}
                            onClick={() => fileInputRef.current?.click()}
                            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all
                                ${dragOver ? "border-indigo-400 bg-indigo-50/50" : file ? "border-emerald-300 bg-emerald-50/30" : "border-gray-200 bg-gray-50 hover:border-indigo-300 hover:bg-indigo-50/30"}`}
                        >
                            {file ? (
                                <div className="flex items-center justify-center gap-3">
                                    {file.name.endsWith(".pdf") ? <FileText className="w-8 h-8 text-rose-500" /> : <FileSpreadsheet className="w-8 h-8 text-emerald-600" />}
                                    <div className="text-left">
                                        <p className="text-sm font-bold text-gray-900">{file.name}</p>
                                        <p className="text-xs text-gray-400">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                    <button
                                        onClick={e => { e.stopPropagation(); setFile(null); }}
                                        className="ml-2 p-1.5 rounded-lg hover:bg-gray-200 text-gray-400 transition-all"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <UploadCloud className="w-10 h-10 text-gray-300 mx-auto" />
                                    <p className="text-sm font-medium text-gray-500">Drag & drop or <span className="text-indigo-600 font-bold">click to browse</span></p>
                                    <p className="text-xs text-gray-400">.xlsx · .xls · .pdf</p>
                                </div>
                            )}
                        </div>
                        <input ref={fileInputRef} type="file" accept=".xlsx,.xls,.pdf" className="hidden" onChange={e => setFile(e.target.files?.[0] ?? null)} />
                    </div>

                    {/* Excel Format Hint */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <p className="text-xs font-bold text-blue-700 mb-2">📋 Excel Format (Row 1 = Header)</p>
                        <div className="overflow-x-auto">
                            <table className="text-[10px] text-blue-700 w-full">
                                <thead><tr className="font-black border-b border-blue-200">
                                    <td className="pb-1 pr-2">Section</td><td className="pb-1 pr-2">Question</td><td className="pb-1 pr-2">Option A</td><td className="pb-1 pr-2">Option B</td><td className="pb-1 pr-2">Option C</td><td className="pb-1 pr-2">Option D</td><td className="pb-1 pr-2">Correct</td><td className="pb-1">Difficulty</td>
                                </tr></thead>
                                <tbody><tr className="opacity-75">
                                    <td className="pr-2">General</td><td className="pr-2">What is...?</td><td className="pr-2">ans A</td><td className="pr-2">ans B</td><td className="pr-2">ans C</td><td className="pr-2">ans D</td><td className="pr-2">A</td><td>Medium</td>
                                </tr></tbody>
                            </table>
                        </div>
                    </div>

                    {/* Upload Button */}
                    <button
                        onClick={handleUpload}
                        disabled={!file || !selectedAssessmentId || uploading}
                        className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 shadow-sm"
                    >
                        {uploading ? (
                            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Uploading...</>
                        ) : (
                            <><UploadCloud className="w-4 h-4" /> Upload & Parse Question Paper</>
                        )}
                    </button>

                    {/* Upload Result */}
                    {uploadResult && (
                        <div className={`flex items-center gap-3 p-4 rounded-xl border ${uploadResult.success ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-200 text-rose-700"}`}>
                            {uploadResult.success ? <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                            <p className="text-sm font-medium">{uploadResult.message}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Questions Table */}
            {selectedAssessmentId && (
                <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
                        <h2 className="font-bold text-gray-900 text-sm">
                            Question Preview
                            {!loadingQ && <span className="text-indigo-500 ml-2">({questions.length} questions)</span>}
                        </h2>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                <input
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    type="text"
                                    placeholder="Search questions..."
                                    className="pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-700 w-44 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                                />
                            </div>
                            <button onClick={() => {
                                setLoadingQ(true);
                                fetch(`/api/exam/${selectedAssessmentId}/questions`).then(r => r.json()).then(data => setQuestions(Array.isArray(data) ? data : [])).finally(() => setLoadingQ(false));
                            }} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 transition-all">
                                <RefreshCw className={`w-4 h-4 ${loadingQ ? "animate-spin" : ""}`} />
                            </button>
                        </div>
                    </div>

                    {loadingQ ? (
                        <div className="p-12 flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="p-12 text-center">
                            <UploadCloud className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                            <p className="text-sm text-gray-400 font-medium">No questions yet. Upload a file to get started.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-wider border-b border-gray-100">
                                    <th className="px-6 py-3">#</th>
                                    <th className="px-6 py-3">Section</th>
                                    <th className="px-6 py-3">Question</th>
                                    <th className="px-6 py-3">Difficulty</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((q, i) => (
                                    <tr key={q.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-xs font-black text-gray-300">{i + 1}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-lg">{q.section}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-medium text-gray-900 line-clamp-2">{q.text}</p>
                                            <div className="flex gap-1.5 mt-1.5">
                                                {[q.optionA, q.optionB, q.optionC, q.optionD].map((opt, oi) => (
                                                    <span key={oi} className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded font-medium">
                                                        {String.fromCharCode(65 + oi)}: {opt}
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-black px-2 py-1 rounded-md ${diffColor(q.difficulty)}`}>{q.difficulty}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
        </div>
    );
}
