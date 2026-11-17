import { useState } from "react";
import { Link } from "wouter";
import { Plus, X, ChevronDown, Target, GraduationCap, RefreshCw, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GpaToolLinks } from "@/components/GpaShared";
import { useSeo } from "@/hooks/useSeo";
import { useCountUp } from "@/hooks/useCountUp";
import { useHighlightOnChange } from "@/hooks/useHighlightOnChange";
import {
  calculateGpa, calculateCumulativeGpa, letterForGpa, gradePointsFor,
  GRADE_OPTIONS, LEVEL_LABELS,
  type CourseLevel, type GpaCourse,
} from "@shared/gradeMath";
import "@/styles/design-c.css";

interface CourseRow extends GpaCourse {
  id: string;
  name: string;
  level: CourseLevel;
}

const blankRow = (): CourseRow => ({
  id: Math.random().toString(36).slice(2, 9),
  name: "",
  grade: "",
  credits: 3,
  level: "regular",
});

const faqData = [
  {
    question: "What's the difference between weighted and unweighted GPA?",
    answer: "An unweighted GPA caps out at 4.0 and treats every class the same — an A is 4.0 whether it's gym or AP Calculus. A weighted GPA adds bonus points for harder courses: usually +0.5 for Honors and +1.0 for AP or IB, so an A in AP Calc is worth 5.0. That's why weighted GPAs can go above 4.0.",
  },
  {
    question: "How do credit hours affect my GPA?",
    answer: "Heavily. A 4-credit course counts roughly four times as much as a 1-credit course. That's why one bad grade in a big lecture class hurts far more than a bad grade in a one-credit lab. Enter the real credit value from your transcript rather than assuming every class is 3 credits.",
  },
  {
    question: "How do I calculate my cumulative GPA?",
    answer: "Enter this term's courses, then fill in your prior GPA and the total credits you'd already earned before this term. The calculator combines them and shows your new cumulative GPA. You'll find both numbers on your latest transcript or student portal.",
  },
  {
    question: "Is an A+ worth more than an A?",
    answer: "At most schools, no — both are 4.0 on an unweighted scale. A handful of universities award 4.3 for an A+, but it's uncommon. Check your registrar's grading scale if the distinction matters for you; this calculator uses the standard 4.0 for both.",
  },
  {
    question: "Do pass/fail courses count toward my GPA?",
    answer: "Usually not. Pass/fail (or credit/no-credit) courses typically earn credit toward graduation but carry no grade points, so they're left out of the GPA calculation entirely. Just leave those courses out of this calculator.",
  },
  {
    question: "What's considered a good GPA?",
    answer: "It depends on where you're headed. A 3.0 is generally solid, 3.5+ is strong, and 3.7+ is competitive for graduate programs and selective scholarships. Many employers screen at 3.0, and most schools require around 2.0 to stay in good academic standing.",
  },
];

