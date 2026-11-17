import { Link } from "wouter";
import "@/styles/design-c.css";

export const ALL_CALCULATORS = [
  { href: "/", label: "Final Grade Calculator", desc: "The score you need on your final exam to hit a target grade." },
  { href: "/grade-calculator", label: "Grade Calculator", desc: "Your overall course grade from weighted assignments and tests." },
  { href: "/test-grade-calculator", label: "Test Grade Calculator", desc: "A test's percentage and letter grade, plus a grading chart." },
  { href: "/gpa-calculator", label: "GPA Calculator", desc: "Your GPA for a term from letter grades and credit hours." },
  { href: "/high-school-gpa-calculator", label: "High School GPA Calculator", desc: "Grades 9–12, weighted and unweighted side by side." },
  { href: "/weighted-gpa-calculator", label: "Weighted GPA Calculator", desc: "Honors, AP and IB bonuses on a 5.0 scale." },
  { href: "/cumulative-gpa-calculator", label: "Cumulative GPA Calculator", desc: "Combine semesters and plan the GPA you need next." },
  { href: "/ap-score-calculator", label: "AP Score Calculator", desc: "Estimate your 1–5 AP exam score from a practice test." },
  { href: "/sat-score-calculator", label: "SAT Score Calculator", desc: "Estimate your digital SAT score, as a range, from a practice test." },
];

/** Crawlable links to every calculator except the current page. */
export default function CalculatorLinks({ current }: { current: string }) {
  return (
    <section className="dc-page" style={{ minHeight: 0 }}>
      <div className="dc-sec white">
        <div style={{ maxWidth: 1060, margin: "0 auto" }}>
          <div className="dc-sec-head">
            <span className="dc-tag">All calculators</span>
            <h2 className="dc-h2">More free <u>grade tools</u></h2>
          </div>
          <div className="dc-grid3">
            {ALL_CALCULATORS.filter(c => c.href !== current).map(c => (
              <Link key={c.href} href={c.href} className="dc-card" style={{ textDecoration: "none", display: "block" }}>
                <h3>{c.label} →</h3>
                <p>{c.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
