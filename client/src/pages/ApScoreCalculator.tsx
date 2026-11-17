import { useState } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CalculatorLinks from "@/components/CalculatorLinks";
import { FaqSection, type Faq } from "@/components/GpaShared";
import { useSeo } from "@/hooks/useSeo";
import { useHighlightOnChange } from "@/hooks/useHighlightOnChange";
import { AP_EXAMS, AP_SCORE_MEANING, estimateApScore } from "@shared/apExams";
import "@/styles/design-c.css";

const PATH = "/ap-score-calculator";
const SUBJECTS = ["Math & CS", "Science", "History & Social Science", "English"] as const;

const faqs: Faq[] = [
  {
    question: "How is an AP score calculated?",
    answer: "Your multiple-choice and free-response points are each converted to a share of a weighted composite score, using the section weights College Board publishes for that exam (for example 50% / 50% for AP Calculus, 45% / 55% for AP English Language). The composite is then mapped to a 1–5 score using cutoffs that College Board sets each year after the exam.",
  },
  {
    question: "How accurate is this AP score calculator?",
    answer: "Section weights and question counts come from College Board's official exam pages for the May 2027 exams. The composite cutoffs for each score are not published by College Board and shift slightly from year to year, so the 1–5 result is an estimate. Treat a result that's within a few points of a cutoff as a coin flip.",
  },
  {
    question: "Is there a penalty for wrong answers on AP multiple choice?",
    answer: "No. AP exams stopped deducting points for wrong answers in 2011. Your multiple-choice score is simply the number you got right, so never leave a question blank — guess if you have to.",
  },
  {
    question: "What AP score do I need for college credit?",
    answer: "Most colleges grant credit or placement for a 3 or higher, and many selective schools require a 4 or 5. Policies differ by school and by subject, so check each college's AP credit policy before you plan your schedule around it.",
  },
  {
    question: "What percentage do you need to get a 5 on an AP exam?",
    answer: "It depends on the exam. On some exams, roughly 60–65% of the weighted composite has been enough for a 5 in recent years; on others it takes 70–75%. That's why this calculator uses a separate estimated cutoff for each exam instead of one fixed percentage.",
  },
  {
    question: "When do AP scores come out?",
    answer: "AP scores are usually released in early July, through your College Board account. If you sent a free score report to a college, it receives your scores around the same time.",
  },
];