export default function GpaCalculator() {
  useSeo({
    title: "GPA Calculator – Weighted & Unweighted GPA in Seconds",
    description: "Free GPA calculator for high school and college. Enter your grades and credit hours to get your weighted, unweighted, or cumulative GPA instantly.",
    path: "/gpa-calculator",
    keywords: "gpa calculator, college gpa calculator, semester gpa calculator, grade point average calculator",
  });

  const [weighted, setWeighted] = useState(false);
  const [courses, setCourses] = useState<CourseRow[]>([blankRow(), blankRow(), blankRow(), blankRow()]);
  const [useCumulative, setUseCumulative] = useState(false);
  const [priorGpa, setPriorGpa] = useState<number>(0);
  const [priorCredits, setPriorCredits] = useState<number>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Recomputed on every keystroke — it's pure arithmetic in the browser.
  const result = calculateGpa(courses, weighted);
  const cumulative = calculateCumulativeGpa(priorGpa, priorCredits, result);

  const maxScale = weighted ? 5.0 : 4.0;
  const hasResult = result.countedCourses > 0;

  // Visible feedback that the number just moved.
  const animatedGpa = useCountUp(result.gpa);
  const animatedCumulative = useCountUp(cumulative.gpa);
  const flash = useHighlightOnChange(`${result.gpa}|${cumulative.gpa}`, 950);

  const update = (id: string, patch: Partial<CourseRow>) =>
    setCourses(cs => cs.map(c => (c.id === id ? { ...c, ...patch } : c)));
  const addCourse = () => setCourses(cs => [...cs, blankRow()]);
  const removeCourse = (id: string) =>
    setCourses(cs => (cs.length > 1 ? cs.filter(c => c.id !== id) : cs));
  const reset = () => {
    setCourses([blankRow(), blankRow(), blankRow(), blankRow()]);
    setPriorGpa(0);
    setPriorCredits(0);
  };

  const gridCols = weighted ? "2fr 1.1fr 1.1fr 0.8fr 62px 38px" : "2.4fr 1.2fr 0.9fr 62px 38px";
  const smCols = weighted ? "1fr 1.3fr 50px 30px" : "1fr 1fr 30px";

  return (
    <div className="dc-page">
      <style>{`
        .row-points {
          display: inline-block; text-align: center; border-radius: 10px; padding: 9px 0;
          font-size: 0.85rem; font-weight: 800; color: #111; background: #fde047;
          font-variant-numeric: tabular-nums;
        }
        .row-points.empty { color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.12); font-weight: 600; }
        .cum-toggle {
          display: flex; align-items: center; gap: 10px; cursor: pointer;
          font-size: 0.9rem; font-weight: 700; color: #fff;
          padding: 13px 16px; background: rgba(255,255,255,0.14); border-radius: 12px;
        }
        .cum-toggle input { width: 18px; height: 18px; accent-color: #111; cursor: pointer; }
        .cum-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px; }
        .cum-banner {
          margin-top: 12px; padding: 12px 14px; border-radius: 12px; background: #fde047; color: #111;
          display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
        }
        .cum-banner small { display: block; font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.7; }
        @media (max-width: 720px) { .row-points { display: none !important; } }
      `}</style>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org/",
        "@type": "WebApplication",
        name: "GPA Calculator",
        description: "Calculate weighted, unweighted, and cumulative GPA from your course grades and credit hours.",
        url: "https://finalgradecalculators.us/gpa-calculator",
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

      <Header activePage="gpa-calculator" />

      {/* ═════════════ HERO + CALCULATOR ═════════════ */}
      <section className="dc-hero">
        <div className="dc-intro">
          <div>
            <span className="dc-tag">GPA Calculator</span>
            <h1 className="dc-h1">What's your GPA, <u>really</u>?</h1>
            <p className="dc-sub">Add your courses, grades and credit hours. Your GPA updates as you type — weighted, unweighted, or cumulative with your past terms.</p>
          </div>
          <div className="dc-tiles">
            <div className="dc-tile"><b>4.0 · 5.0</b><span>scales supported</span></div>
            <div className="dc-tile"><b>Live</b><span>updates as you type</span></div>
            <div className="dc-tile"><b>0</b><span>data stored</span></div>
            <div className="dc-tile"><b>100%</b><span>always free</span></div>
          </div>
        </div>

        <div className="dc-panel">
          <div className="dc-panel-head">
            <div>
              <h2 className="dc-panel-title">Add your courses</h2>
              {weighted && <p className="dc-hint">Honors adds +0.5 and AP/IB adds +1.0 to each course's grade points.</p>}
            </div>
            <div className="dc-seg" role="group" aria-label="GPA scale">
              <button className={!weighted ? "on" : ""} onClick={() => setWeighted(false)} aria-pressed={!weighted}>Unweighted (4.0)</button>
              <button className={weighted ? "on" : ""} onClick={() => setWeighted(true)} aria-pressed={weighted}>Weighted (5.0)</button>
            </div>
          </div>

          <div className="dc-col-heads" style={{ display: "grid", gridTemplateColumns: gridCols, gap: 10, padding: "0 14px 8px" }}>
            <span className="dc-col-head">Course</span>
            <span className="dc-col-head">Grade</span>
            {weighted && <span className="dc-col-head">Level</span>}
            <span className="dc-col-head">Credits</span>
            <span className="dc-col-head" style={{ textAlign: "center" }}>Points</span>
            <span />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {courses.map((c, i) => (
              <div key={c.id} className="dc-row">
                <div className="dc-row-grid" style={{ display: "grid", gridTemplateColumns: gridCols, gap: 10, alignItems: "center", ["--sm-cols" as string]: smCols }}>
                  <input
                    type="text" className="dc-input dc-full"
                    placeholder={`Course ${i + 1}`}
                    value={c.name}
                    onChange={e => update(c.id, { name: e.target.value })}
                    aria-label={`Course ${i + 1} name`}
                  />

                  <select
                    className="dc-select" value={c.grade}
                    onChange={e => update(c.id, { grade: e.target.value })}
                    aria-label={`Course ${i + 1} grade`}
                  >
                    <option value="">Grade</option>
                    {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>

                  {weighted && (
                    <select
                      className="dc-select" value={c.level}
                      onChange={e => update(c.id, { level: e.target.value as CourseLevel })}
                      aria-label={`Course ${i + 1} level`}
                    >
                      {(Object.keys(LEVEL_LABELS) as CourseLevel[]).map(l => (
                        <option key={l} value={l}>{LEVEL_LABELS[l]}</option>
                      ))}
                    </select>
                  )}

                  <input
                    type="number" inputMode="decimal" min="0" max="12" step="0.5" className="dc-input"
                    placeholder="3" value={c.credits || ""}
                    onChange={e => update(c.id, { credits: parseFloat(e.target.value) || 0 })}
                    aria-label={`Course ${i + 1} credits`}
                  />

                  {/* Live contribution — what this row adds to the total. */}
                  {c.grade && c.credits > 0 ? (
                    <span className="row-points" title={`${gradePointsFor(c.grade, c.level, weighted)} points × ${c.credits} credits`}>
                      {(gradePointsFor(c.grade, c.level, weighted) * c.credits).toFixed(1)}
                    </span>
                  ) : (
                    <span className="row-points empty">—</span>
                  )}

                  <button
                    onClick={() => removeCourse(c.id)}
                    disabled={courses.length === 1}
                    className="dc-del"
                    aria-label={`Remove course ${i + 1}`}
                  >
                    <X style={{ width: 15, height: 15 }} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="dc-actions">
            <button onClick={addCourse} className="dc-add"><Plus style={{ width: 15, height: 15 }} />Add course</button>
            <button onClick={reset} className="dc-clear">Clear all</button>
          </div>

          <label className="cum-toggle">
            <input type="checkbox" checked={useCumulative} onChange={e => setUseCumulative(e.target.checked)} />
            Include my prior GPA to get a cumulative GPA
          </label>

          {useCumulative && (
            <div className="cum-grid">
              <div>
                <label className="dc-col-head" style={{ display: "block", marginBottom: 6 }} htmlFor="prior-gpa">Prior GPA</label>
                <input
                  id="prior-gpa" type="number" inputMode="decimal" min="0" max="5" step="0.01" className="dc-input"
                  placeholder="3.20" value={priorGpa || ""}
                  onChange={e => setPriorGpa(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="dc-col-head" style={{ display: "block", marginBottom: 6 }} htmlFor="prior-credits">Credits earned so far</label>
                <input
                  id="prior-credits" type="number" inputMode="decimal" min="0" step="0.5" className="dc-input"
                  placeholder="30" value={priorCredits || ""}
                  onChange={e => setPriorCredits(parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          )}

          {hasResult ? (
            <div className={`dc-result ${flash}`} aria-live="polite">
              <div className="dc-res-top">
                <div>
                  <p className="dc-res-label">{weighted ? "Weighted GPA" : "Your GPA"}</p>
                  <p className="dc-res-big">{animatedGpa.toFixed(2)}<small> / {maxScale.toFixed(1)}</small></p>
                </div>
                <div className="dc-letter"><b>{letterForGpa(result.gpa)}</b><span>average</span></div>
              </div>
              <div className="dc-track">
                <div className="dc-fill" style={{ width: `${Math.min((result.gpa / maxScale) * 100, 100)}%` }} />
              </div>
              <div className="dc-chips">
                <div className="dc-chip"><b>{result.countedCourses}</b><span>Courses</span></div>
                <div className="dc-chip"><b>{result.totalCredits}</b><span>Credits</span></div>
                <div className="dc-chip"><b>{result.qualityPoints.toFixed(1)}</b><span>Quality pts</span></div>
              </div>

              {useCumulative && priorCredits > 0 && (
                <div className="cum-banner">
                  <div>
                    <small>New cumulative GPA</small>
                    <b style={{ fontSize: "1.8rem", fontWeight: 900, lineHeight: 1 }}>{animatedCumulative.toFixed(2)}</b>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <small>Across</small>
                    <b>{cumulative.totalCredits} credits</b>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="dc-empty">
              Pick a grade and enter credit hours for at least one course to see your GPA.
            </div>
          )}
        </div>

        <p className="dc-micro">🔒 Nothing stored · Everything is calculated in your browser</p>
      </section>

      {/* ═════════════ GRADE SCALE TABLE ═════════════ */}
      <section className="dc-sec white">
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div className="dc-sec-head">
            <span className="dc-tag">The scale</span>
            <h2 className="dc-h2">How letter grades turn into <u>GPA points</u></h2>
            <p className="dc-lead">The standard 4.0 scale used by most US schools.</p>
          </div>

          <div className="dc-card dc-table-wrap" style={{ padding: 20 }}>
            <table className="dc-table">
              <thead>
                <tr>
                  <th>Letter</th>
                  <th>Unweighted</th>
                  <th>Honors (+0.5)</th>
                  <th>AP / IB (+1.0)</th>
                </tr>
              </thead>
              <tbody>
                {([
                  ["A+ / A", 4.0], ["A-", 3.7], ["B+", 3.3], ["B", 3.0], ["B-", 2.7],
                  ["C+", 2.3], ["C", 2.0], ["C-", 1.7], ["D+", 1.3], ["D", 1.0], ["D-", 0.7], ["F", 0.0],
                ] as [string, number][]).map(([letter, pts]) => (
                  <tr key={letter}>
                    <td>{letter}</td>
                    <td>{pts.toFixed(1)}</td>
                    <td>{pts === 0 ? "0.0" : (pts + 0.5).toFixed(1)}</td>
                    <td>{pts === 0 ? "0.0" : (pts + 1.0).toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ fontSize: "0.82rem", marginTop: 14 }}>
              An F stays at 0.0 on every scale — a harder course never turns a failing grade into points.
            </p>
          </div>
        </div>
      </section>

      {/* ═════════════ HOW IT WORKS ═════════════ */}
      <section className="dc-sec cream">
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div className="dc-sec-head">
            <span className="dc-tag">The math</span>
            <h2 className="dc-h2">How GPA is <u>actually</u> calculated</h2>
            <p className="dc-lead">Credit hours do most of the work.</p>
          </div>

          <div className="dc-card" style={{ padding: 32 }}>
            <p style={{ marginBottom: 20 }}>
              Every course earns <strong>quality points</strong> — its grade points multiplied by its credit hours. Your GPA is the total quality points divided by the total credits. That's why a 4-credit class swings your average far more than a 1-credit one.
            </p>
            <div className="dc-formula" style={{ marginBottom: 22 }}>GPA = Total Quality Points ÷ Total Credit Hours</div>
            <p className="dc-kicker">Quick example</p>
            <p style={{ marginBottom: 14 }}>
              An A in a 4-credit Biology class, a B in 3-credit English, and a C in a 3-credit elective:
            </p>
            <div className="dc-code">
              <div>(4.0 × 4) + (3.0 × 3) + (2.0 × 3)</div>
              <div>= 16 + 9 + 6 = 31 quality points</div>
              <div><span className="hl">31 ÷ 10 credits = 3.10 GPA</span></div>
            </div>
            <p style={{ marginTop: 18 }}>
              Notice the A in the 4-credit class carries more weight than the C in a 3-credit one. When you're deciding where to put your study hours, the high-credit courses are where they pay off most.
            </p>
          </div>
        </div>
      </section>

      {/* ═════════════ FEATURES ═════════════ */}
      <section className="dc-sec white">
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div className="dc-sec-head">
            <span className="dc-tag">Why it helps</span>
            <h2 className="dc-h2">Built for <u>real</u> transcripts</h2>
            <p className="dc-lead">High school or college, weighted or not — it handles what your registrar actually reports.</p>
          </div>
          <div className="dc-grid3">
            {[
              { icon: <RefreshCw style={{ width: 22, height: 22 }} />, title: "Updates as you type", desc: "No calculate button to hunt for. Change a grade or a credit value and your GPA moves instantly, so you can test scenarios in seconds." },
              { icon: <GraduationCap style={{ width: 22, height: 22 }} />, title: "Weighted and unweighted", desc: "Flip between the 4.0 and 5.0 scales. Honors and AP/IB bonuses are applied per course, the way high schools report them." },
              { icon: <Target style={{ width: 22, height: 22 }} />, title: "Cumulative in one step", desc: "Add your prior GPA and earned credits to see where this term leaves your overall average — no separate calculator needed." },
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

      {/* ═════════════ FAQ ═════════════ */}
      <section className="dc-sec cream">
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

      <GpaToolLinks current="/gpa-calculator" />

      {/* ═════════════ CTA ═════════════ */}
      <section className="dc-sec ink">
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
          <span className="dc-tag">One class at a time</span>
          <h2 className="dc-h2">Need a single <u>course grade</u> instead?</h2>
          <p className="dc-lead" style={{ marginBottom: 34 }}>
            The Grade Calculator works out your percentage in one class from assignments, tests, and projects.
          </p>
          <Link href="/grade-calculator" className="dc-cta-btn">
            Open Grade Calculator
            <ArrowRight style={{ width: 18, height: 18 }} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
