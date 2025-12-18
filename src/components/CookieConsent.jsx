import { useState, useEffect } from 'react';

const CookieConsent = ({ onAccept, onDecline, onPrivacyClick, lang = 'en' }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show banner after a brief delay
      setTimeout(() => setIsVisible(true), 1000);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
    onAccept?.();
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
    onDecline?.();
  };

  const translations = {
    en: {
      title: "We Value Your Privacy",
      message: "We use cookies for analytics (Google Analytics, Microsoft Clarity) and conversion tracking (Google Ads, Facebook, Bing, LinkedIn) to improve your experience and measure advertising effectiveness.",
      accept: "Accept",
      decline: "Decline",
      learnMore: "Learn more in our",
      privacyPolicy: "Privacy Policy"
    },
    es: {
      title: "Valoramos Tu Privacidad",
      message: "Utilizamos cookies para análisis (Google Analytics, Microsoft Clarity) y seguimiento de conversiones (Google Ads, Facebook, Bing, LinkedIn) para mejorar tu experiencia y medir la efectividad de la publicidad.",
      accept: "Aceptar",
      decline: "Rechazar",
      learnMore: "Más información en nuestra",
      privacyPolicy: "Política de Privacidad"
    },
    zh: {
      title: "我们重视您的隐私",
      message: "我们使用分析cookies（Google Analytics、Microsoft Clarity）和转化跟踪（Google Ads、Facebook、Bing、LinkedIn）来改善您的体验并衡量广告效果。",
      accept: "接受",
      decline: "拒绝",
      learnMore: "了解更多请查看我们的",
      privacyPolicy: "隐私政策"
    }
  };

  const t = translations[lang] || translations.en;

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[100] p-4 sm:p-6 pointer-events-none animate-fade-in"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
    >
      <div className="max-w-6xl mx-auto pointer-events-auto">
        <div className="bg-white border-2 border-cardBorder rounded-2xl shadow-legal-lg p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Cookie Icon */}
            <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-2xl">
              🍪
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-text mb-2">
                {t.title}
              </h3>
              <p className="text-sm sm:text-base text-textMuted leading-relaxed">
                {t.message}{' '}
                <button
                  onClick={() => {
                    onPrivacyClick?.();
                  }}
                  className="text-accent hover:text-accentHover underline font-semibold"
                >
                  {t.learnMore} {t.privacyPolicy}
                </button>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={handleDecline}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-semibold text-text transition-all text-sm sm:text-base border-2 border-cardBorder"
              >
                {t.decline}
              </button>
              <button
                onClick={handleAccept}
                className="px-6 py-3 bg-accent hover:bg-accentHover rounded-xl font-bold text-white shadow-legal-md transition-all transform hover:scale-105 text-sm sm:text-base"
              >
                {t.accept}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
