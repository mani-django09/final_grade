import { Calculator, Users, Target, Heart, TrendingUp, BookOpen } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";


export default function AboutUs() {
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
      `}</style>

      <Header/>

      {/* Hero Section */}
      <section className="relative py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12 fade-in">
            <h2 className="font-jakarta font-extrabold text-4xl sm:text-5xl text-white mb-4 leading-tight">
              About Final Grade Calculators
            </h2>
            <p className="font-jakarta text-lg text-blue-200/80 max-w-2xl mx-auto">
              Built by students, for students. We're here to make finals week a little less stressful.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="glass-card-light rounded-2xl p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-jakarta font-bold text-2xl text-slate-900">Our Mission</h3>
            </div>
            <div className="font-jakarta text-slate-700 space-y-4 leading-relaxed">
              <p>
                We created Final Grade Calculators with one simple goal: to help students understand exactly where they stand academically and what they need to achieve their goals.
              </p>
              <p>
                Finals week is stressful enough without having to wonder "what do I need to get on this exam?" We believe every student deserves quick, accurate answers to that question—without ads, paywalls, or unnecessary complexity.
              </p>
              <p>
                Our tools are completely free, easy to use, and built with the same care we'd want if we were sitting in your shoes, calculator in hand, trying to figure out our next move.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h3 className="font-jakarta font-bold text-2xl text-white text-center mb-8">What We Stand For</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <Heart className="w-6 h-6" />,
                title: "Student-First",
                description: "Every decision we make is guided by what's best for students. No ads, no distractions, just tools that work."
              },
              {
                icon: <TrendingUp className="w-6 h-6" />,
                title: "Accuracy Matters",
                description: "We use the exact same formulas your professors use. The math is reliable, so your planning can be too."
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Accessible to All",
                description: "Free tools for everyone. Whether you're in high school or grad school, we're here to help."
              }
            ].map((value, idx) => (
              <div key={idx} className="glass-card rounded-xl p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-500/20 text-blue-400 mb-4">
                  {value.icon}
                </div>
                <h4 className="font-jakarta font-bold text-lg text-white mb-2">{value.title}</h4>
                <p className="font-jakarta text-sm text-blue-100/60 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="glass-card rounded-2xl p-8 sm:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/20">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-jakarta font-bold text-2xl text-white">Our Story</h3>
            </div>
            <div className="font-jakarta text-blue-100/80 space-y-4 leading-relaxed">
              <p>
                Final Grade Calculators started the way most student projects do: out of necessity. We were tired of hunting through cluttered websites filled with ads and pop-ups just to answer a simple question about our grades.
              </p>
              <p>
                We wanted something clean, fast, and honest. A tool that respects your time and gives you the information you need without the noise. So we built it ourselves.
              </p>
              <p>
                Today, thousands of students use our calculators to plan their study time, set realistic goals, and reduce the anxiety that comes with not knowing where you stand. We're proud to be a small part of your academic journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="glass-card rounded-2xl p-8 text-center">
            <Calculator className="w-10 h-10 text-blue-400 mx-auto mb-4" />
            <h3 className="font-jakarta font-bold text-2xl text-white mb-3">
              Ready to Calculate Your Grade?
            </h3>
            <p className="font-jakarta text-blue-100/60 mb-6 max-w-md mx-auto">
              Try our tools and see how easy grade planning can be.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/"
                className="inline-flex items-center justify-center font-jakarta font-bold bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-500/25 transition-all"
              >
                Final Grade Calculator
              </a>
              <a
                href="/grades"
                className="inline-flex items-center justify-center font-jakarta font-bold border-2 border-blue-400/30 bg-blue-500/10 hover:bg-blue-500/20 text-white px-6 py-3 rounded-xl transition-all"
              >
                Grade Calculator
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* Footer Component */}
      <Footer/>
    </div>
  );
}