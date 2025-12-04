import { Calculator, FileText, AlertTriangle, Scale, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsOfService() {
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
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h2 className="font-jakarta font-extrabold text-4xl sm:text-5xl text-white mb-4 leading-tight">
              Terms of Service
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
            <h3 className="font-jakarta font-bold text-xl text-white mb-4">The Short Version</h3>
            <div className="space-y-3 font-jakarta text-blue-100/80">
              <div className="flex gap-3">
                <span className="text-blue-400">✓</span>
                <p>Our calculators are free tools to help you plan your academics</p>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-400">✓</span>
                <p>We provide these tools "as is" without guarantees</p>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-400">✓</span>
                <p>You're responsible for verifying results with your instructor</p>
              </div>
              <div className="flex gap-3">
                <span className="text-blue-400">✓</span>
                <p>Use our service responsibly and don't try to break it</p>
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
                <h3 className="font-bold text-2xl text-slate-900 mb-4">Agreement to Terms</h3>
                <p className="leading-relaxed">
                  Welcome to Final Grade Calculators (finalgradecalculators.us). By accessing or using our website and calculator tools, you agree to be bound by these Terms of Service. If you don't agree with any part of these terms, please don't use our service.
                </p>
              </div>

              {/* Description of Service */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-2xl text-slate-900">Description of Service</h3>
                </div>
                <p className="leading-relaxed mb-4">
                  Final Grade Calculators provides free online tools to help students calculate their grades and determine what scores they need on future assignments or exams. Our service includes:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="leading-relaxed">Final Grade Calculator: Calculate what score you need on your final exam to achieve your desired course grade</li>
                  <li className="leading-relaxed">Grade Calculator: Calculate your overall course grade based on multiple weighted assignments</li>
                  <li className="leading-relaxed">Educational resources and tips related to grade calculation and academic planning</li>
                </ul>
              </div>

              {/* Use of Service */}
              <div>
                <h3 className="font-bold text-2xl text-slate-900 mb-4">Acceptable Use</h3>
                <p className="leading-relaxed mb-4">
                  When using our service, you agree to:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="leading-relaxed">Use our calculators for legitimate academic planning purposes</li>
                  <li className="leading-relaxed">Provide accurate input data for meaningful results</li>
                  <li className="leading-relaxed">Verify all calculations with your instructor or academic institution</li>
                  <li className="leading-relaxed">Not use automated systems or bots to access our service</li>
                  <li className="leading-relaxed">Not attempt to interfere with or disrupt our service</li>
                  <li className="leading-relaxed">Not use our service for any illegal purpose</li>
                </ul>
              </div>

              {/* Accuracy Disclaimer */}
              <div className="bg-amber-50 rounded-xl p-6 border-2 border-amber-200">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-xl text-slate-900 mb-3">Important: Accuracy and Verification</h3>
                    <p className="leading-relaxed mb-3">
                      While we strive for accuracy, our calculators are <strong>educational tools only</strong>. They cannot account for:
                    </p>
                    <ul className="space-y-2 ml-6 mb-3">
                      <li className="leading-relaxed">Grading curves or adjustments made by your instructor</li>
                      <li className="leading-relaxed">Extra credit opportunities</li>
                      <li className="leading-relaxed">Dropped assignments or exams</li>
                      <li className="leading-relaxed">Special grading policies specific to your course</li>
                      <li className="leading-relaxed">Rounding methods used by your institution</li>
                    </ul>
                    <p className="leading-relaxed font-semibold">
                      Always verify grade calculations with your instructor or syllabus. Do not rely solely on our calculators for academic decisions.
                    </p>
                  </div>
                </div>
              </div>

              {/* No Warranties */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-slate-100">
                    <Scale className="w-5 h-5 text-slate-600" />
                  </div>
                  <h3 className="font-bold text-2xl text-slate-900">Disclaimer of Warranties</h3>
                </div>
                <p className="leading-relaxed mb-4">
                  Our service is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="leading-relaxed">Our service will be uninterrupted, secure, or error-free</li>
                  <li className="leading-relaxed">The results from our calculators will be accurate, complete, or reliable</li>
                  <li className="leading-relaxed">Any errors in the service will be corrected</li>
                  <li className="leading-relaxed">Our calculators will meet your specific needs or expectations</li>
                </ul>
              </div>

              {/* Limitation of Liability */}
              <div>
                <h3 className="font-bold text-2xl text-slate-900 mb-4">Limitation of Liability</h3>
                <p className="leading-relaxed mb-4">
                  To the fullest extent permitted by law, Final Grade Calculators and its operators shall not be liable for any:
                </p>
                <ul className="space-y-2 ml-6">
                  <li className="leading-relaxed">Indirect, incidental, special, consequential, or punitive damages</li>
                  <li className="leading-relaxed">Loss of grades, academic standing, or educational opportunities</li>
                  <li className="leading-relaxed">Damages resulting from your use or inability to use our service</li>
                  <li className="leading-relaxed">Damages resulting from reliance on information provided by our calculators</li>
                  <li className="leading-relaxed">Errors, mistakes, or inaccuracies in calculator results</li>
                </ul>
                <p className="leading-relaxed mt-4">
                  You acknowledge that you use our service at your own risk and are solely responsible for verifying any calculations or recommendations.
                </p>
              </div>

              {/* Intellectual Property */}
              <div>
                <h3 className="font-bold text-2xl text-slate-900 mb-4">Intellectual Property</h3>
                <p className="leading-relaxed">
                  The content, features, and functionality of Final Grade Calculators, including but not limited to text, graphics, logos, and software, are owned by us or our licensors and are protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, distribute, or create derivative works from our service without express written permission.
                </p>
              </div>

              {/* User Content */}
              <div>
                <h3 className="font-bold text-2xl text-slate-900 mb-4">User Input and Privacy</h3>
                <p className="leading-relaxed">
                  Any information you input into our calculators (such as grades and weights) is processed locally in your browser and is not transmitted to or stored on our servers. We do not collect, store, or share your grade data. For more information, please review our Privacy Policy.
                </p>
              </div>

              {/* Third-Party Links */}
              <div>
                <h3 className="font-bold text-2xl text-slate-900 mb-4">Third-Party Links and Services</h3>
                <p className="leading-relaxed">
                  Our service may contain links to third-party websites or services. We are not responsible for the content, privacy policies, or practices of any third-party sites. Your use of third-party services is at your own risk.
                </p>
              </div>

              {/* Changes to Service */}
              <div>
                <h3 className="font-bold text-2xl text-slate-900 mb-4">Modifications to Service</h3>
                <p className="leading-relaxed">
                  We reserve the right to modify, suspend, or discontinue our service at any time without notice. We may also update these Terms of Service periodically. Continued use of our service after changes constitutes acceptance of the modified terms.
                </p>
              </div>

              {/* Termination */}
              <div>
                <h3 className="font-bold text-2xl text-slate-900 mb-4">Termination</h3>
                <p className="leading-relaxed">
                  We reserve the right to terminate or restrict your access to our service at any time, without notice, for any reason, including but not limited to violation of these Terms of Service or engaging in fraudulent, abusive, or illegal activity.
                </p>
              </div>

              {/* Governing Law */}
              <div>
                <h3 className="font-bold text-2xl text-slate-900 mb-4">Governing Law</h3>
                <p className="leading-relaxed">
                  These Terms of Service shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions. Any disputes arising from these terms or your use of our service shall be resolved in the appropriate courts.
                </p>
              </div>

              {/* Severability */}
              <div>
                <h3 className="font-bold text-2xl text-slate-900 mb-4">Severability</h3>
                <p className="leading-relaxed">
                  If any provision of these Terms of Service is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.
                </p>
              </div>

              {/* Entire Agreement */}
              <div>
                <h3 className="font-bold text-2xl text-slate-900 mb-4">Entire Agreement</h3>
                <p className="leading-relaxed">
                  These Terms of Service, together with our Privacy Policy, constitute the entire agreement between you and Final Grade Calculators regarding your use of our service.
                </p>
              </div>

              {/* Contact Information */}
              <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-100">
                <h3 className="font-bold text-2xl text-slate-900 mb-3">Questions About These Terms?</h3>
                <p className="leading-relaxed mb-3">
                  If you have any questions or concerns about these Terms of Service, please contact us at:
                </p>
                <p className="font-semibold text-blue-600">
                  contact@finalgradecalculators.us
                </p>
                <p className="leading-relaxed mt-4 text-sm text-slate-600">
                  By using Final Grade Calculators, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
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