import { FileText, AlertTriangle, Scale, CheckCircle, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSeo } from "@/hooks/useSeo";

const LAST_UPDATED = "September 14, 2026";

export default function TermsOfService() {
  useSeo({
    title: "Terms of Service – FinalGradeCalculators.us",
    description: "Terms of service for using the free grade calculator tools on FinalGradeCalculators.us, including acceptable use and accuracy disclaimers.",
    path: "/terms",
  });

  return (
    <div style={{ fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,system-ui,sans-serif", minHeight: "100vh", background: "#f8fafc" }}>
      <style>{`
        * { box-sizing: border-box; }

        .tm-hero { position: relative; padding: 72px 24px 64px; overflow: hidden;
          background: linear-gradient(145deg,#060812 0%,#0e0c2a 35%,#0a1a3a 65%,#060d1f 100%); }
        .tm-orb-1 { position:absolute; top:-160px; right:-80px; width:600px; height:600px; border-radius:50%;
          background:radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 65%); pointer-events:none; }
        .tm-orb-2 { position:absolute; bottom:-120px; left:-60px; width:420px; height:420px; border-radius:50%;
          background:radial-gradient(circle,rgba(56,189,248,0.11) 0%,transparent 65%); pointer-events:none; }

        .pill { display:inline-flex; align-items:center; gap:6px;
          background:rgba(99,102,241,0.12); border:1px solid rgba(99,102,241,0.3);
          border-radius:100px; padding:5px 14px; color:#a5b4fc;
          font-size:0.75rem; font-weight:600; letter-spacing:0.06em;
          text-transform:uppercase; margin-bottom:14px; }

        .tm-summary {
          background:white; border:2px solid #c7d2fe; border-radius:20px;
          padding:32px; max-width:640px; margin:-40px auto 0;
          position:relative; z-index:1; box-shadow:0 20px 48px rgba(0,0,0,0.12);
        }
        .tm-check { display:flex; gap:12px; align-items:flex-start; padding:10px 0; }
        .tm-check-icon { color:#10b981; font-weight:900; flex-shrink:0; }

        .tm-body { max-width:740px; margin:0 auto; padding:60px 24px 90px; }
        .tm-section { margin-bottom:36px; }
        .tm-section h2 {
          font-size:1.35rem; font-weight:800; color:#0f172a; margin:0 0 14px;
          display:flex; align-items:center; gap:10px;
        }
        .tm-icon-box {
          width:36px; height:36px; border-radius:10px; display:flex;
          align-items:center; justify-content:center; flex-shrink:0;
        }
        .tm-section p { color:#475569; line-height:1.75; font-size:0.95rem; margin:0 0 12px; }
        .tm-section ul { margin:0 0 12px; padding-left:20px; color:#475569; line-height:1.75; font-size:0.95rem; }
        .tm-section li { margin-bottom:8px; }

        .tm-warning {
          background:#fffbeb; border:2px solid #fde68a; border-radius:16px; padding:26px;
        }
        .tm-contact {
          background:linear-gradient(135deg,#eef2ff 0%,#eff6ff 100%);
          border:1px solid #c7d2fe; border-radius:16px; padding:28px;
        }
      `}</style>

      <Header />

      {/* ═══ HERO ═══ */}
      <section className="tm-hero">
        <div className="tm-orb-1" /><div className="tm-orb-2" />
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div className="pill"><FileText style={{ width: 12, height: 12 }} />Terms</div>
          <h1 style={{ fontSize: "3rem", fontWeight: 900, color: "white", lineHeight: 1.1, letterSpacing: "-0.03em", margin: "0 0 12px" }}>
            Terms of Service
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      {/* ═══ SUMMARY CARD ═══ */}
      <section style={{ padding: "0 24px", background: "white" }}>
        <div className="tm-summary">
          <h2 style={{ fontWeight: 800, fontSize: "1.1rem", color: "#0f172a", margin: "0 0 16px" }}>The short version</h2>
          {[
            "Our calculators are free tools to help you plan your academics",
            "We provide them \"as is\" — no guarantees on outcomes",
            "You're responsible for verifying results with your instructor",
            "Use the service reasonably; don't try to break it",
          ].map((line, i) => (
            <div key={i} className="tm-check">
              <span className="tm-check-icon">✓</span>
              <span style={{ color: "#334155", fontSize: "0.9rem", lineHeight: 1.6 }}>{line}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ BODY ═══ */}
      <section style={{ background: "white" }}>
        <div className="tm-body">

          <div className="tm-section">
            <h2>Agreement to terms</h2>
            <p>
              By using FinalGradeCalculators.us, you agree to these terms. If you don't agree with any part of them, please don't use the site.
            </p>
          </div>

          <div className="tm-section">
            <h2><span className="tm-icon-box" style={{ background: "#dbeafe" }}><CheckCircle style={{ width: 18, height: 18, color: "#2563eb" }} /></span>What's here</h2>
            <p>Four free calculators, each answering a specific grade-math question:</p>
            <ul>
              <li><strong>Final Grade Calculator</strong> — the score you need on your final to hit a target course grade</li>
              <li><strong>Grade Calculator</strong> — your overall course grade from weighted assignments</li>
              <li><strong>GPA Calculator</strong> — weighted, unweighted, or cumulative GPA</li>
              <li><strong>Test Grade Calculator</strong> — a single test's score, plus a full grading chart</li>
            </ul>
          </div>

          <div className="tm-section">
            <h2>Acceptable use</h2>
            <p>When using this site, you agree to:</p>
            <ul>
              <li>Use the calculators for legitimate academic planning</li>
              <li>Verify results with your instructor or syllabus before relying on them</li>
              <li>Not use bots or automated systems to access the site</li>
              <li>Not attempt to interfere with or disrupt the service</li>
            </ul>
          </div>

          <div className="tm-warning">
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <AlertTriangle style={{ width: 24, height: 24, color: "#d97706", flexShrink: 0, marginTop: 2 }} />
              <div>
                <h3 style={{ fontWeight: 800, fontSize: "1.05rem", color: "#0f172a", margin: "0 0 10px" }}>Accuracy and verification</h3>
                <p style={{ color: "#475569", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: 10 }}>
                  These are <strong>educational tools</strong>, not official records. They can't account for grading curves, extra credit, dropped assignments, or a course's specific rounding policy.
                </p>
                <p style={{ color: "#1e293b", fontSize: "0.9rem", fontWeight: 700, margin: 0 }}>
                  Always verify with your instructor or syllabus before making academic decisions based on a result here.
                </p>
              </div>
            </div>
          </div>

          <div className="tm-section" style={{ marginTop: 36 }}>
            <h2><span className="tm-icon-box" style={{ background: "#f1f5f9" }}><Scale style={{ width: 18, height: 18, color: "#475569" }} /></span>No warranties</h2>
            <p>
              The service is provided "as is," without warranties of any kind. We don't guarantee it will be uninterrupted, error-free, or that results will always be accurate.
            </p>
          </div>

          <div className="tm-section">
            <h2>Limitation of liability</h2>
            <p>
              To the extent permitted by law, we're not liable for damages arising from your use of this service — including any consequences tied to relying on a calculator's result without independently verifying it.
            </p>
          </div>

          <div className="tm-section">
            <h2>Your inputs stay yours</h2>
            <p>
              Anything you type into a calculator — grades, weights, course names — is processed entirely in your browser and never transmitted to or stored on our servers. See the <a href="/privacy" style={{ color: "#4f46e5", fontWeight: 600 }}>Privacy Policy</a> for details.
            </p>
          </div>

          <div className="tm-section">
            <h2>Changes</h2>
            <p>
              We may update these terms or the service itself over time. Continued use after a change means you accept the updated terms.
            </p>
          </div>

          <div className="tm-section">
            <h2>Governing law</h2>
            <p>
              These terms are governed by the laws of the United States, without regard to conflict-of-law provisions.
            </p>
          </div>

          <div className="tm-contact">
            <h2 style={{ fontWeight: 800, fontSize: "1.1rem", color: "#0f172a", margin: "0 0 10px", display: "flex", alignItems: "center", gap: 8 }}>
              <Mail style={{ width: 18, height: 18, color: "#4f46e5" }} />Questions?
            </h2>
            <p style={{ color: "#475569", fontSize: "0.9rem", marginBottom: 12 }}>
              Email us and we'll answer directly.
            </p>
            <a href="mailto:contact@finalgradecalculators.us" style={{ color: "#4f46e5", fontWeight: 700, textDecoration: "none", overflowWrap: "anywhere", wordBreak: "break-word" }}>
              contact@finalgradecalculators.us
            </a>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
