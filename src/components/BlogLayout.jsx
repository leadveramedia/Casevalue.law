/**
 * Blog Layout Component
 * Wraps blog pages with navigation and footer
 */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Calculator } from 'lucide-react';
import { getQuestionnaireLink } from '../utils/categoryToCaseType';
import { allStateSlugs, stateSlugToInfo } from '../constants/stateSlugMap';

export default function BlogLayout({ children, categories, ctaLink, hideWhenHeroCTAVisible }) {
  const [hideFloatingCTA, setHideFloatingCTA] = useState(hideWhenHeroCTAVisible);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(key => {
      const val = params.get(key);
      if (val) sessionStorage.setItem(key, val);
    });
  }, []);

  useEffect(() => {
    if (!hideWhenHeroCTAVisible) return;
    if (typeof IntersectionObserver === 'undefined') return;
    const hero = document.getElementById('hero-cta');
    const bottom = document.getElementById('bottom-cta');
    if (!hero && !bottom) return;
    const visibleSet = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) visibleSet.add(entry.target.id);
          else visibleSet.delete(entry.target.id);
        });
        setHideFloatingCTA(visibleSet.size > 0);
      },
      { threshold: 0.1 }
    );
    if (hero) observer.observe(hero);
    if (bottom) observer.observe(bottom);
    return () => observer.disconnect();
  }, [hideWhenHeroCTAVisible]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip to Main Content - Accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-6 focus:py-3 focus:bg-accent focus:text-textDark focus:rounded-lg focus:font-bold focus:shadow-lg focus:outline-none"
      >
        Skip to main content
      </a>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-primary/90 backdrop-blur-md border-b border-cardBorder/15 shadow-lg">
        <div className="flex justify-between items-center p-4 md:p-6 max-w-7xl mx-auto">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center text-text hover:opacity-80 transition-opacity"
            aria-label="CaseValue.law – Return to home"
          >
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
            {/* Calculator Link - Always show on blog pages */}
            <Link
              to="/"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/20 text-accent border-2 border-accent/40 font-semibold"
              aria-label="Go to calculator"
            >
              <Calculator className="w-5 h-5" />
              <span className="hidden sm:inline">Calculator</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main id="main-content" className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary border-t border-cardBorder/15 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4">
          {/* State Calculator Directory */}
          <div className="mb-8">
            <h3 className="text-xs font-semibold text-textMuted uppercase tracking-widest mb-4 text-center">
              State Calculators
            </h3>
            <div className="grid grid-flow-col grid-rows-[repeat(17,auto)] sm:grid-rows-[repeat(13,auto)] md:grid-rows-[repeat(9,auto)] gap-1">
              {allStateSlugs.map(stateSlug => (
                <Link
                  key={stateSlug}
                  to={`/states/${stateSlug}`}
                  className="text-xs text-textMuted hover:text-text transition-colors py-1 px-2 rounded hover:bg-card/40 text-center"
                >
                  {stateSlugToInfo[stateSlug].name}
                </Link>
              ))}
            </div>
          </div>

          {/* Copyright & Legal Links */}
          <div className="text-center border-t border-cardBorder/15 pt-6">
            <p className="text-textMuted text-sm">
              © {new Date().getFullYear()} CaseValue.law. For informational purposes only. Not legal advice.
            </p>
            <div className="mt-4 flex justify-center gap-6 text-sm">
              <Link
                to="/privacy"
                className="text-textMuted hover:text-text transition-colors underline"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-textMuted hover:text-text transition-colors underline"
              >
                Terms of Service
              </Link>
              <Link
                to="/methodology"
                className="text-textMuted hover:text-text transition-colors underline"
              >
                Methodology
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating CTA Button - Links to relevant case questionnaire */}
      <div className={`fixed inset-x-0 bottom-6 sm:bottom-8 z-40 flex justify-center pointer-events-none px-4 transition-opacity duration-300 ${hideFloatingCTA ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <Link
          to={ctaLink || getQuestionnaireLink(categories)}
          className={`${hideFloatingCTA ? '' : 'pointer-events-auto'} w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-10 py-4 bg-gradient-gold hover:opacity-90 text-textDark rounded-full text-base sm:text-xl font-extrabold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-accent/60 whitespace-nowrap`}
        >
          What's My Case Worth?
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
