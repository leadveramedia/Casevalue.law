/**
 * Navigation Component
 * Displays the site header with logo and language selector
 */
import { LANGUAGE_OPTIONS } from '../constants/languages';

export default function Navigation({ lang, onLanguageChange, onLogoClick }) {
  return (
    <nav className="sticky top-0 z-50 bg-primary/90 backdrop-blur-md border-b border-cardBorder shadow-lg">
      <div className="flex justify-between items-center p-4 md:p-6 max-w-7xl mx-auto">
        {/* Logo */}
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
    </nav>
  );
}
