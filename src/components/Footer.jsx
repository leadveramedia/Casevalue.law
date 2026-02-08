/**
 * Footer Component
 * Displays the site footer with links to privacy policy and terms of service
 */

export default function Footer({ t, onPrivacyClick, onTermsClick }) {
  return (
    <footer
      className="relative z-10 border-t-2 border-cardBorder mt-20 md:mt-32 py-10 text-center text-textMuted px-4 bg-primary/50 backdrop-blur min-h-[140px] md:min-h-[120px]"
      style={{ contentVisibility: 'auto', containIntrinsicSize: '0 140px' }}
    >
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
      </div>
      <p className="text-sm md:text-base text-textMuted">
        © 2025 CaseValue.law - {t.copyright}
      </p>
    </footer>
  );
}
