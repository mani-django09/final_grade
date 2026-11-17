import { useState } from "react";
import { Plus, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FaqSection, GpaBreadcrumb, GpaSchema, GpaToolLinks, type Faq } from "@/components/GpaShared";
import { useSeo } from "@/hooks/useSeo";
import { useCountUp } from "@/hooks/useCountUp";
import { useHighlightOnChange } from "@/hooks/useHighlightOnChange";
import { combineTermGpas, gpaNeededForTarget, letterForGpa } from "@shared/gradeMath";
import "@/styles/design-c.css";

const PATH = "/cumulative-gpa-calculator";

interface Term {
  id: string;
  name: string;
  gpa: string;
  credits: string;
}
const blank = (n: number): Term => ({ id: Math.random().toString(36).slice(2, 9), name: `Semester ${n}`, gpa: "", credits: "" });
const starter = () => [blank(1), blank(2), blank(3)];
const num = (s: string) => (s.trim() === "" ? NaN : parseFloat(s));

const faqs: Faq[] = [
  {
    question: "How do I calculate cumulative GPA?",
    answer: "Multiply each semester's GPA by the credits you took that semester to get its quality points. Add the quality points from every semester, then divide by the total credits from every semester. Don't simply average the semester GPAs — a 12-credit term and an 18-credit term don't count equally.",
  },
  {
    question: "What's the difference between semester GPA and cumulative GPA?",
    answer: "Semester (or term) GPA covers only the courses from one term. Cumulative GPA covers every graded course you've taken at that school. Transcripts show both; graduate schools, honors programs and most employers look at the cumulative figure.",
  },
  {
    question: "Why can't I just average my semester GPAs?",
    answer: "Because semesters carry different credit loads. A 4.0 in a 6-credit summer term and a 2.0 in an 18-credit fall term don't average to 3.0 — the real cumulative GPA is 2.5, because the fall term holds three times the credits. This calculator weights each term automatically.",
  },
  {
    question: "How fast can I raise my cumulative GPA?",
    answer: "It gets slower the more credits you've earned. Use the target planner above: enter your goal and how many credits you have left, and it shows the GPA you'd need to average. If the number is above 4.0, the goal isn't reachable in that many credits.",
  },
  {
    question: "Do transfer credits count toward my cumulative GPA?",
    answer: "Usually not. Most colleges accept transfer credits toward graduation but compute your institutional cumulative GPA only from courses taken there. Medical and law school applications (AMCAS, LSAC) are the exception — they recompute a GPA across every school you attended.",
  },
  {
    question: "Does a retaken class replace the old grade?",
    answer: "Depends on the school's grade-replacement policy. Some drop the old grade from the GPA entirely, some average both attempts, and some count both. If your school replaces it, adjust that semester's GPA to reflect the new grade before entering it here.",
  },
];

