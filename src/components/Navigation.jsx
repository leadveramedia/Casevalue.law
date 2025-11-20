/**
 * Navigation Component
 * Displays the site header with logo, blog link, and language selector
 */
import { Link, useLocation } from 'react-router-dom';
import { LANGUAGE_OPTIONS } from '../constants/languages';
import { BookOpen, Calculator } from 'lucide-react';

export default function Navigation({ lang, onLanguageChange, onLogoClick }) {
  const location = useLocation();
  const isOnBlog = location.pathname.startsWith('/blog');
  const isOnCalculator = location.pathname === '/';

  return (
    <nav className="sticky top-0 z-50 bg-primary/90 backdrop-blur-md border-b border-cardBorder shadow-lg">
      <div className="flex justify-between items-center p-4 md:p-6 max-w-7xl mx-auto">
        {/* Logo */}
        {isOnCalculator ? (
          <button
            onClick={onLogoClick}
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
          </button>
        ) : (
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
        )}

        {/* Navigation Links and Language Selector */}
        <div className="flex items-center gap-4">
          {/* Calculator Link - Only show when on blog */}
          {isOnBlog && (
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/20 text-accent border-2 border-accent/40 font-semibold"
              aria-label="Go to calculator"
            >
              <Calculator className="w-5 h-5" />
              <span className="hidden sm:inline">Calculator</span>
            </Link>
          )}

          {/* Blog Link - Only show when on calculator */}
          {isOnCalculator && (
            <Link
              to="/blog"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/20 text-accent border-2 border-accent/40 font-semibold"
              aria-label="Go to blog"
            >
              <BookOpen className="w-5 h-5" />
              <span className="hidden sm:inline">Blog</span>
            </Link>
          )}

          {/* Language Navigation - Always visible on all screen sizes */}
          <div className="flex items-center gap-1.5 bg-card/30 p-1 rounded-lg border border-cardBorder">
            {LANGUAGE_OPTIONS.map(option => (
              <button
                key={option.code}
                onClick={() => onLanguageChange(option.code)}
                className={`min-w-[44px] px-2 sm:px-3 py-1.5 rounded-md transition-all text-xs sm:text-sm font-bold uppercase ${
                  lang === option.code
                    ? 'bg-gradient-gold text-textDark shadow-md'
                    : 'bg-transparent hover:bg-card/50 text-text/70 hover:text-text'
                }`}
                aria-label={`Switch to ${option.ariaLabel}`}
              >
                {option.desktopLabel}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
