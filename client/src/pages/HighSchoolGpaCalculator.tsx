import { useState } from "react";
import { Plus, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FaqSection, GpaBreadcrumb, GpaSchema, GpaToolLinks, type Faq } from "@/components/GpaShared";
import { useSeo } from "@/hooks/useSeo";
import { useCountUp } from "@/hooks/useCountUp";
import { useHighlightOnChange } from "@/hooks/useHighlightOnChange";
import {
  calculateGpa, letterForGpa, GRADE_OPTIONS, LEVEL_LABELS,
  type CourseLevel, type GpaCourse,
} from "@shared/gradeMath";
import "@/styles/design-c.css";

const PATH = "/high-school-gpa-calculator";
const YEARS = [9, 10, 11, 12] as const;
type Year = (typeof YEARS)[number];
const YEAR_NAMES: Record<Year, string> = { 9: "Freshman", 10: "Sophomore", 11: "Junior", 12: "Senior" };

interface ClassRow extends GpaCourse {
  id: string;
  name: string;
  level: CourseLevel;
  year: Year;
}

const blank = (year: Year): ClassRow => ({
  id: Math.random().toString(36).slice(2, 9),
  name: "", grade: "", credits: 1, level: "regular", year,
});
const starter = (): ClassRow[] => YEARS.flatMap(y => [blank(y), blank(y), blank(y)]);

const faqs: Faq[] = [
  {
    question: "How do I calculate my high school GPA?",
    answer: "Turn each final class grade into points on the 4.0 scale (A = 4, B = 3, C = 2, D = 1, F = 0), multiply by the class's credits, add everything up, and divide by your total credits. Most high schools give a full-year class 1 credit and a semester class 0.5. Enter each year's classes above and the calculator does the rest.",
  },
  {
    question: "Do colleges look at weighted or unweighted high school GPA?",
    answer: "Both, and many recalculate it themselves. Colleges see your school's reported GPA on the transcript, but because every high school weights differently, many admissions offices strip the bonus points and recompute an unweighted core GPA from English, math, science, social studies and world language. That's why this calculator shows both numbers side by side.",
  },
  {
    question: "Does 9th grade count in my GPA?",
    answer: "Yes, at almost every US high school freshman year counts toward your cumulative GPA. A few colleges, including the University of California system, leave 9th grade out when they calculate their own admissions GPA — so a rough freshman year matters less there. Uncheck years in the calculator to see your GPA without them.",
  },
  {
    question: "What is a good high school GPA?",
    answer: "A 3.0 unweighted (B average) meets the bar at most colleges. A 3.5+ makes you competitive at many selective schools, and highly selective colleges typically see admitted students with 3.8–4.0 unweighted alongside a heavy load of AP, IB or Honors classes.",
  },
  {
    question: "Is it too late to raise my GPA in junior or senior year?",
    answer: "It's harder, not impossible. By the end of junior year you have about three-quarters of your credits locked in, so each new grade moves the average less. But colleges also look at your trend — a clear upward climb in 11th and 12th grade is read favorably even when the cumulative number moves slowly.",
  },
  {
    question: "How many credits is a high school class worth?",
    answer: "It varies by school, but the most common setup is 1 credit for a full-year course and 0.5 for a one-semester course. Some schools use 5 or 10 credits per class instead. The ratio is what matters: as long as you're consistent, your GPA comes out the same.",
  },
];

