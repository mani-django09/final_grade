import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "wouter";

export interface Faq {
  question: string;
  answer: string;
}

/** WebApplication + FAQPage + Breadcrumb JSON-LD for a GPA tool page. */
export function GpaSchema({ name, description, path, faqs }: { name: string; description: string; path: string; faqs: Faq[] }) {
  const url = `https://finalgradecalculators.us${path}`;
  const data = [
    {
      "@context": "https://schema.org/",
      "@type": "WebApplication",
      name,
      description,
      url,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Any",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map(f => ({ "@type": "Question", name: f.question, acceptedAnswer: { "@type": "Answer", text: f.answer } })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://finalgradecalculators.us/" },
        { "@type": "ListItem", position: 2, name: "GPA Calculator", item: "https://finalgradecalculators.us/gpa-calculator" },
        { "@type": "ListItem", position: 3, name, item: url },
      ],
    },
  ];
  return (
    <>
      {data.map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(d) }} />
      ))}
    </>
  );
}

export function FaqSection({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="dc-sec cream">
      <div style={{ maxWidth: 760, margin: "0 auto" }}>
        <div className="dc-sec-head">
          <span className="dc-tag">FAQ</span>
          <h2 className="dc-h2">Common questions</h2>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {faqs.map((faq, idx) => (
            <div key={idx} className={`dc-faq ${open === idx ? "open" : ""}`}>
              <button onClick={() => setOpen(open === idx ? null : idx)} aria-expanded={open === idx}>
                <span>{faq.question}</span>
                <ChevronDown style={{ width: 18, height: 18, flexShrink: 0, transition: "transform 0.25s", transform: open === idx ? "rotate(180deg)" : "none" }} />
              </button>
              <div className="dc-faq-body" style={{ maxHeight: open === idx ? 400 : 0 }}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const GPA_TOOLS = [
  { href: "/gpa-calculator", label: "GPA Calculator", desc: "One term of college or school courses, any scale." },
  { href: "/high-school-gpa-calculator", label: "High School GPA Calculator", desc: "All four years, grades 9–12, weighted and unweighted together." },
  { href: "/weighted-gpa-calculator", label: "Weighted GPA Calculator", desc: "Honors, AP and IB bonuses — set to your school's own weighting." },
  { href: "/cumulative-gpa-calculator", label: "Cumulative GPA Calculator", desc: "Combine semesters and find the GPA you need to hit a target." },
];

/** Hub-and-spoke links between the GPA tools, minus the current page. */
export function GpaToolLinks({ current }: { current: string }) {
  return (
    <section className="dc-sec white">
      <div style={{ maxWidth: 1060, margin: "0 auto" }}>
        <div className="dc-sec-head">
          <span className="dc-tag">More GPA tools</span>
          <h2 className="dc-h2">Pick the calculator that <u>fits</u></h2>
        </div>
        <div className="dc-grid3">
          {GPA_TOOLS.filter(t => t.href !== current).map(t => (
            <Link key={t.href} href={t.href} className="dc-card" style={{ textDecoration: "none", display: "block" }}>
              <h3>{t.label} →</h3>
              <p>{t.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Visible breadcrumb matching the BreadcrumbList schema. */
export function GpaBreadcrumb({ name }: { name: string }) {
  const sep = <span aria-hidden="true" style={{ color: "#999" }}>›</span>;
  const a = { color: "#444", textDecoration: "none", fontWeight: 600 } as const;
  return (
    <nav aria-label="Breadcrumb" style={{ maxWidth: 1100, margin: "0 auto 18px", fontSize: "0.82rem", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
      <Link href="/" style={a}>Home</Link>{sep}
      <Link href="/gpa-calculator" style={a}>GPA Calculator</Link>{sep}
      <span aria-current="page" style={{ color: "#111", fontWeight: 700 }}>{name}</span>
    </nav>
  );
}
