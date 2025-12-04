import { Calculator, Menu, X } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

interface HeaderProps {
  activePage?: "final-grade" | "grade-calculator";
}

export default function Header({ activePage }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [, navigate] = useLocation();

  const navItems = [
    { label: "Final Grade", href: "/", id: "final-grade" },
    { label: "Grade Calculator", href: "/grade-calculator", id: "grade-calculator" },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .font-inter { font-family: 'Inter', sans-serif; }
        
        .nav-link {
          transition: all 0.2s ease;
          position: relative;
        }
        
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: #3b82f6;
          transition: width 0.2s ease;
        }
        
        .nav-link:hover::after {
          width: 100%;
        }
        
        .nav-link.active::after {
          width: 100%;
        }
      `}</style>

      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button 
              onClick={() => navigate("/")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                <Calculator className="w-5 h-5 text-white" />
              </div>
              <span className="font-inter font-bold text-gray-900 text-lg">GradeCalc</span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(item.href)}
                  className={`nav-link font-inter text-sm font-medium pb-1 ${
                    activePage === item.id
                      ? "text-blue-600 active"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-600" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col gap-3">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      navigate(item.href);
                      setMobileMenuOpen(false);
                    }}
                    className={`font-inter text-sm font-medium text-left px-4 py-2 rounded-lg transition-colors ${
                      activePage === item.id
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}