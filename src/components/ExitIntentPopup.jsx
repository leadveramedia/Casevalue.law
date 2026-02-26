/**
 * Exit-Intent Popup Component
 * Shows a re-engagement popup when users are about to leave the landing page.
 * Desktop: triggers on mouseout from viewport top.
 * Mobile: triggers after 30s of inactivity.
 * Shows once per session (sessionStorage).
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronRight } from 'lucide-react';

const SESSION_KEY = 'exitIntentShown';

const translations = {
  en: {
    headline: "Wait — Don't Leave Yet!",
    subtext: "Find out what your case is worth in just 2 minutes. It's free, private, and no obligation.",
    cta: "Get My Free Case Valuation",
    dismiss: "No thanks, I'll come back later",
  },
  es: {
    headline: "Espere — ¡No se vaya todavía!",
    subtext: "Descubra el valor de su caso en solo 2 minutos. Es gratis, privado y sin compromiso.",
    cta: "Obtener Mi Valoración Gratis",
    dismiss: "No gracias, volveré más tarde",
  },
  zh: {
    headline: "请等一下！",
    subtext: "只需2分钟即可了解您的案件价值。完全免费、隐私安全、无任何义务。",
    cta: "获取免费案件估值",
    dismiss: "不用了，我稍后再来",
  },
};

const ExitIntentPopup = ({ lang = 'en', onGetStarted }) => {
  const [isVisible, setIsVisible] = useState(false);
  const hasTriggered = useRef(false);
  const inactivityTimer = useRef(null);
  const t = translations[lang] || translations.en;

  const showPopup = useCallback(() => {
    if (hasTriggered.current) return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    hasTriggered.current = true;
    sessionStorage.setItem(SESSION_KEY, 'true');
    setIsVisible(true);
  }, []);

  const dismiss = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleCTA = useCallback(() => {
    setIsVisible(false);
    onGetStarted?.();
  }, [onGetStarted]);

  // Desktop: mouseout from top of viewport
  useEffect(() => {
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0) {
        showPopup();
      }
    };
    document.addEventListener('mouseout', handleMouseLeave);
    return () => document.removeEventListener('mouseout', handleMouseLeave);
  }, [showPopup]);

  // Mobile: inactivity timeout (30s)
  useEffect(() => {
    const isMobile = window.matchMedia('(pointer: coarse)').matches;
    if (!isMobile) return;

    const resetTimer = () => {
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
      inactivityTimer.current = setTimeout(showPopup, 30000);
    };

    const events = ['touchstart', 'scroll'];
    events.forEach(evt => document.addEventListener(evt, resetTimer, { passive: true }));
    resetTimer();

    return () => {
      events.forEach(evt => document.removeEventListener(evt, resetTimer));
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
  }, [showPopup]);

  // Keyboard: Escape to dismiss + focus trapping
  useEffect(() => {
    if (!isVisible) return;
    const previousFocus = document.activeElement;
    // Focus the first button in the dialog
    requestAnimationFrame(() => {
      const dialog = document.getElementById('exit-intent-dialog');
      if (dialog) {
        const firstBtn = dialog.querySelector('button');
        if (firstBtn) firstBtn.focus();
      }
    });

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') { dismiss(); return; }
      if (e.key === 'Tab') {
        const dialog = document.getElementById('exit-intent-dialog');
        if (!dialog) return;
        const focusable = dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocus && previousFocus.focus) previousFocus.focus();
    };
  }, [isVisible, dismiss]);

  // Lock body scroll when visible
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = ''; };
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-intent-title"
      onClick={dismiss}
    >
      <div
        id="exit-intent-dialog"
        className="bg-card rounded-3xl w-full max-w-lg border-2 border-accent/40 shadow-card animate-scale-in p-8 text-center space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="exit-intent-title" className="text-2xl md:text-3xl font-bold text-text">
          {t.headline}
        </h2>
        <p className="text-base md:text-lg text-textMuted leading-relaxed">
          {t.subtext}
        </p>
        <button
          onClick={handleCTA}
          className="group w-full inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-gold hover:opacity-90 text-textDark rounded-full text-lg font-extrabold shadow-glow-gold hover:shadow-glow-gold transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-accent/60"
        >
          {t.cta}
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
        </button>
        <button
          onClick={dismiss}
          className="block mx-auto text-sm text-textMuted hover:text-text transition-colors underline"
        >
          {t.dismiss}
        </button>
      </div>
    </div>
  );
};

export default ExitIntentPopup;
