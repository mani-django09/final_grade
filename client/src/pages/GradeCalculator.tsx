import { useState, useRef } from "react";
import { Link } from "wouter";
import { Plus, Loader2, ChevronDown, Calculator, AlertTriangle, X, Layers, RefreshCw, TrendingUp, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CalculatorLinks from "@/components/CalculatorLinks";
import { useSeo } from "@/hooks/useSeo";
import { useCountUp } from "@/hooks/useCountUp";
import { useHighlightOnChange } from "@/hooks/useHighlightOnChange";
import { calculateOverallGrade, letterForPercentage } from "@shared/gradeMath";
import "@/styles/design-c.css";

type GradeType = "percentage" | "letters" | "points";
// Everything is kept as the raw input string so a blank field and a real 0
// (e.g. 0/50 on a missed quiz) stay distinguishable.
interface GradeEntry { id: string; name: string; grade: string; weight: string; points: string; maxPoints: string; }

const letterGradeValues: { [key: string]: number } = { "A+": 97, "A": 95, "A-": 92, "B+": 89, "B": 85, "B-": 82, "C+": 79, "C": 75, "C-": 72, "D+": 69, "D": 65, "D-": 62, "F": 50 };
const letterGradeOptions = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"];
const LETTER_CUTOFFS: [number, string][] = [[60, "D-"], [63, "D"], [67, "D+"], [70, "C-"], [73, "C"], [77, "C+"], [80, "B-"], [83, "B"], [87, "B+"], [90, "A-"], [93, "A"]];

const blankRow = (): GradeEntry => ({ id: Math.random().toString(36).slice(2, 9), name: "", grade: "", weight: "", points: "", maxPoints: "" });
const freshRows = () => [blankRow(), blankRow(), blankRow(), blankRow(), blankRow()];
const num = (s: string) => (s.trim() === "" ? NaN : parseFloat(s));

interface Result { overall: number; letter: string; counted: number; skipped: number; weightUsed: number; equalWeights: boolean; }

const faqData = [
  { question: "Does it matter if my percentages don't equal 100?", answer: "Not really. Maybe your prof hasn't posted every grade yet, or you're checking mid-semester before everything's due. The calculator divides by whatever weight you've entered so far, so the result is your current average on the work that's been graded." },
  { question: "What if my class doesn't use weights?", answer: "Leave every weight box empty. When no weights are entered, each assignment counts equally and you get a plain average. If you fill in weights for some rows but not others, the rows without a weight are left out — the result card tells you how many." },
  { question: "Should I put in every single homework or just the average?", answer: "Either works. Got ten homework assignments? You can list each one separately or just average them and enter that number once with the category's weight. You'll end up with the same grade either way." },
  { question: "What's different about this versus the final exam one?", answer: "This shows your overall grade right now. The final exam calculator tells you what score you need on your final to hit whatever grade you're shooting for. Use this all semester, use that one during finals week." },
  { question: "Can I throw in grades that are above 100 from extra credit?", answer: "Yes. If you ended up with 107% on something, enter 107. The math takes care of it without any problem." },
  { question: "Do my grades get saved anywhere?", answer: "No. As soon as you close this page, everything is gone. Nothing is stored — it all lives in your browser while you're using it." },
];

export default function GradeCalculator() {
  useSeo({
    title: "Grade Calculator – Calculate Your Weighted Course Grade",
    description: "Calculate your overall course grade from assignments, tests, and projects. Works with percentages, letter grades, or points. Free, instant, no login required.",
    path: "/grade-calculator",
    keywords: "grade calculator, weighted grade calculator, course grade calculator, assignment grade calculator, class grade calculator",
  });

  const [gradeType, setGradeType] = useState<GradeType>("percentage");
  const [grades, setGrades] = useState<GradeEntry[]>(freshRows);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [calcCount, setCalcCount] = useState(0);
  const [barWidth, setBarWidth] = useState(0);
  const [noInput, setNoInput] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // Percentage for a row, or null when the row isn't filled in yet.
  const rowPercent = (e: GradeEntry): number | null => {
    if (gradeType === "letters") return e.grade ? letterGradeValues[e.grade] : null;
    if (gradeType === "points") {
      const pts = num(e.points), max = num(e.maxPoints);
      return !isNaN(pts) && max > 0 ? (pts / max) * 100 : null;
    }
    const g = num(e.grade);
    return isNaN(g) ? null : g;
  };

  const handleCalculate = async () => {
    const graded = grades
      .map(g => ({ pct: rowPercent(g), weight: num(g.weight) }))
      .filter((g): g is { pct: number; weight: number } => g.pct !== null);
    if (!graded.length) { setNoInput(true); setResult(null); return; }
    setNoInput(false);
    setIsCalculating(true);
    await new Promise(r => setTimeout(r, 250));

    // No weights at all → a plain average. Otherwise only weighted rows count.
    const equalWeights = graded.every(g => !(g.weight > 0));
    const used = equalWeights
      ? graded.map(g => ({ grade: g.pct, weight: 1 }))
      : graded.filter(g => g.weight > 0).map(g => ({ grade: g.pct, weight: g.weight }));
    const { overallGrade, totalWeight } = calculateOverallGrade(used);

    setResult({
      overall: overallGrade,
      letter: letterForPercentage(overallGrade),
      counted: used.length,
      skipped: graded.length - used.length,
      weightUsed: equalWeights ? 0 : totalWeight,
      equalWeights,
    });
    setIsCalculating(false);
    setCalcCount(c => c + 1);
    setBarWidth(0);
    setTimeout(() => { setBarWidth(Math.min(Math.max(overallGrade, 0), 100)); resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }); }, 60);
  };

  const addGrade = () => setGrades(gs => [...gs, blankRow()]);
  const removeGrade = (id: string) => setGrades(gs => (gs.length > 1 ? gs.filter(g => g.id !== id) : gs));
  const updateGrade = (id: string, field: keyof GradeEntry, value: string) => setGrades(gs => gs.map(g => (g.id === id ? { ...g, [field]: value } : g)));
  const handleReset = () => { setGrades(freshRows()); setResult(null); setBarWidth(0); setNoInput(false); };

  const totalWeight = grades.reduce((s, g) => s + (num(g.weight) || 0), 0);
  const animatedOverall = useCountUp(result?.overall ?? 0);
  const flash = useHighlightOnChange(calcCount, 950);

  const nextLetter = result ? LETTER_CUTOFFS.find(([cut]) => cut > result.overall) : undefined;
  const gridCols = gradeType === "points" ? "2fr 1fr 1fr 1fr 38px" : "2fr 1.4fr 1.1fr 38px";
  const smCols = gradeType === "points" ? "1fr 1fr 1fr 30px" : "1fr 1fr 30px";

  return (
    <div className="dc-page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org/", "@type": "WebApplication", name: "Grade Calculator", url: "https://finalgradecalculators.us/grade-calculator", applicationCategory: "EducationalApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) }} />

      <Header activePage="grade-calculator" />

      {/* ═════════════ HERO + CALCULATOR ═════════════ */}
      <section className="dc-hero">
        <div className="dc-intro">
          <div>
            <span className="dc-tag">Grade Calculator</span>
            <h1 className="dc-h1">Where does your grade <u>actually</u> stand?</h1>
            <p className="dc-sub">List your assignments, tests and projects with their weights. You get the weighted course grade and letter, worked out in your browser.</p>
          </div>
          <div className="dc-tiles">
            <div className="dc-tile"><b>3</b><span>grade formats</span></div>
            <div className="dc-tile"><b>No cap</b><span>on assignments</span></div>
            <div className="dc-tile"><b>0</b><span>data stored</span></div>
            <div className="dc-tile"><b>100%</b><span>always free</span></div>
          </div>
        </div>

        <div className="dc-panel">
          <div className="dc-panel-head">
            <h2 className="dc-panel-title">Add your grades</h2>
            <div className="dc-seg" role="group" aria-label="Grade format">
              {[{ id: "percentage", label: "Percent" }, { id: "letters", label: "Letters" }, { id: "points", label: "Points" }].map(t => (
                <button key={t.id} onClick={() => setGradeType(t.id as GradeType)} className={gradeType === t.id ? "on" : ""} aria-pressed={gradeType === t.id}>{t.label}</button>
              ))}
            </div>
          </div>

          <div className="dc-col-heads" style={{ display: "grid", gridTemplateColumns: gridCols, gap: 10, padding: "0 14px 8px" }}>
            <span className="dc-col-head">Assignment</span>
            {gradeType === "points" ? <><span className="dc-col-head">Earned</span><span className="dc-col-head">Out of</span></> : <span className="dc-col-head">Grade</span>}
            <span className="dc-col-head">Weight %</span>
            <span />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {grades.map((grade, index) => (
              <div key={grade.id} className="dc-row">
                <div className="dc-row-grid" style={{ display: "grid", gridTemplateColumns: gridCols, gap: 10, alignItems: "center", ["--sm-cols" as string]: smCols }}>
                  <input type="text" placeholder={`Assignment ${index + 1}`} value={grade.name} onChange={e => updateGrade(grade.id, "name", e.target.value)} className="dc-input dc-full" aria-label={`Assignment ${index + 1} name`} />

                  {gradeType === "percentage" && (
                    <div style={{ position: "relative" }}>
                      <input type="number" inputMode="decimal" min="0" max="150" step="0.1" placeholder="85" value={grade.grade} onChange={e => updateGrade(grade.id, "grade", e.target.value)} className="dc-input" style={{ paddingRight: 30 }} aria-label={`Assignment ${index + 1} grade percent`} />
                      <span className="dc-suffix">%</span>
                    </div>
                  )}

                  {gradeType === "letters" && (
                    <select value={grade.grade} onChange={e => updateGrade(grade.id, "grade", e.target.value)} className="dc-select" aria-label={`Assignment ${index + 1} letter grade`}>
                      <option value="">Grade</option>
                      {letterGradeOptions.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  )}

                  {gradeType === "points" && (
                    <>
                      <input type="number" inputMode="decimal" min="0" step="0.1" placeholder="45" value={grade.points} onChange={e => updateGrade(grade.id, "points", e.target.value)} className="dc-input" aria-label={`Assignment ${index + 1} points earned`} />
                      <input type="number" inputMode="decimal" min="0" step="0.1" placeholder="50" value={grade.maxPoints} onChange={e => updateGrade(grade.id, "maxPoints", e.target.value)} className="dc-input" aria-label={`Assignment ${index + 1} points possible`} />
                    </>
                  )}

                  <div style={{ position: "relative" }}>
                    <input type="number" inputMode="decimal" min="0" max="100" step="1" placeholder="20" value={grade.weight} onChange={e => updateGrade(grade.id, "weight", e.target.value)} className="dc-input" style={{ paddingRight: 30 }} aria-label={`Assignment ${index + 1} weight percent`} />
                    <span className="dc-suffix">%</span>
                  </div>

                  <button onClick={() => removeGrade(grade.id)} disabled={grades.length === 1} className="dc-del" aria-label={`Remove assignment ${index + 1}`}>
                    <X style={{ width: 15, height: 15 }} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="dc-actions">
            <button onClick={addGrade} className="dc-add"><Plus style={{ width: 15, height: 15 }} />Add assignment</button>
            <button onClick={handleReset} className="dc-clear">Clear all</button>
          </div>

          {totalWeight > 100 && (
            <div className="dc-note bad">
              <AlertTriangle style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2, color: "#ef4444" }} />
              <span><b>Weights add up to {totalWeight}%.</b> They should total 100% or less — double-check your syllabus.</span>
            </div>
          )}
          {totalWeight > 0 && totalWeight < 100 && (
            <div className="dc-note warn">
              <AlertTriangle style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2, color: "#f59e0b" }} />
              <span><b>Weights so far: {totalWeight}%.</b> That's fine mid-semester — the result is your average on what's been graded.</span>
            </div>
          )}
          {noInput && (
            <div className="dc-note warn">
              <AlertTriangle style={{ width: 16, height: 16, flexShrink: 0, marginTop: 2, color: "#f59e0b" }} />
              <span>Enter a grade for at least one assignment first.</span>
            </div>
          )}

          <button className="dc-btn" onClick={handleCalculate} disabled={isCalculating}>
            {isCalculating
              ? <><span className="dc-spin"><Loader2 style={{ width: 18, height: 18 }} /></span>Calculating…</>
              : <><Calculator style={{ width: 18, height: 18 }} />Calculate My Grade</>}
          </button>

          {result && (
            <div ref={resultRef} className={`dc-result ${flash}`} aria-live="polite">
              <div className="dc-res-top">
                <div>
                  <p className="dc-res-label">Your overall grade</p>
                  <p className="dc-res-big">{animatedOverall.toFixed(animatedOverall % 1 === 0 ? 0 : 2)}<small>%</small></p>
                </div>
                <div className="dc-letter"><b>{result.letter}</b><span>letter grade</span></div>
              </div>
              <div className="dc-track"><div className="dc-fill" style={{ width: `${barWidth}%` }} /></div>
              <div className="dc-chips">
                <div className="dc-chip"><b>{result.counted}</b><span>Items counted</span></div>
                <div className="dc-chip"><b>{result.equalWeights ? "Equal" : `${result.weightUsed}%`}</b><span>Weight used</span></div>
                <div className="dc-chip"><b>{nextLetter ? `${nextLetter[1]} at ${nextLetter[0]}%` : "Top grade"}</b><span>Next letter</span></div>
              </div>
              {result.equalWeights && result.counted > 1 && (
                <p className="dc-res-note">No weights entered, so every assignment counts the same.</p>
              )}
              {result.skipped > 0 && (
                <p className="dc-res-note">{result.skipped} {result.skipped === 1 ? "row has" : "rows have"} a grade but no weight, so {result.skipped === 1 ? "it was" : "they were"} left out.</p>
              )}
            </div>
          )}
        </div>

        <p className="dc-micro">🔒 Nothing stored · All calculations happen in your browser</p>
      </section>

      {/* ═════════════ FEATURES ═════════════ */}
      <section className="dc-sec white">
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div className="dc-sec-head">
            <span className="dc-tag">Why it helps</span>
            <h2 className="dc-h2">Built for how classes <u>really</u> grade</h2>
            <p className="dc-lead">Simple tools that actually work when you need them.</p>
          </div>
          <div className="dc-grid3">
            {[
              { icon: <Layers style={{ width: 22, height: 22 }} />, title: "Works with any format", desc: "Percentages, letter grades, raw points — switch between formats any time. The conversions are handled for you." },
              { icon: <RefreshCw style={{ width: 22, height: 22 }} />, title: "Test what-ifs fast", desc: "Want to see what happens if you bomb the next quiz? Change one number and hit calculate again." },
              { icon: <TrendingUp style={{ width: 22, height: 22 }} />, title: "Handles edge cases", desc: "Weights don't add to 100 yet? Fine. Extra credit above 100%? Enter it. No weights at all? You get a plain average." },
            ].map((f, i) => (
              <div key={i} className="dc-card">
                <div className="dc-card-ico">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════ FORMULA ═════════════ */}
      <section className="dc-sec cream">
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div className="dc-sec-head">
            <span className="dc-tag">The math</span>
            <h2 className="dc-h2">How weighted grades <u>work</u></h2>
            <p className="dc-lead">Here's how your prof actually calculates your grade.</p>
          </div>
          <div className="dc-card" style={{ padding: 32 }}>
            <p style={{ marginBottom: 20 }}>
              Not everything counts the same. A final worth 30% matters way more than homework worth 5%. Each grade is multiplied by its weight, everything is added up, then divided by the total weight.
            </p>
            <div className="dc-formula" style={{ marginBottom: 22 }}>Grade = Σ(score × weight) ÷ Σ(weight)</div>
            <p className="dc-kicker">Quick example</p>
            <p style={{ marginBottom: 14 }}>
              You have 88% on homework (20%), 75% on your midterm (30%), and 92% on quizzes (15%):
            </p>
            <div className="dc-code">
              <div>(88 × 0.20) + (75 × 0.30) + (92 × 0.15)</div>
              <div>= 17.6 + 22.5 + 13.8 = 53.9</div>
              <div><span className="hl">53.9 ÷ 0.65 = 82.9%</span> ← your grade</div>
            </div>
            <p style={{ marginTop: 18 }}>
              That 75% midterm pulls you down more than the 92% quizzes help because the midterm's worth more. Once you get how weighting works, you know where to focus your effort.
            </p>
          </div>
        </div>
      </section>

      {/* ═════════════ FAQ ═════════════ */}
      <section className="dc-sec white">
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div className="dc-sec-head">
            <span className="dc-tag">FAQ</span>
            <h2 className="dc-h2">Common questions</h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {faqData.map((faq, idx) => (
              <div key={idx} className={`dc-faq ${openFaq === idx ? "open" : ""}`}>
                <button onClick={() => setOpenFaq(openFaq === idx ? null : idx)} aria-expanded={openFaq === idx}>
                  <span>{faq.question}</span>
                  <ChevronDown style={{ width: 18, height: 18, flexShrink: 0, transition: "transform 0.25s", transform: openFaq === idx ? "rotate(180deg)" : "none" }} />
                </button>
                <div className="dc-faq-body" style={{ maxHeight: openFaq === idx ? 400 : 0 }}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CalculatorLinks current="/grade-calculator" />

      {/* ═════════════ CTA ═════════════ */}
      <section className="dc-sec ink">
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <span className="dc-tag">Finals week?</span>
          <h2 className="dc-h2">Got a final exam <u>coming up</u>?</h2>
          <p className="dc-lead" style={{ marginBottom: 34 }}>
            The Final Grade Calculator tells you exactly what score you need on your final to hit your target grade.
          </p>
          <Link href="/" className="dc-cta-btn">
            Final Grade Calculator
            <ArrowRight style={{ width: 18, height: 18 }} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