export default function HighSchoolGpaCalculator() {
  useSeo({
    title: "High School GPA Calculator – Grades 9 to 12",
    description: "Free high school GPA calculator. Add your classes for freshman through senior year and see your weighted and unweighted GPA side by side, year by year.",
    path: PATH,
    keywords: "high school gpa calculator, gpa calculator high school, high school gpa, how to calculate high school gpa",
  });

  const [rows, setRows] = useState<ClassRow[]>(starter);
  const [activeYear, setActiveYear] = useState<Year>(9);
  const [included, setIncluded] = useState<Record<Year, boolean>>({ 9: true, 10: true, 11: true, 12: true });

  const counted = rows.filter(r => included[r.year]);
  const unweighted = calculateGpa(counted, false);
  const weighted = calculateGpa(counted, true);
  const hasResult = unweighted.countedCourses > 0;

  const animU = useCountUp(unweighted.gpa);
  const animW = useCountUp(weighted.gpa);
  const flash = useHighlightOnChange(`${unweighted.gpa}|${weighted.gpa}`, 950);

  const update = (id: string, patch: Partial<ClassRow>) =>
    setRows(rs => rs.map(r => (r.id === id ? { ...r, ...patch } : r)));
  const remove = (id: string) => setRows(rs => rs.filter(r => r.id !== id));
  const yearRows = rows.filter(r => r.year === activeYear);

  const gridCols = "2fr 1fr 1.1fr 0.8fr 38px";
  const smCols = "1fr 1fr 1fr 30px";

  return (
    <div className="dc-page">
      <style>{`
        .hs-years { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-top: 14px; }
        .hs-year { background: rgba(255,255,255,0.07); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 10px 12px; }
        .hs-year b { display: block; font-size: 1.05rem; font-weight: 800; font-variant-numeric: tabular-nums; }
        .hs-year span { font-size: 0.68rem; color: rgba(255,255,255,0.55); text-transform: uppercase; letter-spacing: 0.04em; }
        .hs-year.off { opacity: 0.4; }
        .hs-two { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .hs-incl { display: flex; flex-wrap: wrap; gap: 14px; margin: 0 0 16px; font-size: 0.82rem; font-weight: 700; }
        .hs-incl label { display: flex; align-items: center; gap: 6px; cursor: pointer; }
        .hs-incl input { width: 16px; height: 16px; accent-color: #111; }
        @media (max-width: 720px) { .hs-years { grid-template-columns: 1fr 1fr; } }
      `}</style>

      <GpaSchema name="High School GPA Calculator" description="Calculate weighted and unweighted high school GPA across grades 9–12." path={PATH} faqs={faqs} />
      <Header activePage="gpa-calculator" />

      <section className="dc-hero">
        <GpaBreadcrumb name="High School GPA Calculator" />
        <div className="dc-intro">
          <div>
            <span className="dc-tag">High School GPA Calculator</span>
            <h1 className="dc-h1">Your high school GPA, <u>all four years</u></h1>
            <p className="dc-sub">Add your classes for each grade, 9th through 12th. You'll see your weighted and unweighted GPA together — the two numbers colleges actually look at.</p>
          </div>
          <div className="dc-tiles">
            <div className="dc-tile"><b>9 → 12</b><span>every grade level</span></div>
            <div className="dc-tile"><b>2 GPAs</b><span>weighted + unweighted</span></div>
            <div className="dc-tile"><b>AP · IB</b><span>Honors bonus built in</span></div>
            <div className="dc-tile"><b>0</b><span>data stored</span></div>
          </div>
        </div>

        <div className="dc-panel">
          <div className="dc-panel-head">
            <div>
              <h2 className="dc-panel-title">{YEAR_NAMES[activeYear]} year · {activeYear}th grade</h2>
              <p className="dc-hint">Full-year class = 1 credit, semester class = 0.5.</p>
            </div>
            <div className="dc-seg" role="group" aria-label="Grade level">
              {YEARS.map(y => (
                <button key={y} className={activeYear === y ? "on" : ""} onClick={() => setActiveYear(y)} aria-pressed={activeYear === y}>
                  {y}th
                </button>
              ))}
            </div>
          </div>

          <div className="dc-col-heads" style={{ display: "grid", gridTemplateColumns: gridCols, gap: 10, padding: "0 14px 8px" }}>
            <span className="dc-col-head">Class</span>
            <span className="dc-col-head">Grade</span>
            <span className="dc-col-head">Type</span>
            <span className="dc-col-head">Credits</span>
            <span />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {yearRows.map((c, i) => (
              <div key={c.id} className="dc-row">
                <div className="dc-row-grid" style={{ display: "grid", gridTemplateColumns: gridCols, gap: 10, alignItems: "center", ["--sm-cols" as string]: smCols }}>
                  <input type="text" className="dc-input dc-full" placeholder={`Class ${i + 1}`} value={c.name}
                    onChange={e => update(c.id, { name: e.target.value })} aria-label={`${activeYear}th grade class ${i + 1} name`} />
                  <select className="dc-select" value={c.grade} onChange={e => update(c.id, { grade: e.target.value })}
                    aria-label={`${activeYear}th grade class ${i + 1} grade`}>
                    <option value="">Grade</option>
                    {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  <select className="dc-select" value={c.level} onChange={e => update(c.id, { level: e.target.value as CourseLevel })}
                    aria-label={`${activeYear}th grade class ${i + 1} type`}>
                    {(Object.keys(LEVEL_LABELS) as CourseLevel[]).map(l => <option key={l} value={l}>{LEVEL_LABELS[l]}</option>)}
                  </select>
                  <input type="number" inputMode="decimal" min="0" max="10" step="0.5" className="dc-input" placeholder="1"
                    value={c.credits || ""} onChange={e => update(c.id, { credits: parseFloat(e.target.value) || 0 })}
                    aria-label={`${activeYear}th grade class ${i + 1} credits`} />
                  <button onClick={() => remove(c.id)} className="dc-del" aria-label={`Remove class ${i + 1}`}>
                    <X style={{ width: 15, height: 15 }} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="dc-actions">
            <button onClick={() => setRows(rs => [...rs, blank(activeYear)])} className="dc-add">
              <Plus style={{ width: 15, height: 15 }} />Add {activeYear}th grade class
            </button>
            <button onClick={() => setRows(starter())} className="dc-clear">Clear all</button>
          </div>

          <div className="hs-incl" aria-label="Years included in GPA">
            <span>Count in GPA:</span>
            {YEARS.map(y => (
              <label key={y}>
                <input type="checkbox" checked={included[y]} onChange={e => setIncluded(s => ({ ...s, [y]: e.target.checked }))} />
                {y}th
              </label>
            ))}
          </div>

          {hasResult ? (
            <div className={`dc-result ${flash}`} aria-live="polite">
              <div className="hs-two">
                <div>
                  <p className="dc-res-label">Unweighted GPA</p>
                  <p className="dc-res-big">{animU.toFixed(2)}<small> / 4.0</small></p>
                </div>
                <div>
                  <p className="dc-res-label">Weighted GPA</p>
                  <p className="dc-res-big">{animW.toFixed(2)}<small> / 5.0</small></p>
                </div>
              </div>
              <div className="dc-track">
                <div className="dc-fill" style={{ width: `${Math.min((unweighted.gpa / 4) * 100, 100)}%` }} />
              </div>
              <div className="hs-years">
                {YEARS.map(y => {
                  const r = calculateGpa(rows.filter(c => c.year === y), false);
                  return (
                    <div key={y} className={`hs-year ${included[y] ? "" : "off"}`}>
                      <b>{r.countedCourses ? r.gpa.toFixed(2) : "—"}</b>
                      <span>{y}th grade</span>
                    </div>
                  );
                })}
              </div>
              <p className="dc-res-note">
                {unweighted.countedCourses} classes · {unweighted.totalCredits} credits · {letterForGpa(unweighted.gpa)} average (unweighted)
              </p>
            </div>
          ) : (
            <div className="dc-empty">Pick a grade for at least one class to see your high school GPA.</div>
          )}
        </div>

        <p className="dc-micro">🔒 Nothing stored · Everything is calculated in your browser</p>
      </section>

      <section className="dc-sec white">
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div className="dc-sec-head">
            <span className="dc-tag">The method</span>
            <h2 className="dc-h2">How to calculate a <u>high school GPA</u></h2>
            <p className="dc-lead">Four steps, the same way your school counselor does it.</p>
          </div>
          <div className="dc-card" style={{ padding: 32 }}>
            <ol style={{ paddingLeft: 20, margin: "0 0 22px", lineHeight: 1.9, color: "#333" }}>
              <li>Take the <strong>final grade</strong> for every class on your transcript (not quarter or progress grades).</li>
              <li>Convert each letter to points: A = 4, B = 3, C = 2, D = 1, F = 0. For weighted GPA, add +0.5 for Honors and +1.0 for AP/IB.</li>
              <li>Multiply the points by the class's credits — usually 1 for a full year, 0.5 for a semester.</li>
              <li>Add all the points and divide by your total credits.</li>
            </ol>
            <p className="dc-kicker">Example: a sophomore's year</p>
            <div className="dc-code">
              <div>AP World History A → 5.0 × 1 = 5.0</div>
              <div>Honors English B+ → 3.8 × 1 = 3.8</div>
              <div>Geometry B → 3.0 × 1 = 3.0</div>
              <div>Health A (semester) → 4.0 × 0.5 = 2.0</div>
              <div><span className="hl">13.8 ÷ 3.5 credits = 3.94 weighted</span></div>
            </div>
            <p style={{ marginTop: 18 }}>
              The same year unweighted is (4.0 + 3.3 + 3.0 + 2.0) ÷ 3.5 = <strong>3.51</strong>. That gap — a 3.94 next to a 3.51 — is exactly why colleges ask about course rigor alongside your GPA.
            </p>
          </div>
        </div>
      </section>

      <section className="dc-sec cream">
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div className="dc-sec-head">
            <span className="dc-tag">Benchmarks</span>
            <h2 className="dc-h2">What your GPA means for <u>college</u></h2>
            <p className="dc-lead">Rough unweighted ranges. Every college weighs GPA alongside rigor, essays and activities.</p>
          </div>
          <div className="dc-card dc-table-wrap" style={{ padding: 20 }}>
            <table className="dc-table">
              <thead><tr><th>Unweighted GPA</th><th>Average</th><th>Typical college fit</th></tr></thead>
              <tbody>
                <tr><td>3.8 – 4.0</td><td>A</td><td>Competitive at highly selective schools</td></tr>
                <tr><td>3.5 – 3.79</td><td>A- / B+</td><td>Strong at selective schools and flagship universities</td></tr>
                <tr><td>3.0 – 3.49</td><td>B</td><td>Meets requirements at most four-year colleges</td></tr>
                <tr><td>2.5 – 2.99</td><td>B- / C+</td><td>Many state schools; strong upward trend helps</td></tr>
                <tr><td>2.0 – 2.49</td><td>C</td><td>Community college, then transfer, is a common path</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <FaqSection faqs={faqs} />
      <GpaToolLinks current={PATH} />
      <Footer />
    </div>
  );
}
