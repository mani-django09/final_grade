import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CalculatorLinks from "@/components/CalculatorLinks";
import { FaqSection, type Faq } from "@/components/GpaShared";
import { useSeo } from "@/hooks/useSeo";
import { useCountUp } from "@/hooks/useCountUp";
import { useHighlightOnChange } from "@/hooks/useHighlightOnChange";
import {
  SAT_SECTIONS, SECTION_MARGIN, estimateSatScore, estimateSectionScore,
  type SatPath, type SatSectionId,
} from "@shared/satScore";
import "@/styles/design-c.css";

const PATH = "/sat-score-calculator";
const SECTION_IDS: SatSectionId[] = ["rw", "math"];

const faqs: Faq[] = [
  {
    question: "How is the digital SAT scored?",
    answer: "The digital SAT has two sections, Reading & Writing and Math, each split into two modules. Each section is scored from 200 to 800 and the two add up to a total of 400 to 1600. There is no penalty for wrong answers, so a blank answer scores nothing and a guess can only help.",
  },
  {
    question: "Is the digital SAT adaptive?",
    answer: "Yes, section by section. How you do on Module 1 decides whether Module 2 is easier or harder. A harder Module 2 opens up the top of the score range, while an easier one lowers the ceiling. That's why the same number of correct answers can give different scores, and why this calculator asks how Module 2 felt.",
  },
  {
    question: "How accurate is this SAT score calculator?",
    answer: "It's an estimate, and the result is shown as a range for that reason. College Board doesn't publish a raw-to-scaled conversion for the digital SAT because the exact conversion comes from equating and varies by test form. This calculator uses approximate conversions drawn from published samples, so expect to land within roughly 30 points per section. For an official number, take a full practice test in College Board's Bluebook app.",
  },
  {
    question: "How many questions can I miss and still get a 1500?",
    answer: "Roughly 10 to 12 questions across the whole test, for example about 6 missed in Reading & Writing and 5 in Math, assuming you got the harder Module 2 in both sections. Run your practice numbers through the calculator above to see where you land. Treat anything within 30 points of a target as a toss-up.",
  },
  {
    question: "What is a good SAT score?",
    answer: "The national average is around 1000 to 1050. A 1200 puts you comfortably above average, 1400 or more is competitive at many selective colleges, and 1500 or more is common among admits to the most selective schools. What counts as good depends on the colleges you're applying to, so check the middle 50% range on each school's admissions page.",
  },
  {
    question: "Does a harder Module 2 mean I did well?",
    answer: "Usually it means you did well on Module 1, since that's what routes you to the harder module. It raises your score ceiling, but you still have to answer its questions correctly. How College Board weights individual questions isn't public, so this calculator simply uses a higher score curve for the harder path. Use Auto, or pick the module you actually got.",
  },
];

