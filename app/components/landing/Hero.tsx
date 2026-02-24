"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { SignInButton, useUser } from "@clerk/nextjs";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const { isSignedIn } = useUser(); // better than isSignedIn alone

  useEffect(() => {
    if (!headlineRef.current) return;

    gsap.fromTo(
      headlineRef.current,
      { y: 120, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.4,
        ease: "power3.out",
        // ease: [0.215, 0.61, 0.355, 1] as const, // power3.out equivalent
        scrollTrigger: {
          trigger: headlineRef.current,
          start: "top 85%",
        },
      }
    );
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-32 md:py-0">
      {/* Background orbs – keep your glows */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-cyan-500/20 to-purple-600/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-[-15%] right-[-15%] w-[70%] h-[70%] bg-gradient-to-tl from-pink-500/20 to-blue-600/30 rounded-full blur-3xl animate-pulse-slower" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 mb-8"
        >
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span className="text-sm font-medium">AI-Powered • College Level • Real-Time Ranks</span>
        </motion.div>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-none mb-8 bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300"
        >
          Dominate Your College Exams
          <br />
          <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            with RK Skills
          </span>
        </h1>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12"
        >
          Realistic mock tests • Live ranks & percentile • Detailed solution analysis • Personalized improvement suggestions — tailored for your college placements.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          {isSignedIn ? (
            <Button
              size="lg"
              className="px-10 py-7 text-lg font-bold bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 rounded-xl shadow-2xl shadow-purple-500/30 transition-all hover:scale-105"
            >
              <a href="/dashboard">
                Go to Dashboard <ArrowRight className="ml-2 w-6 h-6" />
              </a>
            </Button>
          ) : (
            <SignInButton mode="modal">
              <Button
                size="lg"
                className="px-10 py-7 text-lg font-bold bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-600 hover:to-purple-700 rounded-xl shadow-2xl shadow-purple-500/30 transition-all hover:scale-105"
              >
                Start Free with Google <ArrowRight className="ml-2 w-6 h-6" />
              </Button>
            </SignInButton>
          )}

          <Button
            size="lg"
            variant="outline"
            className="px-10 py-7 text-lg font-bold border-white/20 backdrop-blur-sm hover:bg-white/5 rounded-xl transition-all hover:scale-105"
          >
            Watch Demo
          </Button>
        </motion.div>

        {/* Trust signals */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="mt-16 flex flex-wrap justify-center gap-8 md:gap-12 text-sm md:text-base text-gray-400"
        >
          <div className="flex items-center gap-2">
            <span className="text-[#00D4FF] font-bold">10,000+</span> Students
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#22C55E] font-bold">500+</span> Companies
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#C8A951] font-bold">92%</span> Placement Rate
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#00D4FF] font-bold">AI-Powered</span> Insights
          </div>
        </motion.div>
      </div>
    </section>
  );
}