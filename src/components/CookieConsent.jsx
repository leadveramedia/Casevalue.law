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
      message: "We use cookies and similar technologies to improve your experience, analyze site usage, and assist in our marketing efforts. We only use analytics cookies (Google Analytics, Microsoft Clarity) to understand how visitors use our site.",
      accept: "Accept",
      decline: "Decline",
      learnMore: "Learn more in our",
      privacyPolicy: "Privacy Policy"
    },
    es: {
      title: "Valoramos Tu Privacidad",
      message: "Utilizamos cookies y tecnologías similares para mejorar tu experiencia, analizar el uso del sitio y ayudar en nuestros esfuerzos de marketing. Solo usamos cookies analíticas (Google Analytics, Microsoft Clarity).",
      accept: "Aceptar",
      decline: "Rechazar",
      learnMore: "Más información en nuestra",
      privacyPolicy: "Política de Privacidad"
    },
    zh: {
      title: "我们重视您的隐私",
      message: "我们使用cookies和类似技术来改善您的体验、分析网站使用情况并协助我们的营销工作。我们仅使用分析cookies（Google Analytics、Microsoft Clarity）。",
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
        <div className="bg-gradient-to-r from-slate-900 to-blue-900 border-2 border-blue-400/40 rounded-2xl shadow-2xl backdrop-blur-xl p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {/* Cookie Icon */}
            <div className="flex-shrink-0 w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-2xl">
              🍪
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                {t.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                {t.message}{' '}
                <button
                  onClick={() => {
                    onPrivacyClick?.();
                  }}
                  className="text-blue-400 hover:text-blue-300 underline font-semibold"
                >
                  {t.learnMore} {t.privacyPolicy}
                </button>
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={handleDecline}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold text-white transition-all text-sm sm:text-base"
              >
                {t.decline}
              </button>
              <button
                onClick={handleAccept}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-105 text-sm sm:text-base"
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
