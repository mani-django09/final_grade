import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { AlertCircle, CheckCircle2, Loader2, ArrowRight, BookOpen, Target, Award, ChevronDown, HelpCircle, GraduationCap, Clock, Shield, Calculator, Sparkles, TrendingUp, Zap, Brain } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  const [currentGrade, setCurrentGrade] = useState<number>(85);
  const [finalExamWeight, setFinalExamWeight] = useState<number>(25);
  const [desiredGrade, setDesiredGrade] = useState<number>(90);
  const [mounted, setMounted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [, navigate] = useLocation();

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: result, refetch } = trpc.grades.calculateFinalGrade.useQuery(
    {
      currentGrade,
      finalExamWeight,
      desiredGrade,
    },
    {
      enabled: false,
    }
  );

  const handleCalculate = async () => {
    setIsCalculating(true);
    setShowResult(false);
    await new Promise(resolve => setTimeout(resolve, 800));
    await refetch();
    setIsCalculating(false);
    setShowResult(true);
  };

  const handleNavigateToGradeCalculator = () => {
    navigate("/grades");
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const getScoreCategory = (score: number) => {
    if (score <= 60) return { label: "Easy Target", color: "emerald", emoji: "🎯" };
    if (score <= 75) return { label: "Realistic", color: "green", emoji: "💪" };
    if (score <= 85) return { label: "Needs Work", color: "amber", emoji: "⚡" };
    if (score <= 95) return { label: "Difficult", color: "orange", emoji: "🔥" };
    if (score <= 100) return { label: "Nearly Perfect", color: "red", emoji: "🚀" };
    return { label: "Not Possible", color: "gray", emoji: "😅" };
  };

  const faqData = [
    {
      question: "Where's the final exam weight listed in my syllabus?",
      answer: "Check out the first few pages of your syllabus. Typically the sections “Grading Policy” or “Course Assessment” are present. Your instructor shows the percentage of each component (e.g. homework, quizzes, midterms, final) that counts toward your grade. If you do not find it there, look up the grading scheme on your school's online portal like Canvas or Blackboard. Still can not find it? Then send an email to your professor."
    },
    {
      question: "What if the calculator tells me I need 110%?",
      answer: "This is the way the calculator uses to tell you that reaching your goal with just the final exam is impossible. Nevertheless, there is no need to be worry. Verify if your professor allows for extra credit activities–some do, especially towards the end of the term. You also may discuss with him/her about incomplete assignments or grade changes. Occasionally, the reduction of your target by 3-5 points makes all the difference."
    },
    {
      question: "My class gets curved. How does that affect this?",
      answer: "As a rule, curve works to your advantage, so consider this figure as a worst-case scenario. The use of individual exam curves by your professor means that the necessary score might be lower than what we indicate. If they apply the curve to final grades only, it is the same situation. When you are not sure about the type of the curve they employ, it is better to be slightly above our number just to be on the safe side."
    },
    {
      question: "One of my quiz grades doesn't count. How do I handle that?",
      answer: "Just ignore the grade that you have dropped completely. For example, if you have done 6 quizzes and the lowest one is going to be dropped, average your top 5 scores and take that result. Do not mention the dropped grade in any of your calculations. Think of it as if it had never taken place."
    },
    {
      question: "Can I convert letter grades to percentages?",
      answer: "Sure. Your syllabus should have the conversion scale. Most schools use something like: A = 93-96%, B+ = 87-89%, B = 83-86%, and so on. Pick the middle of the range for best results. So if you got a B, use 85% rather than 83% or 86%."
    },
    {
      question: "My final can replace my midterm if it's higher. What now?",
      answer: "That's actually great for you. Run the math twice: once with your actual midterm included, and once pretending the final replaces it. This shows you both scenarios. If your midterm grade was rough, you might need a lower final score than you think since it could wipe out that bad midterm."
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
        }

        .hero-section {
          background: linear-gradient(to bottom, #1e40af 0%, #1e3a8a 100%);
          position: relative;
        }

        .glass-card {
          background: white;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
        }

        .input-field {
          background: white;
          border: 1px solid #d1d5db;
          transition: all 0.15s ease;
        }

        .input-field:focus {
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          outline: none;
        }

        .input-field:hover:not(:focus) {
          border-color: #9ca3af;
        }

        .btn-calculate {
          background: #2563eb;
          transition: all 0.15s ease;
        }

        .btn-calculate:hover {
          background: #1d4ed8;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .btn-calculate:active {
          transform: translateY(0);
        }

        .fade-in {
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .feature-box {
          background: white;
          border: 1px solid #e5e7eb;
          transition: all 0.2s ease;
        }

        .feature-box:hover {
          border-color: #d1d5db;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }

        .faq-item {
          border: 1px solid #e5e7eb;
          transition: border-color 0.15s ease;
        }

        .faq-item:hover {
          border-color: #d1d5db;
        }

        .faq-answer {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.25s ease;
        }

        .faq-answer.open {
          max-height: 400px;
        }

        .stat-item {
          padding: 1rem;
        }

        @media (max-width: 640px) {
          .stat-item {
            padding: 0.75rem;
          }
        }
      `}</style>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "WebApplication",
            name: "Final Grade Calculator",
            description: "Calculate the exact score you need on your final exam to achieve your desired course grade. Free, instant, and accurate.",
            url: "https://finalgradecalculators.us",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: "4.9",
              ratingCount: "2847"
            }
          })
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqData.map(faq => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer }
            }))
          })
        }}
      />

      <Header activePage="final-grade" />

      {/* Hero Section */}
      <section className="hero-section pt-12 pb-20 sm:pt-16 sm:pb-28">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className={`text-center mb-10 ${mounted ? 'fade-in' : 'opacity-0'}`}>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Final Grade Calculator
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
              Find out what you need to score on your final. Takes 10 seconds.
            </p>
          </div>

          {/* Calculator */}
          <div className="grid gap-6 lg:grid-cols-2 max-w-5xl mx-auto">
            {/* Input Card */}
            <div className="glass-card rounded-xl p-6">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Your Information</h2>
                </div>
                <p className="text-sm text-gray-500">Enter as percentages</p>
              </div>

              <div className="space-y-5">
                <div>
                  <Label htmlFor="current-grade" className="text-sm font-medium text-gray-700 mb-2 block">
                    Current Grade
                  </Label>
                  <div className="relative">
                    <Input
                      id="current-grade"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={currentGrade}
                      onChange={(e) => setCurrentGrade(parseFloat(e.target.value) || 0)}
                      className="h-11 input-field rounded-lg pr-10"
                      placeholder="85"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">Where you're at right now</p>
                </div>

                <div>
                  <Label htmlFor="final-weight" className="text-sm font-medium text-gray-700 mb-2 block">
                    Final Exam Weight
                  </Label>
                  <div className="relative">
                    <Input
                      id="final-weight"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={finalExamWeight}
                      onChange={(e) => setFinalExamWeight(parseFloat(e.target.value) || 0)}
                      className="h-11 input-field rounded-lg pr-10"
                      placeholder="25"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">How much the final counts</p>
                </div>

                <div>
                  <Label htmlFor="desired-grade" className="text-sm font-medium text-gray-700 mb-2 block">
                    Goal Grade
                  </Label>
                  <div className="relative">
                    <Input
                      id="desired-grade"
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={desiredGrade}
                      onChange={(e) => setDesiredGrade(parseFloat(e.target.value) || 0)}
                      className="h-11 input-field rounded-lg pr-10"
                      placeholder="90"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1.5">What you want to finish with</p>
                </div>

                <Button
                  onClick={handleCalculate}
                  disabled={isCalculating}
                  className="w-full h-12 btn-calculate text-white font-semibold rounded-lg"
                >
                  {isCalculating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Calculating...
                    </>
                  ) : (
                    <>
                      <Calculator className="mr-2 h-5 w-5" />
                      Calculate
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Result Card */}
            <div className="glass-card rounded-xl p-6">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <Target className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-gray-900">What You Need</h2>
                </div>
                <p className="text-sm text-gray-500">Score required on final</p>
              </div>

              <div>
                {!showResult ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center mb-4">
                      <Calculator className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-600 text-sm">
                      {isCalculating ? "One sec..." : "Hit calculate when ready"}
                    </p>
                  </div>
                ) : result ? (
                  <div className="space-y-4 fade-in">
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-center">
                      <p className="text-sm text-blue-100 mb-1">You need</p>
                      <p className="text-5xl font-bold text-white">
                        {result.requiredGrade > 100 ? (
                          <span className="text-4xl">100+</span>
                        ) : result.requiredGrade < 0 ? (
                          <span>0</span>
                        ) : (
                          result.requiredGrade
                        )}
                        <span className="text-3xl text-blue-100">%</span>
                      </p>
                      {result.requiredGrade <= 100 && result.requiredGrade >= 0 && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 mt-2">
                          <span>{getScoreCategory(result.requiredGrade).emoji}</span>
                          <span className="text-sm text-white">
                            {getScoreCategory(result.requiredGrade).label}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className={`flex items-start gap-2.5 rounded-lg p-3.5 text-sm ${
                      result.isAchievable 
                        ? "bg-green-50 text-green-800 border border-green-200" 
                        : "bg-red-50 text-red-800 border border-red-200"
                    }`}>
                      {result.isAchievable ? (
                        <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                      )}
                      <p>{result.message}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5">
                      <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                        <p className="text-xl font-bold text-gray-900">{currentGrade}%</p>
                        <p className="text-xs text-gray-500 mt-0.5">Current</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                        <p className="text-xl font-bold text-gray-900">{finalExamWeight}%</p>
                        <p className="text-xs text-gray-500 mt-0.5">Weight</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                        <p className="text-xl font-bold text-gray-900">{desiredGrade}%</p>
                        <p className="text-xs text-gray-500 mt-0.5">Goal</p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-8 bg-white border-y border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="stat-item">
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">2.8M+</p>
              <p className="text-sm text-gray-600 mt-1">Students</p>
            </div>
            <div className="stat-item">
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">4.9/5</p>
              <p className="text-sm text-gray-600 mt-1">Rating</p>
            </div>
            <div className="stat-item">
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">Free</p>
              <p className="text-sm text-gray-600 mt-1">Always</p>
            </div>
            <div className="stat-item">
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">0.1s</p>
              <p className="text-sm text-gray-600 mt-1">Fast</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Why Students Use This
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              No login. No ads. Just answers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="feature-box rounded-xl p-5">
              <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Super Fast</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Results show up before you can blink. No spinning wheels or waiting around.
              </p>
            </div>

            <div className="feature-box rounded-xl p-5">
              <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Reliable Math</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Same formula professors use. Nothing tricky, just straight weighted averages.
              </p>
            </div>

            <div className="feature-box rounded-xl p-5">
              <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Smart Feedback</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Not just numbers—tells you if your goal makes sense and what it'll take.
              </p>
            </div>

            <div className="feature-box rounded-xl p-5">
              <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Works Anywhere</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                High school, college, grad school—grade math is grade math everywhere.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              The Math Explained
            </h2>
            <p className="text-lg text-gray-600">
              How weighted grades actually work
            </p>
          </div>

          <div className="bg-white rounded-xl p-8 sm:p-10 border border-gray-200">
            <div className="space-y-5 text-gray-700 leading-relaxed">
              <p>
                Your final grade isn't a simple average. Different things count for different amounts. 
                A final worth 30% matters way more than homework worth 5%.
              </p>
              
              <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
                <p className="text-sm font-medium text-blue-900 mb-2">The Formula</p>
                <div className="bg-white rounded p-3 border border-blue-100">
                  <p className="text-blue-900 font-mono text-sm text-center">
                    Score Needed = (Goal − Current × Current Weight) ÷ Final Weight
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <p className="font-semibold text-gray-900 mb-2">Real Example</p>
                <p>
                  You've got 82%, your final is 35% of the grade, and you want 88% overall. 
                  Plug those in and you need about 99% on the final. That's tough, but at least 
                  you know what you're shooting for instead of guessing.
                </p>
              </div>

              <p>
                Knowing your target changes everything. Maybe 99% isn't realistic with three other 
                finals that week, so you adjust your goal to 85% instead. Or maybe you only need 
                65% to pass, which frees you up to focus on harder classes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Study Tips */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Study Tips That Actually Help
            </h2>
            <p className="text-lg text-gray-600">
              Stuff that works when finals hit
            </p>
          </div>

          <div className="space-y-4">
            <div className="feature-box rounded-lg p-5">
              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 border border-green-100">
                  <span className="text-sm font-bold text-green-700">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1.5">Think in actual questions</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Need 85% on 50 questions? That means you can miss about 7-8 questions. Way easier 
                    to picture than abstract percentages.
                  </p>
                </div>
              </div>
            </div>

            <div className="feature-box rounded-lg p-5">
              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 border border-green-100">
                  <span className="text-sm font-bold text-green-700">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1.5">Focus on repeat topics</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Check old exams and study guides for patterns. Whatever shows up repeatedly is 
                    what you should master first.
                  </p>
                </div>
              </div>
            </div>

            <div className="feature-box rounded-lg p-5">
              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 border border-green-100">
                  <span className="text-sm font-bold text-green-700">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1.5">Space out your review</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Study today, review tomorrow, then again in three days. Your brain locks stuff 
                    in better when you spread it out.
                  </p>
                </div>
              </div>
            </div>

            <div className="feature-box rounded-lg p-5">
              <div className="flex gap-4">
                <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center flex-shrink-0 border border-green-100">
                  <span className="text-sm font-bold text-green-700">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1.5">Teach it out loud</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Try explaining concepts like you're teaching someone. Anywhere you stumble is 
                    exactly where you need more work.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqData.map((faq, idx) => (
              <div key={idx} className="faq-item bg-white rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-medium text-gray-900 pr-4">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <div className={`faq-answer ${openFaq === idx ? 'open' : ''}`}>
                  <div className="px-5 pb-4">
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-10 text-center">
            <Award className="w-11 h-11 text-blue-100 mx-auto mb-4" />
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              Need to Track All Your Grades?
            </h3>
            <p className="text-blue-100 mb-7 max-w-lg mx-auto">
              Calculate your overall course grade with homework, tests, projects—everything in one place.
            </p>
            <Button
              onClick={handleNavigateToGradeCalculator}
              className="bg-white hover:bg-gray-50 text-blue-700 font-semibold px-7 py-3 rounded-lg h-auto"
            >
              Open Grade Calculator
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}