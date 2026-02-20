/**
 * Navigation Component
 * Displays the site header with logo, blog link, and language selector
 */
import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LANGUAGE_OPTIONS } from '../constants/languages';
import { BookOpen, Calculator } from 'lucide-react';
import Logo from './Logo';

export default memo(function Navigation({ lang, onLanguageChange, onLogoClick }) {
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
            aria-label="CaseValue.law – Return to home"
          >
            <Logo />
          </button>
        ) : (
          <Link
            to="/#landing"
            className="flex items-center text-text hover:opacity-80 transition-opacity"
            aria-label="CaseValue.law – Return to home"
          >
            <Logo />
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
                aria-label={`${option.desktopLabel} – Switch to ${option.ariaLabel}`}
              >
                {option.desktopLabel}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
});
