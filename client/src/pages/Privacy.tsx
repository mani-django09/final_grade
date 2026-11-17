import { Shield, Eye, Lock, Mail } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSeo } from "@/hooks/useSeo";

const LAST_UPDATED = "September 14, 2026";

export default function Privacy() {
  useSeo({
    title: "Privacy Policy – FinalGradeCalculators.us",
    description: "How FinalGradeCalculators.us handles your data. We don't use cookies, analytics, or local storage — every calculation runs in your browser and nothing is saved anywhere.",
    path: "/privacy",
  });

  return (
    <div style={{ fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,system-ui,sans-serif", minHeight: "100vh", background: "#f8fafc" }}>
      <style>{`
        * { box-sizing: border-box; }

        .pv-hero { position: relative; padding: 72px 24px 64px; overflow: hidden;
          background: linear-gradient(145deg,#060812 0%,#0e0c2a 35%,#0a1a3a 65%,#060d1f 100%); }
        .pv-orb-1 { position:absolute; top:-160px; right:-80px; width:600px; height:600px; border-radius:50%;
          background:radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 65%); pointer-events:none; }
        .pv-orb-2 { position:absolute; bottom:-120px; left:-60px; width:420px; height:420px; border-radius:50%;
          background:radial-gradient(circle,rgba(56,189,248,0.11) 0%,transparent 65%); pointer-events:none; }

        .pill { display:inline-flex; align-items:center; gap:6px;
          background:rgba(99,102,241,0.12); border:1px solid rgba(99,102,241,0.3);
          border-radius:100px; padding:5px 14px; color:#a5b4fc;
          font-size:0.75rem; font-weight:600; letter-spacing:0.06em;
          text-transform:uppercase; margin-bottom:14px; }

        .pv-summary {
          background:white; border:2px solid #c7d2fe; border-radius:20px;
          padding:32px; max-width:640px; margin:-40px auto 0;
          position:relative; z-index:1; box-shadow:0 20px 48px rgba(0,0,0,0.12);
        }
        .pv-check { display:flex; gap:12px; align-items:flex-start; padding:10px 0; }
        .pv-check-icon { color:#10b981; font-weight:900; flex-shrink:0; }

        .pv-body { max-width:740px; margin:0 auto; padding:60px 24px 90px; }
        .pv-section { margin-bottom:36px; }
        .pv-section h2 {
          font-size:1.35rem; font-weight:800; color:#0f172a; margin:0 0 14px;
          display:flex; align-items:center; gap:10px;
        }
        .pv-icon-box {
          width:36px; height:36px; border-radius:10px; display:flex;
          align-items:center; justify-content:center; flex-shrink:0;
        }
        .pv-section p { color:#475569; line-height:1.75; font-size:0.95rem; margin:0 0 12px; }
        .pv-section ul { margin:0 0 12px; padding-left:20px; color:#475569; line-height:1.75; font-size:0.95rem; }
        .pv-section li { margin-bottom:8px; }
        .pv-section strong { color:#1e293b; }

        .pv-contact {
          background:linear-gradient(135deg,#eef2ff 0%,#eff6ff 100%);
          border:1px solid #c7d2fe; border-radius:16px; padding:28px;
        }
      `}</style>

      <Header />

      {/* ═══ HERO ═══ */}
      <section className="pv-hero">
        <div className="pv-orb-1" /><div className="pv-orb-2" />
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div className="pill"><Shield style={{ width: 12, height: 12 }} />Privacy</div>
          <h1 style={{ fontSize: "3rem", fontWeight: 900, color: "white", lineHeight: 1.1, letterSpacing: "-0.03em", margin: "0 0 12px" }}>
            Privacy Policy
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.95rem" }}>Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      {/* ═══ SUMMARY CARD ═══ */}
      <section style={{ padding: "0 24px", background: "white" }}>
        <div className="pv-summary">
          <h2 style={{ fontWeight: 800, fontSize: "1.1rem", color: "#0f172a", margin: "0 0 16px" }}>The short version</h2>
          {[
            "We don't use cookies, analytics, or tracking scripts of any kind",
            "Nothing you type is sent to a server or stored anywhere — not even in your browser",
            "Refresh the page and every input is gone, because none of it was ever saved",
            "No account, no sign-up, no personal information collected",
          ].map((line, i) => (
            <div key={i} className="pv-check">
              <span className="pv-check-icon">✓</span>
              <span style={{ color: "#334155", fontSize: "0.9rem", lineHeight: 1.6 }}>{line}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ BODY ═══ */}
      <section style={{ background: "white" }}>
        <div className="pv-body">

          <div className="pv-section">
            <h2>How the calculators work</h2>
            <p>
              Every calculation on this site — final grade, course grade, GPA, test score — runs entirely in your browser using JavaScript. The numbers you type never leave your device. There's no backend that receives, logs, or stores them.
            </p>
          </div>

          <div className="pv-section">
            <h2><span className="pv-icon-box" style={{ background: "#dcfce7" }}><Eye style={{ width: 18, height: 18, color: "#16a34a" }} /></span>What we don't collect</h2>
            <ul>
              <li><strong>Your calculator inputs</strong> — grades, weights, course names, GPA data. None of it is transmitted anywhere.</li>
              <li><strong>Cookies</strong> — this site doesn't set any.</li>
              <li><strong>Local storage or session storage</strong> — nothing is saved to your browser either. Refresh the page and you're starting from a clean slate.</li>
              <li><strong>Analytics or tracking</strong> — there's currently no analytics service connected to this site. If that changes, this page will be updated to say so before it happens.</li>
              <li><strong>Personal information</strong> — no name, email, or account is ever requested.</li>
            </ul>
          </div>

          <div className="pv-section">
            <h2><span className="pv-icon-box" style={{ background: "#dbeafe" }}><Lock style={{ width: 18, height: 18, color: "#2563eb" }} /></span>What your browser or host inevitably sees</h2>
            <p>
              Like any website, basic connection information (your IP address, browser type, and the page you requested) passes through our hosting provider's server logs as part of normal web traffic — this is standard for any site on the internet and isn't something we access, analyze, or store separately.
            </p>
          </div>

          <div className="pv-section">
            <h2>Children's privacy</h2>
            <p>
              This site is built for students of any age. Since nothing is collected from anyone, there's nothing here that would put a younger student's data at risk.
            </p>
          </div>

          <div className="pv-section">
            <h2>Changes to this policy</h2>
            <p>
              If how this site handles data ever changes — say, if we add analytics or any form of tracking in the future — this page will be updated first, with a new "last updated" date at the top, before that change takes effect.
            </p>
          </div>

          <div className="pv-contact">
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
