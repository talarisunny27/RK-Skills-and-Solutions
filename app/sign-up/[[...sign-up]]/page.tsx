import { SignUp } from "@clerk/nextjs";
import { GraduationCap, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function SignUpPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 via-blue-50 to-blue-400 p-4 sm:p-8 relative overflow-hidden">
            <div className="flex w-full max-w-5xl rounded-[2rem] overflow-hidden shadow-2xl bg-white min-h-[600px] relative z-10">

                {/* Left Side Container */}
                <div className="hidden md:flex flex-col flex-1 bg-[#1e253c] text-white p-12 justify-center relative overflow-hidden">

                    <div className="relative z-10 max-w-sm pl-4">
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mb-8 backdrop-blur-sm border border-white/20">
                            <GraduationCap className="w-8 h-8 text-white" />
                        </div>

                        <h1 className="text-3xl font-bold tracking-[0.2em] mb-4 text-white">RK SKILLS</h1>

                        <p className="text-gray-300 text-sm leading-relaxed mt-4 w-5/6">
                            Create an account to start your learning journey, take mock tests, and track your progress daily!
                        </p>
                    </div>
                </div>

                {/* The slanted divider & back button */}
                <div className="hidden md:block absolute left-[50%] top-0 bottom-0 w-32 bg-white -skew-x-[15deg] origin-bottom shadow-[-20px_0_30px_rgba(0,0,0,0.1)] z-20"></div>

                <div className="absolute left-[50%] top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 hidden md:flex items-center justify-center">
                    <Link href="/" className="w-14 h-14 rounded-full bg-rose-50 flex items-center justify-center border-[8px] border-white group transition-all shadow-md hover:shadow-lg">
                        <div className="w-10 h-10 rounded-full bg-[#cc5f6d] flex items-center justify-center text-white shadow-sm group-hover:bg-[#b04b58] transition-colors">
                            <ChevronLeft className="w-5 h-5 ml-1" />
                        </div>
                    </Link>
                </div>

                {/* Right Side Container */}
                <div className="flex-[1.2] flex items-center justify-center p-8 relative z-30 bg-white md:pl-20">
                    <div className="w-full max-w-lg flex flex-col pt-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Account</h2>
                        <p className="text-gray-500 text-sm mb-6">Sign up to get started</p>

                        <SignUp
                            afterSignUpUrl="/dashboard"
                            appearance={{
                                elements: {
                                    rootBox: 'w-full max-w-none flex justify-center',
                                    cardBox: 'w-full max-w-none',
                                    card: 'shadow-none w-full max-w-none bg-transparent p-0 flex flex-col',
                                    header: 'hidden',
                                    main: 'w-full px-1',
                                    socialButtonsBlockButton: 'border-gray-200 text-gray-700 hover:bg-gray-50',
                                    formButtonPrimary: 'bg-[#cc5f6d] hover:bg-[#b04b58] shadow-md text-white rounded-full py-3 mt-2 font-semibold text-lg hover:shadow-lg transition-all w-full',
                                    formFieldInput: 'rounded-full border-gray-200 py-3 px-5 w-full box-border',
                                    footerAction: 'justify-center',
                                    footer: 'bg-transparent border-0 pt-6',
                                    dividerRow: 'my-6',
                                    formFieldLabel: 'text-sm font-medium text-gray-700 ml-2 mb-1 block'
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
