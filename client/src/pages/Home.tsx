import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { calculateFinalGrade, projectCourseGrade, letterForPercentage } from "@shared/gradeMath";
import {
  AlertCircle, CheckCircle2, Loader2, ArrowRight,
  Target, Award, ChevronDown, GraduationCap,
  Calculator, Shield, Brain, TrendingUp,
  Sparkles, BookOpen, Zap, BarChart3, Share2, Check, ImageDown, Printer
} from "lucide-react";
import { renderResultCard, downloadBlob } from "@/lib/resultImage";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CalculatorLinks from "@/components/CalculatorLinks";
import { useSeo } from "@/hooks/useSeo";
import { useCountUp } from "@/hooks/useCountUp";
import { useHighlightOnChange } from "@/hooks/useHighlightOnChange";


/* ── Score ring ───────────────────────────────────────────────── */
function ScoreRing({ score, show }: { score: number; show: boolean }) {
  const r = 50; const stroke = 8; const nr = r - stroke;
  const circ = 2 * Math.PI * nr;
  const clamped = Math.min(Math.max(score, 0), 100);
  const offset = circ - (show ? clamped / 100 : 0) * circ;
  const color = clamped <= 60 ? "#34d399" : clamped <= 75 ? "#4ade80" : clamped <= 85 ? "#fbbf24" : clamped <= 95 ? "#fb923c" : "#f87171";
  const glow = clamped <= 60 ? "0 0 24px rgba(52,211,153,0.5)" : clamped <= 75 ? "0 0 24px rgba(74,222,128,0.5)" : clamped <= 85 ? "0 0 24px rgba(251,191,36,0.5)" : clamped <= 95 ? "0 0 24px rgba(251,146,60,0.5)" : "0 0 24px rgba(248,113,113,0.5)";
  return (
    <div style={{ position: "relative", width: r * 2, height: r * 2, flexShrink: 0, filter: show ? glow : "none", transition: "filter 1s" }}>
      <svg width={r * 2} height={r * 2} viewBox={`0 0 ${r * 2} ${r * 2}`}>
        <defs>
          <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <circle cx={r} cy={r} r={nr} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth={stroke} />
        <circle cx={r} cy={r} r={nr} fill="none" stroke="url(#ringGrad)" strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={`${circ} ${circ}`} strokeDashoffset={offset}
          transform={`rotate(-90 ${r} ${r})`}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "white", fontWeight: 900, fontSize: "1.35rem", lineHeight: 1, letterSpacing: "-0.03em" }}>
          {score < 0 ? 0 : Math.round(score)}
          <span style={{ color: "rgba(255,255,255,0.45)", fontWeight: 600, fontSize: "0.7rem" }}>%</span>
        </span>
      </div>
    </div>
  );
}

const faqData = [
  { question: "Where's the final exam weight listed in my syllabus?", answer: `Check the first few pages of your syllabus under "Grading Policy" or "Course Assessment." Your instructor lists the percentage each component counts toward your grade. If it's not there, check Canvas or Blackboard — or just email your professor.` },
  { question: "What if the calculator tells me I need 110%?", answer: "That means hitting your goal with just the final isn't possible. Check if your professor offers extra credit — many do near the end of term. You could also ask about grade adjustments or incomplete options. Often, dropping your target by 3–5 points makes it achievable." },
  { question: "My class gets curved. How does that affect this?", answer: "A curve almost always helps you, so treat our number as the worst-case scenario. If your professor curves individual exams or final grades, the actual score you'll need is likely lower than what we show. When in doubt, aim a few points above our number." },
  { question: "One of my quiz grades doesn't count. How do I handle that?", answer: "Simply ignore the dropped grade. If 6 quizzes were graded and the lowest is dropped, average your top 5 and enter that. Treat the dropped grade as if it never happened — because in the weighted calculation, it didn't." },
  { question: "Can I convert letter grades to percentages?", answer: "Yes — check your syllabus for the conversion scale. Most schools use A = 93–96%, B+ = 87–89%, B = 83–86%, etc. Use the midpoint of the range for best accuracy." },
  { question: "My final can replace my midterm if it's higher. What now?", answer: "Run the calculation twice: once with your midterm included, once without it (as if the final replaces it). Compare both results. If your midterm hurt your grade, you might need a lower final score than you think." },
];

/** Read a 0–100 number out of the query string, falling back when it's absent or junk. */
function paramNumber(params: URLSearchParams, key: string, fallback: number) {
  const raw = params.get(key);
  if (raw === null) return fallback;
  const n = parseFloat(raw);
  return Number.isFinite(n) && n >= 0 && n <= 100 ? n : fallback;
}

