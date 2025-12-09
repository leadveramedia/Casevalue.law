/**
 * Blog Layout Component
 * Wraps blog pages with navigation and footer
 */
import { useState, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Calculator } from 'lucide-react';
import { getQuestionnaireLink } from '../utils/categoryToCaseType';

// Lazy load legal documents
const PrivacyPolicy = lazy(() => import('./PrivacyPolicy'));
const TermsOfService = lazy(() => import('./TermsOfService'));

export default function BlogLayout({ children, categories }) {
  const [showPrivacyPage, setShowPrivacyPage] = useState(false);
  const [showTermsPage, setShowTermsPage] = useState(false);

  // Show Privacy Policy as full-page overlay
  if (showPrivacyPage) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <PrivacyPolicy
          lang="en"
          onClose={() => setShowPrivacyPage(false)}
        />
      </Suspense>
    );
  }

  // Show Terms of Service as full-page overlay
  if (showTermsPage) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <TermsOfService
          lang="en"
          onClose={() => setShowTermsPage(false)}
        />
      </Suspense>
    );
  }

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
      <footer className="bg-primary border-t border-cardBorder py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-textMuted text-sm">
            © {new Date().getFullYear()} CaseValue.law. For informational purposes only. Not legal advice.
          </p>
          <div className="mt-4 flex justify-center gap-6 text-sm">
            <button
              onClick={() => setShowPrivacyPage(true)}
              className="text-textMuted hover:text-text transition-colors underline"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setShowTermsPage(true)}
              className="text-textMuted hover:text-text transition-colors underline"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </footer>

      {/* Floating CTA Button - Links to relevant case questionnaire */}
      <div className="fixed inset-x-0 bottom-6 sm:bottom-8 z-40 flex justify-center pointer-events-none px-4">
        <Link
          to={getQuestionnaireLink(categories)}
          className="pointer-events-auto w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-10 py-4 bg-gradient-gold hover:opacity-90 text-textDark rounded-full text-base sm:text-xl font-extrabold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-accent/60 whitespace-nowrap"
          aria-label="Calculate your case value"
        >
          What's My Case Worth?
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </Link>
      </div>
    </div>
  );
}
