"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GraduationCap, User, Calendar, MapPin, ArrowRight } from "lucide-react";
import { completeOnboarding } from "./actions";

export default function OnboardingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        college: "",
        age: "",
        gender: "",
    });
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const result = await completeOnboarding({
                college: formData.college,
                age: parseInt(formData.age),
                gender: formData.gender,
            });

            if (result.success) {
                router.push("/dashboard");
            } else {
                setError(result.error || "Something went wrong. Please try again.");
            }
        } catch (err) {
            setError("An unexpected error occurred.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-blue-50 to-blue-400 p-4 sm:p-8 relative overflow-hidden">
            <div className="flex w-full max-w-5xl rounded-[2rem] overflow-hidden shadow-2xl bg-white min-h-[600px] relative z-10">

                {/* Left Side - Visual Branding */}
                <div className="hidden md:flex flex-col flex-1 bg-[#1e253c] text-white p-12 justify-center relative overflow-hidden">
                    <div className="relative z-10 max-w-sm pl-4">
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-8 backdrop-blur-sm border border-white/20">
                            <GraduationCap className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-[0.2em] mb-4 text-white">WELCOME!</h1>
                        <p className="text-gray-300 text-sm leading-relaxed mt-4 w-5/6">
                            We're excited to have you join RK SKILLS. Please provide a few more details to personalize your learning experience.
                        </p>
                    </div>
                    {/* Decorative slanted element matching sign-up style */}
                    <div className="absolute right-0 bottom-0 w-32 h-64 bg-white/5 -skew-x-[15deg] translate-x-16"></div>
                </div>

                {/* Right Side - Form */}
                <div className="flex-[1.2] flex items-center justify-center p-8 relative z-30 bg-white md:pl-20">
                    <div className="w-full max-w-lg flex flex-col">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Almost There</h2>
                        <p className="text-gray-500 text-sm mb-8">Personalize your profile to continue</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm mb-4">
                                    {error}
                                </div>
                            )}

                            <div>
                                <label className="text-sm font-medium text-gray-700 ml-2 mb-2 block flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-[#cc5f6d]" /> College Name
                                </label>
                                <select
                                    required
                                    className="w-full rounded-full border border-gray-200 py-3 px-5 focus:outline-none focus:ring-2 focus:ring-[#cc5f6d]/20 transition-all appearance-none bg-white"
                                    value={formData.college}
                                    onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                                >
                                    <option value="">Select your college</option>
                                    <option value="KMIT">KMIT</option>
                                    <option value="CBIT">CBIT</option>
                                    <option value="MGIT">MGIT</option>
                                </select>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 ml-2 mb-2 block flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-[#cc5f6d]" /> Age
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="15"
                                    max="100"
                                    placeholder="Enter your age"
                                    className="w-full rounded-full border border-gray-200 py-3 px-5 focus:outline-none focus:ring-2 focus:ring-[#cc5f6d]/20 transition-all"
                                    value={formData.age}
                                    onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 ml-2 mb-2 block flex items-center gap-2">
                                    <User className="w-4 h-4 text-[#cc5f6d]" /> Gender
                                </label>
                                <div className="flex gap-4">
                                    {["Male", "Female", "Other"].map((option) => (
                                        <label key={option} className="flex-1 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value={option}
                                                required
                                                className="hidden peer"
                                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                            />
                                            <div className="text-center py-2 px-4 rounded-full border border-gray-200 peer-checked:bg-[#cc5f6d] peer-checked:text-white peer-checked:border-[#cc5f6d] hover:border-[#cc5f6d]/50 transition-all text-sm">
                                                {option}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-[#cc5f6d] hover:bg-[#b04b58] disabled:opacity-50 shadow-md text-white rounded-full py-4 mt-4 font-semibold text-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? "Saving Details..." : (
                                    <>
                                        Complete Profile <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
