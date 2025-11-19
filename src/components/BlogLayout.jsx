/**
 * Blog Layout Component
 * Wraps blog pages with navigation and footer
 */
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

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
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 border-2 border-blue-500/40 font-semibold"
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
      <footer className="bg-slate-900 border-t border-slate-800 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} CaseValue.law. For informational purposes only. Not legal advice.
          </p>
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <button className="text-gray-500 hover:text-gray-300 transition-colors">
              Privacy Policy
            </button>
            <button className="text-gray-500 hover:text-gray-300 transition-colors">
              Terms of Service
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
