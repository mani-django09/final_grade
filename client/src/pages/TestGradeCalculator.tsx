import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { ChevronDown, ClipboardCheck, Zap, ArrowRight, Users, Minus, Plus } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CalculatorLinks from "@/components/CalculatorLinks";
import { useSeo } from "@/hooks/useSeo";
import { useCountUp } from "@/hooks/useCountUp";
import { useHighlightOnChange } from "@/hooks/useHighlightOnChange";
import { scoreFromQuestions, scoreFromPoints, buildGradingChart } from "@shared/gradeMath";
import "@/styles/design-c.css";

/** Question counts teachers reach for most often. */
const QUICK_COUNTS = [10, 20, 25, 30, 50, 100];

type Mode = "questions" | "points";

const faqData = [
  {
    question: "How do I use the grading chart?",
    answer: "Enter the number of questions on the test and the chart fills in every possible outcome. Mark a paper, count the wrong answers, then read the score straight off the chart. You never have to recalculate for the next paper — one chart covers the whole stack.",
  },
  {
    question: "What's the difference between this and the Grade Calculator?",
    answer: "This one scores a single test: you give it questions and wrong answers, it gives you a percentage. The Grade Calculator works out your grade across a whole course by combining assignments, tests, and projects with their weights. Use this to mark one paper, use that to see where you stand in the class.",
  },
  {
    question: "Can I enter partial credit or half points?",
    answer: "Yes — switch to Points mode and enter the points earned and the points possible. It accepts decimals, so 17.5 out of 20 works fine. Question mode assumes each question is worth the same and marked right or wrong.",
  },
  {
    question: "What if a student scores above 100% with extra credit?",
    answer: "Points mode handles it. Enter points earned above the total — 55 out of 50 shows as 110%. The calculator deliberately doesn't cap the result, because clamping it would hide the bonus points you meant to award.",
  },
  {
    question: "Which grading scale does this use?",
    answer: "The standard US scale: A is 93% and above, A- 90%, B+ 87%, B 83%, and so on down to F below 60%. If your school uses different cut-offs, the percentage is still exact — just read it against your own scale.",
  },
  {
    question: "Does it work for quizzes with a lot of questions?",
    answer: "Yes. For tests up to 100 questions the chart lists every single outcome. Beyond that it steps through evenly so the table stays readable, and the score at the top is always exact for whatever you typed in.",
  },
];

const letterStyle = (letter: string) => {
  if (letter.startsWith("A")) return { background: "#dcfce7", color: "#166534" };
  if (letter.startsWith("B")) return { background: "#dbeafe", color: "#1e40af" };
  if (letter.startsWith("C")) return { background: "#fef3c7", color: "#92400e" };
  if (letter.startsWith("D")) return { background: "#ffedd5", color: "#9a3412" };
  return { background: "#fee2e2", color: "#991b1b" };
};

