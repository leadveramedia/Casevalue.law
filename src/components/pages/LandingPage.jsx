/**
 * LandingPage Component
 * The main landing page with hero section, how it works, and trust factors
 */
import { useState, useEffect, useRef, memo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { ChevronRight, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { caseIdToSlug, caseTypeContent } from '../../constants/caseTypeSlugs';

const HOME_FAQS = [
  { q: 'How accurate is this calculator?', a: 'Our calculator analyzes 50+ data points including medical costs, lost wages, injury severity, and state-specific laws to generate estimates. While every case is unique, our methodology is based on thousands of real case outcomes across all 50 states.' },
  { q: 'What types of cases are covered?', a: 'We cover 16 practice areas including motor vehicle accidents, medical malpractice, workers\' compensation, premises liability, wrongful death, wrongful termination, and more. Each calculator is tailored to the specific factors that affect that case type.' },
  { q: 'Is my information private?', a: 'Yes. Your information is transmitted securely and is not stored on our servers. We do not sell or share your data. No account or login is required to use the calculator.' },
  { q: 'Is this legal advice?', a: 'No. This tool provides estimates for informational purposes only and does not constitute legal advice. Every case is unique, and you should consult with a licensed attorney before making legal decisions. Learn more about our data sources and calculation methods on our methodology page.' },
];

const homeFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": HOME_FAQS.map(faq => ({
    "@type": "Question",
    "name": faq.q,
    "acceptedAnswer": { "@type": "Answer", "text": faq.a }
  }))
};

