import { Link } from "wouter";
import { Mail, HelpCircle, ArrowRight, Bug, Lightbulb, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useSeo } from "@/hooks/useSeo";

export default function Contact() {
  useSeo({
    title: "Contact Us – FinalGradeCalculators.us",
    description: "Questions about a calculation, feedback on the tools, or a bug to report? Get in touch with the FinalGradeCalculators.us team — we read every message.",
    path: "/contact",
  });


  return (
    <div style={{ fontFamily: "'Inter',-apple-system,BlinkMacSystemFont,system-ui,sans-serif", minHeight: "100vh", background: "#f8fafc" }}>
      <style>{`
        * { box-sizing: border-box; }

        .ct-hero { position: relative; padding: 72px 24px 64px; overflow: hidden;
          background: linear-gradient(145deg,#060812 0%,#0e0c2a 35%,#0a1a3a 65%,#060d1f 100%); }
        .ct-orb-1 { position:absolute; top:-160px; right:-80px; width:600px; height:600px; border-radius:50%;
          background:radial-gradient(circle,rgba(99,102,241,0.18) 0%,transparent 65%); pointer-events:none; }
        .ct-orb-2 { position:absolute; bottom:-120px; left:-60px; width:420px; height:420px; border-radius:50%;
          background:radial-gradient(circle,rgba(56,189,248,0.11) 0%,transparent 65%); pointer-events:none; }

        .pill {
          display:inline-flex; align-items:center; gap:6px;
          background:rgba(99,102,241,0.08); border:1px solid rgba(99,102,241,0.2);
          border-radius:100px; padding:5px 14px; color:#6366f1;
          font-size:0.75rem; font-weight:600; letter-spacing:0.06em;
          text-transform:uppercase; margin-bottom:14px;
        }
        .pill-dark { background:rgba(99,102,241,0.12); border-color:rgba(99,102,241,0.3); color:#a5b4fc; }

        .sec-h2 { font-size:2.1rem; font-weight:900; color:#0f172a; letter-spacing:-0.025em; margin:0 0 12px; }

        .email-card {
          background:white; border:1px solid #e2e8f0; border-radius:22px;
          padding:40px; text-align:center; max-width:460px; margin:0 auto;
          box-shadow:0 8px 32px rgba(0,0,0,0.06);
        }
        .email-icon {
          width:56px; height:56px; border-radius:16px; margin:0 auto 20px;
          background:linear-gradient(135deg,#4f46e5,#3b82f6);
          display:flex; align-items:center; justify-content:center;
          box-shadow:0 8px 24px rgba(79,70,229,0.3);
        }
        .email-link {
          display:inline-flex; align-items:center; gap:8px; flex-wrap:wrap;
          justify-content:center; max-width:100%;
          font-size:1.15rem; font-weight:700; color:#4f46e5;
          text-decoration:none; transition:color 0.2s;
          /* The address itself is one unbreakable string — without this,
             on a narrow screen it overflows the card instead of wrapping. */
          overflow-wrap:anywhere; word-break:break-word;
        }
        .email-link:hover { color:#4338ca; }
        @media (max-width:400px) {
          .email-link { font-size:1rem; }
        }

        .reason-card {
          background:white; border:1px solid #e2e8f0; border-radius:16px;
          padding:22px; transition:all 0.2s;
        }
        .reason-card:hover { border-color:#c7d2fe; box-shadow:0 8px 24px rgba(99,102,241,0.1); }

        .faq-banner {
          background:linear-gradient(135deg,#eef2ff 0%,#eff6ff 100%);
          border:1px solid #c7d2fe; border-radius:20px; padding:32px;
        }
      `}</style>

      <Header />

      {/* ═════════════ HERO ═════════════ */}
      <section className="ct-hero">
        <div className="ct-orb-1" /><div className="ct-orb-2" />
        <div style={{ maxWidth: 700, margin: "0 auto", textAlign: "center", position: "relative", zIndex: 1 }}>
          <div className="pill pill-dark"><Mail style={{ width: 12, height: 12 }} />Contact</div>
          <h1 style={{ fontSize: "3rem", fontWeight: 900, color: "white", lineHeight: 1.1, letterSpacing: "-0.03em", margin: "0 0 16px" }}>
            Get in touch
          </h1>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "1.1rem", lineHeight: 1.65 }}>
            One inbox, checked by an actual person — not a ticket queue.
          </p>
        </div>
      </section>

      {/* ═════════════ EMAIL CARD ═════════════ */}
      <section style={{ padding: "70px 24px 50px", background: "white" }}>
        <div className="email-card">
          <div className="email-icon"><Mail style={{ width: 26, height: 26, color: "white" }} /></div>
          <h2 style={{ fontWeight: 800, fontSize: "1.2rem", color: "#0f172a", margin: "0 0 10px" }}>Email us directly</h2>
          <p style={{ color: "#64748b", fontSize: "0.9rem", marginBottom: 20, lineHeight: 1.6 }}>
            Bugs, feature ideas, questions about a calculation — all of it goes here.
          </p>
          <a href="mailto:contact@finalgradecalculators.us" className="email-link">
            contact@finalgradecalculators.us
            <ArrowRight style={{ width: 16, height: 16 }} />
          </a>
        </div>
      </section>

      {/* ═════════════ FAQ REFERENCE ═════════════ */}
      <section style={{ padding: "0 24px 70px", background: "white" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <div className="faq-banner">
            <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#4f46e5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <HelpCircle style={{ width: 22, height: 22, color: "white" }} />
              </div>
              <div>
                <h3 style={{ fontWeight: 700, fontSize: "1.1rem", color: "#0f172a", margin: "0 0 8px" }}>Quick question?</h3>
                <p style={{ color: "#475569", fontSize: "0.9rem", lineHeight: 1.65, marginBottom: 16 }}>
                  The FAQ sections on each calculator cover the questions that come up most — weighted grades, curves, dropped grades, letter-to-percent conversion.
                </p>
                <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#4f46e5", color: "white", fontWeight: 700, fontSize: "0.85rem", padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer" }}>
                  Browse the FAQs<ArrowRight style={{ width: 14, height: 14 }} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═════════════ REASONS TO REACH OUT ═════════════ */}
      <section style={{ padding: "0 24px 90px", background: "white" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 className="sec-h2">What's worth emailing about</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 18 }}>
            {[
              { icon: <Bug style={{ width: 20, height: 20, color: "#ef4444" }} />, bg: "#fef2f2", title: "Something's broken", desc: "A calculation looks wrong, a page won't load, a button doesn't work." },
              { icon: <Lightbulb style={{ width: 20, height: 20, color: "#f59e0b" }} />, bg: "#fffbeb", title: "Missing a calculator", desc: "There's a grade-math tool you needed that isn't here yet." },
              { icon: <MessageCircle style={{ width: 20, height: 20, color: "#3b82f6" }} />, bg: "#eff6ff", title: "Not sure how to use it", desc: "A field, a result, or a term on the page doesn't make sense." },
            ].map((r, i) => (
              <div key={i} className="reason-card">
                <div style={{ width: 40, height: 40, borderRadius: 11, background: r.bg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>{r.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: "0.95rem", color: "#0f172a", margin: "0 0 6px" }}>{r.title}</h3>
                <p style={{ color: "#64748b", fontSize: "0.85rem", lineHeight: 1.6, margin: 0 }}>{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