export default function CumulativeGpaCalculator() {
  useSeo({
    title: "Cumulative GPA Calculator – Combine Semesters & Plan a Target",
    description: "Free cumulative GPA calculator. Enter each semester's GPA and credits to get your overall GPA, then see what you need next term to reach your goal.",
    path: PATH,
    keywords: "cumulative gpa calculator, cumulative gpa, overall gpa calculator, how to calculate cumulative gpa, raise gpa calculator",
  });

  const [terms, setTerms] = useState<Term[]>(starter);
  const [target, setTarget] = useState("");
  const [remaining, setRemaining] = useState("");

  const parsed = terms.map(t => ({ gpa: num(t.gpa), credits: num(t.credits) || 0 }));
  const result = combineTermGpas(parsed.filter(t => !Number.isNaN(t.gpa)));
  const hasResult = result.countedTerms > 0;

  const needed = hasResult && num(target) > 0 && num(remaining) > 0
    ? gpaNeededForTarget(result.gpa, result.totalCredits, num(target), num(remaining))
    : NaN;

  const anim = useCountUp(result.gpa);
  const flash = useHighlightOnChange(`${result.gpa}`, 950);

  const update = (id: string, patch: Partial<Term>) =>
    setTerms(ts => ts.map(t => (t.id === id ? { ...t, ...patch } : t)));

  const gridCols = "2fr 1fr 1fr 38px";
  const smCols = "1fr 1fr 30px";

  let plan: { text: string; tone: "" | "warn" | "bad" } | null = null;
  if (!Number.isNaN(needed)) {
    if (needed > 4.0) plan = { tone: "bad", text: `You'd need a ${needed.toFixed(2)} average over the next ${remaining} credits — above a 4.0, so ${target} isn't reachable yet. Try more credits or a lower target.` };
    else if (needed <= 0) plan = { tone: "", text: `You're already set: even with 0.0 grades over ${remaining} credits you'd stay at ${target} or above.` };
    else plan = { tone: needed >= 3.7 ? "warn" : "", text: `Average a ${needed.toFixed(2)} (${letterForGpa(needed)}) over your next ${remaining} credits to finish at a ${num(target).toFixed(2)} cumulative GPA.` };
  }

  return (
    <div className="dc-page">
      <style>{`
        .cg-plan { margin-top: 18px; padding: 18px; border-radius: 16px; background: rgba(255,255,255,0.14); }
        .cg-plan h3 { margin: 0 0 12px; font-size: 1rem; font-weight: 800; }
        .cg-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
        .cg-grid label { display: block; margin-bottom: 6px; }
      `}</style>

      <GpaSchema name="Cumulative GPA Calculator" description="Combine semester GPAs into a cumulative GPA and plan the GPA needed to reach a target." path={PATH} faqs={faqs} />
      <Header activePage="gpa-calculator" />

      <section className="dc-hero">
        <GpaBreadcrumb name="Cumulative GPA Calculator" />
        <div className="dc-intro">
          <div>
            <span className="dc-tag">Cumulative GPA Calculator</span>
            <h1 className="dc-h1">All your semesters, <u>one GPA</u></h1>
            <p className="dc-sub">Enter each semester's GPA and credit hours straight off your transcript. Get your cumulative GPA, then find out what you need next to hit your goal.</p>
          </div>
          <div className="dc-tiles">
            <div className="dc-tile"><b>Credit-</b><span>weighted, not averaged</span></div>
            <div className="dc-tile"><b>Target</b><span>GPA planner built in</span></div>
            <div className="dc-tile"><b>Any</b><span>number of semesters</span></div>
            <div className="dc-tile"><b>0</b><span>data stored</span></div>
          </div>
        </div>

        <div className="dc-panel">
          <div className="dc-panel-head">
            <h2 className="dc-panel-title">Your semesters</h2>
          </div>

          <div className="dc-col-heads" style={{ display: "grid", gridTemplateColumns: gridCols, gap: 10, padding: "0 14px 8px" }}>
            <span className="dc-col-head">Term</span>
            <span className="dc-col-head">Term GPA</span>
            <span className="dc-col-head">Credits</span>
            <span />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {terms.map((t, i) => (
              <div key={t.id} className="dc-row">
                <div className="dc-row-grid" style={{ display: "grid", gridTemplateColumns: gridCols, gap: 10, alignItems: "center", ["--sm-cols" as string]: smCols }}>
                  <input type="text" className="dc-input dc-full" value={t.name} onChange={e => update(t.id, { name: e.target.value })} aria-label={`Term ${i + 1} name`} />
                  <input type="number" inputMode="decimal" min="0" max="5" step="0.01" className="dc-input" placeholder="3.40"
                    value={t.gpa} onChange={e => update(t.id, { gpa: e.target.value })} aria-label={`Term ${i + 1} GPA`} />
                  <input type="number" inputMode="decimal" min="0" step="0.5" className="dc-input" placeholder="15"
                    value={t.credits} onChange={e => update(t.id, { credits: e.target.value })} aria-label={`Term ${i + 1} credits`} />
                  <button onClick={() => setTerms(ts => (ts.length > 1 ? ts.filter(x => x.id !== t.id) : ts))} disabled={terms.length === 1}
                    className="dc-del" aria-label={`Remove term ${i + 1}`}>
                    <X style={{ width: 15, height: 15 }} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="dc-actions">
            <button onClick={() => setTerms(ts => [...ts, blank(ts.length + 1)])} className="dc-add"><Plus style={{ width: 15, height: 15 }} />Add semester</button>
            <button onClick={() => { setTerms(starter()); setTarget(""); setRemaining(""); }} className="dc-clear">Clear all</button>
          </div>

          {hasResult ? (
            <div className={`dc-result ${flash}`} aria-live="polite">
              <div className="dc-res-top">
                <div>
                  <p className="dc-res-label">Cumulative GPA</p>
                  <p className="dc-res-big">{anim.toFixed(2)}<small> / 4.0</small></p>
                </div>
                <div className="dc-letter"><b>{letterForGpa(result.gpa)}</b><span>average</span></div>
              </div>
              <div className="dc-track">
                <div className="dc-fill" style={{ width: `${Math.min((result.gpa / 4) * 100, 100)}%` }} />
              </div>
              <div className="dc-chips">
                <div className="dc-chip"><b>{result.countedTerms}</b><span>Semesters</span></div>
                <div className="dc-chip"><b>{result.totalCredits}</b><span>Credits</span></div>
                <div className="dc-chip"><b>{result.qualityPoints.toFixed(1)}</b><span>Quality pts</span></div>
              </div>
            </div>
          ) : (
            <div className="dc-empty">Enter a GPA and credits for at least one semester to see your cumulative GPA.</div>
          )}

          <div className="cg-plan">
            <h3>🎯 What do I need to reach my goal?</h3>
            <div className="cg-grid">
              <div>
                <label className="dc-col-head" htmlFor="cg-target">Target cumulative GPA</label>
                <input id="cg-target" type="number" inputMode="decimal" min="0" max="4" step="0.01" className="dc-input" placeholder="3.50"
                  value={target} onChange={e => setTarget(e.target.value)} />
              </div>
              <div>
                <label className="dc-col-head" htmlFor="cg-rem">Credits left to take</label>
                <input id="cg-rem" type="number" inputMode="decimal" min="0" step="0.5" className="dc-input" placeholder="30"
                  value={remaining} onChange={e => setRemaining(e.target.value)} />
              </div>
            </div>
            {plan ? (
              <div className={`dc-note ${plan.tone}`} style={{ marginBottom: 0 }} aria-live="polite">{plan.text}</div>
            ) : (
              <p className="dc-hint" style={{ margin: 0 }}>Fill in your semesters above, then a target and the credits you have left.</p>
            )}
          </div>
        </div>

        <p className="dc-micro">🔒 Nothing stored · Everything is calculated in your browser</p>
      </section>

      <section className="dc-sec white">
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div className="dc-sec-head">
            <span className="dc-tag">The math</span>
            <h2 className="dc-h2">How cumulative GPA is <u>calculated</u></h2>
            <p className="dc-lead">Weight every semester by its credits.</p>
          </div>
          <div className="dc-card" style={{ padding: 32 }}>
            <div className="dc-formula" style={{ marginBottom: 22 }}>Cumulative GPA = Σ (Term GPA × Term Credits) ÷ Σ Term Credits</div>
            <p className="dc-kicker">Example: three semesters</p>
            <div className="dc-code">
              <div>Fall: 3.20 × 15 = 48.0</div>
              <div>Spring: 3.60 × 16 = 57.6</div>
              <div>Summer: 4.00 × 6 = 24.0</div>
              <div><span className="hl">129.6 ÷ 37 credits = 3.50 cumulative</span></div>
            </div>
            <p style={{ marginTop: 18 }}>
              A plain average of 3.20, 3.60 and 4.00 would give 3.60 — too high, because the 6-credit summer term would count as much as a full semester.
            </p>
          </div>
        </div>
      </section>

      <section className="dc-sec cream">
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div className="dc-sec-head">
            <span className="dc-tag">Raising your GPA</span>
            <h2 className="dc-h2">Why it gets <u>harder</u> every semester</h2>
            <p className="dc-lead">Starting from a 2.80, here's what one 15-credit semester of straight A's does.</p>
          </div>
          <div className="dc-card dc-table-wrap" style={{ padding: 20 }}>
            <table className="dc-table">
              <thead><tr><th>Credits already earned</th><th>GPA after a 4.0 term</th><th>Increase</th></tr></thead>
              <tbody>
                {[15, 30, 60, 90].map(c => {
                  const after = combineTermGpas([{ gpa: 2.8, credits: c }, { gpa: 4.0, credits: 15 }]).gpa;
                  return <tr key={c}><td>{c}</td><td>{after.toFixed(2)}</td><td>+{(after - 2.8).toFixed(2)}</td></tr>;
                })}
              </tbody>
            </table>
            <p style={{ fontSize: "0.85rem", marginTop: 14 }}>
              The earlier you turn things around, the more each good semester moves your cumulative GPA.
            </p>
          </div>
        </div>
      </section>

      <FaqSection faqs={faqs} />
      <GpaToolLinks current={PATH} />
      <Footer />
    </div>
  );
}
