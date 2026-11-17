import { Link } from "wouter";
import { Calculator, Shield, GraduationCap, ArrowRight, Zap, BookOpen } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSeo } from "@/hooks/useSeo";

export default function AboutUs() {
  useSeo({
    title: "About Us – Free Grade Calculators for Students",
    description: "Learn about FinalGradeCalculators.us — free, accurate grade calculators built to help students plan smarter, track progress, and hit their academic goals.",
    path: "/about",
  });


  return (
    <div style={{ fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,system-ui,sans-serif", minHeight: "100vh", background: "#f8fafc" }}>
      <style>{`
        * { box-sizing: border-box; }

        .ab-hero { position: relative; padding: 72px 24px 64px; overflow: hidden;
          background: linear-gradient(145deg,#060812 0%,#0e0c2a 35%,#0a1a3a 65%,#060d1f 100%); }
        .ab-orb-1 { position:absolute; top:-160px; right:-80px; width:600px; height:600px; border-radius:50%;
          background:radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 65%); pointer-events:none; }
        .ab-orb-2 { position:absolute; bottom:-120px; left:-60px; width:420px; height:420px; border-radius:50%;
          background:radial-gradient(circle,rgba(56,189,248,0.11) 0%,transparent 65%); pointer-events:none; }

        .pill {
          display:inline-flex; align-items:center; gap:6px;
          background:rgba(99,102,241,0.08); border:1px solid rgba(99,102,241,0.2);
          border-radius:100px; padding:5px 14px; color:#6366f1;
          font-size:0.75rem; font-weight:600; letter-spacing:0.06em;
          text-transform:uppercase; margin-bottom:14px;
        }
        .pill-dark { background:rgba(99,102,241,0.12); border-color:rgba(99,102,241,0.3); color:#a5b4fc; }

        .sec-h2 { font-size:2.2rem; font-weight:900; color:#0f172a; letter-spacing:-0.025em; margin:0 0 14px; }
        .sec-h2-dark { font-size:2.2rem; font-weight:900; color:white; letter-spacing:-0.025em; margin:0 0 14px; }

        .principle-card {
          background:white; border:1px solid #e2e8f0; border-radius:20px; overflow:hidden;
          transition:all 0.3s cubic-bezier(0.4,0,0.2,1);
        }
        .principle-card:hover { transform:translateY(-6px); border-color:#c7d2fe; box-shadow:0 20px 48px rgba(99,102,241,0.14); }

        .formula-note {
          background:white; border:1px solid #e2e8f0; border-radius:20px;
          padding:32px; box-shadow:0 4px 16px rgba(0,0,0,0.04);
        }
        .formula-code {
          background:#f8fafc; border:1px solid #e2e8f0; border-radius:10px;
          padding:14px 18px; font-family:'SF Mono','Fira Code',monospace;
          font-size:0.85rem; color:#334155; text-align:center; font-weight:600;
        }

        .cta-wrap {
          position:relative; overflow:hidden;
          background:linear-gradient(145deg,#060812 0%,#0d0b28 50%,#060d1f 100%);
          padding:90px 24px;
        }
        .cta-wrap::before { content:''; position:absolute; inset:0;
          background:radial-gradient(ellipse at 50% 50%,rgba(99,102,241,0.15) 0%,transparent 65%); }
        .cta-btn {
          display:inline-flex; align-items:center; gap:10px;
          background:white; color:#4f46e5; font-weight:800; font-size:1rem;
          padding:16px 32px; border-radius:14px; border:none; cursor:pointer;
          transition:all 0.25s; box-shadow:0 12px 40px rgba(0,0,0,0.4);
        }
        .cta-btn:hover { transform:translateY(-3px); box-shadow:0 20px 56px rgba(0,0,0,0.5); }
        .cta-btn-outline {
          display:inline-flex; align-items:center; gap:10px;
          background:rgba(255,255,255,0.06); color:white; font-weight:700; font-size:1rem;
          padding:16px 32px; border-radius:14px; border:1px solid rgba(255,255,255,0.18); cursor:pointer;
          transition:all 0.25s;
        }
        .cta-btn-outline:hover { background:rgba(255,255,255,0.1); }

        @media (max-width:640px) {
          .ab-hero h1 { font-size:2.2rem !important; }
          .sec-h2, .sec-h2-dark { font-size:1.7rem !important; }
        }
      `}</style>

      <Header />

      {/* ═════════════ HERO ═════════════ */}
      <section className="ab-hero">
        <div className="ab-orb-1" /><div className="ab-orb-2" />
        <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div className="pill pill-dark"><GraduationCap style={{ width: 12, height: 12 }} />About</div>
          <h1 style={{ fontSize: "3rem", fontWeight: 900, color: "white", lineHeight: 1.1, letterSpacing: "-0.03em", margin: "0 0 16px" }}>
            Grade math, done right
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "1.1rem", lineHeight: 1.65, maxWidth: 560, margin: "0 auto" }}>
            FinalGradeCalculators.us runs the same weighted-average formulas your professors use — no account, no ads, no data collection. Just the number you need.
          </p>
        </div>
      </section>

      {/* ═════════════ WHAT THE SITE DOES ═════════════ */}
      <section style={{ padding: "90px 24px", background: "white" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="pill"><Calculator style={{ width: 12, height: 12 }} />What's here</div>
            <h2 className="sec-h2">Four calculators, one job each</h2>
            <p style={{ color: "#64748b", fontSize: "1.05rem", maxWidth: 480, margin: "0 auto" }}>
              Each tool answers one specific question — pick the one that matches what you're actually asking.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 20 }}>
            {[
              { grad: "linear-gradient(135deg,#6366f1,#4f46e5)", icon: <Zap style={{ width: 22, height: 22, color: "white" }} />, title: "Final Grade Calculator", desc: "What score do you need on your final to hit a target course grade?" },
              { grad: "linear-gradient(135deg,#0ea5e9,#0284c7)", icon: <Calculator style={{ width: 22, height: 22, color: "white" }} />, title: "Grade Calculator", desc: "What's your current grade across all your graded assignments?" },
              { grad: "linear-gradient(135deg,#10b981,#059669)", icon: <GraduationCap style={{ width: 22, height: 22, color: "white" }} />, title: "GPA Calculator", desc: "What's your weighted, unweighted, or cumulative GPA?" },
              { grad: "linear-gradient(135deg,#f59e0b,#d97706)", icon: <BookOpen style={{ width: 22, height: 22, color: "white" }} />, title: "Test Grade Calculator", desc: "What did you score on one test, and what's the grading chart for it?" },
            ].map((f, i) => (
              <div key={i} className="principle-card">
                <div style={{ height: 5, background: f.grad }} />
                <div style={{ padding: 24 }}>
                  <div style={{ background: f.grad, width: 46, height: 46, borderRadius: 13, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>{f.icon}</div>
                  <h3 style={{ fontWeight: 700, fontSize: "1rem", color: "#0f172a", margin: "0 0 8px" }}>{f.title}</h3>
                  <p style={{ color: "#64748b", fontSize: "0.875rem", lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════ HOW IT'S BUILT ═════════════ */}
      <section style={{ padding: "90px 24px", background: "#f8fafc" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div className="pill"><Shield style={{ width: 12, height: 12 }} />How it works</div>
            <h2 className="sec-h2">No account, no server, no catch</h2>
          </div>
          <div className="formula-note">
            <p style={{ color: "#475569", lineHeight: 1.8, marginBottom: 20, fontSize: "0.95rem" }}>
              Every calculation on this site runs in your browser using standard weighted-average math — the same formula printed in most syllabi:
            </p>
            <div className="formula-code" style={{ marginBottom: 20 }}>
              Grade = Σ(score × weight) ÷ Σ(weight)
            </div>
            <p style={{ color: "#475569", lineHeight: 1.8, margin: 0, fontSize: "0.95rem" }}>
              Nothing you type gets sent to a server or stored anywhere — refresh the page and it's gone. That's covered in more detail on the <a href="/privacy" style={{ color: "#4f46e5", fontWeight: 600 }}>privacy page</a>.
            </p>
          </div>
        </div>
      </section>

      {/* ═════════════ CTA ═════════════ */}
      <section className="cta-wrap">
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <h2 className="sec-h2-dark">Ready to calculate?</h2>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "1.05rem", maxWidth: 460, margin: "0 auto 32px", lineHeight: 1.65 }}>
            Pick the calculator that matches your question.
          </p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/" className="cta-btn">
              Final Grade Calculator<ArrowRight style={{ width: 16, height: 16 }} />
            </Link>
            <Link href="/gpa-calculator" className="cta-btn-outline">
              GPA Calculator
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
