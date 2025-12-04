import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import { Plus, Loader2, Home, Target, ChevronDown, BarChart3, Calculator, AlertTriangle, X, Zap, RefreshCw, ArrowRight, TrendingUp } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type GradeType = "percentage" | "letters" | "points";

interface GradeEntry {
  id: string;
  name: string;
  grade: string;
  weight: number;
  points?: number;
  maxPoints?: number;
}

const letterGradeValues: { [key: string]: number } = {
  "A+": 97, "A": 95, "A-": 92,
  "B+": 89, "B": 85, "B-": 82,
  "C+": 79, "C": 75, "C-": 72,
  "D+": 69, "D": 65, "D-": 62,
  "F": 50
};

const letterGradeOptions = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"];

export default function GradeCalculator() {
  const [gradeType, setGradeType] = useState<GradeType>("percentage");
  const [grades, setGrades] = useState<GradeEntry[]>([
    { id: "1", name: "", grade: "", weight: 0 },
    { id: "2", name: "", grade: "", weight: 0 },
    { id: "3", name: "", grade: "", weight: 0 },
    { id: "4", name: "", grade: "", weight: 0 },
    { id: "5", name: "", grade: "", weight: 0 },
  ]);
  const [mounted, setMounted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculatedResult, setCalculatedResult] = useState<{ overallGrade: number; weightedSum: number; letterGrade: string } | null>(null);
  const [, navigate] = useLocation();
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const convertToPercentage = (entry: GradeEntry): number => {
    if (gradeType === "letters") {
      return letterGradeValues[entry.grade] || 0;
    } else if (gradeType === "points") {
      const points = entry.points || 0;
      const maxPoints = entry.maxPoints || 100;
      return maxPoints > 0 ? (points / maxPoints) * 100 : 0;
    } else {
      return parseFloat(entry.grade) || 0;
    }
  };

  const handleCalculate = async () => {
    setIsCalculating(true);
    setShowResult(false);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const validGrades = grades.filter(g => {
      if (gradeType === "percentage") {
        return g.grade !== "" && g.weight > 0;
      } else if (gradeType === "letters") {
        return g.grade !== "" && g.weight > 0;
      } else {
        return (g.points || 0) > 0 && (g.maxPoints || 0) > 0 && g.weight > 0;
      }
    });

    if (validGrades.length === 0) {
      setIsCalculating(false);
      return;
    }

    let weightedSum = 0;
    let totalWeight = 0;

    validGrades.forEach(entry => {
      const percentage = convertToPercentage(entry);
      weightedSum += percentage * entry.weight;
      totalWeight += entry.weight;
    });

    const overallGrade = totalWeight > 0 ? weightedSum / totalWeight : 0;
    const letterGrade = getLetterFromPercentage(overallGrade);

    setCalculatedResult({
      overallGrade: Math.round(overallGrade * 100) / 100,
      weightedSum: Math.round(weightedSum * 100) / 100,
      letterGrade: letterGrade
    });

    setIsCalculating(false);
    setShowResult(true);
    
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const getLetterFromPercentage = (percentage: number): string => {
    if (percentage >= 93) return "A";
    if (percentage >= 90) return "A-";
    if (percentage >= 87) return "B+";
    if (percentage >= 83) return "B";
    if (percentage >= 80) return "B-";
    if (percentage >= 77) return "C+";
    if (percentage >= 73) return "C";
    if (percentage >= 70) return "C-";
    if (percentage >= 67) return "D+";
    if (percentage >= 63) return "D";
    if (percentage >= 60) return "D-";
    return "F";
  };

  const addGrade = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    setGrades([...grades, { id: newId, name: "", grade: "", weight: 0 }]);
  };

  const removeGrade = (id: string) => {
    if (grades.length > 1) {
      setGrades(grades.filter((g) => g.id !== id));
    }
  };

  const updateGrade = (id: string, field: keyof GradeEntry, value: string | number) => {
    setGrades(
      grades.map((g) =>
        g.id === id
          ? { ...g, [field]: value }
          : g
      )
    );
  };

  const handleReset = () => {
    setGrades([
      { id: "1", name: "", grade: "", weight: 0 },
      { id: "2", name: "", grade: "", weight: 0 },
      { id: "3", name: "", grade: "", weight: 0 },
      { id: "4", name: "", grade: "", weight: 0 },
      { id: "5", name: "", grade: "", weight: 0 },
    ]);
    setShowResult(false);
    setCalculatedResult(null);
  };

  const handleNavigateHome = () => {
    navigate("/");
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const totalWeight = grades.reduce((sum, g) => sum + (g.weight || 0), 0);

  const getLetterGradeInfo = (letter: string) => {
    if (letter.startsWith("A")) return { color: "green", label: "Excellent" };
    if (letter.startsWith("B")) return { color: "blue", label: "Good" };
    if (letter.startsWith("C")) return { color: "yellow", label: "Average" };
    if (letter.startsWith("D")) return { color: "orange", label: "Below Average" };
    return { color: "red", label: "Failing" };
  };

  const gradeInfo = calculatedResult ? getLetterGradeInfo(calculatedResult.letterGrade) : null;

  const faqData = [
    {
      question: "Does it matter if my percentages don't equal 100?",
      answer: "Not really. Maybe your prof hasn't posted every grade yet, or you're checking mid-semester before everything's due. The calculator figures out your current average based on whatever you've got so far. It's actually pretty handy for checking where you stand before the semester ends."
    },
    {
      question: "Should I put in every single homework or just the average?",
      answer: "Either works. Got ten homework assignments? You can list each one separately if you're obsessive about details, or just average them and stick that number in once. You'll end up with the same grade either way. I usually go with the average because it's less typing."
    },
    {
      question: "What's different about this versus the final exam one?",
      answer: "This shows your overall grade right now. The final exam calculator tells you what score you need to get on your final to hit whatever grade you're shooting for. Two different jobs. Use this one all semester to track progress, use that one when finals week rolls around and you're stressing."
    },
    {
      question: "Can I throw in grades that are above 100 from extra credit?",
      answer: "Yes, sure. If your professor gave you extra credit and you ended up with 107% on something, enter 107. The math takes care of it without any problem. Extra credit is there for one reason - to raise your grade, so be sure to count it."
    },
    {
      question: "Do my grades get saved anywhere?",
      answer: "No, nothing gets saved. As soon as you close this page, everything will deleted. We're not saving your information anywhere, it's all kept in your browser while you're using it. If you want to save your results, take a screenshot of them or write them ​‍​‌‍​‍‌​‍​‌‍​‍‌down."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        * {
          font-family: 'Inter', -apple-system, system-ui, sans-serif;
        }

        .hero-bg {
          background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
        }

        .card {
          background: white;
          border: 1px solid #e5e7eb;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }

        .input-box {
          border: 1.5px solid #d1d5db;
          transition: all 0.2s;
        }

        .input-box:focus {
          border-color: #3b82f6;
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .input-box:hover:not(:focus) {
          border-color: #9ca3af;
        }

        .btn-primary {
          background: #2563eb;
          transition: all 0.2s;
        }

        .btn-primary:hover:not(:disabled) {
          background: #1d4ed8;
          transform: translateY(-1px);
        }

        .btn-primary:active {
          transform: translateY(0);
        }

        .type-tab {
          transition: all 0.2s;
        }

        .type-tab.active {
          background: #2563eb;
          color: white;
        }

        .type-tab:not(.active) {
          color: #6b7280;
          border: 1px solid #e5e7eb;
        }

        .type-tab:not(.active):hover {
          background: #f9fafb;
          border-color: #d1d5db;
        }

        .row-item {
          transition: background 0.15s;
        }

        .row-item:hover {
          background: #f9fafb;
        }

        .add-btn {
          border: 1.5px dashed #d1d5db;
          transition: all 0.2s;
        }

        .add-btn:hover {
          border-color: #2563eb;
          color: #2563eb;
          background: #eff6ff;
        }

        .delete-btn {
          opacity: 0;
          transition: opacity 0.2s;
        }

        .row-item:hover .delete-btn {
          opacity: 1;
        }

        .delete-btn:hover {
          color: #dc2626;
        }

        .faq-box {
          border: 1px solid #e5e7eb;
          transition: border-color 0.2s;
        }

        .faq-box:hover {
          border-color: #d1d5db;
        }

        .faq-content {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.3s ease;
        }

        .faq-content.open {
          max-height: 400px;
        }

        .result-appear {
          animation: slideUp 0.4s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .select-box {
          border: 1.5px solid #d1d5db;
          transition: all 0.2s;
          background: white;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
          padding-right: 2.5rem;
        }

        .select-box:focus {
          border-color: #3b82f6;
          outline: none;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .feature-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid #e5e7eb;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border-color: #3b82f6;
        }

        .feature-icon {
          transition: all 0.3s ease;
        }

        .feature-card:hover .feature-icon {
          transform: scale(1.1) rotate(5deg);
        }
      `}</style>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "WebApplication",
            name: "Grade Calculator",
            description: "Calculate your overall course grade based on multiple weighted assignments. Supports percentage, letter grades, and points.",
            url: "https://finalgradecalculators.us/grades",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }
          })
        }}
      />

      <Header activePage="grade-calculator" />

      {/* Hero */}
      <section className="hero-bg py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Grade Calculator
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto">
              Type in your assignments and weights. See your course grade instantly.
            </p>
          </div>

          {/* Main Calculator */}
          <div className="max-w-5xl mx-auto">
            <div className="card rounded-xl p-6 sm:p-8">
              {/* Type Selector */}
              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Pick your grade format
                </label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setGradeType("percentage")}
                    className={`type-tab px-6 py-2.5 rounded-lg text-sm font-medium ${
                      gradeType === "percentage" ? "active" : ""
                    }`}
                  >
                    Percentages (85%)
                  </button>
                  <button
                    onClick={() => setGradeType("letters")}
                    className={`type-tab px-6 py-2.5 rounded-lg text-sm font-medium ${
                      gradeType === "letters" ? "active" : ""
                    }`}
                  >
                    Letters (A, B+)
                  </button>
                  <button
                    onClick={() => setGradeType("points")}
                    className={`type-tab px-6 py-2.5 rounded-lg text-sm font-medium ${
                      gradeType === "points" ? "active" : ""
                    }`}
                  >
                    Points (45/50)
                  </button>
                </div>
              </div>

              {/* Assignments */}
              <div className="space-y-3 mb-6">
                {grades.map((grade, index) => (
                  <div key={grade.id} className="row-item rounded-lg p-4 border border-gray-100">
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                      {/* Name */}
                      <div className={gradeType === "points" ? "sm:col-span-4" : "sm:col-span-5"}>
                        <Label className="text-xs text-gray-600 mb-1.5 block">
                          Name (optional)
                        </Label>
                        <Input
                          type="text"
                          placeholder={`Assignment ${index + 1}`}
                          value={grade.name}
                          onChange={(e) => updateGrade(grade.id, "name", e.target.value)}
                          className="h-10 input-box rounded-lg text-sm"
                        />
                      </div>

                      {/* Grade Input */}
                      {gradeType === "percentage" && (
                        <div className="sm:col-span-3">
                          <Label className="text-xs text-gray-600 mb-1.5 block">
                            Grade (%)
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            max="150"
                            step="0.1"
                            value={grade.grade}
                            onChange={(e) => updateGrade(grade.id, "grade", e.target.value)}
                            className="h-10 input-box rounded-lg text-sm"
                            placeholder="85"
                          />
                        </div>
                      )}

                      {gradeType === "letters" && (
                        <div className="sm:col-span-3">
                          <Label className="text-xs text-gray-600 mb-1.5 block">
                            Letter
                          </Label>
                          <select
                            value={grade.grade}
                            onChange={(e) => updateGrade(grade.id, "grade", e.target.value)}
                            className="h-10 w-full select-box rounded-lg text-sm px-3"
                          >
                            <option value="">Pick</option>
                            {letterGradeOptions.map(letter => (
                              <option key={letter} value={letter}>{letter}</option>
                            ))}
                          </select>
                        </div>
                      )}

                      {gradeType === "points" && (
                        <>
                          <div className="sm:col-span-2">
                            <Label className="text-xs text-gray-600 mb-1.5 block">
                              Earned
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.1"
                              value={grade.points || ""}
                              onChange={(e) => updateGrade(grade.id, "points", parseFloat(e.target.value) || 0)}
                              className="h-10 input-box rounded-lg text-sm"
                              placeholder="45"
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <Label className="text-xs text-gray-600 mb-1.5 block">
                              Out of
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              step="0.1"
                              value={grade.maxPoints || ""}
                              onChange={(e) => updateGrade(grade.id, "maxPoints", parseFloat(e.target.value) || 0)}
                              className="h-10 input-box rounded-lg text-sm"
                              placeholder="50"
                            />
                          </div>
                        </>
                      )}

                      {/* Weight */}
                      <div className={gradeType === "points" ? "sm:col-span-3" : "sm:col-span-3"}>
                        <Label className="text-xs text-gray-600 mb-1.5 block">
                          Weight (%)
                        </Label>
                        <div className="relative">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            step="1"
                            value={grade.weight || ""}
                            onChange={(e) => updateGrade(grade.id, "weight", parseFloat(e.target.value) || 0)}
                            className="h-10 input-box rounded-lg text-sm pr-8"
                            placeholder="20"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                        </div>
                      </div>

                      {/* Delete */}
                      <div className="sm:col-span-1 flex items-end justify-end">
                        <button
                          onClick={() => removeGrade(grade.id)}
                          disabled={grades.length === 1}
                          className="delete-btn h-10 w-10 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add & Reset */}
              <div className="flex gap-3 mb-6">
                <button
                  onClick={addGrade}
                  className="add-btn flex-1 py-3 rounded-lg flex items-center justify-center gap-2 text-sm font-medium text-gray-600"
                >
                  <Plus className="w-4 h-4" />
                  Add row
                </button>
                <button
                  onClick={handleReset}
                  className="py-3 px-6 rounded-lg text-sm font-medium text-gray-600 border border-gray-200 hover:bg-gray-50"
                >
                  Clear
                </button>
              </div>

              {/* Weight Warning */}
              {totalWeight > 0 && totalWeight !== 100 && (
                <div className={`flex items-start gap-2 p-3 rounded-lg text-sm mb-6 ${
                  totalWeight > 100 
                    ? 'bg-red-50 text-red-800 border border-red-200' 
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}>
                  <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-medium">Total: {totalWeight}%</span>
                    {totalWeight < 100 && <span className="block mt-0.5 text-xs">That's okay if you're still waiting on grades</span>}
                    {totalWeight > 100 && <span className="block mt-0.5 text-xs">Should be 100% or under</span>}
                  </div>
                </div>
              )}

              {/* Calculate Button */}
              <Button
                onClick={handleCalculate}
                disabled={isCalculating}
                className="w-full h-12 btn-primary text-white font-semibold rounded-lg"
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

              {/* Result */}
              {showResult && calculatedResult && (
                <div ref={resultRef} className="mt-8 result-appear">
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-8 text-center mb-4">
                    <p className="text-sm text-blue-100 mb-2">Your grade</p>
                    <p className="text-6xl font-bold text-white mb-3">
                      {calculatedResult.overallGrade}%
                    </p>
                    {gradeInfo && (
                      <div className="flex items-center justify-center gap-2">
                        <span className={`text-4xl font-bold ${
                          gradeInfo.color === 'green' ? 'text-green-300' :
                          gradeInfo.color === 'blue' ? 'text-blue-300' :
                          gradeInfo.color === 'yellow' ? 'text-yellow-300' :
                          gradeInfo.color === 'orange' ? 'text-orange-300' :
                          'text-red-300'
                        }`}>
                          {calculatedResult.letterGrade}
                        </span>
                        <span className="text-sm text-blue-100">({gradeInfo.label})</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
                      <p className="text-2xl font-bold text-gray-900">
                        {grades.filter(g => gradeType === "points" ? (g.points || 0) > 0 : g.grade !== "").length}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Items</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
                      <p className={`text-2xl font-bold ${totalWeight === 100 ? 'text-green-600' : 'text-amber-600'}`}>
                        {totalWeight}%
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Weight</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 text-center border border-gray-200">
                      <p className="text-2xl font-bold text-gray-900">
                        {calculatedResult.weightedSum.toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">Sum</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Why students keep coming back
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Simple tools that actually work when you need them
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="feature-card bg-white rounded-xl p-8">
              <div className="feature-icon w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Works with any format</h3>
              <p className="text-gray-600 leading-relaxed">
                Percentages, letter grades, raw points—doesn't matter how your prof reports stuff. Switch between formats whenever. The calculator figures out the conversion so you don't have to pull out a spreadsheet.
              </p>
            </div>

            <div className="feature-card bg-white rounded-xl p-8">
              <div className="feature-icon w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6">
                <RefreshCw className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">See results right away</h3>
              <p className="text-gray-600 leading-relaxed">
                Type in a number, your grade updates instantly. No refresh button, no loading screens. Want to see what happens if you bomb the next test? Change the number and find out immediately what it does to your overall grade.
              </p>
            </div>

            <div className="feature-card bg-white rounded-xl p-8">
              <div className="feature-icon w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Handles weird situations</h3>
              <p className="text-gray-600 leading-relaxed">
                Weights don't add to 100 yet? No problem. Got extra credit above 100%? Throw it in. Only halfway through the semester? Still works. The math adjusts automatically no matter what stage you're at in the course.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              The math behind weighted grades
            </h2>
            <p className="text-lg text-gray-600">
              Here's how your prof actually calculates your grade
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-8 sm:p-10 border border-gray-200">
            <div className="space-y-6 text-gray-700 leading-relaxed">
              <p className="text-lg">
                Not everything counts the same. A final worth 30% matters way more than homework worth 5%. Your prof multiplies each grade by its weight, adds everything up, then divides by the total weight. That's your course grade.
              </p>
              
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <p className="text-sm font-semibold text-gray-900 mb-3">Quick example</p>
                <p className="mb-3">
                  Say you've got 88% on homework (20% of grade), 75% on your midterm (30% of grade), and 92% on quizzes (15% of grade).
                </p>
                <div className="bg-gray-50 rounded p-4 font-mono text-sm space-y-1.5">
                  <p>(88 × 0.20) + (75 × 0.30) + (92 × 0.15)</p>
                  <p>= 17.6 + 22.5 + 13.8</p>
                  <p>= 53.9 ÷ 0.65 = 82.9%</p>
                </div>
              </div>

              <p>
                That 75% midterm pulls you down more than the 92% quizzes help because the midterm's worth more. Once you get how weighting works, you know where to focus your effort. No point stressing over a 5% assignment when you've got a 30% exam coming up.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqData.map((faq, idx) => (
              <div key={idx} className="faq-box bg-white rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-200 ${openFaq === idx ? 'rotate-180' : ''}`} />
                </button>
                <div className={`faq-content ${openFaq === idx ? 'open' : ''}`}>
                  <div className="px-6 pb-5">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-10 sm:p-12 text-center">
            <Target className="w-14 h-14 text-blue-100 mx-auto mb-5" />
            <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Got a final exam coming up?
            </h3>
            <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
              Use our other calculator to figure out exactly what score you need on your final to hit whatever grade you're shooting for.
            </p>
            <Button
              onClick={handleNavigateHome}
              className="bg-white hover:bg-gray-50 text-blue-700 font-semibold px-8 py-4 rounded-xl h-auto text-base"
            >
              <Home className="mr-2 w-5 h-5" />
              Final grade calculator
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}