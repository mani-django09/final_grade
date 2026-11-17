import { useState } from "react";
import { Link } from "wouter";
import { Plus, X } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { FaqSection, GpaBreadcrumb, GpaSchema, GpaToolLinks, type Faq } from "@/components/GpaShared";
import { useSeo } from "@/hooks/useSeo";
import { useCountUp } from "@/hooks/useCountUp";
import { useHighlightOnChange } from "@/hooks/useHighlightOnChange";
import {
  calculateGpa, gradePointsFor, GRADE_OPTIONS, LEVEL_LABELS,
  type CourseLevel, type GpaCourse,
} from "@shared/gradeMath";
import "@/styles/design-c.css";

const PATH = "/weighted-gpa-calculator";

interface Row extends GpaCourse {
  id: string;
  name: string;
  level: CourseLevel;
}
const blank = (level: CourseLevel = "regular"): Row => ({
  id: Math.random().toString(36).slice(2, 9), name: "", grade: "", credits: 1, level,
});
const starter = (): Row[] => [blank("ap"), blank("honors"), blank(), blank(), blank()];

const PRESETS: { label: string; honors: number; ap: number }[] = [
  { label: "Standard (+0.5 / +1.0)", honors: 0.5, ap: 1.0 },
  { label: "Equal (+1.0 / +1.0)", honors: 1.0, ap: 1.0 },
  { label: "Half (+0.5 / +0.5)", honors: 0.5, ap: 0.5 },
];

const faqs: Faq[] = [
  {
    question: "How is weighted GPA calculated?",
    answer: "Each class gets its normal 4.0-scale points, plus a bonus for difficulty — most commonly +0.5 for Honors and +1.0 for AP or IB. Multiply each class's weighted points by its credits, add them up, and divide by total credits. An A in AP Chemistry becomes a 5.0 instead of a 4.0.",
  },
  {
    question: "What is a good weighted GPA?",
    answer: "Because the scale usually tops out at 5.0, a 4.0 weighted GPA often means a mix of A's and B's in advanced classes. Anything above 4.0 shows you've taken a rigorous load and done well in it. Compare weighted GPAs only with students at the same school, since weighting rules differ.",
  },
  {
    question: "Why doesn't my school's weighted GPA match this calculator?",
    answer: "Schools weight differently. Some give Honors a full +1.0, some only weight AP, some cap how many weighted classes count, and some only weight grades of C or higher. Use the bonus settings above to match your school's policy — your counselor or student handbook will list it.",
  },
  {
    question: "Does an F in an AP class still get the +1.0 bonus?",
    answer: "No. A failing grade earns 0 points on every scale; the difficulty bonus never turns an F into points. Many schools also drop the bonus for a D, so check your handbook if that applies to you.",
  },
  {
    question: "Is weighted or unweighted GPA more important?",
    answer: "Unweighted GPA shows how well you did; weighted GPA shows how well you did in how hard a schedule. Colleges usually look at both together with the actual list of courses, and many recalculate their own version. Scholarships and class rank are often based on the weighted number.",
  },
  {
    question: "Do dual enrollment college classes count as weighted?",
    answer: "At many high schools, yes — dual enrollment courses are usually weighted the same as AP (+1.0). Choose AP / IB as the course type for those classes if that's your school's rule.",
  },
];