export default function SatScoreCalculator() {
  useSeo({
    title: "SAT Score Calculator – Estimate Your Digital SAT Score",
    description: "Free SAT score calculator for the digital SAT. Enter correct answers per module for Reading & Writing and Math to estimate your 400–1600 score as a range.",
    path: PATH,
    keywords: "sat score calculator, digital sat score calculator, sat calculator, sat raw score to scaled score, how is the sat scored",
  });

  const [m1, setM1] = useState<Record<SatSectionId, string>>({ rw: "", math: "" });
  const [m2, setM2] = useState<Record<SatSectionId, string>>({ rw: "", math: "" });
  const [path, setPath] = useState<Record<SatSectionId, SatPath>>({ rw: "auto", math: "auto" });

  const n = (s: string) => (s.trim() === "" ? 0 : parseFloat(s) || 0);
  const hasInput = SECTION_IDS.some(id => m1[id].trim() !== "" || m2[id].trim() !== "");

  const rw = estimateSectionScore("rw", n(m1.rw), n(m2.rw), path.rw);
  const math = estimateSectionScore("math", n(m1.math), n(m2.math), path.math);
  const total = estimateSatScore(rw, math);

  const animTotal = useCountUp(total.total);
  const flash = useHighlightOnChange(`${total.total}`, 950);
  const est = { rw, math };

  const reset = () => { setM1({ rw: "", math: "" }); setM2({ rw: "", math: "" }); setPath({ rw: "auto", math: "auto" }); };

  return (
    <div className="dc-page">
      <style>{`
        .sat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .sat-card { background: rgba(255,255,255,0.12); border: 1px solid rgba(255,255,255,0.2); border-radius: 18px; padding: 18px; }
        .sat-card h3 { margin: 0 0 14px; font-size: 1.05rem; font-weight: 800; color: #fff; }
        .sat-card label { display: block; font-size: 0.7rem; font-weight: 700; color: rgba(255,255,255,0.8); text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; }
        .sat-fields { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
        .sat-sec-score { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 10px 12px; }
        .sat-sec-score b { display: block; font-size: 1.3rem; font-weight: 900; font-variant-numeric: tabular-nums; }
        .sat-sec-score span { font-size: 0.68rem; color: rgba(255,255,255,0.55); text-transform: uppercase; letter-spacing: 0.04em; }
        .sat-total { font-size: 4.2rem; font-weight: 900; line-height: 1; letter-spacing: -0.05em; font-variant-numeric: tabular-nums; }
        .sat-total small { font-size: 1.1rem; color: rgba(255,255,255,0.45); margin-left: 4px; letter-spacing: 0; }
        @media (max-width: 720px) { .sat-grid { grid-template-columns: 1fr; } .sat-total { font-size: 3.2rem; } }
      `}</style>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        {
          "@context": "https://schema.org/", "@type": "WebApplication", name: "SAT Score Calculator",
          description: "Estimate a digital SAT score from correct answers in each Reading & Writing and Math module.",
          url: `https://finalgradecalculators.us${PATH}`, applicationCategory: "EducationalApplication", operatingSystem: "Any",
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
        { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })) },
      ]) }} />

      <Header />

      <section className="dc-hero">
        <div className="dc-intro">
          <div>
            <span className="dc-tag">SAT Score Calculator</span>
            <h1 className="dc-h1">How many points is your <u>practice test</u> worth?</h1>
            <p className="dc-sub">Enter how many questions you got right in each module of the digital SAT. You'll get an estimated 400–1600 score, with the range it could realistically fall in.</p>
          </div>
          <div className="dc-tiles">
            <div className="dc-tile"><b>400–1600</b><span>total score scale</span></div>
            <div className="dc-tile"><b>4 modules</b><span>R&amp;W and Math</span></div>
            <div className="dc-tile"><b>± range</b><span>honest estimate</span></div>
            <div className="dc-tile"><b>0</b><span>data stored</span></div>
          </div>
        </div>

        <div className="dc-panel">
          <div className="dc-panel-head">
            <div>
              <h2 className="dc-panel-title">Correct answers per module</h2>
              <p className="dc-hint">Reading &amp; Writing: 27 questions per module · Math: 22 per module</p>
            </div>
          </div>

          <div className="sat-grid">
            {SECTION_IDS.map(id => {
              const q = SAT_SECTIONS[id].moduleQuestions;
              const e = est[id];
              return (
                <div key={id} className="sat-card">
                  <h3>{SAT_SECTIONS[id].label}</h3>
                  <div className="sat-fields">
                    <div>
                      <label htmlFor={`${id}-m1`}>Module 1 (of {q})</label>
                      <input id={`${id}-m1`} type="number" inputMode="numeric" min="0" max={q} step="1" className="dc-input" placeholder="0"
                        value={m1[id]} onChange={ev => setM1(s => ({ ...s, [id]: ev.target.value }))} />
                    </div>
                    <div>
                      <label htmlFor={`${id}-m2`}>Module 2 (of {q})</label>
                      <input id={`${id}-m2`} type="number" inputMode="numeric" min="0" max={q} step="1" className="dc-input" placeholder="0"
                        value={m2[id]} onChange={ev => setM2(s => ({ ...s, [id]: ev.target.value }))} />
                    </div>
                  </div>
                  <label htmlFor={`${id}-path`}>Module 2 difficulty</label>
                  <select id={`${id}-path`} className="dc-select" value={path[id]} onChange={ev => setPath(s => ({ ...s, [id]: ev.target.value as SatPath }))}>
                    <option value="auto">Auto (from Module 1)</option>
                    <option value="harder">Harder module</option>
                    <option value="easier">Easier module</option>
                  </select>
                  {hasInput && (
                    <div className="sat-sec-score" style={{ marginTop: 12 }}>
                      <b>{e.score}</b>
                      <span>Est. section score · {e.correct}/{e.total} correct · {e.path} Module 2</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="dc-actions">
            <button onClick={reset} className="dc-clear" style={{ flex: 1 }}>Clear scores</button>
          </div>

          {hasInput ? (
            <div className={`dc-result ${flash}`} aria-live="polite">
              <div className="dc-res-top">
                <div>
                  <p className="dc-res-label">Estimated SAT score</p>
                  <p className="sat-total">{Math.round(animTotal)}<small>/ 1600</small></p>
                </div>
                <div className="dc-letter" style={{ flexDirection: "column", alignItems: "flex-start", gap: 2 }}>
                  <b style={{ fontSize: "1.2rem" }}>{total.low}–{total.high}</b>
                  <span>likely range</span>
                </div>
              </div>
              <div className="dc-track">
                <div className="dc-fill" style={{ width: `${((total.total - 400) / 1200) * 100}%` }} />
              </div>
              <div className="dc-chips" style={{ gridTemplateColumns: "1fr 1fr" }}>
                <div className="dc-chip"><b>{rw.score}</b><span>Reading &amp; Writing</span></div>
                <div className="dc-chip"><b>{math.score}</b><span>Math</span></div>
              </div>
              <p className="dc-res-note">
                An estimate, not an official score: College Board doesn't publish raw-to-scaled conversions. Each section is shown ±{SECTION_MARGIN} points.
              </p>
            </div>
          ) : (
            <div className="dc-empty">Enter your correct answers for at least one module to see your estimated SAT score.</div>
          )}
        </div>

        <p className="dc-micro">🔒 Nothing stored · Everything is calculated in your browser</p>
      </section>

      <section className="dc-sec white">
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div className="dc-sec-head">
            <span className="dc-tag">How it works</span>
            <h2 className="dc-h2">How the digital SAT is <u>scored</u></h2>
            <p className="dc-lead">Four modules, two sections, one total.</p>
          </div>
          <div className="dc-card" style={{ padding: 32 }}>
            <div className="dc-formula" style={{ marginBottom: 22 }}>Total = Reading &amp; Writing (200–800) + Math (200–800)</div>
            <div className="dc-card dc-table-wrap" style={{ padding: 16, boxShadow: "none", marginBottom: 22 }}>
              <table className="dc-table">
                <thead><tr><th>Section</th><th>Modules</th><th>Questions</th><th>Score</th></tr></thead>
                <tbody>
                  <tr><td>Reading &amp; Writing</td><td>2</td><td>27 + 27 = 54</td><td>200–800</td></tr>
                  <tr><td>Math</td><td>2</td><td>22 + 22 = 44</td><td>200–800</td></tr>
                  <tr><td>Total</td><td>4</td><td>98</td><td>400–1600</td></tr>
                </tbody>
              </table>
            </div>
            <p className="dc-kicker">Example: Math section</p>
            <div className="dc-code">
              <div>Module 1: 19 of 22 correct → routed to the harder Module 2</div>
              <div>Module 2: 17 of 22 correct</div>
              <div>36 of 44 correct overall</div>
              <div><span className="hl">Estimated Math score ≈ 730</span></div>
            </div>
            <p style={{ marginTop: 18 }}>
              Your Module 1 result decides how hard Module 2 is. A harder Module 2 raises the ceiling on your score; an easier one caps it, so strong students are better off being routed to the harder one.
            </p>
          </div>
        </div>
      </section>

      <section className="dc-sec cream">
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div className="dc-sec-head">
            <span className="dc-tag">Benchmarks</span>
            <h2 className="dc-h2">What a score <u>means</u></h2>
            <p className="dc-lead">Rough guide to where a total score puts you.</p>
          </div>
          <div className="dc-card dc-table-wrap" style={{ padding: 20 }}>
            <table className="dc-table">
              <thead><tr><th>Total score</th><th>Roughly means</th></tr></thead>
              <tbody>
                <tr><td>1500+</td><td>Common among admits to the most selective colleges</td></tr>
                <tr><td>1400–1490</td><td>Competitive at many selective colleges</td></tr>
                <tr><td>1200–1390</td><td>Well above the national average</td></tr>
                <tr><td>1000–1190</td><td>Around the national average</td></tr>
                <tr><td>Below 1000</td><td>Room to grow; many colleges are test-optional</td></tr>
              </tbody>
            </table>
            <p style={{ fontSize: "0.85rem", marginTop: 14 }}>
              Always compare against the middle 50% SAT range on each college's own admissions page, since expectations differ a lot from school to school.
            </p>
          </div>
        </div>
      </section>

      <FaqSection faqs={faqs} />
      <CalculatorLinks current={PATH} />
      <Footer />
    </div>
  );
}