export default function Home() {
  useSeo({
    title: "Final Grade Calculator – What Do I Need on My Final Exam?",
    description: "Calculate the exact score you need on your final exam to reach your target course grade. Free, instant, no login required.",
    path: "/",
    keywords: "final grade calculator, what do I need on my final, final exam calculator, exam score needed, weighted grade calculator",
  });

  // Seed from ?current=85&weight=25&goal=90 so shared links open pre-filled.
  const initial = (() => {
    if (typeof window === "undefined") return { current: 85, weight: 25, goal: 90, shared: false };
    const p = new URLSearchParams(window.location.search);
    return {
      current: paramNumber(p, "current", 85),
      weight: paramNumber(p, "weight", 25),
      goal: paramNumber(p, "goal", 90),
      shared: p.has("current") || p.has("weight") || p.has("goal"),
    };
  })();

  const [currentGrade, setCurrentGrade] = useState<number>(initial.current);
  const [finalExamWeight, setFinalExamWeight] = useState<number>(initial.weight);
  const [desiredGrade, setDesiredGrade] = useState<number>(initial.goal);
  const [copied, setCopied] = useState(false);
  const [showShareUrl, setShowShareUrl] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [ringShow, setRingShow] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  /** Values the visible result was computed from — frozen until the next calculate. */
  const [resultInputs, setResultInputs] = useState({ current: initial.current, weight: initial.weight, goal: initial.goal });
  const [whatIfScore, setWhatIfScore] = useState<number | null>(null);

  useEffect(() => { setMounted(true); }, []);

  // Computed in the browser — no network round-trip, so the slider can be live.
  const result = calculateFinalGrade(resultInputs.current, resultInputs.weight, resultInputs.goal);

  // Bumped on every click so the result flashes even when the answer is unchanged.
  const [calcCount, setCalcCount] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleCalculate = async () => {
    setIsCalculating(true);
    await new Promise(r => setTimeout(r, 250));
    setResultInputs({ current: currentGrade, weight: finalExamWeight, goal: desiredGrade });
    setWhatIfScore(null);
    setIsCalculating(false);
    setShowResult(true);
    setCalcCount(c => c + 1);
    setTimeout(() => {
      setRingShow(true);
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 60);
  };

  // A link that arrives with values already in it should show its answer immediately.
  useEffect(() => {
    if (!initial.shared) return;
    setShowResult(true);
    const t = setTimeout(() => setRingShow(true), 80);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const animatedRequired = useCountUp(result.requiredGrade);
  const flash = useHighlightOnChange(calcCount);

  // Slider starts at the score they actually need, clamped into the real 0–100 range.
  const sliderScore = whatIfScore ?? Math.min(Math.max(result.requiredGrade, 0), 100);
  const projected = projectCourseGrade(resultInputs.current, resultInputs.weight, sliderScore);
  const projectedLetter = letterForPercentage(projected);
  const hitsGoal = projected >= resultInputs.goal;

  const shareUrl = `${typeof window !== "undefined" ? window.location.origin : ""}/?current=${currentGrade}&weight=${finalExamWeight}&goal=${desiredGrade}`;

  /** Async Clipboard API where it's allowed, legacy execCommand where it isn't. */
  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
    } catch {
      // Permission denied or blocked by an embedding frame — try the legacy path.
    }
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  };

  const handleShare = async () => {
    const text = result
      ? `I need ${result.requiredGrade}% on my final to get ${desiredGrade}% in this course.`
      : "Check what you need on your final exam:";

    // Native share sheet on mobile, clipboard everywhere else.
    if (navigator.share) {
      try {
        await navigator.share({ title: "Final Grade Calculator", text, url: shareUrl });
        return;
      } catch (err) {
        // Dismissing the sheet is a deliberate cancel, so stop there.
        if ((err as Error)?.name === "AbortError") return;
        // Anything else means share isn't usable here — fall through to copying.
      }
    }

    if (await copyToClipboard(shareUrl)) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      // Both copy paths blocked — surface the link so it can be copied by hand.
      setShowShareUrl(true);
    }
  };

  const handleDownloadImage = async () => {
    setIsExporting(true);
    try {
      const d = getDifficulty(result.requiredGrade);
      const blob = await renderResultCard({
        requiredGrade: result.requiredGrade,
        currentGrade: resultInputs.current,
        finalExamWeight: resultInputs.weight,
        desiredGrade: resultInputs.goal,
        difficultyLabel: d.label,
        difficultyEmoji: d.emoji,
        accent: d.color,
      });
      if (blob) downloadBlob(blob, `final-grade-result-${resultInputs.goal}.png`);
    } finally {
      setIsExporting(false);
    }
  };

  const getDifficulty = (score: number) => {
    if (score <= 60) return { label: "Easy Target", emoji: "🎯", bg: "rgba(52,211,153,0.18)", color: "#34d399", border: "rgba(52,211,153,0.35)" };
    if (score <= 75) return { label: "Achievable", emoji: "💪", bg: "rgba(74,222,128,0.18)", color: "#4ade80", border: "rgba(74,222,128,0.35)" };
    if (score <= 85) return { label: "Needs Work", emoji: "⚡", bg: "rgba(251,191,36,0.18)", color: "#fbbf24", border: "rgba(251,191,36,0.35)" };
    if (score <= 95) return { label: "Difficult", emoji: "🔥", bg: "rgba(251,146,60,0.18)", color: "#fb923c", border: "rgba(251,146,60,0.35)" };
    if (score <= 100) return { label: "Near Perfect", emoji: "🚀", bg: "rgba(248,113,113,0.18)", color: "#f87171", border: "rgba(248,113,113,0.35)" };
    return { label: "Not Possible", emoji: "😅", bg: "rgba(148,163,184,0.18)", color: "#94a3b8", border: "rgba(148,163,184,0.35)" };
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif", minHeight: "100vh", background: "#f4f1ea" }}>
      <style>{`
        * { box-sizing: border-box; }

        /* ── Hero ──────────────────────────────── */
        .hero-wrap {
          position: relative;
          overflow: hidden;
          background: linear-gradient(145deg, #060812 0%, #0e0c2a 35%, #0a1a3a 65%, #060d1f 100%);
          padding: 0 24px 60px;
        }
        .hero-orb-1 {
          position: absolute; top: -180px; right: -80px;
          width: 700px; height: 700px; border-radius: 50%;
          background: radial-gradient(circle at center, rgba(99,102,241,0.18) 0%, transparent 65%);
          pointer-events: none;
        }
        .hero-orb-2 {
          position: absolute; bottom: -120px; left: -60px;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle at center, rgba(56,189,248,0.11) 0%, transparent 65%);
          pointer-events: none;
        }
        .hero-orb-3 {
          position: absolute; top: 40%; left: 30%;
          width: 300px; height: 300px; border-radius: 50%;
          background: radial-gradient(circle at center, rgba(167,139,250,0.06) 0%, transparent 65%);
          pointer-events: none;
        }

        /* ── Badge ──────────────────────────────── */
        .hero-badge {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 100px; padding: 7px 18px;
          color: rgba(255,255,255,0.75); font-size: 0.8rem; font-weight: 500;
          backdrop-filter: blur(12px);
          animation: fadeDown 0.6s ease forwards;
        }
        .badge-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: #34d399;
          box-shadow: 0 0 8px #34d399;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.6;transform:scale(0.85)} }
        @keyframes fadeDown { from{opacity:0;transform:translateY(-12px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scaleIn { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }

        /* ── Heading gradient ─────────────────── */
        .hero-h1 {
          font-size: 4rem; font-weight: 900; color: #fff; line-height: 1.05;
          letter-spacing: -0.035em; margin: 0 0 6px;
          animation: fadeUp 0.7s 0.1s ease both;
        }
        .hero-h1-grad {
          background: linear-gradient(95deg, #818cf8 0%, #38bdf8 50%, #a78bfa 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; display: inline;
        }
        .hero-sub {
          color: rgba(255,255,255,0.5); font-size: 1.1rem; line-height: 1.65;
          max-width: 480px; margin: 14px auto 0;
          animation: fadeUp 0.7s 0.2s ease both;
        }

        /* ── Glass card ───────────────────────── */
        .glass-card {
          background: rgba(255,255,255,0.035);
          backdrop-filter: blur(24px) saturate(1.4);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.05) inset,
            0 40px 80px -20px rgba(0,0,0,0.7),
            0 0 120px -40px rgba(99,102,241,0.25);
          animation: scaleIn 0.55s 0.25s ease both;
        }
        .glass-card:hover {
          border-color: rgba(255,255,255,0.15);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.08) inset,
            0 48px 96px -20px rgba(0,0,0,0.75),
            0 0 160px -40px rgba(99,102,241,0.35);
          transition: all 0.4s ease;
        }

        /* ── Inputs ───────────────────────────── */
        .premium-input {
          height: 52px;
          background: rgba(255,255,255,0.06);
          border: 1.5px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          color: white;
          font-size: 1rem; font-weight: 600;
          padding: 0 44px 0 16px;
          width: 100%;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          outline: none;
        }
        .premium-input::placeholder { color: rgba(255,255,255,0.2); }
        .premium-input:focus {
          border-color: rgba(99,102,241,0.7);
          background: rgba(99,102,241,0.08);
          box-shadow: 0 0 0 3px rgba(99,102,241,0.18);
        }
        .premium-input:hover:not(:focus) {
          border-color: rgba(255,255,255,0.18);
          background: rgba(255,255,255,0.08);
        }
        .premium-label {
          font-size: 0.82rem; font-weight: 600; color: rgba(255,255,255,0.6);
          letter-spacing: 0.03em; text-transform: uppercase; display: block; margin-bottom: 8px;
        }

        /* ── Calc button ──────────────────────── */
        .calc-btn {
          position: relative; overflow: hidden;
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #3b82f6 100%);
          border: none; border-radius: 16px; color: white;
          font-weight: 700; font-size: 1rem; letter-spacing: 0.02em;
          height: 56px; width: 100%; cursor: pointer;
          transition: all 0.25s;
          box-shadow: 0 8px 32px rgba(79,70,229,0.5), 0 0 0 1px rgba(255,255,255,0.1) inset;
        }
        .calc-btn::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.25s;
        }
        .calc-btn:hover:not(:disabled)::before { opacity: 1; }
        .calc-btn:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 16px 48px rgba(79,70,229,0.65), 0 0 0 1px rgba(255,255,255,0.15) inset;
        }
        .calc-btn:active { transform: translateY(0); }
        .calc-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        /* ── Result panel ─────────────────────── */
        .result-panel {
          background: linear-gradient(135deg, rgba(49,46,129,0.7) 0%, rgba(30,58,138,0.7) 100%);
          border: 1px solid rgba(99,102,241,0.3);
          border-radius: 18px; margin-top: 20px;
          backdrop-filter: blur(12px);
          animation: resultIn 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards;
          overflow: hidden; position: relative;
        }
        .result-panel::before {
          content: ''; position: absolute;
          top: -60px; right: -60px; width: 180px; height: 180px; border-radius: 50%;
          background: rgba(99,102,241,0.12); pointer-events: none;
        }
        @keyframes resultIn {
          from { opacity:0; transform:scale(0.88) translateY(16px); }
          to { opacity:1; transform:scale(1) translateY(0); }
        }
        /* Confirms the number moved when nothing else on screen changed. */
        .result-panel.flash-a, .result-panel.flash-b { animation: resultFlash 0.65s ease-out; }
        @keyframes resultFlash {
          0%   { box-shadow: 0 0 0 0 rgba(129,140,248,0.55); }
          35%  { box-shadow: 0 0 0 7px rgba(129,140,248,0.22); }
          100% { box-shadow: 0 0 0 0 rgba(129,140,248,0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .result-panel.flash-a, .result-panel.flash-b { animation: none; }
        }
        .stat-chip {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px; padding: 10px 12px; text-align: center;
          backdrop-filter: blur(8px);
          transition: background 0.2s;
        }
        .stat-chip:hover { background: rgba(255,255,255,0.1); }

        /* ── What-if slider ───────────────────── */
        .whatif {
          margin-top: 16px; padding: 16px 18px;
          background: rgba(0,0,0,0.22);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
        }
        .whatif-head {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 12px;
        }
        .whatif-title {
          display: inline-flex; align-items: center; gap: 6px;
          color: rgba(255,255,255,0.55);
          font-size: 0.75rem; font-weight: 600;
          letter-spacing: 0.05em; text-transform: uppercase;
        }
        .whatif-score {
          color: white; font-weight: 800; font-size: 1.05rem;
          font-variant-numeric: tabular-nums;
        }

        .whatif-range {
          -webkit-appearance: none; appearance: none;
          width: 100%; height: 6px; border-radius: 100px; outline: none;
          cursor: pointer; margin: 0 0 14px;
          background: linear-gradient(
            90deg,
            #818cf8 0%, #38bdf8 var(--fill),
            rgba(255,255,255,0.12) var(--fill), rgba(255,255,255,0.12) 100%
          );
        }
        .whatif-range::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 20px; height: 20px; border-radius: 50%;
          background: white; border: 3px solid #6366f1;
          box-shadow: 0 2px 10px rgba(0,0,0,0.45);
          cursor: grab; transition: transform 0.15s;
        }
        .whatif-range::-webkit-slider-thumb:active { transform: scale(1.15); cursor: grabbing; }
        .whatif-range::-moz-range-thumb {
          width: 20px; height: 20px; border-radius: 50%;
          background: white; border: 3px solid #6366f1;
          box-shadow: 0 2px 10px rgba(0,0,0,0.45);
          cursor: grab;
        }
        .whatif-range:focus-visible { outline: 2px solid #818cf8; outline-offset: 4px; }

        .whatif-out {
          display: flex; align-items: center; justify-content: space-between;
          gap: 12px; flex-wrap: wrap;
        }
        .whatif-out-label {
          color: rgba(255,255,255,0.4); font-size: 0.7rem;
          text-transform: uppercase; letter-spacing: 0.05em; margin: 0 0 3px;
        }
        .whatif-out-value {
          color: white; font-weight: 800; font-size: 1.6rem;
          margin: 0; line-height: 1; display: flex; align-items: baseline; gap: 8px;
          font-variant-numeric: tabular-nums;
        }
        .whatif-letter {
          font-size: 0.8rem; font-weight: 700;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 6px; padding: 2px 8px;
          color: rgba(255,255,255,0.85);
        }
        .whatif-verdict {
          display: inline-flex; align-items: center; gap: 5px;
          border-radius: 100px; padding: 5px 12px;
          font-size: 0.78rem; font-weight: 700;
        }
        .whatif-verdict.hit {
          background: rgba(52,211,153,0.15);
          border: 1px solid rgba(52,211,153,0.35);
          color: #6ee7b7;
        }
        .whatif-verdict.miss {
          background: rgba(251,146,60,0.15);
          border: 1px solid rgba(251,146,60,0.35);
          color: #fdba74;
        }

        /* ── Share button ─────────────────────── */
        .action-row {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 8px; margin-top: 14px;
        }
        .share-btn {
          width: 100%; height: 44px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 12px; color: white;
          font-size: 0.875rem; font-weight: 600; cursor: pointer;
          backdrop-filter: blur(8px);
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
        }
        .share-btn:hover {
          background: rgba(255,255,255,0.16);
          border-color: rgba(255,255,255,0.3);
          transform: translateY(-1px);
        }
        .share-btn:active { transform: translateY(0); }
        .share-btn:disabled { opacity: 0.55; cursor: not-allowed; transform: none; }
        .share-url-field {
          width: 100%; margin-top: 8px; height: 38px; padding: 0 12px;
          background: rgba(0,0,0,0.25);
          border: 1px solid rgba(255,255,255,0.15);
          border-radius: 10px;
          color: rgba(255,255,255,0.75);
          font-size: 0.78rem; outline: none;
        }
        .share-url-field:focus { border-color: rgba(129,140,248,0.6); }

        /* ── Trust strip ──────────────────────── */
        .trust-strip {
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
          border-bottom: 1px solid #e2e8f0;
        }
        .trust-num {
          font-size: 1.6rem; font-weight: 900;
          background: linear-gradient(135deg, #4f46e5, #0ea5e9);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        /* ── Section labels ───────────────────── */
        .section-pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(99,102,241,0.12);
          border: 1px solid rgba(99,102,241,0.3);
          border-radius: 100px; padding: 5px 14px;
          color: #a5b4fc; font-size: 0.75rem; font-weight: 600;
          letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 14px;
        }
        .section-h2 {
          font-size: 2.4rem; font-weight: 900; color: white;
          letter-spacing: -0.025em; margin: 0 0 14px;
        }
        .section-h2-dark {
          font-size: 2.4rem; font-weight: 900; color: #0f172a;
          letter-spacing: -0.025em; margin: 0 0 14px;
        }

        /* ── How it works ─────────────────────── */
        .step-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px; padding: 28px;
          transition: all 0.3s ease; position: relative; overflow: hidden;
        }
        .step-card::before {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.03) 0%, transparent 60%);
          opacity: 0; transition: opacity 0.3s;
        }
        .step-card:hover::before { opacity: 1; }
        .step-card:hover {
          border-color: rgba(99,102,241,0.35);
          transform: translateY(-5px);
          box-shadow: 0 20px 48px rgba(0,0,0,0.4), 0 0 60px -20px rgba(99,102,241,0.2);
        }
        .step-num {
          font-size: 4rem; font-weight: 900; position: absolute; right: 20px; top: 12px;
          background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.08));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
          letter-spacing: -0.04em; line-height: 1; pointer-events: none;
        }

        /* ── Feature cards ────────────────────── */
        .feature-card {
          background: white; border-radius: 22px;
          border: 1px solid #e2e8f0; overflow: hidden;
          transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
          position: relative;
        }
        .feature-card::after {
          content: ''; position: absolute; inset: 0; border-radius: 22px;
          box-shadow: 0 0 0 0 rgba(99,102,241,0.0);
          transition: box-shadow 0.35s;
        }
        .feature-card:hover { transform: translateY(-8px) scale(1.01); border-color: #c7d2fe; }
        .feature-card:hover::after { box-shadow: 0 24px 56px rgba(99,102,241,0.18); }
        .feature-top-bar { height: 5px; }

        /* ── Formula ──────────────────────────── */
        .formula-wrap {
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 22px; padding: 36px;
          backdrop-filter: blur(12px);
        }
        .formula-box {
          background: linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(56,189,248,0.08) 100%);
          border: 1px solid rgba(99,102,241,0.25);
          border-radius: 14px; padding: 20px 24px;
        }
        .calc-example {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px; padding: 20px;
        }
        .mono-line {
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 0.85rem; color: rgba(255,255,255,0.65); line-height: 1.9;
        }

        /* ── Tips ─────────────────────────────── */
        .tip-card {
          background: white; border: 1px solid #e2e8f0;
          border-radius: 16px; padding: 22px 24px;
          display: flex; gap: 18px; align-items: flex-start;
          transition: all 0.25s ease;
        }
        .tip-card:hover {
          border-color: #c7d2fe;
          box-shadow: 0 8px 28px rgba(99,102,241,0.1);
          transform: translateX(4px);
        }

        /* ── FAQ ──────────────────────────────── */
        .faq-item {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px; overflow: hidden;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .faq-item:hover { border-color: rgba(99,102,241,0.3); box-shadow: 0 4px 24px rgba(0,0,0,0.3); }
        .faq-answer { max-height: 0; overflow: hidden; transition: max-height 0.35s ease; }
        .faq-answer.open { max-height: 400px; }

        /* ── CTA ──────────────────────────────── */
        .cta-wrap {
          position: relative; overflow: hidden;
          background: linear-gradient(145deg, #060812 0%, #0d0b28 50%, #060d1f 100%);
          padding: 100px 24px;
        }
        .cta-wrap::before {
          content: ''; position: absolute; inset: 0;
          background: radial-gradient(ellipse at 50% 50%, rgba(99,102,241,0.15) 0%, transparent 65%);
        }
        .cta-btn {
          display: inline-flex; align-items: center; gap: 10px;
          background: white; color: #4f46e5;
          font-weight: 800; font-size: 1rem; letter-spacing: 0.01em;
          padding: 16px 32px; border-radius: 16px; border: none; cursor: pointer;
          transition: all 0.25s;
          box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.1);
        }
        .cta-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 20px 56px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.2);
        }
        .cta-badge-icon {
          width: 64px; height: 64px; border-radius: 20px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 28px; backdrop-filter: blur(8px);
        }

        /* ── Spin ─────────────────────────────── */
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 1s linear infinite; display: inline-block; }

        /* ── Print / Save as PDF ──────────────── */
        @media print {
          /* Everything but the calculator card is noise on paper.
             Descendant selector, not a child chain — the sections sit a few
             wrappers below #root and the depth isn't ours to depend on. */
          header, footer, .print-hide { display: none !important; }
          #root section:not(.hero-wrap) { display: none !important; }

          /* Browsers skip backgrounds by default, but force white anyway so the
             dark text stays readable when "background graphics" is switched on. */
          html, body, #root, #root > div, .hero-wrap {
            background: #fff !important;
          }
          .hero-wrap { padding: 0 !important; }
          .hero-orb-1, .hero-orb-2, .hero-orb-3 { display: none !important; }
          .action-row, .share-url-field, .calc-btn, .whatif-range { display: none !important; }

          /* Print in ink-friendly colors instead of the dark UI. */
          .glass-card {
            background: #fff !important;
            border: 1px solid #cbd5e1 !important;
            box-shadow: none !important;
            backdrop-filter: none !important;
            max-width: 100% !important;
            padding: 16px !important;
          }
          .hero-h1, .hero-h1-grad {
            color: #0f172a !important;
            -webkit-text-fill-color: #0f172a !important;
            background: none !important;
            font-size: 1.8rem !important;
          }
          .hero-sub { color: #475569 !important; font-size: 0.9rem !important; }
          .premium-label { color: #475569 !important; }
          .premium-input {
            background: #fff !important;
            border-color: #cbd5e1 !important;
            color: #0f172a !important;
          }
          .result-panel {
            background: #eef2ff !important;
            border: 1px solid #c7d2fe !important;
            page-break-inside: avoid;
          }
          .result-panel *, .whatif, .whatif * {
            color: #0f172a !important;
            -webkit-text-fill-color: #0f172a !important;
          }
          .stat-chip, .whatif {
            background: #fff !important;
            border-color: #cbd5e1 !important;
          }
          @page { margin: 14mm; }
        }

        /* ── Responsive ───────────────────────── */
        @media (max-width: 640px) {
          .hero-h1 { font-size: 2.5rem !important; }
          .section-h2, .section-h2-dark { font-size: 1.8rem !important; }
          .trust-grid { grid-template-columns: repeat(2,1fr) !important; }
          /* Three number inputs side by side is too narrow on a phone —
             the digits and "%" suffix were getting clipped. */
          .input-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
        }

        /* ══ Design C — bold split hero ══════════════════════════════ */
        .hero-wrap {
          background: #f4f1ea; padding: 40px 24px 80px; overflow: hidden;
        }
        .c-grid {
          max-width: 1200px; margin: 0 auto;
          display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: center;
        }
        .c-left { padding-right: 12px; animation: fadeUp 0.6s ease both; }
        .c-tag {
          display: inline-block; background: #111; color: #f4f1ea;
          font-size: 0.75rem; font-weight: 700; letter-spacing: 0.02em;
          padding: 7px 13px; border-radius: 8px; transform: rotate(-2deg);
        }
        .hero-wrap .hero-h1 {
          color: #111; font-size: 4.4rem; line-height: 0.98; font-weight: 900;
          letter-spacing: -0.05em; margin: 26px 0 0; text-align: left; animation: none;
        }
        .hero-wrap .hero-h1 u {
          text-decoration: none;
          background: linear-gradient(transparent 62%, #fde047 62%);
        }
        .hero-wrap .hero-sub {
          color: #444; font-size: 1.1rem; line-height: 1.6;
          max-width: 460px; margin: 22px 0 0; text-align: left; animation: none;
        }
        .c-tiles {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;
          margin-top: 36px; max-width: 440px;
        }
        .c-tile {
          background: #fff; border: 2px solid #111; border-radius: 16px;
          padding: 16px 18px; box-shadow: 4px 4px 0 #111;
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .c-tile:hover { transform: translate(-2px,-2px); box-shadow: 6px 6px 0 #111; }
        .c-tile b { display: block; font-size: 1.6rem; font-weight: 900; color: #111; letter-spacing: -0.03em; }
        .c-tile span { font-size: 0.82rem; color: #555; }

        .glass-card.c-panel {
          position: relative; overflow: hidden;
          border-radius: 32px; padding: 34px; border: none;
          background: linear-gradient(145deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%);
          backdrop-filter: none;
          box-shadow: 0 30px 60px -20px rgba(79,70,229,0.55);
        }
        .glass-card.c-panel:hover { box-shadow: 0 34px 70px -20px rgba(79,70,229,0.65); }
        .glass-card.c-panel::before {
          content: ''; position: absolute; width: 380px; height: 380px; border-radius: 50%;
          background: rgba(255,255,255,0.12); right: -140px; top: -140px; pointer-events: none;
        }
        .c-panel > * { position: relative; }
        .c-panel-title { color: #fff; font-size: 1.35rem; font-weight: 800; margin: 0 0 20px; letter-spacing: -0.02em; }
        .c-panel .premium-label { color: rgba(255,255,255,0.88); }
        .c-panel .premium-input {
          background: #fff; color: #111; border: 2px solid transparent;
          height: 58px; font-size: 1.3rem; font-weight: 800;
        }
        .c-panel .premium-input:focus { border-color: #111; background: #fff; box-shadow: 0 0 0 4px rgba(255,255,255,0.3); }
        .c-panel .premium-input:hover:not(:focus) { background: #fff; border-color: rgba(17,17,17,0.25); }
        .c-panel .calc-btn {
          background: #111; box-shadow: 0 10px 24px rgba(0,0,0,0.3); height: 58px; font-size: 1.05rem;
        }
        .c-panel .calc-btn:hover:not(:disabled) { background: #000; box-shadow: 0 14px 30px rgba(0,0,0,0.4); }
        .c-panel .result-panel {
          background: #111; border: none; backdrop-filter: none;
        }
        .c-micro { color: rgba(255,255,255,0.75); font-size: 0.75rem; text-align: center; margin-top: 16px; }

        /* ── Compact result ── */
        .c-panel .result-panel { margin-top: 16px; border-radius: 18px; scroll-margin: 90px; }
        .res-top { display: flex; align-items: center; gap: 16px; }
        .res-label {
          color: rgba(255,255,255,0.5); font-size: 0.7rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.07em; margin: 0 0 2px;
        }
        .res-big {
          color: #fff; font-weight: 900; font-size: 2.4rem; line-height: 1;
          letter-spacing: -0.04em; margin: 0 0 8px; font-variant-numeric: tabular-nums;
        }
        .res-big span { font-size: 1.1rem; color: rgba(255,255,255,0.45); font-weight: 700; margin-left: 2px; }
        .res-badge {
          display: inline-flex; align-items: center; gap: 5px; border-radius: 100px;
          padding: 3px 10px; font-size: 0.74rem; font-weight: 700;
        }
        .res-summary {
          display: flex; gap: 8px; align-items: flex-start;
          font-size: 0.83rem; line-height: 1.5; margin: 12px 0 0;
        }
        .res-chips { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; }
        .res-chips .stat-chip { padding: 9px 10px; text-align: left; }
        .res-chips .stat-chip b { display: block; color: #fff; font-size: 1.05rem; font-weight: 800; }
        .res-chips .stat-chip span { color: rgba(255,255,255,0.45); font-size: 0.68rem; }
        .c-panel .whatif { margin-top: 12px; padding: 12px 14px; }
        .c-panel .action-row { margin-top: 10px; }
        .c-panel .share-btn { height: 40px; }

        /* Unmissable confirm-flash on every calculate — yellow to match the headline highlight. */
        .c-panel .result-panel.flash-a, .c-panel .result-panel.flash-b { animation: cFlash 0.9s ease-out; }
        @keyframes cFlash {
          0%   { box-shadow: 0 0 0 0 rgba(253,224,71,0.9); transform: scale(0.985); }
          30%  { box-shadow: 0 0 0 6px rgba(253,224,71,0.55); transform: scale(1.01); }
          100% { box-shadow: 0 0 0 0 rgba(253,224,71,0); transform: scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .c-panel .result-panel.flash-a, .c-panel .result-panel.flash-b { animation: none; outline: 3px solid #fde047; }
        }

        @media (max-width: 960px) {
          .c-grid { grid-template-columns: 1fr; gap: 32px; }
          .c-left { padding-right: 0; }
        }
        @media (max-width: 640px) {
          .hero-wrap { padding: 28px 16px 56px; }
          .hero-wrap .hero-h1 { font-size: 2.6rem !important; }
          .glass-card.c-panel { padding: 24px 18px; border-radius: 24px; }
          .c-tile { padding: 12px 14px; }
          .c-tile b { font-size: 1.3rem; }
        }
      `}</style>

      {/* JSON-LD stays for crawler */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org/", "@type": "WebApplication", name: "Final Grade Calculator", url: "https://finalgradecalculators.us", applicationCategory: "EducationalApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqData.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) }) }} />

      <Header activePage="final-grade" />

      {/* ══════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════ */}
      <section className="hero-wrap">
        <div className="c-grid">

          {/* Left: pitch */}
          <div className="c-left">
            <span className="c-tag">Final Grade Calculator</span>
            <h1 className="hero-h1">
              How much do you <u>actually</u> need on your final?
            </h1>
            <p className="hero-sub">
              Stop guessing. Plug in your current grade, the final's weight and your goal — get the exact score in under a second.
            </p>
            <div className="c-tiles">
              {[
                { value: "4", label: "free calculators" },
                { value: "0", label: "data stored" },
                { value: "<1s", label: "instant results" },
                { value: "100%", label: "always free" },
              ].map(t => (
                <div key={t.label} className="c-tile"><b>{t.value}</b><span>{t.label}</span></div>
              ))}
            </div>
          </div>

          {/* Right: calculator panel */}
          <div className="glass-card c-panel">
            <h2 className="c-panel-title">Work out your score</h2>

            {/* Input grid */}
            <div className="input-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14, marginBottom: 18 }}>
              {[
                { id: "curr", label: "Current Grade", value: currentGrade, setter: setCurrentGrade, hint: "Your grade in the class right now" },
                { id: "goal", label: "Target Grade", value: desiredGrade, setter: setDesiredGrade, hint: "The overall grade you want to finish with" },
                { id: "weight", label: "Final Exam Weight", value: finalExamWeight, setter: setFinalExamWeight, hint: "How much the final counts — check your syllabus" },
              ].map(field => (
                <div key={field.id}>
                  <label htmlFor={field.id} className="premium-label">{field.label}</label>
                  <div style={{ position: "relative" }}>
                    <input
                      id={field.id} type="number" min="0" max="100" step="0.1"
                      value={field.value}
                      onChange={e => field.setter(parseFloat(e.target.value) || 0)}
                      className="premium-input"
                    />
                    <span style={{ position: "absolute", right: 18, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", fontWeight: 700, fontSize: "0.95rem" }}>%</span>
                  </div>
                  <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.72)", marginTop: 6 }}>{field.hint}</p>
                </div>
              ))}
            </div>

            {/* Button */}
            <button className="calc-btn" onClick={handleCalculate} disabled={isCalculating}>
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
                {isCalculating ? (
                  <><span className="spin"><Loader2 style={{ width: 18, height: 18 }} /></span> Calculating…</>
                ) : (
                  <><Calculator style={{ width: 18, height: 18 }} /> Calculate My Score</>
                )}
              </span>
            </button>

            {/* Result */}
            {showResult && (
              <div ref={resultRef} className={`result-panel ${flash}`} style={{ padding: "18px 18px 16px" }}>
                {(() => {
                  const req = result.requiredGrade;
                  const shown = req < 0 ? 0 : req > 100 ? Math.round(req * 100) / 100 : Number(animatedRequired.toFixed(2));
                  const maxPossible = projectCourseGrade(resultInputs.current, resultInputs.weight, 100);
                  const floor = projectCourseGrade(resultInputs.current, resultInputs.weight, 0);
                  const d = req > 100
                    ? { label: "Not reachable", emoji: "⛔", bg: "rgba(248,113,113,0.16)", color: "#fca5a5", border: "rgba(248,113,113,0.35)" }
                    : req < 0
                      ? { label: "Already secured", emoji: "✅", bg: "rgba(52,211,153,0.16)", color: "#6ee7b7", border: "rgba(52,211,153,0.35)" }
                      : getDifficulty(req);
                  const summary = req > 100
                    ? `Even 100% on the final only gets you to ${maxPossible}%. Try a target of ${Math.floor(maxPossible)}% or lower.`
                    : req < 0
                      ? `You'll finish at ${floor}% or higher even if you score 0 on the final.`
                      : `Score at least ${Math.round(req * 100) / 100}% on the final to finish with ${resultInputs.goal}%.`;
                  return (
                    <>
                      <div className="res-top">
                        <ScoreRing score={req} show={ringShow} />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p className="res-label">You need on the final</p>
                          <p className="res-big">
                            {shown}<span>%</span>
                          </p>
                          <span className="res-badge" style={{ background: d.bg, border: `1px solid ${d.border}`, color: d.color }}>
                            {d.emoji} {d.label}
                          </span>
                        </div>
                      </div>
                      <p className="res-summary" style={{ color: req > 100 ? "#fca5a5" : "rgba(255,255,255,0.75)" }}>
                        {req > 100 ? <AlertCircle style={{ width: 14, height: 14, flexShrink: 0, marginTop: 2 }} /> : <CheckCircle2 style={{ width: 14, height: 14, flexShrink: 0, marginTop: 2, color: "#6ee7b7" }} />}
                        <span>{summary}</span>
                      </p>
                      <div className="res-chips">
                        <div className="stat-chip"><b>{maxPossible}%</b><span>Max possible (100% on final)</span></div>
                        <div className="stat-chip"><b>{floor}%</b><span>If you score 0 on final</span></div>
                      </div>
                    </>
                  );
                })()}

                {/* What-if slider */}
                <div className="whatif">
                  <div className="whatif-head">
                    <span className="whatif-title">
                      <Sparkles style={{ width: 13, height: 13 }} />
                      What if I score…
                    </span>
                    <span className="whatif-score">{sliderScore}%</span>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={1}
                    value={sliderScore}
                    onChange={e => setWhatIfScore(parseInt(e.target.value, 10))}
                    className="whatif-range"
                    style={{ ["--fill" as string]: `${sliderScore}%` }}
                    aria-label="What-if final exam score"
                  />

                  <div className="whatif-out">
                    <div>
                      <p className="whatif-out-label">Course grade would be</p>
                      <p className="whatif-out-value">
                        {projected}<span style={{ fontSize: "1rem", opacity: 0.5 }}>%</span>
                        <span className="whatif-letter">{projectedLetter}</span>
                      </p>
                    </div>
                    <span className={`whatif-verdict ${hitsGoal ? "hit" : "miss"}`}>
                      {hitsGoal
                        ? <><Check style={{ width: 13, height: 13 }} />Hits your goal</>
                        : `${Math.round((resultInputs.goal - projected) * 100) / 100}% short`}
                    </span>
                  </div>
                </div>

                {/* Share / export */}
                <div className="action-row">
                  <button className="share-btn" onClick={handleShare}>
                    {copied
                      ? <><Check style={{ width: 16, height: 16 }} />Link copied!</>
                      : <><Share2 style={{ width: 16, height: 16 }} />Share</>}
                  </button>
                  <button className="share-btn" onClick={handleDownloadImage} disabled={isExporting}>
                    <ImageDown style={{ width: 16, height: 16 }} />
                    {isExporting ? "Saving…" : "Image"}
                  </button>
                  <button className="share-btn" onClick={() => window.print()}>
                    <Printer style={{ width: 16, height: 16 }} />PDF
                  </button>
                </div>

                {showShareUrl && (
                  <input
                    className="share-url-field"
                    readOnly
                    value={shareUrl}
                    onFocus={e => e.currentTarget.select()}
                    aria-label="Shareable link — select and copy"
                  />
                )}
              </div>
            )}

            <p className="c-micro">🔒 Nothing stored · calculated in your browser</p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          HOW IT WORKS (dark)
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "100px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="section-pill" style={{ background: "rgba(99,102,241,0.08)", borderColor: "rgba(99,102,241,0.2)", color: "#6366f1" }}>
              <Sparkles style={{ width: 12, height: 12 }} />Simple process
            </div>
            <h2 className="section-h2-dark">Get your answer in 3 steps</h2>
            <p style={{ color: "#64748b", fontSize: "1.05rem", maxWidth: 420, margin: "0 auto" }}>
              No spreadsheets, no guessing — just fast, accurate results.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 20 }}>
            {[
              { num: "01", icon: <BookOpen style={{ width: 22, height: 22, color: "#6366f1" }} />, grad: "linear-gradient(135deg,#ede9fe,#e0e7ff)", title: "Enter your current grade", desc: "Type in your current standing in the course — the percentage you have before the final." },
              { num: "02", icon: <BarChart3 style={{ width: 22, height: 22, color: "#0ea5e9" }} />, grad: "linear-gradient(135deg,#e0f2fe,#dbeafe)", title: "Add the final exam weight", desc: "Check your syllabus for how much the final counts. Usually 20–40% of the total grade." },
              { num: "03", icon: <Target style={{ width: 22, height: 22, color: "#10b981" }} />, grad: "linear-gradient(135deg,#dcfce7,#d1fae5)", title: "See exactly what you need", desc: "Instantly see the score you need on your final to hit your target grade — with a visual gauge." },
            ].map((step, i) => (
              <div key={i} style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: 20, padding: "28px", transition: "all 0.3s ease", position: "relative", overflow: "hidden" }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#c7d2fe"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-5px)"; (e.currentTarget as HTMLDivElement).style.boxShadow = "0 20px 48px rgba(99,102,241,0.1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "#e2e8f0"; (e.currentTarget as HTMLDivElement).style.transform = ""; (e.currentTarget as HTMLDivElement).style.boxShadow = ""; }}>
                <span style={{ fontSize: "4rem", fontWeight: 900, position: "absolute", right: 20, top: 12, color: "#f1f5f9", letterSpacing: "-0.04em", lineHeight: 1 }}>{step.num}</span>
                <div style={{ background: step.grad, borderRadius: 14, width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
                  {step.icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: "1.05rem", color: "#0f172a", margin: "0 0 10px" }}>{step.title}</h3>
                <p style={{ color: "#64748b", fontSize: "0.875rem", lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FEATURES (light)
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "100px 24px", background: "#f4f1ea" }}>
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div className="section-pill" style={{ background: "rgba(99,102,241,0.08)", borderColor: "rgba(99,102,241,0.2)", color: "#6366f1" }}>
              <Zap style={{ width: 12, height: 12 }} />Why students love it
            </div>
            <h2 className="section-h2-dark">Built for stressed students</h2>
            <p style={{ color: "#64748b", fontSize: "1.05rem", maxWidth: 420, margin: "0 auto" }}>No noise, no nonsense — just the number you need.</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 20 }}>
            {[
              { grad: "linear-gradient(135deg,#6366f1,#4f46e5)", icon: <Zap style={{ width: 24, height: 24, color: "white" }} />, title: "Instant answers", desc: "Results in under a second. No loading screens, no waiting — just your answer." },
              { grad: "linear-gradient(135deg,#0ea5e9,#0284c7)", icon: <Shield style={{ width: 24, height: 24, color: "white" }} />, title: "Professor-approved math", desc: "Uses the same weighted average formula your professor uses. 100% accurate." },
              { grad: "linear-gradient(135deg,#8b5cf6,#7c3aed)", icon: <Brain style={{ width: 24, height: 24, color: "white" }} />, title: "Smart feedback", desc: "Color-coded results and clear messaging tell you exactly where you stand." },
              { grad: "linear-gradient(135deg,#10b981,#059669)", icon: <GraduationCap style={{ width: 24, height: 24, color: "white" }} />, title: "Works everywhere", desc: "High school, college, grad school — the formula is the same everywhere." },
            ].map((f, i) => (
              <div key={i} className="feature-card">
                <div className="feature-top-bar" style={{ background: f.grad }} />
                <div style={{ padding: "26px" }}>
                  <div style={{ background: f.grad, width: 50, height: 50, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 18, boxShadow: "0 6px 16px rgba(0,0,0,0.18)" }}>
                    {f.icon}
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a", margin: "0 0 8px" }}>{f.title}</h3>
                  <p style={{ color: "#64748b", fontSize: "0.875rem", lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FORMULA (dark)
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "100px 24px", background: "#111" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div className="section-pill"><TrendingUp style={{ width: 12, height: 12 }} />The math</div>
            <h2 className="section-h2">How weighted grades work</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "1rem" }}>The formula is simpler than you think.</p>
          </div>
          <div className="formula-wrap">
            <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.8, marginBottom: 24, fontSize: "0.95rem" }}>
              Different assignments count for different amounts. A final worth 35% matters far more than homework worth 5%. The formula figures out how high you need to score on the final to bring your average to your target:
            </p>
            <div className="formula-box" style={{ marginBottom: 24 }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, color: "#a78bfa", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>The Formula</p>
              <code style={{ display: "block", textAlign: "center", fontFamily: "'SF Mono','Fira Code',monospace", fontSize: "0.95rem", color: "#c4b5fd", fontWeight: 600, lineHeight: 1.6 }}>
                Score Needed = (Goal − Current × (1 − Final Weight)) ÷ Final Weight
              </code>
            </div>
            <div className="calc-example">
              <p style={{ fontWeight: 700, color: "white", fontSize: "0.9rem", marginBottom: 10 }}>Quick example</p>
              <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.875rem", lineHeight: 1.65, marginBottom: 14 }}>
                You have 82%, your final is 35% of your grade, and you want to finish with 88%:
              </p>
              <div style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "14px 18px" }}>
                <div className="mono-line">(88 − 82 × 0.65) ÷ 0.35</div>
                <div className="mono-line">= (88 − 53.3) ÷ 0.35</div>
                <div className="mono-line" style={{ color: "#818cf8", fontWeight: 700 }}>= 99.1% ← your target</div>
              </div>
            </div>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.875rem", lineHeight: 1.8, marginTop: 22, marginBottom: 0 }}>
              Knowing this number changes everything. If 99% isn't realistic this week, you can adjust your goal or explore other options early — extra credit, office hours, or reweighting strategies.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          STUDY TIPS (light)
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "100px 24px", background: "#fff" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div className="section-pill" style={{ background: "rgba(99,102,241,0.08)", borderColor: "rgba(99,102,241,0.2)", color: "#6366f1" }}>
              <BookOpen style={{ width: 12, height: 12 }} />Study smarter
            </div>
            <h2 className="section-h2-dark">Tips that actually move the needle</h2>
            <p style={{ color: "#64748b", fontSize: "1rem" }}>For when you know your target and need to hit it.</p>
          </div>
          <div style={{ display: "grid", gap: 14 }}>
            {[
              { num: 1, color: "#6366f1", bg: "#ede9fe", title: "Think in questions, not percentages", desc: "Need 82% on a 50-question exam? That means you can miss about 9. Concrete targets beat abstract percentages." },
              { num: 2, color: "#0ea5e9", bg: "#e0f2fe", title: "Mine old exams for patterns", desc: "Professors repeat themselves. Check past tests — whatever appears twice is what you master first." },
              { num: 3, color: "#10b981", bg: "#dcfce7", title: "Space your review sessions", desc: "Study today, revisit tomorrow, review again in 3 days. Spaced repetition beats marathon cramming every time." },
              { num: 4, color: "#f59e0b", bg: "#fef3c7", title: "Teach it out loud", desc: "Say the concept aloud as if explaining it to someone. Where you stumble is exactly where you haven't locked it in." },
            ].map(tip => (
              <div key={tip.num} className="tip-card">
                <div style={{ width: 42, height: 42, borderRadius: 13, background: tip.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <span style={{ fontWeight: 900, fontSize: "1.1rem", color: tip.color }}>{tip.num}</span>
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: "0.97rem", color: "#0f172a", margin: "0 0 6px" }}>{tip.title}</h3>
                  <p style={{ color: "#64748b", fontSize: "0.875rem", lineHeight: 1.7, margin: 0 }}>{tip.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FAQ (dark)
      ══════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "100px 24px", background: "#111" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <div className="section-pill"><Target style={{ width: 12, height: 12 }} />FAQ</div>
            <h2 className="section-h2">Common questions</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "1rem" }}>Everything you need to know about final grade calculations.</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {faqData.map((faq, idx) => (
              <div key={idx} className="faq-item">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  style={{ width: "100%", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 12 }}
                >
                  <span style={{ fontWeight: 600, fontSize: "0.95rem", color: "rgba(255,255,255,0.85)" }}>{faq.question}</span>
                  <ChevronDown style={{ width: 18, height: 18, color: "rgba(255,255,255,0.3)", flexShrink: 0, transition: "transform 0.25s", transform: openFaq === idx ? "rotate(180deg)" : "none" }} />
                </button>
                <div className={`faq-answer ${openFaq === idx ? "open" : ""}`}>
                  <div style={{ padding: "0 24px 20px" }}>
                    <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "0.875rem", lineHeight: 1.8, margin: 0 }}>{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CalculatorLinks current="/" />

      {/* ══════════════════════════════════════════════════════════════
          CTA
      ══════════════════════════════════════════════════════════════ */}
      <section className="cta-wrap">
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div className="cta-badge-icon">
            <Award style={{ width: 30, height: 30, color: "white" }} />
          </div>
          <h2 style={{ fontSize: "2.4rem", fontWeight: 900, color: "white", margin: "0 0 18px", letterSpacing: "-0.03em" }}>
            Need to track your overall grade?
          </h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "1.05rem", maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.7 }}>
            Our Grade Calculator handles all your assignments, tests, and projects — see your full course grade at a glance.
          </p>
          <Link href="/grade-calculator" className="cta-btn">
            Open Grade Calculator
            <ArrowRight style={{ width: 18, height: 18 }} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