export default function ApScoreCalculator() {
  useSeo({
    title: "AP Score Calculator 2027 – Estimate Your 1–5 AP Exam Score",
    description: "Free AP score calculator for 18 AP exams. Enter your multiple-choice and free-response points to estimate your 1–5 score using official section weights.",
    path: PATH,
    keywords: "ap score calculator, ap exam score calculator, ap calculator score, ap test score calculator, how are ap exams scored",
  });

  const [examId, setExamId] = useState(AP_EXAMS[0].id);
  const exam = AP_EXAMS.find(e => e.id === examId)!;
  const [earned, setEarned] = useState<string[]>([]);
  const [maxes, setMaxes] = useState<string[]>([]);

  const pickExam = (id: string) => { setExamId(id); setEarned([]); setMaxes([]); };
  const num = (s: string | undefined) => (s && s.trim() !== "" ? parseFloat(s) : NaN);

  const earnedNums = exam.sections.map((_, i) => num(earned[i]) || 0);
  const maxNums = exam.sections.map((s, i) => (num(maxes[i]) > 0 ? num(maxes[i]) : s.max));
  const hasInput = earned.some(v => v && v.trim() !== "");
  const result = estimateApScore(exam, earnedNums, maxNums);
  const flash = useHighlightOnChange(`${result.score}|${result.composite}`, 950);

  const setAt = (arr: string[], i: number, v: string) => { const next = [...arr]; next[i] = v; return next; };
  const gridCols = "2.2fr 1fr 1fr 0.9fr";
  const [c5, c4, c3, c2] = exam.cutoffs;

  return (
    <div className="dc-page">
      <style>{`
        .ap-sec-label { font-size: 0.9rem; font-weight: 700; color: #fff; }
        .ap-sec-label small { display: block; font-size: 0.72rem; font-weight: 600; color: rgba(255,255,255,0.7); margin-top: 2px; }
        .ap-weight { font-size: 0.85rem; font-weight: 800; color: #fff; text-align: center; }
        .ap-score { font-size: 4.4rem; font-weight: 900; line-height: 1; letter-spacing: -0.05em; }
        .ap-scale { position: relative; height: 10px; border-radius: 100px; margin-top: 22px;
          background: linear-gradient(90deg, #ef4444 0%, #f59e0b 35%, #fde047 55%, #4ade80 75%, #22d3ee 100%); }
        .ap-tick { position: absolute; top: -4px; width: 2px; height: 18px; background: #111; outline: 1px solid rgba(255,255,255,0.6); }
        .ap-tick span { position: absolute; top: 20px; left: 50%; transform: translateX(-50%); font-size: 0.68rem; font-weight: 800; color: rgba(255,255,255,0.75); white-space: nowrap; }
        .ap-pin { position: absolute; top: -7px; width: 24px; height: 24px; margin-left: -12px; border-radius: 50%; background: #fff; border: 3px solid #111; transition: left 0.6s cubic-bezier(0.4,0,0.2,1); }
        .ap-subject { font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; color: #666; margin: 0 0 6px; }
        @media (max-width: 720px) { .ap-score { font-size: 3.4rem; } }
      `}</style>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        {
          "@context": "https://schema.org/", "@type": "WebApplication", name: "AP Score Calculator",
          description: "Estimate a 1–5 AP exam score from multiple-choice and free-response points.",
          url: `https://finalgradecalculators.us${PATH}`, applicationCategory: "EducationalApplication", operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) },
      ]) }} />

      <Header />

      <section className="dc-hero">
        <div className="dc-intro">
          <div>
            <span className="dc-tag">AP Score Calculator</span>
            <h1 className="dc-h1">What will you get on your <u>AP exam</u>?</h1>
            <p className="dc-sub">Pick your exam, enter how many multiple-choice questions you got right and your free-response points. We'll estimate your 1–5 score from the official section weights.</p>
          </div>
          <div className="dc-tiles">
            <div className="dc-tile"><b>{AP_EXAMS.length}</b><span>AP exams covered</span></div>
            <div className="dc-tile"><b>2027</b><span>exam formats</span></div>
            <div className="dc-tile"><b>1 → 5</b><span>estimated score</span></div>
            <div className="dc-tile"><b>0</b><span>data stored</span></div>
          </div>
        </div>

        <div className="dc-panel">
          <div className="dc-panel-head" style={{ alignItems: "center" }}>
            <h2 className="dc-panel-title">Your practice exam</h2>
            <select className="dc-select" style={{ maxWidth: 340 }} value={examId} onChange={e => pickExam(e.target.value)} aria-label="AP exam">
              {SUBJECTS.map(s => (
                <optgroup key={s} label={s}>
                  {AP_EXAMS.filter(e => e.subject === s).map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="dc-col-heads" style={{ display: "grid", gridTemplateColumns: gridCols, gap: 10, padding: "0 14px 8px" }}>
            <span className="dc-col-head">Section</span>
            <span className="dc-col-head">Your points</span>
            <span className="dc-col-head">Out of</span>
            <span className="dc-col-head" style={{ textAlign: "center" }}>Weight</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {exam.sections.map((s, i) => (
              <div key={`${exam.id}-${i}`} className="dc-row">
                <div className="dc-row-grid" style={{ display: "grid", gridTemplateColumns: gridCols, gap: 10, alignItems: "center", ["--sm-cols" as string]: "1fr 1fr 0.7fr" }}>
                  <div className="ap-sec-label dc-full">
                    {s.label}
                    {s.typicalMax && <small>Typical points — match your scoring guide</small>}
                  </div>
                  <input type="number" inputMode="decimal" min="0" max={maxNums[i]} step={s.kind === "mcq" ? 1 : 0.5} className="dc-input"
                    placeholder="0" value={earned[i] ?? ""} onChange={e => setEarned(a => setAt(a, i, e.target.value))}
                    aria-label={`${s.label} points earned`} />
                  {s.kind === "mcq" ? (
                    <input className="dc-input" value={s.max} readOnly aria-label={`${s.label} total questions`} style={{ background: "rgba(255,255,255,0.75)" }} />
                  ) : (
                    <input type="number" inputMode="decimal" min="1" step="1" className="dc-input" placeholder={String(s.max)}
                      value={maxes[i] ?? ""} onChange={e => setMaxes(a => setAt(a, i, e.target.value))}
                      aria-label={`${s.label} maximum points`} />
                  )}
                  <span className="ap-weight">{s.weight.toFixed(s.weight % 1 ? 1 : 0)}%</span>
                </div>
              </div>
            ))}
          </div>

          <div className="dc-actions">
            <button onClick={() => { setEarned([]); setMaxes([]); }} className="dc-clear" style={{ flex: 1 }}>Clear scores</button>
          </div>

          {hasInput ? (
            <div className={`dc-result ${flash}`} aria-live="polite">
              <div className="dc-res-top">
                <div>
                  <p className="dc-res-label">Estimated AP score</p>
                  <p className="ap-score">{result.score}</p>
                </div>
                <div className="dc-letter" style={{ flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
                  <b style={{ fontSize: "1.1rem" }}>{AP_SCORE_MEANING[result.score]}</b>
                  <span>Composite {result.composite.toFixed(1)} / 100</span>
                </div>
              </div>
              <div className="ap-scale" style={{ marginBottom: 30 }}>
                {[[c2, "2"], [c3, "3"], [c4, "4"], [c5, "5"]].map(([c, l]) => (
                  <div key={l} className="ap-tick" style={{ left: `${c}%` }}><span>{l}</span></div>
                ))}
                <div className="ap-pin" style={{ left: `${Math.min(result.composite, 100)}%` }} />
              </div>
              <p className="dc-res-note">
                {result.score === 5
                  ? "You're above the estimated cutoff for a 5. Keep the margin — cutoffs move a few points each year."
                  : `About ${result.toNext.toFixed(1)} more composite points would move you to an estimated ${result.score + 1}.`}
              </p>
              <p className="dc-res-note" style={{ marginTop: 6 }}>
                Estimated cutoffs for {exam.name}: 5 at {c5} · 4 at {c4} · 3 at {c3} · 2 at {c2} (composite out of 100).
              </p>
            </div>
          ) : (
            <div className="dc-empty">Enter your multiple-choice and free-response points to see your estimated AP score.</div>
          )}
        </div>

        <p className="dc-micro">Score cutoffs are estimates — College Board doesn't publish them. 🔒 Nothing stored.</p>
        <p className="dc-micro" style={{ marginTop: 6 }}>Prepping for the SAT too? Try the <Link href="/sat-score-calculator" style={{ fontWeight: 800, color: "#4f46e5" }}>SAT score calculator</Link>.</p>
      </section>

      <section className="dc-sec white">
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div className="dc-sec-head">
            <span className="dc-tag">How it works</span>
            <h2 className="dc-h2">How AP exams are <u>scored</u></h2>
            <p className="dc-lead">Raw points become a weighted composite, and the composite becomes a 1–5.</p>
          </div>
          <div className="dc-card" style={{ padding: 32 }}>
            <div className="dc-formula" style={{ marginBottom: 22 }}>Composite = Σ (your points ÷ section points × section weight)</div>
            <p className="dc-kicker">Example: AP Calculus AB</p>
            <div className="dc-code">
              <div>Multiple choice: 30 of 42 right → 30 ÷ 42 × 50 = 35.7</div>
              <div>Free response: 32 of 54 points → 32 ÷ 54 × 50 = 29.6</div>
              <div><span className="hl">Composite 65.3 → estimated 5</span></div>
            </div>
            <p style={{ marginTop: 18 }}>
              Notice you don't need anywhere near 100% for a top score. On most AP exams a composite in the 60s or low 70s has been enough for a 5, because College Board sets the cutoffs after each exam so scores mean the same thing from year to year.
            </p>
          </div>
        </div>
      </section>

      <section className="dc-sec cream">
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div className="dc-sec-head">
            <span className="dc-tag">Exam formats</span>
            <h2 className="dc-h2">Section weights for <u>every exam</u></h2>
            <p className="dc-lead">From College Board's AP Central exam pages for May 2027, with this calculator's estimated cutoff for a 5.</p>
          </div>
          <div className="dc-card dc-table-wrap" style={{ padding: 20 }}>
            <table className="dc-table">
              <thead><tr><th>Exam</th><th>Multiple choice</th><th>Free response</th><th>Est. 5 at</th></tr></thead>
              <tbody>
                {AP_EXAMS.map(e => {
                  const m = e.sections.find(s => s.kind === "mcq")!;
                  const f = e.sections.filter(s => s.kind === "frq");
                  const fw = f.reduce((a, s) => a + s.weight, 0);
                  return (
                    <tr key={e.id}>
                      <td>{e.name}</td>
                      <td>{m.max} Q · {Math.round(m.weight)}%</td>
                      <td>{f.length} Q · {Math.round(fw)}%</td>
                      <td>{e.cutoffs[0]}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="dc-sec white">
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div className="dc-sec-head">
            <span className="dc-tag">The 1–5 scale</span>
            <h2 className="dc-h2">What each AP score <u>means</u></h2>
          </div>
          <div className="dc-card dc-table-wrap" style={{ padding: 20 }}>
            <table className="dc-table">
              <thead><tr><th>Score</th><th>College Board label</th><th>What it usually gets you</th></tr></thead>
              <tbody>
                <tr><td>5</td><td>{AP_SCORE_MEANING[5]}</td><td>Credit or placement at most colleges, including selective ones</td></tr>
                <tr><td>4</td><td>{AP_SCORE_MEANING[4]}</td><td>Credit at most colleges</td></tr>
                <tr><td>3</td><td>{AP_SCORE_MEANING[3]}</td><td>Credit at many public universities</td></tr>
                <tr><td>2</td><td>{AP_SCORE_MEANING[2]}</td><td>Rarely earns credit</td></tr>
                <tr><td>1</td><td>{AP_SCORE_MEANING[1]}</td><td>No credit</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <FaqSection faqs={faqs} />
      <CalculatorLinks current={PATH} />
      <Footer />
    </div>
  );
}
