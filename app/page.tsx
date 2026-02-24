"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Trophy, Brain, Clock, BarChart3, Users, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import { BookOpen, Building2, Eye, Settings } from "lucide-react";
import { CalendarDays, Target, Timer, BookOpenCheck, LineChart } from "lucide-react";
import { Mail, Phone, MapPin, Linkedin, Instagram, Youtube, MessageCircle} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    sectionsRef.current.forEach((section) => {
      if (!section) return;
      gsap.fromTo(
        section,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, []);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !sectionsRef.current.includes(el)) {
      sectionsRef.current.push(el);
    }
  };

  return (
    <div className="min-h-screen text-gray-900 bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo + Brand Name */}
          <a href="/" className="flex items-center gap-4 group">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-rose-500 group-hover:border-rose-400 transition-all duration-500 shadow-md">
              <Image
                src="/team/logo.webp"
                alt="RK Skills and Solutions Logo"
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="flex flex-col">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black-600 group-hover:text-black-700 transition-colors">
                RK SKILLS AND SOLUTIONS
              </h1>
              <span className="text-xs sm:text-sm md:text-base font-medium text-gray-600">
                Industry-Aligned CRT & Technical Skills Training
              </span>
            </div>
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-10 text-gray-700 font-medium">
            <a href="#features" className="hover:text-indigo-600 transition-colors duration-300">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors duration-300">How It Works</a>
            <a href="#contact" className="hover:text-indigo-600 transition-colors duration-300">Contact</a>
          </div>

          {/* CTA Button */}
          <button className="hidden sm:flex items-center px-7 py-3 text-base font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg">
            Login / Sign Up
          </button>
        </div>
      </nav>

      {/* Hero */}
      {/* ── Improved Hero Section ── (Side Image Layout) */}
      <section ref={addToRefs} className="relative min-h-screen flex items-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-indigo-100 text-indigo-800 font-medium mb-8 shadow-sm mx-auto lg:mx-0"
              >
                <span>Daily Practice • Results • Leaderboard</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 1 }}
                className="text-4xl md:text-5xl lg:text-4xl xl:text-6xl font-extrabold tracking-tight mb-8 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-700 via-orange-600 to-indigo-600"
              >
                Develop placement confidence with advanced CRT and technical skills,
                <br />

              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.9 }}
                className="text-lg md:text-xl lg:text-2xl text-gray-700 max-w-3xl mx-auto lg:mx-0 mb-12 leading-relaxed"
              >
                An integrated learning platform that enables daily practice, mock assessments, real-time results, and continuous improvement—built for seamless adoption across college batches.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 1 }}
                className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start"
              >
                <button className="px-10 py-5 text-xl font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all shadow-lg hover:shadow-red-500/40 hover:scale-105">
                  Enroll Now →
                </button>
                <button className="px-10 py-5 text-xl font-bold rounded-xl border-2 border-blue-600 text-blue-700 hover:bg-blue-50 transition-all">
                  Platform Features
                </button>
                <button className="px-10 py-5 text-xl font-bold rounded-xl bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all">
                  Talk to Counselor
                </button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 1 }}
                className="mt-12 flex flex-wrap justify-center lg:justify-start gap-6 text-sm md:text-base text-gray-600"
              >
                {["Aptitude", "Reasoning", "Verbal", "Communication", "Coding drills", "Company patterns"].map((tag) => (
                  <div key={tag} className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200">
                    <span className="text-emerald-600 font-bold">✔</span>
                    <span className="font-medium">{tag}</span>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Side Image */}
            <motion.div
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ delay: 0.6, duration: 1.2, ease: [0.215, 0.61, 0.355, 1] }}
              className="relative hidden lg:block"
            >
              <div className="relative w-full max-w-xl mx-auto lg:max-w-3xl"> {/* ← increased from max-w-lg to max-w-2xl */}
                <Image
                  src="/team/land.webp"
                  alt="Students collaborating on placement preparation"
                  width={2500}          // ← increased width
                  height={2500}         // ← increased height (keep ratio)
                  className="object-cover rounded-3xl shadow-2xl border-8 border-white"
                  priority
                  quality={95}
                />
                {/* floating orb – optional, can scale too */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                  className="absolute -top-16 -right-16 w-48 h-48 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full blur-3xl opacity-30"
                />
              </div>
            </motion.div>

            {/* Mobile version of image (below text) */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="lg:hidden mt-12"
            >
              <Image
                src="/team/land.webp"
                alt="Students collaborating on placement preparation"
                width={600}
                height={600}
                className="object-cover rounded-3xl shadow-2xl w-full max-w-md mx-auto"
                priority
                quality={90}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section ref={addToRefs} id="platform-features" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold"
            >
              <span>PLATFORM FEATURES</span>
              <span>•</span>
              <span>CRT + Technical + Placement</span>
            </motion.div>

            <h2 className="mt-8 text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900">
              Comprehensive Toolkit for Placement Excellence
            </h2>

            <p className="mt-6 text-xl md:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              An integrated, structured learning ecosystem combining strategic daily planning, focused practice, comprehensive assessments, performance analytics, progress tracking, and continuous motivation in one platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Daily Plan & Targets",
                desc: "Auto-structured daily tasks with clear checkpoints for CRT + coding.",
                image: "/team/card-Plan.png",
                alt: "Daily planner and checklist on laptop",
              },
              {
                title: "Topic Practice (CRT + Tech)",
                desc: "Chapter-wise question sets with increasing difficulty and revision loops.",
                image: "/team/images.jfif",
                alt: "Student practicing coding and questions on computer",
              },
              {
                title: "Mock Tests",
                desc: "Timed mocks that simulate real placement tests with auto-submit & patterns.",
                image: "/team/card-tests.png",
                alt: "Online timed test with timer on screen",
              },
              {
                title: "Solutions & Explanations",
                desc: "Step-by-step solutions, shortcuts, and common mistake highlights.",
                image: "/team/solutions.avif",
                alt: "Step-by-step code explanation on screen",
              },
              {
                title: "Performance Analytics",
                desc: "Accuracy, speed, weak areas, topic mastery, and improvement guidance.",
                image: "/team/card-results.png",
                alt: "Analytics dashboard with charts and graphs",
              },
              {
                title: "Leaderboards & Motivation",
                desc: "Live ranks, weekly streaks, and rewards to keep consistency strong.",
                image: "/team/card-leaderboard.png",
                alt: "Leaderboard ranking and trophy celebration",
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.08 }}
                className="group relative rounded-3xl overflow-hidden bg-white border border-gray-200 hover:border-indigo-500 transition-all duration-500 shadow-md hover:shadow-xl"
              >
                {/* Feature Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={f.image}
                    alt={f.alt}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {f.title}
                  </h3>

                  <p className="text-gray-600 text-lg leading-relaxed">
                    {f.desc}
                  </p>

                  <div className="mt-7 h-[3px] w-16 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 group-hover:from-sky-500 group-hover:to-emerald-500 transition-all" />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom CTA block */}
          <div className="mt-16 flex flex-col md:flex-row items-center justify-between gap-6 rounded-3xl bg-blue-50 border border-blue-200 p-10 shadow-md">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                Want a guided plan for your batch?
              </h3>
              <p className="mt-2 text-gray-600 text-lg">
                We set targets, track progress, and push improvement week by week.
              </p>
            </div>

            <div className="flex gap-4">
              <button className="px-8 py-4 rounded-xl font-bold bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
                Start Free Trial →
              </button>
              <button className="px-8 py-4 rounded-xl font-bold border border-blue-500 text-blue-600 hover:bg-blue-50 transition-all">
                Request a Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Training Focus ── (light theme) */}
      <section ref={addToRefs} className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Top badge + headline */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-indigo-100 text-indigo-800 text-sm font-semibold border border-indigo-200 mb-6 shadow-sm"
            >
              <span>TRAINING FOCUS</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
              A daily system that improves scores and placement confidence
            </h2>

            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              A performance-driven framework that connects practice, mock assessments, and actionable feedback to deliver measurable results.
            </p>
          </div>

          {/* Trusted stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex flex-wrap justify-center gap-6 mb-16"
          >
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium">
              <span className="text-emerald-600 font-bold">Since 2016</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium">
              <span className="text-blue-600 font-bold">40+ colleges</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 font-medium">
              <span className="text-indigo-600 font-bold">10k+ students</span>
            </div>
            <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-medium">
              <span className="font-bold">Trusted</span>
            </div>
          </motion.div>

          {/* Two main columns */}
          <div className="grid lg:grid-cols-2 gap-8 mb-16">
            {/* Left – Training loop */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="rounded-3xl bg-white border border-gray-200 p-8 md:p-10 hover:border-emerald-500 transition-all duration-500 shadow-md hover:shadow-xl group"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-3xl font-bold text-gray-900">Training loop (daily)</h3>
                <span className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium border border-emerald-200">
                  Repeatable
                </span>
              </div>

              <p className="text-gray-600 mb-8">
                Simple workflow that creates consistent progress.
              </p>

              <ul className="space-y-6 text-gray-700">
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-emerald-700 font-bold">1</span>
                  </div>
                  <div>
                    <span className="font-semibold text-emerald-700">Concept clarity</span>
                    <p className="text-gray-600 mt-1">Explain → simplify → shortcut methods.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-emerald-700 font-bold">2</span>
                  </div>
                  <div>
                    <span className="font-semibold text-emerald-700">Timed practice</span>
                    <p className="text-gray-600 mt-1">Worksheets + drills to build speed.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-emerald-700 font-bold">3</span>
                  </div>
                  <div>
                    <span className="font-semibold text-emerald-700">Mock tests</span>
                    <p className="text-gray-600 mt-1">Company patterns and exam-style sets.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-emerald-700 font-bold">4</span>
                  </div>
                  <div>
                    <span className="font-semibold text-emerald-700">Vedic Mathematics</span>
                    <p className="text-gray-600 mt-1">Mental math techniques for faster calculations.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-emerald-700 font-bold">5</span>
                  </div>
                  <div>
                    <span className="font-semibold text-emerald-700">Feedback</span>
                    <p className="text-gray-600 mt-1">Performance tracking + next steps.</p>
                  </div>
                </li>
              </ul>
            </motion.div>

            {/* Right – Program coverage + bottom box */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="space-y-8"
            >
              <div className="rounded-3xl bg-white border border-gray-200 p-8 md:p-10 hover:border-emerald-500 transition-all duration-500 shadow-md hover:shadow-xl group">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-3xl font-bold text-gray-900">Program coverage</h3>
                  <span className="px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium border border-emerald-200">
                    Complete
                  </span>
                </div>

                <p className="text-gray-600 mb-8">
                  CRT + interview + technical readiness.
                </p>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Aptitude</h4>
                    <p className="text-gray-600">Shortcuts + DI</p>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Reasoning</h4>
                    <p className="text-gray-600">Patterns + puzzles</p>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Verbal</h4>
                    <p className="text-gray-600">RC + grammar</p>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Communication</h4>
                    <p className="text-gray-600">Speaking confidence</p>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Soft skills</h4>
                    <p className="text-gray-600">Etiquette + GD</p>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Interviews</h4>
                    <p className="text-gray-600">HR + technical</p>
                  </div>
                </div>
              </div>

              {/* Bottom small box – Need a campus plan? */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="rounded-3xl bg-blue-50 border border-blue-200 p-8 text-center hover:border-blue-400 transition-all shadow-md hover:shadow-lg"
              >
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Need a campus plan?</h3>
                <p className="text-gray-600 mb-6">
                  Get duration + module plan based on your batch.
                </p>
                <button className="px-8 py-4 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-md hover:shadow-lg">
                  Request plan →
                </button>
              </motion.div>
            </motion.div>
          </div>

          {/* Bottom tags row */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="flex flex-wrap justify-center gap-4 text-sm text-gray-600"
          >
            {["Study material", "Practice sheets", "Mock interviews", "Resume + LinkedIn"].map((item) => (
              <div
                key={item}
                className="px-6 py-3 rounded-full bg-indigo-50 border border-indigo-200 hover:border-indigo-400 hover:text-indigo-700 transition-all"
              >
                {item}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Student Journey  */}
      <section ref={addToRefs} className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Top badge + headline */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-blue-100 text-blue-800 text-sm font-semibold border border-blue-200 mb-6 shadow-sm"
            >
              <span>STUDENT JOURNEY</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
              How students improve week by week
            </h2>

            <p className="text-xl text-gray-700 max-w-4xl mx-auto">
              A predictable process that colleges can run for every batch.
            </p>
          </div>

          {/* Main grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left column – Student side */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="space-y-6"
            >
              <div className="rounded-3xl bg-white border border-gray-200 p-8 md:p-10 hover:border-emerald-500 transition-all duration-500 shadow-md hover:shadow-xl group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-2xl font-bold text-emerald-700 border border-emerald-200">
                    ①
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Daily plan</h3>
                </div>
                <p className="text-gray-600 text-lg">
                  Students follow a simple target list.
                </p>
              </div>

              <div className="rounded-3xl bg-white border border-gray-200 p-8 md:p-10 hover:border-emerald-500 transition-all duration-500 shadow-md hover:shadow-xl group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-2xl font-bold text-emerald-700 border border-emerald-200">
                    ②
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Practice + timed tests</h3>
                </div>
                <p className="text-gray-600 text-lg">
                  Regular tests build speed and accuracy.
                </p>
              </div>

              <div className="rounded-3xl bg-white border border-gray-200 p-8 md:p-10 hover:border-emerald-500 transition-all duration-500 shadow-md hover:shadow-xl group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-2xl font-bold text-emerald-700 border border-emerald-200">
                    ③
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Instant results</h3>
                </div>
                <p className="text-gray-600 text-lg">
                  See weak areas and fix them fast.
                </p>
              </div>

              <div className="rounded-3xl bg-white border border-gray-200 p-8 md:p-10 hover:border-emerald-500 transition-all duration-500 shadow-md hover:shadow-xl group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-2xl font-bold text-emerald-700 border border-emerald-200">
                    ④
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Leaderboard + improvement</h3>
                </div>
                <p className="text-gray-600 text-lg">
                  Consistency + motivation through rankings.
                </p>
              </div>
            </motion.div>

            {/* Right column – For Colleges */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="space-y-6"
            >
              <div className="rounded-3xl bg-white border border-gray-200 p-8 md:p-10 hover:border-blue-500 transition-all duration-500 shadow-md hover:shadow-xl group">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-2xl">
                    <span className="text-blue-600">📋</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">For Colleges</h3>
                </div>
                <p className="text-gray-600 text-lg mb-8">
                  Run a batch with weekly targets and track performance easily.
                </p>

                <div className="grid grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Tracking</h4>
                    <p className="text-gray-600 text-sm">Daily reports</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Tests</h4>
                    <p className="text-gray-600 text-sm">Company pattern</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Students</h4>
                    <p className="text-gray-600 text-sm">Batch control</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">Mentors</h4>
                    <p className="text-gray-600 text-sm">Guidance flow</p>
                  </div>
                </div>
              </div>

              {/* Bottom CTA box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="rounded-3xl bg-gradient-to-r from-orange-500 to-orange-600 p-10 text-center shadow-xl"
              >
                <button className="px-10 py-5 text-xl font-bold rounded-xl bg-white text-orange-700 hover:bg-orange-50 transition-all shadow-lg">
                  Talk to us for onboarding
                </button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section ref={addToRefs} className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-16">Results That Speak Louder</h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div>
              <div className="text-6xl font-extrabold text-emerald-600">85%</div>
              <p className="text-xl mt-4 text-gray-600">Students report faster solving speed</p>
            </div>
            <div>
              <div className="text-6xl font-extrabold text-blue-600">4x</div>
              <p className="text-xl mt-4 text-gray-600">More attempts cracked after 30 days</p>
            </div>
            <div>
              <div className="text-6xl font-extrabold text-indigo-600">Top 10%</div>
              <p className="text-xl mt-4 text-gray-600">Consistent rankers get dream offers</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={addToRefs} className="py-24 px-6 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">Ready to Land Your Dream Job?</h2>
          <p className="text-2xl text-gray-600 mb-12">
            Join thousands of students transforming their placement game – daily.
          </p>
          <button className="px-12 py-7 text-2xl font-bold rounded-2xl bg-red-600 hover:bg-red-700 text-white transition-all shadow-xl hover:shadow-red-500/30 hover:scale-105">
            Start Your Journey Today – It's Free
          </button>
        </div>
      </section>

      {/* CEO */}
      <section ref={addToRefs} id="ceo" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-orange-100 text-orange-800 text-sm font-semibold border border-orange-200 mb-6 shadow-sm"
            >
              <span>○ VISION & LEADERSHIP</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
              Governance that drives measurable student outcomes
            </h2>

            <p className="text-xl text-gray-700 max-w-4xl mx-auto">
              Structured leadership, disciplined execution, and transparent evaluation.
            </p>
          </div>

          {/* ── Your existing CEO grid content (unchanged) ── */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.215, 0.61, 0.355, 1] }}
              className="relative rounded-3xl overflow-hidden bg-white border border-gray-200 hover:border-indigo-500 transition-all duration-500 shadow-lg hover:shadow-xl group"
            >
              <div className="p-8 md:p-12 relative z-10">
                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-indigo-100 text-indigo-800 font-semibold text-sm mb-8">
                  <span>CHIEF EXECUTIVE OFFICER</span>
                  <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                </div>

                <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto mb-10 rounded-full overflow-hidden border-8 border-indigo-200 group-hover:border-indigo-400 transition-all duration-500 shadow-lg">
                  <Image
                    src="/team/RK.jpg"
                    alt="M.K. Radhakrishna - CEO & Founder"
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 192px, 256px"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg=="
                    priority
                  />
                </div>

                <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-indigo-600">
                  M.K. Radhakrishna
                </h2>

                <p className="text-xl text-gray-600 font-semibold text-center mb-8">
                  CEO & Founder — RK Skills & Solutions
                </p>

                <blockquote className="text-xl md:text-2xl italic text-gray-700 text-center mb-10 leading-relaxed border-l-4 border-emerald-500 pl-6">
                  "Our methodology is built on a structured improvement cycle: guided learning, timed practice, performance testing, analytical review, and strategic corrective intervention—driving sustained progress for every learner."
                </blockquote>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
                  <div className="flex items-start gap-4">
                    <BookOpen className="w-6 h-6 text-sky-600 mt-1 flex-shrink-0" />
                    <p className="font-semibold">Curriculum strategy & alignment</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <BarChart3 className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                    <p className="font-semibold">Evaluation & performance metrics</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <Users className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
                    <p className="font-semibold">Trainer standards & mentoring</p>
                  </div>
                  <div className="flex items-start gap-4">
                    <Building2 className="w-6 h-6 text-violet-600 mt-1 flex-shrink-0" />
                    <p className="font-semibold">College partnerships</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
                  <button className="px-10 py-5 text-lg font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
                    Contact
                  </button>
                  <button className="px-10 py-5 text-lg font-bold rounded-xl border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 transition-all">
                    View Testimonials
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.215, 0.61, 0.355, 1] }}
              className="space-y-12"
            >
              <div className="rounded-3xl p-10 bg-white border border-gray-200 hover:border-indigo-500 transition-all shadow-lg hover:shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <Eye className="w-10 h-10 text-sky-600" />
                  <h3 className="text-3xl font-bold text-gray-900">Organizational Vision</h3>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  A structured vision designed for placement readiness.
                </p>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">Vision</h4>
                    <p className="text-gray-700">
                      To become a trusted placement transformation ecosystem that empowers every student with the competence, confidence, and consistency required to succeed in competitive campus hiring environments.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl p-10 bg-white border border-gray-200 hover:border-indigo-500 transition-all shadow-lg hover:shadow-xl">
                <div className="flex items-center gap-4 mb-6">
                  <Settings className="w-10 h-10 text-indigo-600" />
                  <h3 className="text-3xl font-bold text-gray-900">Operating Model</h3>
                </div>

                <ul className="space-y-5 text-gray-600 text-lg">
                  {[
                    "Daily structured practice",
                    "Weekly targets & checkpoints",
                    "Mock tests with analysis",
                    "Transparent progress reports",
                  ].map((x, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 mt-1 flex-shrink-0" />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-3xl p-10 bg-blue-50 border border-blue-200 text-center shadow-lg">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">For Colleges</h3>
                <p className="text-gray-600 mb-8">
                  Structured placement programs with defined targets, evaluation frameworks, and visible student improvement.
                </p>
                <button className="px-10 py-5 text-lg font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all shadow-md hover:shadow-lg">
                  Request a Demo →
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section ref={addToRefs} id="team" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6">
                Meet the RK Skills Team
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Passionate trainers, experienced mentors, and placement experts dedicated to turning your college dreams into reality. We're here to guide you every step of the way.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-12">
            {[
              {
                name: "Giriyam Sai Narasimha",
                role: "Chief Advisory Officer (CAO)",
                bio: "IIT Alumni",
                imgPlaceholder: "/team/sai.jpeg",
              },
              {
                name: "Talari Venkata Sunny",
                role: "Chief Technology Officer (CTO)",
                bio: "Head of Technical Wing All Over India, IIT alumni. Builds our platform, AI features & personalized learning engine.",
                imgPlaceholder: "/team/1.jpg",
              },
              {
                name: "Arunkumar B Hosalli",
                role: "Cofounder",
                bio: "Head affairs, karnataka.",
                imgPlaceholder: "/team/2.jpg",
              },
              {
                name: "M.K.Pavani Krishna",
                role: "Cofounder",
                bio: "Chief Strategist, IIM alumni. Leads overall vision, content strategy & mentorship.",
                imgPlaceholder: "/team/4.jpg",
              },
            ].map((member, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 60, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: i * 0.15 }}
                whileHover={{ scale: 1.05, y: -10 }}
                className="group relative overflow-hidden rounded-2xl bg-white border border-gray-200 hover:border-indigo-500 transition-all duration-500 shadow-md hover:shadow-xl"
              >
                <div className="p-8 text-center relative z-10">
                  <div className="relative w-40 h-40 md:w-60 md:h-60 mx-auto mb-16 rounded-full overflow-hidden border-4 md:border-6 border-pink-200 group-hover:border-pink-400 transition-all duration-400 shadow-md">
                    <Image
                      src={member.imgPlaceholder}
                      alt={`${member.name} - ${member.role}`}
                      fill
                      className="object-cover"
                      sizes="600px"
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+/HgAFhAJ/wlseKgAAAABJRU5ErkJggg=="
                      priority={i < 2}
                    />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {member.name}
                  </h3>
                  <p className="text-sky-600 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>

                  <div className="mt-6 flex justify-center gap-4 opacity-70 group-hover:opacity-100 transition-opacity">
                    <a href="#" className="text-gray-500 hover:text-sky-600 transition-colors">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-16 text-gray-600">
            <p>We're a small but passionate team in Bengaluru, fully committed to your placement success.</p>
          </div>
        </div>
      </section>


      {/* ── Student Reviews */}
      <section ref={addToRefs} className="py-20 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          {/* Top badge + headline */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-orange-100 text-orange-800 text-sm font-semibold border border-orange-200 mb-6 shadow-sm"
            >
              <span>○ STUDENT REVIEWS</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
              Student progress across recent batches
            </h2>

            <p className="text-xl text-gray-700 max-w-4xl mx-auto">
              Feedback on practice, results, confidence, and consistency.
            </p>
          </div>

          {/* Stats circles row */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 text-center"
          >
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md">
              <div className="text-5xl font-bold text-orange-600 mb-2">96%</div>
              <p className="text-gray-600">Average rating</p>
              <p className="text-sm text-gray-500">4.8 / 5</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md">
              <div className="text-5xl font-bold text-emerald-600 mb-2">85%</div>
              <p className="text-gray-600">Speed Improved</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md">
              <div className="text-5xl font-bold text-blue-600 mb-2">88%</div>
              <p className="text-gray-600">Accuracy Up</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-md">
              <div className="text-5xl font-bold text-indigo-600 mb-2">92%</div>
              <p className="text-gray-600">Consistency Daily</p>
            </div>
          </motion.div>

          {/* Reviews heading */}
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
              Reviews from recent batches
            </h3>
          </div>

          {/* Auto-scrolling infinite carousel */}
          <div className="relative overflow-hidden">
            <div className="animate-scroll-left flex gap-6 py-4">
              {/* Duplicate cards to create seamless loop */}
              {[
                // Card 1 - Featured
                {
                  isFeatured: true,
                  quote: "The daily practice + timed mocks changed my routine. I stopped guessing and started improving. The results page shows exactly what to fix next day.",
                  tags: ["Daily tests", "Timed mocks", "Result insights"],
                },
                // Card 2
                {
                  name: "Baddaram Padmini",
                  branch: "BVRITW, HYDERABAD",
                  quote: "RK Skills & Solutions has excellent expert faculty! They are very friendly and always ready to help. The teachers explain everything clearly and make learning fun. I feel confident in showing my professional skills. The classes are well-organized, and I learn a lot in each session. I highly recommend RK Skills & Solutions for anyone who wants to improve their skills!",
                  tags: ["Expert faculty", "Confidence", "Skill improvement focused"],
                },
                // Card 3
                {
                  name: "Vaishnava Akshaya",
                  branch: "GPREC, KURNOOL",
                  quote: "It is very enthusiastic and interesting to be present in Radha Krishna sirs class. like mentioned in the company name, sirs class is skill developing to students and provides us solutions. your class is supercalifragilisticexpialidocious.",
                  tags: ["Improvement tips", "Enthusiastic & interesting classes"],
                },
                // Card 4
                {
                  name: "Dhoni daniel",
                  branch: "GPREC, KURNOOL",
                  quote: "RK Skills & Solutions is truly a gem among coaching centres! The quality of courses offered is exceptional, catering to various skill levels and needs. The instructors are knowledgeable and approachable, ensuring that every student receives personalized attention. The well-structured curriculum and practical approach make learning enjoyable and effective. Highly recommended for anyone looking to enhance their skills!",
                  tags: ["Quality courses", "Knowledgeable instructors", "Practical approach"],
                },
                // Card 5
                {
                  name: "Konepalli Lavanya",
                  branch: "BVRITW, HYDERABAD",
                  quote: "I had a good experience with RK Skills & Solutions, a coaching center. They offer very special and high-quality courses. The teachers are helpful and know a lot about the subjects. The classes are interesting and easy to follow. I learned new skills that can help me in my studies or job. The place is nice, and the staff is friendly. I feel happy with my learning here. Overall, RK Skills & Solutions is a great choice for anyone who wants to improve their skills!",
                  tags: ["Highly specialised courses", "High-quality courses"],
                },
                {
                  name: "Raju Gummala",
                  branch: "GPREC, KURNOOL",
                  quote: "Fantastic, mind blowing unbelievable teaching by Radha Krishna sir. Just like a wow 👍",
                  tags: ["Highly impressive instructor (Radha Krishna sir)", "Confidence"],
                },
                {
                  name: "Varshini Kalliganur",
                  branch: "GPREC, KURNOOL",
                  quote: "RK sir explains concepts very clearly and motivates every student. His new company provides excellent guidance and helps us improve problem-solving skills. I strongly recommend it to all learners.",
                  tags: ["Clear concept explanation", "Confidence"],
                },
              ].map((review, idx) => (
                <div
                  key={idx}
                  className={`flex-shrink-0 w-80 md:w-96 bg-white border border-gray-200 rounded-3xl p-6 shadow-md hover:shadow-xl transition-all ${
                    review.isFeatured ? "border-orange-300 bg-orange-50/30" : ""
                  }`}
                >
                  {review.isFeatured && (
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold">
                          ★
                        </div>
                        <span className="font-semibold text-gray-900">Featured Review</span>
                      </div>
                      <div className="flex text-orange-500">★★★★★</div>
                    </div>
                  )}

                  {!review.isFeatured && (
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-600">👤</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{review.name}</p>
                          <p className="text-sm text-gray-600">{review.branch}</p>
                        </div>
                      </div>
                      <div className="flex text-orange-500">★★★★★</div>
                    </div>
                  )}

                  <blockquote className="text-gray-700 italic mb-6">
                    "{review.quote}"
                  </blockquote>

                  <div className="flex flex-wrap gap-2">
                    {review.tags.map((tag, i) => (
                      <span
                        key={i}
                        className={`px-3 py-1 rounded-full text-sm ${
                          review.isFeatured
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-50 text-blue-700"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CSS for smooth infinite scroll */}
        <style jsx>{`
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll-left {
            display: flex;
            animation: scroll-left 30s linear infinite;
            width: max-content;
          }
          .animate-scroll-left:hover {
            animation-play-state: paused;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </section>


      {/* ── Study Motivation ── (light theme) */}
      <section ref={addToRefs} className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          {/* Top badge + headline */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-orange-100 text-orange-800 text-sm font-semibold border border-orange-200 mb-6 shadow-sm"
            >
              <span>○ STUDY MOTIVATION</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-4">
              Small words. Big discipline.
            </h2>

            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discipline • Focus • Consistency • Courage
            </p>
          </div>

          {/* Two quote cards – side by side on desktop, stacked on mobile */}
          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Card 1 - Swami Vivekananda */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="bg-white border border-gray-200 rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-orange-200 flex-shrink-0">
                  <Image
                    src="/team/vivek.jpeg" 
                    alt="Swami Vivekananda"
                    width={64}
                    height={64}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Swami Vivekananda</h3>
                  <p className="text-sm text-gray-600">Discipline • Focus</p>
                </div>
                <span className="ml-auto px-4 py-1.5 rounded-full bg-orange-50 text-orange-700 text-sm font-medium border border-orange-200">
                  Study
                </span>
              </div>

              <blockquote className="text-gray-700 italic text-lg leading-relaxed">
                "Dare to be Free, dare to go as far as your thought leads, and dare to carry that you in your life."
              </blockquote>
            </motion.div>

            {/* Card 2 - Subhas Chandra Bose */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="bg-white border border-gray-200 rounded-3xl p-8 shadow-md hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-orange-200 flex-shrink-0">
                  <Image
                    src="/team/bose.jpeg" 
                    alt="Subhas Chandra Bose"
                    width={594}
                    height={594}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Subhas Chandra Bose</h3>
                  <p className="text-sm text-gray-600">Consistency • Courage</p>
                </div>
                <span className="ml-auto px-4 py-1.5 rounded-full bg-orange-50 text-orange-700 text-sm font-medium border border-orange-200">
                  Practice
                </span>
              </div>

              <blockquote className="text-gray-700 italic text-lg leading-relaxed">
                "Life loses half its interest if there is no struggle—if there are no risks to be taken."
              </blockquote>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Enquiry Form  */}

      <section ref={addToRefs} id="contact" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Top badge + heading */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-orange-100 text-orange-800 text-sm font-semibold border border-orange-200 mb-6 shadow-sm"
            >
              <span>○ CONTACT</span>
            </motion.div>

            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6">
              Enquiry Form
            </h2>

            <p className="text-xl text-gray-700 max-w-4xl mx-auto">
              Fill your details and we'll call you back with batch timings and demo info.
            </p>
          </div>

          {/* Two-column layout: Company Info + Form */}
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left: Company Info */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="rounded-3xl bg-white border border-gray-200 p-8 md:p-12 shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                RK Skills & Solutions
              </h3>

              <p className="text-gray-700 text-lg mb-8">
                Placement-focused CRT & Technical Training with daily practice and mock tests.
              </p>

              <ul className="space-y-4 text-gray-700 mb-10">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  Structured weekly targets
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  Timed assessments & mock tests
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  Instant results & leaderboard
                </li>
              </ul>

              <div className="flex flex-col gap-4">
                <a
                  href="mailto:rkskillsandsolutions@gmail.com"
                  className="flex items-center gap-3 text-gray-700 hover:text-orange-600 transition-colors"
                >
                  <span className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-orange-600">
                    ✉
                  </span>
                  rkskillsandsolutions@gmail.com
                </a>

                <a
                  href="https://wa.me/918341391285"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-700 hover:text-green-600 transition-colors"
                >
                  <span className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xl">
                    💬
                  </span>
                  +91 8341391285
                </a>
              </div>
            </motion.div>

            {/* Right: Form */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9 }}
              className="rounded-3xl bg-white border border-gray-200 p-8 md:p-12 shadow-lg hover:shadow-xl transition-shadow"
            >
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                Send your enquiry
              </h3>

              <p className="text-gray-600 mb-8">
                We'll respond quickly with details.
              </p>

              <form className="space-y-6">
                {/* Name + Mobile */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      id="mobile"
                      className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                      placeholder="+91 XXXXXXXXXX"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                {/* Interested In (dropdown) */}
                <div>
                  <label htmlFor="interested" className="block text-sm font-medium text-gray-700 mb-2">
                    Interested In
                  </label>
                  <select
                    id="interested"
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                  >
                    <option value="">Select option</option>
                    <option value="batch-timing">Batch Timings & Demo</option>
                    <option value="college-plan">College Batch Plan</option>
                    <option value="individual">Individual Enrollment</option>
                    <option value="other">Other Enquiry</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Write your message...
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                    placeholder="Tell us about your requirements or questions..."
                  ></textarea>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full px-8 py-5 text-lg font-bold rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white transition-all shadow-lg hover:shadow-orange-500/30 flex items-center justify-center gap-3"
                >
                  <span>Submit Enquiry</span>
                  <span>→</span>
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                  Your details are safe and never shared.
                </p>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      {/* ── Footer with Card Blocks ── (light theme) */}
<footer className="py-16 px-6 bg-gray-50 border-t border-gray-200">
  <div className="max-w-7xl mx-auto">
    {/* Three Card Blocks */}
    <div className="grid lg:grid-cols-3 gap-8 mb-12">
      {/* Block 1: Company Info */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-md hover:shadow-lg transition-all">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-orange-500 flex-shrink-0">
            <Image
              src="/team/logo.webp"
              alt="RK Skills & Solutions Logo"
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">RK Skills & Solutions</h3>
            <p className="text-sm text-gray-600">CRT • Aptitude • Technical Training</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-4 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-medium">
            Mock Tests
          </span>
          <span className="px-4 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-medium">
            Analytics
          </span>
          <span className="px-4 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-medium">
            Leaderboard
          </span>
        </div>

        <p className="text-gray-700 mb-6 leading-relaxed">
          A comprehensive and placement-focused training ecosystem designed to enhance aptitude, technical proficiency, interview confidence, and consistency through structured practice and systematic progress tracking.
        </p>

        <div className="mt-6 p-5 rounded-2xl bg-orange-50 border border-orange-200">
          <p className="text-orange-800 font-medium mb-3">
            Want to enroll or partner?
          </p>
          <a
            href="#contact"
            className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
          >
            Contact Now →
          </a>
          <p className="text-sm text-orange-700 mt-3">
            Ping us on WhatsApp for details & demo access.
          </p>
        </div>
      </div>

      {/* Block 2: Quick Links */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-md hover:shadow-lg transition-all">
        <h4 className="text-xl font-bold text-gray-900 mb-6">Quick Links</h4>
        <ul className="space-y-4 text-gray-700">
          <li>
            <a href="#platform-overview" className="hover:text-orange-600 transition-colors flex items-center gap-2">
              → Platform Overview
            </a>
          </li>
          <li>
            <a href="#training-focus" className="hover:text-orange-600 transition-colors flex items-center gap-2">
              → Training Focus
            </a>
          </li>
          <li>
            <a href="#student-journey" className="hover:text-orange-600 transition-colors flex items-center gap-2">
              → Student Journey
            </a>
          </li>
          <li>
            <a href="#core-team" className="hover:text-orange-600 transition-colors flex items-center gap-2">
              → Core Team
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:text-orange-600 transition-colors flex items-center gap-2">
              → Contact Us
            </a>
          </li>
        </ul>
      </div>

      {/* Block 3: Contact + Social */}
      <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-md hover:shadow-lg transition-all">
        <h4 className="text-xl font-bold text-gray-900 mb-6">Contact</h4>

        <div className="space-y-5 text-gray-700 mb-8">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700">
              ✉
            </span>
            <a href="mailto:rkskillsolutions@gmail.com" className="hover:text-orange-600 transition-colors">
              rkskillsandsolutions@gmail.com
            </a>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-xl">
              📞
            </span>
            <a
              href="https://wa.me/918341391285"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-600 transition-colors"
            >
              +91 8341391285
            </a>
          </div>

          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
              📍
            </span>
            <span>Hyderabad, Telangana</span>
          </div>
        </div>

        {/* Social Icons */}
        <div className="mt-6">
          <h5 className="text-sm font-semibold text-gray-600 mb-4">More</h5>
          <div className="flex gap-4">
            <a href="https://www.linkedin.com/company/rk-skills-and-solutions" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="https://www.instagram.com/rkskillsandsolutions?igsh=a3Z0cmdlcndobGtx&utm_source=qr" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="https://youtube.com/@radhakrishna-i1i4p?si=TIz70Y2c8wIBmnZf" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors">
              <Youtube className="w-5 h-5" />
            </a>
            <a href="https://wa.me/918341391285" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors">
              <MessageCircle className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-colors">
              📍
            </a>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom copyright + tagline */}
    <div className="border-t border-gray-200 pt-8 mt-8 text-center text-gray-600 text-sm">
      <p>© 2026 RK Skills & Solutions. All Rights Reserved.</p>
      <p className="mt-2">
        Built for placement excellence • Consistency • Confidence
      </p>
    </div>
  </div>
</footer>
    </div>
  );
}