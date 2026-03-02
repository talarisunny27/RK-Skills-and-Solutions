"use client";

import { useState, useEffect } from "react";
import {
    Plus,
    Search,
    Filter,
    Trash2,
    Edit2,
    XCircle,
    UploadCloud,
} from "lucide-react";
import { CollegeLevel, Question } from "@/app/lib/types";

const colleges: CollegeLevel[] = ["KMIT", "CBIT", "MGIT", "ALL"];
const difficulties = ["Easy", "Medium", "Hard"];

export default function AdminQuestions() {
    const [selectedCollege, setSelectedCollege] = useState<CollegeLevel>("ALL");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [newQuestion, setNewQuestion] = useState<Question>({
        text: "",
        options: ["", "", "", ""],
        correctAnswer: "A",
        difficulty: "Medium",
        college: "KMIT"
    });

    useEffect(() => {
        setQuestions([
            { id: 1, text: "What is the time complexity of binary search?", options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], correctAnswer: "B", difficulty: "Medium", college: "KMIT" },
            { id: 2, text: "Which keyword is used to define a class in Java?", options: ["define", "struct", "class", "object"], correctAnswer: "C", difficulty: "Easy", college: "CBIT" },
        ]);
    }, []);

    const handleAddQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const id = questions.length + 1;
        setQuestions([{ ...newQuestion, id }, ...questions]);
        setNewQuestion({ text: "", options: ["", "", "", ""], correctAnswer: "A", difficulty: "Medium", college: selectedCollege === "ALL" ? "KMIT" : selectedCollege });
        setIsAdding(false);
        setLoading(false);
    };

    const filteredQuestions = selectedCollege === "ALL"
        ? questions
        : questions.filter(q => q.college === selectedCollege);

    const difficultyBadge = (d: string) => {
        if (d === "Easy") return "bg-emerald-50 text-emerald-600 border border-emerald-100";
        if (d === "Medium") return "bg-amber-50 text-amber-600 border border-amber-100";
        return "bg-rose-50 text-rose-600 border border-rose-100";
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Question Bank</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Manage and organize questions for each college level.</p>
                </div>
                <button
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-200"
                >
                    <Plus className="w-5 h-5" />
                    Add Question
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white border border-gray-100 shadow-sm p-4 rounded-2xl flex flex-wrap gap-4 items-center">
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-xl border border-gray-200 min-w-[200px]">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                        value={selectedCollege}
                        onChange={(e) => setSelectedCollege(e.target.value as CollegeLevel)}
                        className="bg-transparent text-sm text-gray-700 focus:outline-none w-full cursor-pointer"
                    >
                        {colleges.map(c => <option key={c} value={c}>{c === "ALL" ? "All Colleges" : c}</option>)}
                    </select>
                </div>
                <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search questions..."
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                </div>
            </div>

            {/* Questions Table */}
            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-wider border-b border-gray-100">
                            <th className="px-6 py-4">Question</th>
                            <th className="px-6 py-4">College</th>
                            <th className="px-6 py-4">Difficulty</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredQuestions.map((q) => (
                            <tr key={q.id} className="hover:bg-gray-50 transition-colors group">
                                <td className="px-6 py-5">
                                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{q.text}</p>
                                    <div className="flex gap-2 mt-2">
                                        {q.options.map((opt, i) => (
                                            <span
                                                key={i}
                                                className={`text-[10px] px-2 py-0.5 rounded font-semibold ${String.fromCharCode(65 + i) === q.correctAnswer
                                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                    : 'bg-gray-100 text-gray-500'
                                                    }`}
                                            >
                                                {String.fromCharCode(65 + i)}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-5">
                                    <span className="text-xs font-bold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg">
                                        {q.college}
                                    </span>
                                </td>
                                <td className="px-6 py-5">
                                    <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${difficultyBadge(q.difficulty)}`}>
                                        {q.difficulty}
                                    </span>
                                </td>
                                <td className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-700 transition-all">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button className="p-2 hover:bg-rose-50 rounded-lg text-gray-400 hover:text-rose-500 transition-all">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Question Modal */}
            {isAdding && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsAdding(false)} />
                    <div className="relative bg-white border border-gray-100 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Create New Question</h2>
                            <button
                                onClick={() => setIsAdding(false)}
                                className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-all"
                            >
                                <XCircle className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleAddQuestion} className="p-6 space-y-6 overflow-y-auto">
                            {/* Question Text */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Question Text</label>
                                <textarea
                                    required
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 min-h-[100px] transition-all placeholder-gray-400"
                                    placeholder="Enter the question here..."
                                    value={newQuestion.text}
                                    onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                                />
                            </div>

                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">College Level</label>
                                    <select
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                        value={newQuestion.college}
                                        onChange={(e) => setNewQuestion({ ...newQuestion, college: e.target.value as CollegeLevel })}
                                    >
                                        {colleges.filter(c => c !== "ALL").map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Difficulty</label>
                                    <select
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                                        value={newQuestion.difficulty}
                                        onChange={(e) => setNewQuestion({ ...newQuestion, difficulty: e.target.value as any })}
                                    >
                                        {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Options */}
                            <div className="space-y-4">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Options & Correct Answer</label>
                                {newQuestion.options.map((opt, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <button
                                            type="button"
                                            onClick={() => setNewQuestion({ ...newQuestion, correctAnswer: String.fromCharCode(65 + i) })}
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all border text-sm
                                                ${newQuestion.correctAnswer === String.fromCharCode(65 + i)
                                                    ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                                                    : "bg-gray-50 border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-500"
                                                }`}
                                        >
                                            {String.fromCharCode(65 + i)}
                                        </button>
                                        <input
                                            required
                                            type="text"
                                            placeholder={`Option ${String.fromCharCode(65 + i)}`}
                                            className={`flex-1 bg-gray-50 border rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-all
                                                ${newQuestion.correctAnswer === String.fromCharCode(65 + i)
                                                    ? "border-indigo-300 ring-1 ring-indigo-200"
                                                    : "border-gray-200 hover:border-gray-300"
                                                }`}
                                            value={opt}
                                            onChange={(e) => {
                                                const next = [...newQuestion.options];
                                                next[i] = e.target.value;
                                                setNewQuestion({ ...newQuestion, options: next });
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="pt-4 flex gap-4">
                                <button
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    className="flex-1 py-3 px-6 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl font-bold transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition-all shadow-sm flex items-center justify-center gap-2"
                                >
                                    {loading
                                        ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        : <UploadCloud className="w-5 h-5" />
                                    }
                                    Create Question
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
