import { Calculator, Mail, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
        
        .font-inter { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }

        .footer-link {
          transition: all 0.2s ease;
        }

        .footer-link:hover {
          color: #3b82f6;
          transform: translateX(2px);
        }

        .social-button {
          transition: all 0.2s ease;
        }

        .social-button:hover {
          background: #3b82f6;
          color: #ffffff;
          transform: translateY(-2px);
        }
      `}</style>

      <footer className="border-t border-gray-200 bg-white">
        {/* Main Footer Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-5">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                <span className="font-inter font-bold text-gray-900 text-xl">GradeCalc</span>
              </div>
              <p className="font-inter text-sm text-gray-600 mb-6 leading-relaxed">
                Free, accurate grade calculators helping students plan smarter and achieve their academic goals.
              </p>
              {/* Social Icons */}
              <div className="flex items-center gap-3">
                <a 
                  href="https://twitter.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-button flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 text-gray-600"
                  aria-label="Follow us on Twitter"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a 
                  href="https://github.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-button flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 text-gray-600"
                  aria-label="Check our GitHub"
                >
                  <Github className="w-4 h-4" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-button flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 text-gray-600"
                  aria-label="Connect on LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a 
                  href="mailto:contact@finalgradecalculators.us" 
                  className="social-button flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 text-gray-600"
                  aria-label="Email us"
                >
                  <Mail className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Calculators Column */}
            <div>
              <h4 className="font-inter font-bold text-gray-900 mb-5 text-sm uppercase tracking-wider">Calculators</h4>
              <ul className="space-y-3">
                <li>
                  <a href="/" className="footer-link font-inter text-sm text-gray-600 flex items-center">
                    Final Grade Calculator
                  </a>
                </li>
                <li>
                  <a href="/grade-calculator" className="footer-link font-inter text-sm text-gray-600 flex items-center">
                    Grade Calculator
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h4 className="font-inter font-bold text-gray-900 mb-5 text-sm uppercase tracking-wider">Resources</h4>
              <ul className="space-y-3">
                <li>
                  <a href="/about" className="footer-link font-inter text-sm text-gray-600 flex items-center">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="/contact" className="footer-link font-inter text-sm text-gray-600 flex items-center">
                    Contact Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h4 className="font-inter font-bold text-gray-900 mb-5 text-sm uppercase tracking-wider">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <a href="/privacy" className="footer-link font-inter text-sm text-gray-600 flex items-center">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms" className="footer-link font-inter text-sm text-gray-600 flex items-center">
                    Terms of Service
                  </a>
                </li>
                
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-200">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="font-inter text-sm text-gray-500">
                © {currentYear} FinalGradeCalculators.us. All rights reserved.
              </p>
              <p className="font-inter text-sm text-gray-500">
                Made with care for students worldwide 🎓
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}