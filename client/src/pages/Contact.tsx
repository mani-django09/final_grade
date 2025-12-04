import { Calculator, Mail, MessageSquare, HelpCircle } from "lucide-react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";


export default function Contact() {
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');

        .font-jakarta { font-family: 'Plus Jakarta Sans', sans-serif; }
        .font-mono { font-family: 'Space Mono', monospace; }

        .glass-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .glass-card-light {
          background: rgba(255, 255, 255, 0.97);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4);
        }

        .fade-in {
          animation: fadeIn 0.5s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .hover-lift {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .hover-lift:hover {
          transform: translateY(-2px);
        }
      `}</style>

      <Header/>

      {/* Hero Section */}
      <section className="relative py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 fade-in">
            <h2 className="font-jakarta font-extrabold text-4xl sm:text-5xl text-white mb-4 leading-tight">
              Get in Touch
            </h2>
            <p className="font-jakarta text-lg text-blue-200/80 max-w-2xl mx-auto">
              We'd love to hear from you. Whether you have a question, feedback, or just want to say hi.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Email Card */}
            <div className="glass-card-light rounded-2xl p-8 hover-lift">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-jakarta font-bold text-xl text-slate-900">Email Us</h3>
              </div>
              <p className="font-jakarta text-slate-700 mb-4 leading-relaxed">
                Have a question or suggestion? Drop us an email and we'll get back to you as soon as possible.
              </p>
              <a
                href="mailto:contact@finalgradecalculators.us"
                className="font-jakarta font-semibold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center"
              >
                contact@finalgradecalculators.us
              </a>
            </div>

            {/* Feedback Card */}
            <div className="glass-card-light rounded-2xl p-8 hover-lift">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-100">
                  <MessageSquare className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="font-jakarta font-bold text-xl text-slate-900">Feedback</h3>
              </div>
              <p className="font-jakarta text-slate-700 mb-4 leading-relaxed">
                We're always looking to improve. Your feedback helps us make better tools for students.
              </p>
              <a
                href="mailto:feedback@finalgradecalculators.us"
                className="font-jakarta font-semibold text-emerald-600 hover:text-emerald-700 transition-colors inline-flex items-center"
              >
                feedback@finalgradecalculators.us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Reference */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="glass-card rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/20">
                <HelpCircle className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-jakarta font-bold text-2xl text-white">Have a Question?</h3>
            </div>
            <p className="font-jakarta text-blue-100/80 leading-relaxed mb-6">
              Before reaching out, check if your question is answered in our FAQ section on the homepage. We've covered the most common questions about using our calculators, understanding weighted grades, and interpreting results.
            </p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center font-jakarta font-bold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-500/25 transition-all"
            >
              View FAQ Section
            </button>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <h3 className="font-jakarta font-bold text-2xl text-white mb-2">What to Expect</h3>
            <p className="font-jakarta text-blue-200/60">Our typical response process</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                step: "1",
                title: "We Read Everything",
                description: "Every email gets reviewed by our team. We take your feedback and questions seriously."
              },
              {
                step: "2",
                title: "Quick Response",
                description: "We aim to respond within 48 hours. Usually faster during weekdays."
              },
              {
                step: "3",
                title: "Real Solutions",
                description: "We don't send automated replies. You'll get a real answer from real people."
              }
            ].map((item, idx) => (
              <div key={idx} className="glass-card rounded-xl p-6">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 mb-4">
                  <span className="font-mono text-lg font-bold">{item.step}</span>
                </div>
                <h4 className="font-jakarta font-bold text-lg text-white mb-2">{item.title}</h4>
                <p className="font-jakarta text-sm text-blue-100/60 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* General Inquiries */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="glass-card-light rounded-2xl p-8">
            <h3 className="font-jakarta font-bold text-2xl text-slate-900 mb-6">Common Reasons to Contact Us</h3>
            <div className="space-y-4 font-jakarta text-slate-700">
              <div className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <div>
                  <span className="font-semibold text-slate-900">Bug Reports:</span> Found something that doesn't work? Let us know so we can fix it.
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <div>
                  <span className="font-semibold text-slate-900">Feature Requests:</span> Have an idea for a new calculator or feature? We're all ears.
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <div>
                  <span className="font-semibold text-slate-900">Questions:</span> Not sure how to use a calculator or interpret results? We can help.
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <div>
                  <span className="font-semibold text-slate-900">Partnerships:</span> Interested in working together? Reach out to discuss opportunities.
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-600 font-bold">•</span>
                <div>
                  <span className="font-semibold text-slate-900">General Feedback:</span> Love it? Hate it? Want to suggest improvements? We want to hear it.
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
}