export default function WeightedGpaCalculator() {
  useSeo({
    title: "Weighted GPA Calculator – Honors, AP & IB on a 5.0 Scale",
    description: "Free weighted GPA calculator. Add Honors, AP and IB classes, match your school's bonus points, and see how much course rigor lifts your GPA above 4.0.",
    path: PATH,
    keywords: "weighted gpa calculator, weighted gpa, ap gpa calculator, honors gpa calculator, 5.0 gpa scale",
  });

  const [rows, setRows] = useState<Row[]>(starter);
  const [honorsBonus, setHonorsBonus] = useState(0.5);
  const [apBonus, setApBonus] = useState(1.0);
  const bonuses = { regular: 0, honors: honorsBonus, ap: apBonus };

  const w = calculateGpa(rows, true, bonuses);
  const u = calculateGpa(rows, false);
  const hasResult = w.countedCourses > 0;
  const boost = Math.round((w.gpa - u.gpa) * 100) / 100;
  const maxScale = 4 + Math.max(honorsBonus, apBonus);
  const advanced = rows.filter(r => r.grade && r.credits > 0 && r.level !== "regular").length;

  const animW = useCountUp(w.gpa);
  const flash = useHighlightOnChange(`${w.gpa}`, 950);

  const update = (id: string, patch: Partial<Row>) =>
    setRows(rs => rs.map(r => (r.id === id ? { ...r, ...patch } : r)));

  const gridCols = "2fr 1fr 1.1fr 0.8fr 62px 38px";
  const smCols = "1fr 1fr 1fr 30px";

  return (
    <div className="dc-page">
      <style>{`
        .wg-pts { display: inline-block; text-align: center; border-radius: 10px; padding: 9px 0; font-size: 0.85rem; font-weight: 800; color: #111; background: #fde047; font-variant-numeric: tabular-nums; }
        .wg-pts.empty { color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.12); font-weight: 600; }
        .wg-set { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 12px; margin-bottom: 20px; align-items: end; }
        .wg-set label { display: block; margin-bottom: 6px; }
        @media (max-width: 720px) { .wg-pts { display: none !important; } .wg-set { grid-template-columns: 1fr 1fr; } .wg-set > :first-child { grid-column: 1 / -1; } }
      `}</style>

      <GpaSchema name="Weighted GPA Calculator" description="Calculate weighted GPA with custom Honors, AP and IB bonus points." path={PATH} faqs={faqs} />
      <Header activePage="gpa-calculator" />

      <section className="dc-hero">
        <GpaBreadcrumb name="Weighted GPA Calculator" />
        <div className="dc-intro">
          <div>
            <span className="dc-tag">Weighted GPA Calculator</span>
            <h1 className="dc-h1">See what your <u>AP classes</u> are worth</h1>
            <p className="dc-sub">Mark each class as Regular, Honors or AP/IB, set the bonus your school uses, and see your weighted GPA next to the boost your harder classes give you.</p>
          </div>
          <div className="dc-tiles">
            <div className="dc-tile"><b>5.0</b><span>weighted scale</span></div>
            <div className="dc-tile"><b>Custom</b><span>bonus per course type</span></div>
            <div className="dc-tile"><b>+Boost</b><span>vs. unweighted</span></div>
            <div className="dc-tile"><b>100%</b><span>always free</span></div>
          </div>
        </div>

        <div className="dc-panel">
          <div className="dc-panel-head">
            <h2 className="dc-panel-title">Your school's weighting</h2>
          </div>

          <div className="wg-set">
            <div>
              <label className="dc-col-head" htmlFor="wg-preset">Preset</label>
              <select id="wg-preset" className="dc-select"
                value={PRESETS.findIndex(p => p.honors === honorsBonus && p.ap === apBonus)}
                onChange={e => { const p = PRESETS[+e.target.value]; if (p) { setHonorsBonus(p.honors); setApBonus(p.ap); } }}>
                {PRESETS.map((p, i) => <option key={i} value={i}>{p.label}</option>)}
                <option value={-1} disabled>Custom</option>
              </select>
            </div>
            <div>
              <label className="dc-col-head" htmlFor="wg-h">Honors bonus</label>
              <input id="wg-h" type="number" min="0" max="2" step="0.1" className="dc-input" value={honorsBonus}
                onChange={e => setHonorsBonus(Math.max(0, parseFloat(e.target.value) || 0))} />
            </div>
            <div>
              <label className="dc-col-head" htmlFor="wg-ap">AP / IB bonus</label>
              <input id="wg-ap" type="number" min="0" max="2" step="0.1" className="dc-input" value={apBonus}
                onChange={e => setApBonus(Math.max(0, parseFloat(e.target.value) || 0))} />
            </div>
          </div>

          <div className="dc-col-heads" style={{ display: "grid", gridTemplateColumns: gridCols, gap: 10, padding: "0 14px 8px" }}>
            <span className="dc-col-head">Class</span>
            <span className="dc-col-head">Grade</span>
            <span className="dc-col-head">Type</span>
            <span className="dc-col-head">Credits</span>
            <span className="dc-col-head" style={{ textAlign: "center" }}>Points</span>
            <span />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {rows.map((c, i) => (
              <div key={c.id} className="dc-row">
                <div className="dc-row-grid" style={{ display: "grid", gridTemplateColumns: gridCols, gap: 10, alignItems: "center", ["--sm-cols" as string]: smCols }}>
                  <input type="text" className="dc-input dc-full" placeholder={`Class ${i + 1}`} value={c.name}
                    onChange={e => update(c.id, { name: e.target.value })} aria-label={`Class ${i + 1} name`} />
                  <select className="dc-select" value={c.grade} onChange={e => update(c.id, { grade: e.target.value })} aria-label={`Class ${i + 1} grade`}>
                    <option value="">Grade</option>
                    {GRADE_OPTIONS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  <select className="dc-select" value={c.level} onChange={e => update(c.id, { level: e.target.value as CourseLevel })} aria-label={`Class ${i + 1} type`}>
                    {(Object.keys(LEVEL_LABELS) as CourseLevel[]).map(l => <option key={l} value={l}>{LEVEL_LABELS[l]}</option>)}
                  </select>
                  <input type="number" inputMode="decimal" min="0" max="10" step="0.5" className="dc-input" placeholder="1"
                    value={c.credits || ""} onChange={e => update(c.id, { credits: parseFloat(e.target.value) || 0 })} aria-label={`Class ${i + 1} credits`} />
                  {c.grade ? (
                    <span className="wg-pts">{gradePointsFor(c.grade, c.level, true, bonuses).toFixed(1)}</span>
                  ) : (
                    <span className="wg-pts empty">—</span>
                  )}
                  <button onClick={() => setRows(rs => (rs.length > 1 ? rs.filter(r => r.id !== c.id) : rs))} disabled={rows.length === 1}
                    className="dc-del" aria-label={`Remove class ${i + 1}`}>
                    <X style={{ width: 15, height: 15 }} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="dc-actions">
            <button onClick={() => setRows(rs => [...rs, blank()])} className="dc-add"><Plus style={{ width: 15, height: 15 }} />Add class</button>
            <button onClick={() => setRows(starter())} className="dc-clear">Clear all</button>
          </div>

          {hasResult ? (
            <div className={`dc-result ${flash}`} aria-live="polite">
              <div className="dc-res-top">
                <div>
                  <p className="dc-res-label">Weighted GPA</p>
                  <p className="dc-res-big">{animW.toFixed(2)}<small> / {maxScale.toFixed(1)}</small></p>
                </div>
                <div className="dc-letter"><b>+{boost.toFixed(2)}</b><span>rigor boost</span></div>
              </div>
              <div className="dc-track">
                <div className="dc-fill" style={{ width: `${Math.min((w.gpa / maxScale) * 100, 100)}%` }} />
              </div>
              <div className="dc-chips">
                <div className="dc-chip"><b>{u.gpa.toFixed(2)}</b><span>Unweighted</span></div>
                <div className="dc-chip"><b>{advanced}/{w.countedCourses}</b><span>Advanced classes</span></div>
                <div className="dc-chip"><b>{w.totalCredits}</b><span>Credits</span></div>
              </div>
            </div>
          ) : (
            <div className="dc-empty">Pick a grade for at least one class to see your weighted GPA.</div>
          )}
        </div>

        <p className="dc-micro">🔒 Nothing stored · Everything is calculated in your browser</p>
      </section>

      <section className="dc-sec white">
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div className="dc-sec-head">
            <span className="dc-tag">Weighted vs unweighted</span>
            <h2 className="dc-h2">Same grades, <u>two GPAs</u></h2>
            <p className="dc-lead">Here's how one student's schedule scores on each scale.</p>
          </div>
          <div className="dc-card dc-table-wrap" style={{ padding: 20 }}>
            <table className="dc-table">
              <thead><tr><th>Class</th><th>Grade</th><th>Unweighted</th><th>Weighted</th></tr></thead>
              <tbody>
                <tr><td>AP Calculus</td><td>B+</td><td>3.3</td><td>4.3</td></tr>
                <tr><td>AP Biology</td><td>A-</td><td>3.7</td><td>4.7</td></tr>
                <tr><td>Honors English</td><td>A</td><td>4.0</td><td>4.5</td></tr>
                <tr><td>Spanish III</td><td>B</td><td>3.0</td><td>3.0</td></tr>
                <tr><td>US History</td><td>A</td><td>4.0</td><td>4.0</td></tr>
                <tr><td>GPA (1 credit each)</td><td>—</td><td>3.60</td><td>4.10</td></tr>
              </tbody>
            </table>
            <p style={{ fontSize: "0.85rem", marginTop: 14 }}>
              The weighted GPA is half a point higher purely because three of the five classes are advanced. On a transcript, that's the difference between "a B+ student" and "a B+ student in a demanding schedule."
            </p>
            <p style={{ fontSize: "0.85rem", marginTop: 10 }}>
              Taking the AP exam too? Use the <Link href="/ap-score-calculator" style={{ fontWeight: 800, color: "#4f46e5" }}>AP score calculator</Link> to estimate your 1–5 score from a practice test.
            </p>
          </div>
        </div>
      </section>

      <section className="dc-sec cream">
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div className="dc-sec-head">
            <span className="dc-tag">Weighting systems</span>
            <h2 className="dc-h2">Not every school weights <u>the same</u></h2>
            <p className="dc-lead">Find your school's rule in the student handbook, then set the bonuses above to match.</p>
          </div>
          <div className="dc-grid3">
            <div className="dc-card"><h3>Standard 5.0 scale</h3><p>Honors +0.5, AP and IB +1.0. The most common setup in US public high schools, and this calculator's default.</p></div>
            <div className="dc-card"><h3>Flat +1.0</h3><p>Every advanced class, Honors included, earns a full extra point. Common at schools that offer few AP courses.</p></div>
            <div className="dc-card"><h3>Capped weighting</h3><p>Some schools weight only a set number of classes, or only grades of C and above. Enter extra classes as Regular to mirror a cap.</p></div>
          </div>
        </div>
      </section>

      <FaqSection faqs={faqs} />
      <GpaToolLinks current={PATH} />
      <Footer />
    </div>
  );
}
