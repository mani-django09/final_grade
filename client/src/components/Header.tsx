import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

interface HeaderProps {
  activePage?: "final-grade" | "grade-calculator" | "gpa-calculator" | "test-grade-calculator";
}

export default function Header({ activePage }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Final Grade", href: "/", id: "final-grade" },
    { label: "Grade Calculator", href: "/grade-calculator", id: "grade-calculator" },
    { label: "GPA Calculator", href: "/gpa-calculator", id: "gpa-calculator" },
    { label: "Test Grade", href: "/test-grade-calculator", id: "test-grade-calculator" },
  ];

  return (
    <>
      <style>{`
        .logo-text {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
          font-size: 1.2rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1;
          background: linear-gradient(135deg, #1e1b4b 0%, #4f46e5 50%, #3b82f6 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: opacity 0.15s ease;
        }

        .logo-text:hover {
          opacity: 0.8;
        }

        .logo-text .grade {
          color: #4f46e5;
        }

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
          background: linear-gradient(90deg, #4f46e5, #3b82f6);
          border-radius: 2px;
          transition: width 0.2s ease;
        }

        .nav-link:hover::after { width: 100%; }
        .nav-link.active::after { width: 100%; }
      `}</style>

      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span className="logo-text">
                FinalGrade<span style={{ background: 'linear-gradient(135deg, #4f46e5, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Calculator</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`nav-link font-inter text-sm font-medium pb-1 ${
                    activePage === item.id
                      ? "text-blue-600 active"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {item.label}
                </Link>
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
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`font-inter text-sm font-medium text-left px-4 py-2 rounded-lg transition-colors ${
                      activePage === item.id
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </nav>
      </header>
    </>
  );
}