export default function TestGradeCalculator() {
  useSeo({
    title: "Test Grade Calculator – Score & Grading Chart for Teachers",
    description: "Enter the number of questions missed to get the percentage and letter grade instantly, plus a full grading chart for marking a whole stack of papers.",
    path: "/test-grade-calculator",
    keywords: "test grade calculator, ez grader, grading chart, test score calculator, quiz grade calculator, teacher grading scale",
  });

  const [mode, setMode] = useState<Mode>("questions");
  const [totalQuestions, setTotalQuestions] = useState<number>(20);
  const [wrong, setWrong] = useState<number>(3);
  const [earned, setEarned] = useState<number>(43);
  const [totalPoints, setTotalPoints] = useState<number>(50);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const result = mode === "questions"
    ? scoreFromQuestions(totalQuestions, wrong)
    : scoreFromPoints(earned, totalPoints);

  const chart = buildGradingChart(mode === "questions" ? totalQuestions : 0);

  const animatedPct = useCountUp(result.percentage);
  const flash = useHighlightOnChange(result.percentage, 950);

  // Keep the highlighted chart row visible — scrolling only the chart box,
  // never the page, so load and stepper clicks don't yank the viewport.
  const chartScrollRef = useRef<HTMLDivElement>(null);
  const currentRowRef = useRef<HTMLTableRowElement>(null);
  useEffect(() => {
    const box = chartScrollRef.current, row = currentRowRef.current;
    if (!box || !row) return;
    const head = 44;
    const top = row.offsetTop - head, bottom = row.offsetTop + row.offsetHeight;
    if (top < box.scrollTop) box.scrollTo({ top, behavior: "smooth" });
    else if (bottom > box.scrollTop + box.clientHeight) box.scrollTo({ top: bottom - box.clientHeight, behavior: "smooth" });
  }, [result.wrong, totalQuestions]);

  /** Nudges the wrong-answer count, staying inside 0..total. */
  const stepWrong = (delta: number) =>
    setWrong(w => Math.min(Math.max(w + delta, 0), totalQuestions));

  const perQuestion = totalQuestions > 0 ? Math.round((100 / totalQuestions) * 100) / 100 : 0;

  return (
    <div className="dc-page">
      <style>{`
        .tg-label { display: block; font-size: 0.75rem; font-weight: 700; color: rgba(255,255,255,0.88); margin-bottom: 8px; }
        .tg-input { height: 58px; font-size: 1.35rem; font-weight: 800; text-align: center; font-variant-numeric: tabular-nums; }
        .input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        .quick-row { display: flex; gap: 6px; margin-top: 10px; flex-wrap: wrap; }
        .quick-btn {
          flex: 1; min-width: 40px; min-height: 44px; border-radius: 10px; border: none;
          background: rgba(255,255,255,0.16); color: #fff; font-size: 0.8rem; font-weight: 800;
          cursor: pointer; transition: background 0.15s; font-variant-numeric: tabular-nums;
        }
        .quick-btn:hover:not(.on) { background: rgba(255,255,255,0.28); }
        .quick-btn.on { background: #111; }

        .stepper { display: flex; gap: 8px; }
        .step-btn {
          width: 52px; flex-shrink: 0; border-radius: 12px; border: none;
          background: #111; color: #fff; cursor: pointer;
          display: flex; align-items: center; justify-content: center; transition: transform 0.1s, opacity 0.15s;
        }
        .step-btn:active:not(:disabled) { transform: scale(0.94); }
        .step-btn:disabled { opacity: 0.35; cursor: not-allowed; }

        .chart-wrap { padding: 0; overflow: hidden; }
        .chart-wrap:hover { transform: none; box-shadow: 5px 5px 0 #111; }
        .chart-scroll { max-height: 520px; overflow-y: auto; position: relative; }
        .chart-table { width: 100%; border-collapse: collapse; font-size: 0.92rem; }
        .chart-table thead th {
          position: sticky; top: 0; z-index: 1; background: #111; color: #fff;
          text-align: left; padding: 13px 18px; font-size: 0.72rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.05em;
        }
        .chart-table td { padding: 10px 18px; border-bottom: 1px solid #ece8de; color: #333; font-variant-numeric: tabular-nums; }
        .chart-table tbody tr:last-child td { border-bottom: none; }
        .chart-table tbody tr:hover { background: #faf8f3; }
        .chart-table tbody tr.current { background: #fde047; }
        .chart-table tbody tr.current td { font-weight: 900; color: #111; }
        .letter-tag { display: inline-block; min-width: 36px; text-align: center; border-radius: 6px; padding: 3px 8px; font-weight: 800; font-size: 0.8rem; }

        .dc-card.here { background: #fde047; }
        .compare-head { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
        .compare-head h3 { margin: 0; }
        .compare-link {
          display: inline-flex; align-items: center; gap: 6px; background: none; border: none; cursor: pointer;
          color: #111; font-weight: 800; font-size: 0.88rem; padding: 10px 0; margin: 4px 0 -10px;
          text-decoration: underline; text-decoration-color: #fde047; text-decoration-thickness: 3px; text-underline-offset: 3px;
        }

        @media (max-width: 640px) {
          .input-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org/",
        "@type": "WebApplication",
        name: "Test Grade Calculator",
        description: "Score a single test from the number of questions missed, with a full grading chart for marking a set of papers.",
        url: "https://finalgradecalculators.us/test-grade-calculator",
        applicationCategory: "EducationalApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqData.map(f => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }) }} />

      <Header activePage="test-grade-calculator" />

      {/* ═════════════ HERO + CALCULATOR ═════════════ */}
      <section className="dc-hero">
        <div className="dc-split">
          <div>
            <span className="dc-tag">Test Grade Calculator</span>
            <h1 className="dc-h1">Count the misses. <u>Get the grade.</u></h1>
            <p className="dc-sub">Enter how many questions a test has and how many were wrong. You get the percentage and letter at once, plus a chart for marking the rest of the stack.</p>
            <div className="dc-tiles">
              <div className="dc-tile"><b>1 chart</b><span>covers the whole stack</span></div>
              <div className="dc-tile"><b>½ pts</b><span>partial credit OK</span></div>
              <div className="dc-tile"><b>0</b><span>data stored</span></div>
              <div className="dc-tile"><b>100%</b><span>always free</span></div>
            </div>
          </div>

          <div className="dc-panel">
            <div className="dc-panel-head">
              <h2 className="dc-panel-title">Score a test</h2>
              <div className="dc-seg" role="group" aria-label="Scoring mode">
                <button className={mode === "questions" ? "on" : ""} onClick={() => setMode("questions")} aria-pressed={mode === "questions"}>Questions</button>
                <button className={mode === "points" ? "on" : ""} onClick={() => setMode("points")} aria-pressed={mode === "points"}>Points</button>
              </div>
            </div>

            <div className="input-grid">
              {mode === "questions" ? (
                <>
                  <div>
                    <label className="tg-label" htmlFor="total-q">Total questions</label>
                    <input
                      id="total-q" type="number" inputMode="numeric" min="1" max="1000" step="1" className="dc-input tg-input"
                      value={totalQuestions || ""}
                      onChange={e => setTotalQuestions(parseInt(e.target.value, 10) || 0)}
                    />
                  </div>
                  <div>
                    <label className="tg-label" htmlFor="wrong-q">Wrong answers</label>
                    {/* Steppers beat typing when you're working through a stack. */}
                    <div className="stepper">
                      <button className="step-btn" onClick={() => stepWrong(-1)} disabled={wrong <= 0} aria-label="One fewer wrong answer">
                        <Minus style={{ width: 16, height: 16 }} />
                      </button>
                      <input
                        id="wrong-q" type="number" inputMode="numeric" min="0" max={totalQuestions} step="1"
                        className="dc-input tg-input" style={{ minWidth: 0 }}
                        value={wrong === 0 ? "0" : wrong || ""}
                        onChange={e => setWrong(parseInt(e.target.value, 10) || 0)}
                      />
                      <button className="step-btn" onClick={() => stepWrong(1)} disabled={wrong >= totalQuestions} aria-label="One more wrong answer">
                        <Plus style={{ width: 16, height: 16 }} />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="tg-label" htmlFor="earned-p">Points earned</label>
                    <input
                      id="earned-p" type="number" inputMode="decimal" min="0" step="0.5" className="dc-input tg-input"
                      value={earned === 0 ? "0" : earned || ""}
                      onChange={e => setEarned(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label className="tg-label" htmlFor="total-p">Out of</label>
                    <input
                      id="total-p" type="number" inputMode="decimal" min="1" step="0.5" className="dc-input tg-input"
                      value={totalPoints || ""}
                      onChange={e => setTotalPoints(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </>
              )}
            </div>

            {mode === "questions" && (
              <div className="quick-row" role="group" aria-label="Common question counts">
                {QUICK_COUNTS.map(n => (
                  <button key={n} className={`quick-btn ${totalQuestions === n ? "on" : ""}`} onClick={() => setTotalQuestions(n)} aria-pressed={totalQuestions === n}>
                    {n}
                  </button>
                ))}
              </div>
            )}

            <div className={`dc-result ${flash}`} aria-live="polite">
              <div className="dc-res-top">
                <div>
                  <p className="dc-res-label">Test score</p>
                  <p className="dc-res-big">{animatedPct.toFixed(animatedPct % 1 === 0 ? 0 : 2)}<small>%</small></p>
                </div>
                <div className="dc-letter"><b>{result.letter}</b><span>letter grade</span></div>
              </div>
              <div className="dc-track"><div className="dc-fill" style={{ width: `${Math.min(Math.max(result.percentage, 0), 100)}%` }} /></div>
              <div className="dc-chips">
                <div className="dc-chip"><b>{result.correct}</b><span>{mode === "questions" ? "Correct" : "Earned"}</span></div>
                <div className="dc-chip"><b>{result.wrong}</b><span>{mode === "questions" ? "Wrong" : "Lost"}</span></div>
                <div className="dc-chip">
                  <b>{mode === "questions" ? `${perQuestion}%` : totalPoints}</b>
                  <span>{mode === "questions" ? "Per question" : "Out of"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="dc-micro">🔒 Nothing stored · Everything is calculated in your browser</p>
      </section>

      {/* ═════════════ GRADING CHART ═════════════ */}
      {mode === "questions" && chart.length > 0 && (
        <section className="dc-sec white">
          <div style={{ maxWidth: 760, margin: "0 auto" }}>
            <div className="dc-sec-head">
              <span className="dc-tag">Grading chart</span>
              <h2 className="dc-h2">Every score for a <u>{totalQuestions}-question</u> test</h2>
              <p className="dc-lead">Mark a paper, count the misses, read the grade. Your current entry is highlighted.</p>
            </div>

            <div className="dc-card chart-wrap">
              <div className="chart-scroll" ref={chartScrollRef}>
                <table className="chart-table">
                  <thead>
                    <tr>
                      <th>Wrong</th>
                      <th>Correct</th>
                      <th>Score</th>
                      <th>Grade</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chart.map(row => (
                      <tr
                        key={row.wrong}
                        ref={row.wrong === result.wrong ? currentRowRef : undefined}
                        className={row.wrong === result.wrong ? "current" : ""}
                      >
                        <td>{row.wrong}</td>
                        <td>{row.correct}</td>
                        <td>{row.percentage}%</td>
                        <td><span className="letter-tag" style={letterStyle(row.letter)}>{row.letter}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {chart.length < totalQuestions + 1 && (
              <p style={{ color: "#666", fontSize: "0.8rem", marginTop: 14, textAlign: "center" }}>
                Long test — the chart steps through evenly to stay readable. The score above is exact.
              </p>
            )}
          </div>
        </section>
      )}

      {/* ═════════════ WHICH CALCULATOR ═════════════ */}
      <section className="dc-sec cream">
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div className="dc-sec-head">
            <span className="dc-tag">Pick the right tool</span>
            <h2 className="dc-h2">Which calculator do you <u>need</u>?</h2>
            <p className="dc-lead">These do different jobs — here's how they split up.</p>
          </div>

          <div className="dc-grid3">
            <div className="dc-card here">
              <div className="compare-head"><ClipboardCheck style={{ width: 20, height: 20 }} /><h3>Test Grade Calculator</h3></div>
              <p style={{ color: "#333" }}>
                Scores <strong>one test</strong>. Give it the question count and the misses; it returns the percentage plus a chart covering every possible result.
              </p>
              <p style={{ color: "#111", fontWeight: 800, marginTop: 12 }}>You're here</p>
            </div>

            <div className="dc-card">
              <div className="compare-head"><Zap style={{ width: 20, height: 20 }} /><h3>Grade Calculator</h3></div>
              <p>
                Scores a <strong>whole course</strong>. Combines every assignment, test, and project with its weight to give your overall class percentage.
              </p>
              <Link href="/grade-calculator" className="compare-link">
                Open Grade Calculator <ArrowRight style={{ width: 14, height: 14 }} />
              </Link>
            </div>

            <div className="dc-card">
              <div className="compare-head"><Users style={{ width: 20, height: 20 }} /><h3>GPA Calculator</h3></div>
              <p>
                Scores <strong>every course at once</strong>. Turns letter grades and credit hours into a term, weighted, or cumulative GPA.
              </p>
              <Link href="/gpa-calculator" className="compare-link">
                Open GPA Calculator <ArrowRight style={{ width: 14, height: 14 }} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════ FAQ ═════════════ */}
      <section className="dc-sec white">
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div className="dc-sec-head">
            <span className="dc-tag">FAQ</span>
            <h2 className="dc-h2">Common questions</h2>
            <p className="dc-lead">From teachers and students marking tests.</p>
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

      <CalculatorLinks current="/test-grade-calculator" />

      {/* ═════════════ CTA ═════════════ */}
      <section className="dc-sec ink">
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <span className="dc-tag">Finals week?</span>
          <h2 className="dc-h2">Wondering what you need <u>on the final</u>?</h2>
          <p className="dc-lead" style={{ marginBottom: 34 }}>
            The Final Grade Calculator works out the exact score you need on your final exam to land the course grade you're after.
          </p>
          <Link href="/" className="dc-cta-btn">
            Open Final Grade Calculator
            <ArrowRight style={{ width: 18, height: 18 }} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