function LandingPage({
  t,
  primaryCTARef,
  onGetStarted
}) {
  // Local state for counter animation - isolated to prevent parent re-renders
  const [hasAnimatedStats, setHasAnimatedStats] = useState(false);
  const [casesAnalyzedCount, setCasesAnalyzedCount] = useState(15000);
  const [openFAQ, setOpenFAQ] = useState(null);
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
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(homeFaqSchema)}</script>
      </Helmet>
      <div className="text-center space-y-6 md:space-y-8 px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-text bg-clip-text text-transparent leading-tight animate-fade-in">
          {t.title}
        </h1>
        <p className="text-xl sm:text-2xl md:text-3xl text-text/90 max-w-4xl mx-auto leading-relaxed">
          {t.subtitle}
        </p>
        <button
          ref={primaryCTARef}
          onClick={onGetStarted}
          className="group inline-flex items-center justify-center gap-2 sm:gap-3 px-6 sm:px-16 py-5 sm:py-6 bg-gradient-gold hover:opacity-90 text-textDark rounded-full text-xl sm:text-3xl font-extrabold shadow-glow-gold hover:shadow-glow-gold transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-accent/60 whitespace-nowrap"
        >
          {t.cta}
          <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8 group-hover:translate-x-2 transition-transform" aria-hidden="true" />
        </button>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm sm:text-base text-text/80">
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

        {/* Social Proof Trust Bar */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 py-4 px-6 mx-auto max-w-3xl rounded-2xl bg-card/40 border border-cardBorder/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm text-textMuted">
            <span className="text-green-400 font-bold" aria-hidden="true">&#10003;</span>
            <span>{t.socialProofCasesValued}</span>
          </div>
          <div className="hidden sm:block w-px h-5 bg-cardBorder" aria-hidden="true" />
          <div className="flex items-center gap-2 text-sm text-textMuted">
            <span className="text-orange-400 font-bold" aria-hidden="true">&#10003;</span>
            <span>{t.socialProofAccuracy}</span>
          </div>
          <div className="hidden sm:block w-px h-5 bg-cardBorder" aria-hidden="true" />
          <div className="flex items-center gap-2 text-sm text-textMuted">
            <span className="text-blue-400 font-bold" aria-hidden="true">&#10003;</span>
            <span>{t.socialProofPrivate}</span>
          </div>
          <div className="hidden sm:block w-px h-5 bg-cardBorder" aria-hidden="true" />
          <div className="flex items-center gap-2 text-sm text-textMuted">
            <span className="text-accent font-bold" aria-hidden="true">&#10003;</span>
            <span>{t.socialProofFree}</span>
          </div>
        </div>
      </div>

      <section ref={howItWorksRef} className="px-4">
        <div className="max-w-6xl mx-auto bg-card/60 backdrop-blur-xl rounded-3xl border-2 border-cardBorder/15 shadow-2xl p-8 sm:p-10 lg:p-14 space-y-12">
          <div className="space-y-4 text-center">
            <Link to="/methodology" className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-accent/20 text-accent border border-accent/60 font-semibold uppercase tracking-wider text-xs sm:text-sm hover:bg-accent/30 transition-colors">
              {t.methodology}
            </Link>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-text">
              {t.howItWorks}
            </h2>
            <p className="text-lg md:text-xl text-textMuted max-w-3xl mx-auto leading-relaxed">
              {t.methodologyIntro}
            </p>
          </div>

          <ul className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 list-none p-0 m-0">
            <li>
              <a
                href="https://casevalue.law/blog"
                className="bg-statBlue/20 rounded-2xl p-4 sm:p-6 text-center shadow-card border-2 border-statBlue/40 hover:border-statBlue hover:shadow-glow-cyan transition-all cursor-pointer block"
                aria-label={`50+ ${t.dataPoints} - View blog for details`}
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-statBlue mb-2 leading-tight tracking-tight break-words">
                  50+
                </div>
                <div className="text-xs sm:text-sm md:text-base text-text font-semibold tracking-wide uppercase">
                  {t.dataPoints}
                </div>
              </a>
            </li>
            <li>
              <a
                href="https://casevalue.law/blog"
                className="bg-statGreen/20 rounded-2xl p-4 sm:p-6 text-center shadow-card border-2 border-statGreen/40 hover:border-statGreen hover:shadow-glow-green transition-all cursor-pointer block"
                aria-label={`${casesAnalyzedCount.toLocaleString()} ${t.casesAnalyzed} - View blog for details`}
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-statGreen mb-2 leading-tight tracking-tight break-words">
                  {casesAnalyzedCount.toLocaleString()}
                </div>
                <div className="text-xs sm:text-sm md:text-base text-text font-semibold tracking-wide uppercase">
                  {t.casesAnalyzed}
                </div>
              </a>
            </li>
            <li>
              <a
                href="https://casevalue.law/blog"
                className="bg-statOrange/20 rounded-2xl p-4 sm:p-6 text-center shadow-card border-2 border-statOrange/40 hover:border-statOrange hover:shadow-glow-orange transition-all cursor-pointer block"
                aria-label={`99% ${t.accuracyRate} - View blog for details`}
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-statOrange mb-2 leading-tight tracking-tight break-words">
                  99%
                </div>
                <div className="text-xs sm:text-sm md:text-base text-text font-semibold tracking-wide uppercase">
                  {t.accuracyRate}
                </div>
              </a>
            </li>
            <li>
              <a
                href="https://casevalue.law/blog"
                className="bg-statPink/20 rounded-2xl p-4 sm:p-6 text-center shadow-card border-2 border-statPink/40 hover:border-statPink hover:shadow-glow-pink transition-all cursor-pointer block"
                aria-label={`50 ${t.stateSpecific} - View blog for details`}
              >
                <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-statPink mb-2 leading-tight tracking-tight break-words">
                  50
                </div>
                <div className="text-xs sm:text-sm md:text-base text-text font-semibold tracking-wide uppercase">
                  {t.stateSpecific}
                </div>
              </a>
            </li>
          </ul>

          <ol className="space-y-6 list-none p-0 m-0">
            {[1, 2, 3, 4].map((i) => (
              <li
                key={i}
                className="bg-methodBg border-2 border-methodBorder hover:border-methodNumber/40 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-5 md:gap-7 shadow-card hover:shadow-xl transition-all"
              >
                <div className="w-14 h-14 md:w-16 md:h-16 bg-methodNumber rounded-2xl flex items-center justify-center text-2xl md:text-3xl font-bold text-white shadow-lg flex-shrink-0" aria-hidden="true">
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
              </li>
            ))}
          </ol>

          <div className="bg-trustOuter border border-cardBorder/15 rounded-2xl p-6 md:p-8 shadow-card">
            <h3 className="text-2xl md:text-3xl font-bold text-text mb-6 text-center md:text-left">
              {t.trustFactors}
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: t.trustFactor1, text: t.trustFactor1Text },
                { title: t.trustFactor2, text: t.trustFactor2Text },
                { title: t.trustFactor3, text: t.trustFactor3Text }
              ].map((factor, i) => (
                <div key={i} className="bg-trustCard border border-cardBorder/15 rounded-2xl p-5 sm:p-6 shadow-card">
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

          <div className="bg-accent/10 border-2 border-accent/40 rounded-2xl p-6 md:p-8 shadow-card flex flex-col md:flex-row items-start gap-4">
            <AlertCircle className="w-8 h-8 md:w-10 md:h-10 text-accent flex-shrink-0" aria-hidden="true" />
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

      {/* Case Type Overview Grid */}
      <section className="px-4">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-text">
              Calculate Your Case Value
            </h2>
            <p className="text-lg text-textMuted max-w-2xl mx-auto">
              Select your case type for a free, instant estimate based on state-specific laws and real case data.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Object.entries(caseIdToSlug).map(([id, caseSlug]) => {
              const ct = caseTypeContent[id];
              if (!ct) return null;
              const label = ct.heading.replace(/ Case Value Calculator$/, '').replace(/ Settlement Calculator$/, '').replace(/ Claim Calculator$/, '').replace(/ Case Calculator$/, '').replace(/ Calculator$/, '');
              return (
                <Link
                  key={id}
                  to={`/calculator/${caseSlug}`}
                  className="group p-4 bg-card/50 border border-cardBorder/15 rounded-xl hover:border-accent/50 hover:bg-card/60 transition-all text-center"
                >
                  <h3 className="text-sm font-semibold text-text group-hover:text-accent transition-colors leading-snug">
                    {label}
                  </h3>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Homepage FAQ */}
      <section className="px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-text text-center">
            Frequently Asked Questions
          </h2>
          {HOME_FAQS.map((faq, i) => (
            <div key={i} className="bg-card/50 border border-cardBorder/15 rounded-xl overflow-hidden">
              <button
                onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-card/70 transition-colors"
                aria-expanded={openFAQ === i}
                aria-controls={`home-faq-${i}`}
              >
                <span className="font-semibold text-text text-base leading-snug">{faq.q}</span>
                {openFAQ === i
                  ? <ChevronUp className="w-5 h-5 text-accent shrink-0" aria-hidden="true" />
                  : <ChevronDown className="w-5 h-5 text-textMuted shrink-0" aria-hidden="true" />
                }
              </button>
              <div id={`home-faq-${i}`} hidden={openFAQ !== i} className="px-6 pb-5 text-textMuted leading-relaxed border-t border-cardBorder/15 pt-4">
                {faq.a}
              </div>
            </div>
          ))}
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
