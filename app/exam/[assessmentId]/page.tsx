"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ExamQuestion, ExamSubmitResponse } from "@/app/lib/types";
import { useUser } from "@clerk/nextjs";
import {
    Clock, CheckCircle2, AlertCircle, X, ChevronLeft, ChevronRight,
    Bookmark, Trash2, Send, Trophy, Target, ListChecks, Video, ShieldAlert
} from "lucide-react";

type QuestionStatus = "not-visited" | "not-answered" | "answered" | "marked" | "answered-marked";

function formatTime(secs: number) {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
}

// Loads TensorFlow.js / coco-ssd from a CDN as a plain <script> tag rather than an
// npm import — face-api.js bundles its own pinned, ancient @tensorflow/tfjs-core,
// and webpack resolving a modern one alongside it for coco-ssd breaks the build.
// A CDN <script> tag runs as a separate global script, so it never touches webpack's
// module graph at all.
function loadScriptOnce(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
            resolve();
            return;
        }
        const script = document.createElement("script");
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
    });
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

    const [proctorError, setProctorError] = useState<string | null>(null);
    const [starting, setStarting] = useState(false);
    const [violations, setViolations] = useState(0);
    const [violationMessage, setViolationMessage] = useState<string | null>(null);
    const [fullscreenExitCountdown, setFullscreenExitCountdown] = useState<number | null>(null);
    const FULLSCREEN_GRACE_SECONDS = 5;
    const [navBlockedMessage, setNavBlockedMessage] = useState<string | null>(null);
    const [sessionEnded, setSessionEnded] = useState(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const violationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const sessionTokenRef = useRef<string | null>(null);

    const registerViolation = useCallback((message: string) => {
        setViolations(v => v + 1);
        setViolationMessage(message);
        if (violationTimeoutRef.current) clearTimeout(violationTimeoutRef.current);
        violationTimeoutRef.current = setTimeout(() => setViolationMessage(null), 4000);
    }, []);

    const stopProctoring = useCallback(() => {
        streamRef.current?.getTracks().forEach(t => t.stop());
        streamRef.current = null;
        if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    }, []);

    const endSessionLock = useCallback(() => {
        if (!sessionTokenRef.current) return;
        const token = sessionTokenRef.current;
        sessionTokenRef.current = null;
        fetch(`/api/exam/${assessmentId}/session/end`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionToken: token }),
            keepalive: true,
        }).catch(() => {});
    }, [assessmentId]);

    const startExam = useCallback(async () => {
        setProctorError(null);
        setStarting(true);

        // Fullscreen must be requested first, synchronously off the click's user
        // activation — any awaited call (camera permission, network) before it
        // causes browsers to silently reject requestFullscreen().
        try {
            await document.documentElement.requestFullscreen();
        } catch {
            // some browsers may still block programmatic fullscreen; the lockdown
            // effect below detects this and forces the resume/auto-submit flow
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            streamRef.current = stream;
        } catch {
            setProctorError("Camera and microphone access is required to start the exam. Please allow access and try again.");
            if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
            setStarting(false);
            return;
        }
        try {
            const res = await fetch(`/api/exam/${assessmentId}/session/start`, { method: "POST" });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setProctorError(data.error || "This exam is already in progress in another browser tab or device.");
                stopProctoring();
                setStarting(false);
                return;
            }
            sessionTokenRef.current = data.sessionToken;
        } catch {
            setProctorError("Could not verify exam session. Please check your connection and try again.");
            stopProctoring();
            setStarting(false);
            return;
        }

        setStarting(false);
        setPhase("exam");
    }, [assessmentId, stopProctoring]);

    // Exam lockdown: block copy/paste, devtools shortcuts, tab-switch, back navigation, and enforce fullscreen
    useEffect(() => {
        if (phase !== "exam") return;

        // If fullscreen didn't actually engage (browser silently blocked it), don't
        // let the exam run unprotected — kick off the same resume/auto-submit flow.
        if (!document.fullscreenElement) {
            registerViolation("Fullscreen could not be enabled.");
            setFullscreenExitCountdown(FULLSCREEN_GRACE_SECONDS);
        }

        const blockEvent = (e: Event) => e.preventDefault();

        const blockKeys = (e: KeyboardEvent) => {
            const key = e.key.toLowerCase();
            const blockedCombo =
                ((e.ctrlKey || e.metaKey) && ["c", "v", "x", "a", "p", "u", "s"].includes(key)) ||
                (e.ctrlKey && e.shiftKey && ["i", "j", "c"].includes(key)) ||
                key === "f12" || key === "printscreen";
            if (blockedCombo) {
                e.preventDefault();
                registerViolation("Restricted action detected and blocked.");
            }
        };

        const handleVisibility = () => {
            if (document.hidden) registerViolation("You switched away from the exam tab.");
        };
        const handleBlur = () => registerViolation("Exam window lost focus.");

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                registerViolation("Fullscreen was exited.");
                setFullscreenExitCountdown(FULLSCREEN_GRACE_SECONDS);
            } else {
                setFullscreenExitCountdown(null);
            }
        };

        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = "";
        };

        window.history.pushState(null, "", window.location.href);
        const handlePopState = () => {
            window.history.pushState(null, "", window.location.href);
            registerViolation("Navigation away from the exam is not allowed.");
        };

        document.addEventListener("contextmenu", blockEvent);
        document.addEventListener("copy", blockEvent);
        document.addEventListener("cut", blockEvent);
        document.addEventListener("paste", blockEvent);
        document.addEventListener("keydown", blockKeys);
        document.addEventListener("visibilitychange", handleVisibility);
        window.addEventListener("blur", handleBlur);
        document.addEventListener("fullscreenchange", handleFullscreenChange);
        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("popstate", handlePopState);

        return () => {
            document.removeEventListener("contextmenu", blockEvent);
            document.removeEventListener("copy", blockEvent);
            document.removeEventListener("cut", blockEvent);
            document.removeEventListener("paste", blockEvent);
            document.removeEventListener("keydown", blockKeys);
            document.removeEventListener("visibilitychange", handleVisibility);
            window.removeEventListener("blur", handleBlur);
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("popstate", handlePopState);
        };
    }, [phase, registerViolation]);

    // Fullscreen was exited (e.g. Esc key, which browsers always allow and cannot be
    // blocked) — give the student a short grace window to resume, then auto-submit.
    useEffect(() => {
        if (phase !== "exam" || fullscreenExitCountdown === null) return;
        if (fullscreenExitCountdown <= 0) {
            handleSubmit(true);
            return;
        }
        const t = setTimeout(() => {
            setFullscreenExitCountdown(c => (c === null ? null : c - 1));
        }, 1000);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fullscreenExitCountdown, phase]);

    const resumeFullscreen = useCallback(async () => {
        try {
            await document.documentElement.requestFullscreen();
            setFullscreenExitCountdown(null);
        } catch {
            registerViolation("Unable to re-enter fullscreen. Click Resume again.");
        }
    }, [registerViolation]);

    useEffect(() => () => stopProctoring(), [stopProctoring]);

    // Session heartbeat: proves to the server this tab/device still owns the exam
    // session. If another tab or device starts the same exam, this heartbeat starts
    // failing (409) and the session here is locked out.
    useEffect(() => {
        if (phase !== "exam") return;
        const iv = setInterval(async () => {
            if (!sessionTokenRef.current) return;
            try {
                const res = await fetch(`/api/exam/${assessmentId}/session/heartbeat`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ sessionToken: sessionTokenRef.current }),
                });
                if (!res.ok) {
                    sessionTokenRef.current = null;
                    clearInterval(timerRef.current!);
                    stopProctoring();
                    setSessionEnded(true);
                }
            } catch {
                // transient network hiccup; don't lock the student out over one failed beat
            }
        }, 8000);
        return () => clearInterval(iv);
    }, [phase, assessmentId, stopProctoring]);

    // Attach the camera stream once the video element mounts in the exam phase
    useEffect(() => {
        if (phase === "exam" && videoRef.current && streamRef.current) {
            videoRef.current.srcObject = streamRef.current;
        }
    }, [phase]);

    // Face-presence monitoring: flags when no face or more than one face is visible
    // for several consecutive checks in a row (avoids false positives from a single
    // blurry/misaligned frame, e.g. blinking or a brief head turn).
    const faceStatusRef = useRef<"ok" | "no-face" | "multi-face">("ok");
    useEffect(() => {
        if (phase !== "exam") return;
        let cancelled = false;
        let intervalId: ReturnType<typeof setInterval> | undefined;
        let noFaceStreak = 0;
        let multiFaceStreak = 0;
        const STREAK_THRESHOLD = 3;

        (async () => {
            const faceapi = await import("face-api.js");
            await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
            if (cancelled) return;

            intervalId = setInterval(async () => {
                if (!videoRef.current || videoRef.current.readyState < 2) return;
                const detections = await faceapi.detectAllFaces(
                    videoRef.current,
                    new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.3 })
                );

                if (detections.length === 0) {
                    noFaceStreak += 1;
                    multiFaceStreak = 0;
                    if (noFaceStreak >= STREAK_THRESHOLD && faceStatusRef.current !== "no-face") {
                        faceStatusRef.current = "no-face";
                        registerViolation("No face detected in camera frame.");
                    }
                } else if (detections.length > 1) {
                    multiFaceStreak += 1;
                    noFaceStreak = 0;
                    if (multiFaceStreak >= STREAK_THRESHOLD && faceStatusRef.current !== "multi-face") {
                        faceStatusRef.current = "multi-face";
                        registerViolation("Multiple faces detected in camera frame.");
                    }
                } else {
                    noFaceStreak = 0;
                    multiFaceStreak = 0;
                    faceStatusRef.current = "ok";
                }
            }, 3000);
        })();

        return () => {
            cancelled = true;
            if (intervalId) clearInterval(intervalId);
            faceStatusRef.current = "ok";
        };
    }, [phase, registerViolation]);

    // Mobile-phone detection: runs an object-detection model on the same camera feed
    // to catch a phone being held up in frame (e.g. to photograph the screen or notes).
    // A phone physically photographing the monitor from outside the browser can't be
    // detected by any web page — this only catches the phone appearing in view.
    useEffect(() => {
        if (phase !== "exam") return;
        let cancelled = false;
        let intervalId: ReturnType<typeof setInterval> | undefined;
        let phoneStreak = 0;
        let submitted = false;
        const STREAK_THRESHOLD = 2;

        (async () => {
            await loadScriptOnce("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4.22.0/dist/tf.min.js");
            await loadScriptOnce("https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.3/dist/coco-ssd.min.js");
            if (cancelled) return;
            const cocoSsd = (window as any).cocoSsd;
            const model = await cocoSsd.load({ base: "lite_mobilenet_v2" });
            if (cancelled) return;

            intervalId = setInterval(async () => {
                if (submitted || !videoRef.current || videoRef.current.readyState < 2) return;
                const predictions = await model.detect(videoRef.current);
                const phone = predictions.find(p => p.class === "cell phone" && p.score > 0.6);

                if (phone) {
                    phoneStreak += 1;
                    if (phoneStreak >= STREAK_THRESHOLD) {
                        submitted = true;
                        registerViolation("Mobile phone detected in camera frame. Auto-submitting exam.");
                        handleSubmit(true);
                    }
                } else {
                    phoneStreak = 0;
                }
            }, 3000);
        })();

        return () => {
            cancelled = true;
            if (intervalId) clearInterval(intervalId);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [phase, registerViolation]);

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

    const NAV_COOLDOWN_MS = 5000;
    const lastNavAtRef = useRef<number>(0);
    const navBlockedTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const canNavigate = useCallback(() => {
        const now = Date.now();
        const elapsed = now - lastNavAtRef.current;
        if (elapsed < NAV_COOLDOWN_MS) {
            const remaining = Math.ceil((NAV_COOLDOWN_MS - elapsed) / 1000);
            setNavBlockedMessage(`Please wait ${remaining}s before moving to another question.`);
            if (navBlockedTimeoutRef.current) clearTimeout(navBlockedTimeoutRef.current);
            navBlockedTimeoutRef.current = setTimeout(() => setNavBlockedMessage(null), 1500);
            return false;
        }
        lastNavAtRef.current = now;
        return true;
    }, []);

    const goTo = (idx: number) => {
        if (idx === currentIdx) return;
        if (!canNavigate()) return;
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
        if (currentIdx < questions.length - 1 && canNavigate()) setCurrentIdx(currentIdx + 1);
    };

    const saveAndNext = () => {
        if (!currentQ) return;
        setStatuses(prev => ({ ...prev, [currentQ.id]: answers[currentQ.id] ? "answered" : "not-answered" }));
        if (currentIdx < questions.length - 1 && canNavigate()) setCurrentIdx(currentIdx + 1);
    };

    const handleSubmit = useCallback(async (auto = false) => {
        if (!auto && !confirmSubmit) { setConfirmSubmit(true); return; }
        clearInterval(timerRef.current!);
        stopProctoring();
        endSessionLock();
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
    }, [answers, assessmentId, confirmSubmit, stopProctoring, endSessionLock]);

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
                        "The exam runs in fullscreen with camera and microphone monitoring. Switching tabs, copying, or exiting fullscreen will be flagged.",
                    ].map((text, i) => (
                        <li key={i} className="flex items-start gap-2">
                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-[10px] font-black mt-0.5">{i + 1}</span>
                            {text}
                        </li>
                    ))}
                </ul>
                {proctorError && (
                    <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-sm text-rose-700">
                        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        {proctorError}
                    </div>
                )}
                <div className="flex gap-3 pt-2">
                    <button onClick={() => router.push("/assessments")} className="flex-1 py-3 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all">Cancel</button>
                    <button
                        onClick={startExam}
                        disabled={starting}
                        className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-60"
                    >
                        {starting ? "Requesting access…" : "Start Exam →"}
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
        <div className="fixed inset-0 flex flex-col bg-gray-50 overflow-hidden select-none">
            {/* Camera preview */}
            <div className="fixed bottom-4 right-4 z-40 w-32 h-24 rounded-xl overflow-hidden border-2 border-indigo-500 shadow-lg bg-black">
                <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                <div className="absolute top-1 left-1 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-black/60 text-[9px] font-bold text-white">
                    <Video className="w-2.5 h-2.5 text-rose-400" /> REC
                </div>
            </div>

            {/* Violation banner */}
            {violationMessage && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold shadow-xl">
                    <ShieldAlert className="w-4 h-4 flex-shrink-0" />
                    {violationMessage} ({violations})
                </div>
            )}

            {/* Navigation cooldown notice */}
            {navBlockedMessage && (
                <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold shadow-xl">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    {navBlockedMessage}
                </div>
            )}

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
                        onClick={() => {
                            if (window.confirm("Leaving now will end your exam session without submitting. Continue?")) {
                                stopProctoring();
                                endSessionLock();
                                router.push("/assessments");
                            }
                        }}
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

            {/* Fullscreen Exit Warning */}
            {fullscreenExitCountdown !== null && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4 text-center">
                        <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto">
                            <ShieldAlert className="w-7 h-7 text-rose-600" />
                        </div>
                        <div>
                            <h3 className="font-black text-gray-900">Fullscreen Exited</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Return to fullscreen within <span className="font-black text-rose-600">{fullscreenExitCountdown}s</span> or your exam will be auto-submitted.
                            </p>
                        </div>
                        <button onClick={resumeFullscreen} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                            Resume Fullscreen
                        </button>
                    </div>
                </div>
            )}

            {/* Session Ended (opened elsewhere) */}
            {sessionEnded && (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                    <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 space-y-4 text-center">
                        <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto">
                            <ShieldAlert className="w-7 h-7 text-rose-600" />
                        </div>
                        <div>
                            <h3 className="font-black text-gray-900">Session Ended</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                This exam was started in another browser tab or device, so this session has been closed.
                            </p>
                        </div>
                        <button onClick={() => router.push("/assessments")} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-black hover:bg-indigo-700 transition-all">
                            Back to Assessments
                        </button>
                    </div>
                </div>
            )}

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
