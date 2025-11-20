/**
 * Blog Layout Component
 * Wraps blog pages with navigation and footer
 */
import { Link } from 'react-router-dom';
import { BookOpen, Calculator } from 'lucide-react';

export default function BlogLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-primary/90 backdrop-blur-md border-b border-cardBorder shadow-lg">
        <div className="flex justify-between items-center p-4 md:p-6 max-w-7xl mx-auto">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center text-text hover:opacity-80 transition-opacity"
            aria-label="Return to home"
          >
            <span className="sr-only">CaseValue.law</span>
            <div className="hidden sm:flex flex-col leading-none text-left">
              <span className="text-2xl md:text-3xl font-serif tracking-tight text-text">case</span>
              <span className="relative mt-1 inline-flex">
                <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 border-2 border-[#FFA000] rounded-sm pointer-events-none z-0"></span>
                <span className="relative z-10 px-3 py-1 bg-gradient-gold text-textDark font-black uppercase tracking-tight text-2xl md:text-3xl rounded-sm">
                  value
                </span>
              </span>
              <span className="text-2xl md:text-3xl font-serif tracking-tight mt-1 self-end text-text">.law</span>
            </div>
            <div className="sm:hidden flex items-center gap-1 text-xl font-extrabold">
              <span className="text-text">case</span>
              <span className="relative inline-flex">
                <span className="absolute inset-0 translate-x-[3px] translate-y-[3px] border border-[#FFA000] rounded-sm pointer-events-none z-0"></span>
                <span className="relative z-10 px-2 py-0.5 bg-gradient-gold text-textDark rounded-sm">value</span>
              </span>
              <span className="text-text">.law</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-text/70 hover:text-text transition-colors font-semibold px-4 py-2 rounded-lg hover:bg-card/50"
            >
              Calculator
            </Link>
            <Link
              to="/blog"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/20 text-accent border-2 border-accent/40 font-semibold"
            >
              <BookOpen className="w-5 h-5" />
              <span className="hidden sm:inline">Blog</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary border-t border-cardBorder py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-textMuted text-sm">
            © {new Date().getFullYear()} CaseValue.law. For informational purposes only. Not legal advice.
          </p>
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <button className="text-textMuted hover:text-text transition-colors">
              Privacy Policy
            </button>
            <button className="text-textMuted hover:text-text transition-colors">
              Terms of Service
            </button>
          </div>
        </div>
      </footer>

      {/* Floating CTA Button */}
      <Link
        to="/"
        className="fixed bottom-8 right-8 z-40 group"
        aria-label="Calculate your case value"
      >
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-gold rounded-full blur-xl opacity-60 group-hover:opacity-80 transition-opacity animate-pulse"></div>

          {/* Button */}
          <div className="relative flex items-center gap-3 px-6 py-4 bg-gradient-gold text-textDark rounded-full shadow-glow-gold font-bold text-lg transition-all transform group-hover:scale-110 group-hover:shadow-glow-gold-soft">
            <Calculator className="w-6 h-6" />
            <span className="hidden sm:inline whitespace-nowrap">Calculate My Case Value</span>
            <span className="sm:hidden">Calculator</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
