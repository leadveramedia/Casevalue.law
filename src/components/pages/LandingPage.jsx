/**
 * LandingPage Component
 * The main landing page with hero section, how it works, and trust factors
 */
import { useState, useEffect, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import { ChevronRight, AlertCircle } from 'lucide-react';

function LandingPage({
  t,
  primaryCTARef,
  onGetStarted
}) {
  // Local state for counter animation - isolated to prevent parent re-renders
  const [hasAnimatedStats, setHasAnimatedStats] = useState(false);
  const [casesAnalyzedCount, setCasesAnalyzedCount] = useState(15000);
  const howItWorksRef = useRef(null);

  // Trigger animation when "How It Works" section comes into view
  useEffect(() => {
    if (hasAnimatedStats) return;
    const section = howItWorksRef.current;
    if (!section) return;

    if (typeof IntersectionObserver === 'undefined') {
      setHasAnimatedStats(true);
      setCasesAnalyzedCount(15000);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCasesAnalyzedCount(15000);
            setHasAnimatedStats(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, [hasAnimatedStats]);

  // Animate counter from 15000 to 25000
  useEffect(() => {
    if (!hasAnimatedStats) return;
    const targetValue = 25000;
    const speedPerSecond = 10;
    let lastTimestamp = null;
    let currentValue = 15000;
    let animationFrame = null;

    const animate = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaSeconds = (timestamp - lastTimestamp) / 1000;
      lastTimestamp = timestamp;
      currentValue = Math.min(targetValue, currentValue + deltaSeconds * speedPerSecond);
      setCasesAnalyzedCount(Math.round(currentValue));
      if (currentValue < targetValue) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [hasAnimatedStats]);

  return (
    <div className="space-y-16 md:space-y-20 py-8 md:py-16 lg:py-24">
      <div className="text-center space-y-6 md:space-y-8 px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-text leading-tight animate-fade-in">
          {t.title}
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl text-textMuted max-w-4xl mx-auto leading-relaxed">
          {t.subtitle}
        </p>
        <button
          ref={primaryCTARef}
          onClick={onGetStarted}
          className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-16 py-5 sm:py-6 bg-accent hover:bg-accentHover text-white rounded-lg text-xl sm:text-3xl font-extrabold shadow-legal-lg hover:shadow-legal-lg transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-accent/40 whitespace-nowrap"
        >
          {t.cta}
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 group-hover:translate-x-2 transition-transform" />
        </button>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm sm:text-base text-textMuted">
          <div className="flex items-center gap-2">
            <span role="img" aria-hidden="true" className="text-xl">⚡</span>
            <span className="font-medium">{t.instantResults}</span>
          </div>
          <div className="flex items-center gap-2">
            <span role="img" aria-hidden="true" className="text-xl">📊</span>
            <span className="font-medium">{t.dataDriven}</span>
          </div>
          <div className="flex items-center gap-2">
            <span role="img" aria-hidden="true" className="text-xl">🔒</span>
            <span className="font-medium">{t.confidential}</span>
          </div>
        </div>
      </div>

      <section ref={howItWorksRef} className="px-4">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-cardBorder shadow-legal-lg p-8 sm:p-10 lg:p-14 space-y-12">
          <div className="space-y-4 text-center">
            <span className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent border border-accent font-semibold uppercase tracking-wider text-xs sm:text-sm">
              {t.methodology}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text">
              {t.howItWorks}
            </h2>
            <p className="text-lg md:text-xl text-textMuted max-w-3xl mx-auto leading-relaxed">
              {t.methodologyIntro}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-blue-50 rounded-xl p-4 sm:p-6 text-center shadow-legal-sm border border-blue-200 hover:border-blue-400 hover:shadow-legal-md transition-all">
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-statBlue mb-2 leading-tight tracking-tight break-words">
                50+
              </div>
              <div className="text-xs sm:text-sm md:text-base text-text font-semibold tracking-wide uppercase">
                {t.dataPoints}
              </div>
            </div>
            <div className="bg-green-50 rounded-xl p-4 sm:p-6 text-center shadow-legal-sm border border-green-200 hover:border-green-400 hover:shadow-legal-md transition-all">
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-statGreen mb-2 leading-tight tracking-tight break-words">
                {casesAnalyzedCount.toLocaleString()}
              </div>
              <div className="text-xs sm:text-sm md:text-base text-text font-semibold tracking-wide uppercase">
                {t.casesAnalyzed}
              </div>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 sm:p-6 text-center shadow-legal-sm border border-amber-200 hover:border-amber-400 hover:shadow-legal-md transition-all">
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-statOrange mb-2 leading-tight tracking-tight break-words">
                99%
              </div>
              <div className="text-xs sm:text-sm md:text-base text-text font-semibold tracking-wide uppercase">
                {t.accuracyRate}
              </div>
            </div>
            <div className="bg-pink-50 rounded-xl p-4 sm:p-6 text-center shadow-legal-sm border border-pink-200 hover:border-pink-400 hover:shadow-legal-md transition-all">
              <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-statPink mb-2 leading-tight tracking-tight break-words">
                50
              </div>
              <div className="text-xs sm:text-sm md:text-base text-text font-semibold tracking-wide uppercase">
                {t.stateSpecific}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-gray-50 border border-cardBorder hover:border-accent/40 rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-5 md:gap-7 shadow-legal-sm hover:shadow-legal-md transition-all"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-accent rounded-xl flex items-center justify-center text-2xl md:text-3xl font-bold text-white shadow-legal-sm flex-shrink-0">
                  {i}
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl md:text-3xl font-bold text-text">
                    {t[`methodSection${i}Title`]}
                  </h3>
                  <p className="text-base md:text-lg text-textMuted leading-relaxed">
                    {t[`methodSection${i}Text`]}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 border border-cardBorder rounded-xl p-6 md:p-8 shadow-legal-sm">
            <h3 className="text-2xl md:text-3xl font-bold text-text mb-6 text-center md:text-left">
              {t.trustFactors}
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: t.trustFactor1, text: t.trustFactor1Text },
                { title: t.trustFactor2, text: t.trustFactor2Text },
                { title: t.trustFactor3, text: t.trustFactor3Text }
              ].map((factor, i) => (
                <div key={i} className="bg-white border border-cardBorder rounded-xl p-5 sm:p-6 shadow-legal-sm">
                  <h4 className="text-xl font-bold text-text mb-3">
                    {factor.title}
                  </h4>
                  <p className="text-sm sm:text-base text-textMuted leading-relaxed">
                    {factor.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 md:p-8 shadow-legal-sm flex flex-col md:flex-row items-start gap-4">
            <AlertCircle className="w-8 h-8 md:w-10 md:h-10 text-accent flex-shrink-0" />
            <div className="space-y-3">
              <h3 className="text-xl md:text-2xl font-bold text-accent">
                {t.limitationsTitle}
              </h3>
              <p className="text-base md:text-lg text-textMuted leading-relaxed">
                {t.limitationsText}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

LandingPage.propTypes = {
  t: PropTypes.object.isRequired,
  primaryCTARef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) })
  ]),
  onGetStarted: PropTypes.func.isRequired
};

export default memo(LandingPage);
