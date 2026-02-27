/**
 * Footer Component
 * Displays the site footer with links to privacy policy, terms of service, and sitemap
 */
import { Link } from 'react-router-dom';

export default function Footer({ t, onPrivacyClick, onTermsClick, onGetStarted }) {
  return (
    <footer
      className="relative z-10 border-t-2 border-cardBorder mt-20 md:mt-32 py-10 text-center text-textMuted px-4 bg-primary/50 backdrop-blur min-h-[140px] md:min-h-[120px]"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 200px' }}
    >
      {onGetStarted && (
        <div className="mb-8 space-y-4">
          <p className="text-lg md:text-xl text-text font-semibold">
            {t.footerTagline}
          </p>
          <button
            onClick={onGetStarted}
            className="inline-flex items-center justify-center px-8 py-3 bg-gradient-gold hover:opacity-90 text-textDark rounded-full text-base font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
          >
            {t.footerCTA}
          </button>
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4">
        <button
          onClick={onPrivacyClick}
          className="text-accent hover:text-accentHover underline transition-colors text-base md:text-lg font-semibold"
        >
          {t.privacyPolicy}
        </button>
        <span className="hidden sm:inline text-textMuted/60" aria-hidden="true">|</span>
        <button
          onClick={onTermsClick}
          className="text-accent hover:text-accentHover underline transition-colors text-base md:text-lg font-semibold"
        >
          {t.termsOfService}
        </button>
        <span className="hidden sm:inline text-textMuted/60" aria-hidden="true">|</span>
        <Link
          to="/sitemap"
          className="text-accent hover:text-accentHover underline transition-colors text-base md:text-lg font-semibold"
        >
          {t.sitemap || 'Sitemap'}
        </Link>
      </div>
      <p className="text-sm md:text-base text-textMuted">
        © {new Date().getFullYear()} CaseValue.law - {t.copyright}
      </p>
    </footer>
  );
}
