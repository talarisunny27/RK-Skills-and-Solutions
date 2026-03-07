"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ExamQuestion, ExamSubmitResponse } from "@/app/lib/types";
import { useUser } from "@clerk/nextjs";
import {
    Clock, CheckCircle2, AlertCircle, X, ChevronLeft, ChevronRight,
    Bookmark, Trash2, Send, Trophy, Target, ListChecks
} from "lucide-react";

type QuestionStatus = "not-visited" | "not-answered" | "answered" | "marked" | "answered-marked";

function formatTime(secs: number) {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

export default function ExamPage() {
    const { assessmentId } = useParams<{ assessmentId: string }>();
    const router = useRouter();
    const { user } = useUser();

    const [questions, setQuestions] = useState<ExamQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [statuses, setStatuses] = useState<Record<number, QuestionStatus>>({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [phase, setPhase] = useState<"instructions" | "exam" | "submitting" | "results">("instructions");
    const [confirmSubmit, setConfirmSubmit] = useState(false);
    const [result, setResult] = useState<ExamSubmitResponse | null>(null);
    const [durationMinutes, setDurationMinutes] = useState(60);

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Fetch questions
    useEffect(() => {
        fetch(`/api/exam/${assessmentId}/questions`)
            .then(r => r.json())
            .then(data => {
                setQuestions(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => { setError("Failed to load questions."); setLoading(false); });

        // Fetch assessment duration
        fetch("/api/assessments")
            .then(r => r.json())
            .then((data: any[]) => {
                const a = data.find((x: any) => String(x.id) === assessmentId);
                if (a?.duration) setDurationMinutes(a.duration);
            }).catch(() => {});
    }, [assessmentId]);

    // Start timer when exam begins
    useEffect(() => {
        if (phase !== "exam") return;
        setTimeLeft(durationMinutes * 60);
        timerRef.current = setInterval(() => {
            setTimeLeft(t => {
                if (t <= 1) { clearInterval(timerRef.current!); handleSubmit(true); return 0; }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(timerRef.current!);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase]);

    const sections = [...new Set(questions.map(q => q.section))];
    const questionsBySection = sections.map(s => questions.filter(q => q.section === s));

    const currentQ = questions[currentIdx];
    const currentSection = currentQ?.section;

    const goTo = (idx: number) => {
        if (currentQ) {
            setStatuses(prev => ({
                ...prev,
                [currentQ.id]: prev[currentQ.id] === "answered" || prev[currentQ.id] === "answered-marked"
                    ? prev[currentQ.id]
                    : "not-answered"
            }));
        }
        setCurrentIdx(idx);
    };

    const selectOption = (opt: string) => {
        if (!currentQ) return;
        setAnswers(prev => ({ ...prev, [currentQ.id]: opt }));
        setStatuses(prev => ({
            ...prev,
            [currentQ.id]: prev[currentQ.id] === "marked" || prev[currentQ.id] === "answered-marked"
                ? "answered-marked" : "answered"
        }));
    };

    const clearAnswer = () => {
        if (!currentQ) return;
        setAnswers(prev => { const n = { ...prev }; delete n[currentQ.id]; return n; });
        setStatuses(prev => ({ ...prev, [currentQ.id]: "not-answered" }));
    };

    const markAndNext = () => {
        if (!currentQ) return;
        setStatuses(prev => ({
            ...prev,
            [currentQ.id]: answers[currentQ.id] ? "answered-marked" : "marked"
        }));
        if (currentIdx < questions.length - 1) setCurrentIdx(currentIdx + 1);
    };

    const saveAndNext = () => {
        if (!currentQ) return;
        setStatuses(prev => ({ ...prev, [currentQ.id]: answers[currentQ.id] ? "answered" : "not-answered" }));
        if (currentIdx < questions.length - 1) setCurrentIdx(currentIdx + 1);
    };

    const handleSubmit = useCallback(async (auto = false) => {
        if (!auto && !confirmSubmit) { setConfirmSubmit(true); return; }
        clearInterval(timerRef.current!);
        setPhase("submitting");
        setConfirmSubmit(false);
        try {
            const res = await fetch(`/api/exam/${assessmentId}/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ answers }),
            });
            if (!res.ok) {
                const errData = await res.json().catch(() => ({}));
                throw new Error(errData?.error || `Server error (${res.status})`);
            }
            const data: ExamSubmitResponse = await res.json();
            setResult(data);
            setPhase("results");
        } catch (err: any) {
            setError(err.message || "Submission failed. Please try again.");
            setPhase("exam");
        }
    }, [answers, assessmentId, confirmSubmit]);

    const statusColor: Record<QuestionStatus, string> = {
        "not-visited": "bg-gray-100 text-gray-500 border border-gray-200",
        "not-answered": "bg-red-100 text-red-600 border border-red-200",
        "answered": "bg-emerald-500 text-white border border-emerald-500",
        "marked": "bg-amber-500 text-white border border-amber-500",
        "answered-marked": "bg-emerald-500 text-white border-4 border-amber-400",
    };

    if (loading) return (
        <div className="fixed inset-0 bg-gray-50 flex items-center justify-center">
            <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-gray-500 font-medium">Loading questions...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="fixed inset-0 bg-gray-50 flex items-center justify-center">
            <div className="text-center space-y-4">
                <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
                <p className="text-gray-700 font-bold">{error}</p>
                <button onClick={() => router.push("/assessments")} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold">Back to Assessments</button>
            </div>
        </div>
    );

    if (questions.length === 0) return (
        <div className="fixed inset-0 bg-gray-50 flex items-center justify-center">
            <div className="text-center space-y-4 max-w-sm">
                <ListChecks className="w-16 h-16 text-gray-300 mx-auto" />
                <h2 className="text-xl font-bold text-gray-800">No Questions Yet</h2>
                <p className="text-gray-500 text-sm">The admin hasn&apos;t uploaded a question paper for this assessment yet. Please check back later.</p>
                <button onClick={() => router.push("/assessments")} className="px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold">Back</button>
            </div>
        </div>
    );

    // Instructions Screen
    if (phase === "instructions") return (
        <div className="fixed inset-0 bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full p-8 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center">
                        <ListChecks className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-gray-900">Instructions</h1>
                        <p className="text-sm text-gray-500">Read before starting</p>
                    </div>
                </div>
                <ul className="space-y-3 text-sm text-gray-600">
                    {[
                        `This test has ${questions.length} questions across ${sections.length} section(s).`,
                        `Time allowed: ${durationMinutes} minutes. The test auto-submits when time runs out.`,
                        "Each correct answer carries 10 marks. No negative marking.",
                        "Use 'Mark & Next' to flag questions for review. Come back via the Question Palette.",
                        "You can change your answer any time before final submission.",
                        "Do not refresh or close the browser during the exam.",
                    ].map((text, i) => (
                        <li key={i} className="flex items-start gap-2">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-black mt-0.5">{i + 1}</span>
                            {text}
                        </li>
                    ))}
                </ul>
                <div className="flex gap-3 pt-2">
                    <button onClick={() => router.push("/assessments")} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
                    <button onClick={() => setPhase("exam")} className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                        Start Exam →
                    </button>
                </div>
            </div>
        </div>
    );

    // Results Screen
    if (phase === "results" && result) return (
        <div className="fixed inset-0 bg-gray-50 flex flex-col p-4 sm:p-6 overflow-y-auto w-full z-50">
            <div className="max-w-4xl w-full mx-auto space-y-6 max-h-full">
                {/* Summary Score Card */}
                <div className="bg-white rounded-3xl shadow-xl w-full p-8 text-center border-t-8 border-indigo-600">
                    <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${parseInt(result.percentage) >= 50 ? "bg-emerald-100" : "bg-rose-100"}`}>
                        <Trophy className={`w-10 h-10 ${parseInt(result.percentage) >= 50 ? "text-emerald-600" : "text-rose-500"}`} />
                    </div>
                    <div className="mt-4">
                        <h2 className="text-4xl font-black text-gray-900">{result.percentage}</h2>
                        <p className="text-gray-500 font-medium mt-1">Total Score: {result.score} marks</p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 mt-8">
                        {[
                            { label: "Correct", value: result.rightAnswers, color: "text-emerald-600 bg-emerald-50" },
                            { label: "Wrong", value: result.wrongAnswers, color: "text-rose-600 bg-rose-50" },
                            { label: "Total", value: result.totalQuestions, color: "text-indigo-600 bg-indigo-50" },
                        ].map(s => (
                            <div key={s.label} className={`rounded-2xl p-4 ${s.color}`}>
                                <p className="text-3xl font-black">{s.value}</p>
                                <p className="text-xs font-bold mt-1 opacity-70 uppercase tracking-widest">{s.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="flex gap-4 mt-8">
                        <button onClick={() => router.push("/assessments")} className="flex-1 py-4 border-2 border-gray-200 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all">Back to Dashboard</button>
                    </div>
                </div>

                {/* Detailed Review Section */}
                <div className="bg-white rounded-3xl shadow-xl p-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                            <ListChecks className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-900">Answer Review</h3>
                            <p className="text-sm text-gray-500 font-medium">Verify your answers against the correct solutions</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {questions.map((q, i) => {
                            // Find the result matching this question in the backend response
                            const qRes = result.results?.find(r => r.questionId === q.id);
                            if (!qRes) return null;

                            return (
                                <div key={q.id} className="border border-gray-200 rounded-2xl p-6 bg-gray-50/50">
                                    <div className="flex gap-4 items-start">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm ${qRes.isCorrect ? "bg-emerald-100 text-emerald-700" : (qRes.userAnswer ? "bg-rose-100 text-rose-700" : "bg-gray-200 text-gray-600")}`}>
                                            {i + 1}
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <p className="font-semibold text-gray-900">{q.text}</p>
                                            
                                            <div className="grid sm:grid-cols-2 gap-3">
                                                {[
                                                    { key: "A", val: q.optionA },
                                                    { key: "B", val: q.optionB },
                                                    { key: "C", val: q.optionC },
                                                    { key: "D", val: q.optionD },
                                                ].map(opt => {
                                                    const isCorrectAns = qRes.correctAnswer.trim().toUpperCase() === opt.key;
                                                    const isUserAns = qRes.userAnswer?.trim().toUpperCase() === opt.key;

                                                    let containerStyle = "border-gray-200 bg-white";
                                                    let icon = null;

                                                    if (isCorrectAns) {
                                                        containerStyle = "border-emerald-500 bg-emerald-50 shadow-sm ring-1 ring-emerald-500";
                                                        icon = <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
                                                    } else if (isUserAns && !isCorrectAns) {
                                                        containerStyle = "border-rose-400 bg-rose-50";
                                                        icon = <X className="w-5 h-5 text-rose-500" />;
                                                    }

                                                    return (
                                                        <div key={opt.key} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${containerStyle}`}>
                                                            <div className="flex items-center gap-3">
                                                                <span className="font-bold text-sm text-gray-500 w-5">{opt.key}.</span>
                                                                <span className={isCorrectAns ? "font-semibold text-emerald-900" : isUserAns ? "font-medium text-rose-900" : "text-gray-700"}>{opt.val}</span>
                                                            </div>
                                                            {icon}
                                                        </div>
                                                    )
                                                })}
                                            </div>

                                            {!qRes.userAnswer && (
                                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-200 text-gray-600 rounded-lg text-xs font-bold">
                                                    <AlertCircle className="w-3.5 h-3.5" /> Not Answered
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );

    // Main Exam UI
    const answeredCount = Object.values(statuses).filter(s => s === "answered" || s === "answered-marked").length;
    const markedCount = Object.values(statuses).filter(s => s === "marked" || s === "answered-marked").length;
    const isTimeLow = timeLeft < 300;

    return (
        <div className="fixed inset-0 flex flex-col bg-gray-50 overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 shadow-sm px-4 py-3 flex items-center justify-between gap-4 flex-shrink-0">
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-black text-xs">RK</span>
                    </div>
                    <div className="min-w-0">
                        <p className="text-sm font-black text-gray-900 truncate">Assessment #{assessmentId}</p>
                        <p className="text-[10px] text-gray-400 hidden sm:block">{questions.length} Questions • {sections.length} Sections</p>
                    </div>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-black text-sm tabular-nums
                        ${isTimeLow ? "bg-rose-50 border-rose-200 text-rose-600 animate-pulse" : "bg-gray-50 border-gray-200 text-gray-700"}`}>
                        <Clock className="w-4 h-4" />
                        {formatTime(timeLeft)}
                    </div>
                    <button
                        onClick={() => router.push("/assessments")}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all"
                    >
                        <X className="w-3.5 h-3.5" /> Exit
                    </button>
                    <button
                        onClick={() => handleSubmit(false)}
                        className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-black hover:bg-indigo-700 transition-all shadow-sm"
                    >
                        <Send className="w-3.5 h-3.5" /> Submit
                    </button>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Panel — Question */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Section Tabs */}
                    <div className="bg-white border-b border-gray-100 px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
                        {sections.map(sec => (
                            <button
                                key={sec}
                                onClick={() => {
                                    const firstQ = questions.find(q => q.section === sec);
                                    if (firstQ) goTo(questions.indexOf(firstQ));
                                }}
                                className={`px-3 py-1 rounded-lg text-xs font-bold whitespace-nowrap transition-all border
                                    ${currentSection === sec ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-200"}`}
                            >
                                {sec}
                            </button>
                        ))}
                    </div>

                    {/* Shortcuts */}
                    <div className="bg-gray-50 border-b border-gray-100 px-4 py-1.5 flex items-center gap-3 text-[10px] text-gray-400 font-bold">
                        <button onClick={saveAndNext} className="hover:text-indigo-600 transition-colors">Save & Next</button>
                        <span>•</span>
                        <button onClick={markAndNext} className="hover:text-amber-600 transition-colors">Mark & Next</button>
                        <span>•</span>
                        <button onClick={clearAnswer} className="hover:text-rose-600 transition-colors">Clear</button>
                    </div>

                    {/* Question */}
                    {currentQ && (
                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Question No. {currentIdx + 1}</p>
                                    <p className="text-gray-900 font-medium leading-relaxed text-sm sm:text-base">{currentQ.text}</p>
                                </div>
                                <span className="flex-shrink-0 text-[10px] font-black px-2 py-1 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                                    {currentQ.difficulty}
                                </span>
                            </div>

                            {/* Options */}
                            <div className="space-y-3">
                                {[
                                    { key: "A", val: currentQ.optionA },
                                    { key: "B", val: currentQ.optionB },
                                    { key: "C", val: currentQ.optionC },
                                    { key: "D", val: currentQ.optionD },
                                ].map(({ key, val }) => {
                                    const selected = answers[currentQ.id] === key;
                                    return (
                                        <button
                                            key={key}
                                            onClick={() => selectOption(key)}
                                            className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all
                                                ${selected
                                                    ? "bg-indigo-50 border-indigo-400 shadow-sm"
                                                    : "bg-white border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/40"}`}
                                        >
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 transition-all
                                                ${selected ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-500"}`}>
                                                {key}
                                            </div>
                                            <span className={`text-sm ${selected ? "text-indigo-900 font-semibold" : "text-gray-700"}`}>{val}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Navigation Footer */}
                    <div className="bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-between gap-3 flex-shrink-0">
                        <button
                            onClick={() => goTo(Math.max(0, currentIdx - 1))}
                            disabled={currentIdx === 0}
                            className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft className="w-4 h-4" /> Prev
                        </button>
                        <div className="flex gap-2">
                            <button onClick={markAndNext} className="flex items-center gap-1.5 px-4 py-2 border border-amber-200 bg-amber-50 text-amber-700 rounded-xl text-sm font-bold hover:bg-amber-100 transition-all">
                                <Bookmark className="w-3.5 h-3.5 fill-amber-500" /> Mark & Next
                            </button>
                            <button onClick={clearAnswer} className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all">
                                <Trash2 className="w-3.5 h-3.5" /> Clear
                            </button>
                        </div>
                        <button
                            onClick={() => goTo(Math.min(questions.length - 1, currentIdx + 1))}
                            disabled={currentIdx === questions.length - 1}
                            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                        >
                            Next <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Right Panel — Navigator */}
                <div className="hidden lg:flex flex-col w-72 bg-white border-l border-gray-100 overflow-y-auto">
                    {/* User Info */}
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-black flex-shrink-0">
                                {user?.firstName?.charAt(0) ?? "U"}
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">{user?.fullName ?? "Student"}</p>
                                <p className="text-[10px] text-gray-400">Student ID: {user?.id?.slice(-6)}</p>
                            </div>
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2">
                            <div className="bg-indigo-50 rounded-xl p-2 text-center">
                                <p className="text-lg font-black text-indigo-600">{answeredCount}</p>
                                <p className="text-[10px] text-indigo-500 font-bold">Answered</p>
                            </div>
                            <div className="bg-amber-50 rounded-xl p-2 text-center">
                                <p className="text-lg font-black text-amber-600">{markedCount}</p>
                                <p className="text-[10px] text-amber-500 font-bold">Marked</p>
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="p-4 border-b border-gray-100 space-y-2">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-3">Legend</p>
                        {[
                            { color: "bg-indigo-600", label: "Current" },
                            { color: "bg-emerald-500", label: "Answered" },
                            { color: "bg-red-400", label: "Not Answered" },
                            { color: "bg-amber-500", label: "Marked" },
                            { color: "bg-gray-100 border border-gray-200", label: "Not Visited" },
                        ].map(({ color, label }) => (
                            <div key={label} className="flex items-center gap-2">
                                <div className={`w-5 h-5 rounded-md ${color} flex-shrink-0`} />
                                <span className="text-xs text-gray-600">{label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Question Palette */}
                    <div className="p-4 flex-1">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-wider mb-3">Question Palette</p>
                        <div className="flex flex-wrap gap-2">
                            {questions.map((q, idx) => {
                                const st = statuses[q.id] ?? "not-visited";
                                const isCurrent = idx === currentIdx;
                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => goTo(idx)}
                                        className={`w-9 h-9 rounded-xl text-xs font-black transition-all
                                            ${isCurrent ? "ring-2 ring-offset-1 ring-indigo-600 bg-indigo-600 text-white" : statusColor[st]}`}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirm Submit Modal */}
            {confirmSubmit && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmSubmit(false)} />
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-amber-600" />
                            </div>
                            <div>
                                <h3 className="font-black text-gray-900">Submit Exam?</h3>
                                <p className="text-xs text-gray-500">This action cannot be undone.</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-3 gap-3 text-center text-sm">
                            <div><p className="font-black text-emerald-600">{answeredCount}</p><p className="text-[10px] text-gray-400">Answered</p></div>
                            <div><p className="font-black text-amber-600">{markedCount}</p><p className="text-[10px] text-gray-400">Marked</p></div>
                            <div><p className="font-black text-gray-600">{questions.length - answeredCount - Object.values(statuses).filter(s => s === "not-answered").length}</p><p className="text-[10px] text-gray-400">Not Visited</p></div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setConfirmSubmit(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
                            <button onClick={() => handleSubmit(true)} className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-700 transition-all">
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Submitting overlay */}
            {phase === "submitting" && (
                <div className="fixed inset-0 z-50 bg-white/80 backdrop-blur-md flex items-center justify-center">
                    <div className="text-center space-y-4">
                        <div className="w-14 h-14 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto" />
                        <p className="text-gray-700 font-black">Submitting your answers...</p>
                    </div>
                </div>
            )}
        </div>
    );
}
