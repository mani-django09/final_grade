import { Calculator, Shield, Lock, Eye, Database, Cookie } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Privacy() {
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
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-500/25 mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-jakarta font-extrabold text-4xl sm:text-5xl text-white mb-4 leading-tight">
              Privacy Policy
            </h2>
            <p className="font-jakarta text-blue-200/80 max-w-2xl mx-auto">
              Last Updated: December 3, 2024
            </p>
          </div>
        </div>
      </section>

      {/* Quick Summary */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="glass-card rounded-2xl p-8 border-2 border-blue-400/30">
            <h3 className="font-jakarta font-bold text-xl text-white mb-4">Privacy at a Glance</h3>
            <div className="space-y-3 font-jakarta text-blue-100/80">
              <div className="flex gap-3">
                <span className="text-blue-400">✓</span>
                <p>We don't collect any personal information from you</p>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-400">✓</span>
                <p>Your grade calculations stay on your device</p>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-400">✓</span>
                <p>We use basic analytics to improve our service</p>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-400">✓</span>
                <p>No account creation required</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="glass-card-light rounded-2xl p-8 sm:p-10">
            <div className="space-y-8 font-jakarta text-slate-700">
              
              {/* Introduction */}
              <div>
                <h3 className="font-bold text-2xl text-slate-900 mb-4">Introduction</h3>
                <p className="leading-relaxed">
                  At Final Grade Calculators (finalgradecalculators.us), your privacy is important to us. This Privacy Policy explains how we handle information when you use our grade calculation tools. The simple version: we don't collect or store your personal information or grade data.
                </p>
              </div>

              {/* Information We Don't Collect */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100">
                    <Eye className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-2xl text-slate-900">Information We Don't Collect</h3>
                </div>
                <p className="leading-relaxed mb-4">
                  We want to be crystal clear about what we don't collect:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="leading-relaxed"><strong>Personal Information:</strong> We don't ask for or store your name, email address, student ID, or any other identifying information.</li>
                  <li className="leading-relaxed"><strong>Grade Data:</strong> All grade calculations happen in your browser. We never see or store your grades, course names, or academic information.</li>
                  <li className="leading-relaxed"><strong>Account Information:</strong> We don't require accounts, so there's no username, password, or profile data.</li>
                  <li className="leading-relaxed"><strong>Location Data:</strong> We don't collect or track your precise location.</li>
                </ul>
              </div>

              {/* Information We Collect */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
                    <Database className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-2xl text-slate-900">Information We Collect</h3>
                </div>
                <p className="leading-relaxed mb-4">
                  We collect minimal, non-personal information to keep our service running and improve it:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="leading-relaxed"><strong>Usage Analytics:</strong> We use standard web analytics (like Google Analytics) to understand how people use our calculators. This includes things like which pages are visited, how long people stay, and general traffic patterns.</li>
                  <li className="leading-relaxed"><strong>Technical Information:</strong> Basic technical data like browser type, device type, and operating system to ensure our calculators work properly across different platforms.</li>
                  <li className="leading-relaxed"><strong>Anonymous Interaction Data:</strong> We track which buttons are clicked and which features are used to improve user experience, but this data is never tied to you personally.</li>
                </ul>
              </div>

              {/* Cookies */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-100">
                    <Cookie className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="font-bold text-2xl text-slate-900">Cookies and Local Storage</h3>
                </div>
                <p className="leading-relaxed mb-4">
                  Our website uses cookies and local storage for:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="leading-relaxed"><strong>Analytics Cookies:</strong> Third-party cookies from services like Google Analytics to track website usage.</li>
                  <li className="leading-relaxed"><strong>Functional Storage:</strong> Your browser may temporarily store your calculator inputs so you don't lose your work if you refresh the page. This data stays on your device and is never sent to us.</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  You can disable cookies in your browser settings, though this may affect some functionality.
                </p>
              </div>

              {/* How We Use Information */}
              <div>
                <h3 className="font-bold text-2xl text-slate-900 mb-4">How We Use Information</h3>
                <p className="leading-relaxed mb-4">
                  The limited information we collect is used to:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="leading-relaxed">Improve our calculators and add features students actually want</li>
                  <li className="leading-relaxed">Fix bugs and technical issues</li>
                  <li className="leading-relaxed">Understand which calculators are most useful</li>
                  <li className="leading-relaxed">Ensure our service is fast and reliable</li>
                </ul>
              </div>

              {/* Third-Party Services */}
              <div>
                <h3 className="font-bold text-2xl text-slate-900 mb-4">Third-Party Services</h3>
                <p className="leading-relaxed mb-4">
                  We use the following third-party services:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="leading-relaxed"><strong>Google Analytics:</strong> For website analytics. Google Analytics has its own privacy policy available at google.com/policies/privacy.</li>
                  <li className="leading-relaxed"><strong>Hosting Services:</strong> Our website is hosted on secure servers that follow industry-standard security practices.</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  These services may collect their own data according to their privacy policies. We recommend reviewing their policies if you're concerned.
                </p>
              </div>

              {/* Data Security */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-100">
                    <Lock className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-2xl text-slate-900">Data Security</h3>
                </div>
                <p className="leading-relaxed">
                  Since we don't collect personal information or store your grade data, there's minimal risk to your privacy when using our service. All calculations happen locally in your browser. We use HTTPS encryption to protect data transmitted between your browser and our servers.
                </p>
              </div>

              {/* Children's Privacy */}
              <div>
                <h3 className="font-bold text-2xl text-slate-900 mb-4">Children's Privacy</h3>
                <p className="leading-relaxed">
                  Our service is designed for students of all ages. Since we don't collect personal information, we don't specifically track the age of users. Parents and guardians can feel confident that we're not collecting or storing any information about their children.
                </p>
              </div>

              {/* Your Rights */}
              <div>
                <h3 className="font-bold text-2xl text-slate-900 mb-4">Your Rights</h3>
                <p className="leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="leading-relaxed">Use our service without providing any personal information</li>
                  <li className="leading-relaxed">Clear your browser's local storage and cookies at any time</li>
                  <li className="leading-relaxed">Contact us with questions about our privacy practices</li>
                  <li className="leading-relaxed">Stop using our service at any time without consequence</li>
                </ul>
              </div>

              {/* Changes to This Policy */}
              <div>
                <h3 className="font-bold text-2xl text-slate-900 mb-4">Changes to This Policy</h3>
                <p className="leading-relaxed">
                  We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated "Last Updated" date. We encourage you to review this policy periodically. Continued use of our service after changes means you accept the updated policy.
                </p>
              </div>

              {/* Contact Us */}
              <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-100">
                <h3 className="font-bold text-2xl text-slate-900 mb-3">Contact Us</h3>
                <p className="leading-relaxed mb-3">
                  If you have questions about this Privacy Policy or our privacy practices, please contact us at:
                </p>
                <p className="font-semibold text-blue-600">
                  contact@finalgradecalculators.us
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
}