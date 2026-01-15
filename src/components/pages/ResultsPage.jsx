/**
 * ResultsPage Component
 * Displays the case valuation results with factors and disclaimer
 * Also handles shared results and expired share links
 */
import { memo, useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { Check, AlertCircle, Share2, CheckCircle, Clock, Copy } from 'lucide-react';
import { SHARED_STYLES } from '../shared/sharedStyles';

function ResultsPage({
  t,
  valuation,
  onBack,
  isSharedResult = false,
  sharedLinkExpired = false,
  sharedLinkDaysRemaining = null,
  selectedCase,
  selectedState,
  onGenerateShareUrl
}) {
  const [linkCopied, setLinkCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState(null);
  const inputRef = useRef(null);

  const handleShowShareUrl = useCallback(async () => {
    if (!onGenerateShareUrl) return;
    const url = onGenerateShareUrl();

    // Use native share on mobile if available
    if (navigator.share) {
      try {
        await navigator.share({
          title: t.shareTitle || 'My Case Value Estimate',
          text: t.shareText || 'Check out my case value estimate from CaseValue.law',
          url: url
        });
        return; // Don't show input field after native share
      } catch (err) {
        // User cancelled or share failed - fall back to showing URL
        if (err.name === 'AbortError') return; // User cancelled, do nothing
        // Other errors: fall through to show URL input
      }
    }

    // Fallback: show URL input field (desktop or share failed)
    setShareUrl(url);
  }, [onGenerateShareUrl, t]);

  const handleCopyLink = useCallback(async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 3000);
    } catch (err) {
      // Fallback for older browsers
      if (inputRef.current) {
        inputRef.current.select();
        document.execCommand('copy');
        setLinkCopied(true);
        setTimeout(() => setLinkCopied(false), 3000);
      }
    }
  }, [shareUrl]);

  // Handle expired link
  if (sharedLinkExpired) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-xl rounded-3xl p-8 md:p-12 border-2 border-red-500/40 shadow-2xl text-center">
          <Clock className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-300 mb-4">
            {t.linkExpired}
          </h2>
          <p className="text-base md:text-lg text-text/80 mb-8 leading-relaxed">
            {t.linkExpiredMessage}
          </p>
          <button
            onClick={onBack}
            className="px-8 py-4 bg-gradient-gold hover:opacity-90 text-textDark rounded-xl shadow-2xl hover:shadow-accent/50 transition-all font-bold text-lg transform hover:scale-105"
          >
            {t.generateNewEstimate}
          </button>
        </div>
      </div>
    );
  }

  // Handle Texas non-subscriber referral (workers' comp special case)
  if (valuation?.referOut) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        <button
          onClick={onBack}
          className={SHARED_STYLES.backToHomeButton}
        >
          {t.backHome}
        </button>

        <div className="bg-gradient-to-br from-red-500/20 to-orange-500/20 backdrop-blur-xl rounded-3xl p-8 md:p-12 border-2 border-red-500/40 shadow-2xl text-center">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-6" />
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-300 mb-4">
            {t.attorneyConsultationNeeded || 'Attorney Consultation Needed'}
          </h2>
          <div className="space-y-4 mb-8 text-left">
            {valuation.factors.map((f, i) => (
              <p key={i} className="text-base md:text-lg text-text/80 leading-relaxed flex items-start gap-3">
                <span className="text-red-400 mt-1 flex-shrink-0">•</span>
                <span>{f}</span>
              </p>
            ))}
          </div>
          {valuation.warnings && valuation.warnings.length > 0 && (
            <div className="bg-red-500/30 border-2 border-red-500/50 rounded-xl p-5 mb-8">
              {valuation.warnings.map((w, i) => (
                <p key={i} className="text-base md:text-lg text-red-100 leading-relaxed font-semibold mb-2 last:mb-0">
                  {w}
                </p>
              ))}
            </div>
          )}
          <button
            onClick={onBack}
            className="px-8 py-4 bg-gradient-gold hover:opacity-90 text-textDark rounded-xl shadow-2xl hover:shadow-accent/50 transition-all font-bold text-lg transform hover:scale-105"
          >
            {t.backHome}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Back to Home Button */}
      <button
        onClick={onBack}
        className={SHARED_STYLES.backToHomeButton}
      >
        {t.backHome}
      </button>

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 px-4 text-text">
        {isSharedResult ? t.sharedResults : t.yourEstimate}
      </h2>

      {/* Valuation Card */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border-2 border-accent/40 shadow-2xl">
        <div className="text-center mb-10">
          <div className="text-text/70 mb-3 text-xl font-semibold">{t.range}</div>
          <div className="overflow-x-auto pb-2 -mx-4 px-4">
            <div className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-accent whitespace-nowrap mb-4 inline-block min-w-full text-center">
              ${valuation.value.toLocaleString()} USD
            </div>
          </div>
          <div className="text-base sm:text-lg text-text/60 overflow-x-auto pb-2">
            <div className="whitespace-nowrap inline-block">
              Range: ${valuation.lowRange.toLocaleString()} - ${valuation.highRange.toLocaleString()} USD
            </div>
          </div>
        </div>

        {/* Worker's Comp Weekly Rate */}
        {valuation.weeklyBenefitRate > 0 && (
          <div className="bg-accent/10 rounded-2xl p-6 mb-8 text-center border-2 border-accent/30">
            <div className="text-text/70 text-lg mb-2">{t.weeklyBenefitRate || 'Weekly Benefit Rate'}</div>
            <div className="text-3xl md:text-4xl font-bold text-accent">
              ${valuation.weeklyBenefitRate.toLocaleString()}/week
            </div>
          </div>
        )}

        {/* Worker's Comp Benefits Breakdown */}
        {valuation.breakdown && (
          <div className="border-t-2 border-primary/20 pt-6 mb-8">
            <h3 className="text-xl font-bold text-text mb-4">{t.benefitsBreakdown || 'Benefits Breakdown'}</h3>
            <div className="space-y-3">
              {valuation.breakdown.ttdBenefits > 0 && (
                <div className="flex justify-between items-center text-text/80 py-2 border-b border-primary/10">
                  <span>{t.ttdBenefits || 'Temporary Total Disability (TTD)'}</span>
                  <span className="font-semibold text-accent">${valuation.breakdown.ttdBenefits.toLocaleString()}</span>
                </div>
              )}
              {valuation.breakdown.tpdBenefits > 0 && (
                <div className="flex justify-between items-center text-text/80 py-2 border-b border-primary/10">
                  <span>{t.tpdBenefits || 'Temporary Partial Disability (TPD)'}</span>
                  <span className="font-semibold text-accent">${valuation.breakdown.tpdBenefits.toLocaleString()}</span>
                </div>
              )}
              {valuation.breakdown.ppdBenefits > 0 && (
                <div className="flex justify-between items-center text-text/80 py-2 border-b border-primary/10">
                  <span>{t.ppdBenefits || 'Permanent Partial Disability (PPD)'}</span>
                  <span className="font-semibold text-accent">${valuation.breakdown.ppdBenefits.toLocaleString()}</span>
                </div>
              )}
              {valuation.breakdown.medicalBenefits > 0 && (
                <div className="flex justify-between items-center text-text/80 py-2 border-b border-primary/10">
                  <span>{t.medicalBenefits || 'Medical Treatment'}</span>
                  <span className="font-semibold text-accent">${valuation.breakdown.medicalBenefits.toLocaleString()}</span>
                </div>
              )}
              {valuation.breakdown.futureMedical > 0 && (
                <div className="flex justify-between items-center text-text/80 py-2 border-b border-primary/10">
                  <span>{t.futureMedical || 'Estimated Future Medical'}</span>
                  <span className="font-semibold text-accent">${valuation.breakdown.futureMedical.toLocaleString()}</span>
                </div>
              )}
              {valuation.breakdown.vocationalBenefits > 0 && (
                <div className="flex justify-between items-center text-text/80 py-2 border-b border-primary/10">
                  <span>{t.vocationalBenefits || 'Vocational Rehabilitation'}</span>
                  <span className="font-semibold text-accent">${valuation.breakdown.vocationalBenefits.toLocaleString()}</span>
                </div>
              )}
              {valuation.breakdown.deathBenefits > 0 && (
                <div className="flex justify-between items-center text-text/80 py-2 border-b border-primary/10">
                  <span>{t.deathBenefits || 'Death Benefits'}</span>
                  <span className="font-semibold text-accent">${valuation.breakdown.deathBenefits.toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Factors */}
        <div className="border-t-2 border-primary/20 pt-8">
          <h3 className="font-bold mb-6 flex items-center gap-3 text-xl md:text-2xl text-text">
            <Check className="w-7 h-7 text-green-400 flex-shrink-0" />
            {t.factors}
          </h3>
          <ul className="space-y-3">
            {valuation.factors.map((f, i) => (
              <li key={i} className="flex items-start gap-3 text-text/80 text-base md:text-lg break-words">
                <span className="text-accent mt-1 flex-shrink-0 text-2xl font-bold">•</span>
                <span className="leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* State-Specific Warnings */}
        {valuation.warnings && valuation.warnings.length > 0 && (
          <>
            {/* Critical SOL Warning (if case is time-barred) */}
            {valuation.warnings.some(w => w.includes('CRITICAL') || w.includes('time-barred')) && (
              <div className="mt-8 p-6 bg-red-500/30 border-3 border-red-500/60 rounded-xl shadow-lg animate-pulse">
                <h4 className="font-bold mb-4 flex items-center gap-2 text-xl text-red-200">
                  <AlertCircle className="w-7 h-7 text-red-400 flex-shrink-0" />
                  CRITICAL: Case May Be Time-Barred
                </h4>
                <ul className="space-y-3">
                  {valuation.warnings
                    .filter(w => w.includes('CRITICAL') || w.includes('time-barred'))
                    .map((warning, i) => (
                      <li key={i} className="text-base md:text-lg text-red-100 leading-relaxed font-semibold flex items-start gap-3">
                        <span className="text-red-400 mt-1 flex-shrink-0 text-2xl">⚠</span>
                        <span>{warning.replace('🚨 ', '')}</span>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Urgent SOL Warning (less than 1 year remaining) */}
            {valuation.warnings.some(w => w.includes('URGENT') && !w.includes('CRITICAL')) && (
              <div className="mt-8 p-5 bg-orange-500/25 border-2 border-orange-500/50 rounded-xl">
                <h4 className="font-bold mb-3 flex items-center gap-2 text-lg text-orange-200">
                  <AlertCircle className="w-6 h-6 text-orange-400 flex-shrink-0" />
                  Urgent: Filing Deadline Approaching
                </h4>
                <ul className="space-y-2">
                  {valuation.warnings
                    .filter(w => w.includes('URGENT') && !w.includes('CRITICAL'))
                    .map((warning, i) => (
                      <li key={i} className="text-sm md:text-base text-orange-100 leading-relaxed font-medium flex items-start gap-2">
                        <span className="text-orange-400 mt-1 flex-shrink-0">•</span>
                        <span>{warning.replace('⚠️ ', '')}</span>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Standard State-Specific Considerations */}
            {valuation.warnings.filter(w => !w.includes('CRITICAL') && !w.includes('URGENT')).length > 0 && (
              <div className="mt-8 p-5 bg-primary/20 border-2 border-primary/40 rounded-xl">
                <h4 className="font-bold mb-3 flex items-center gap-2 text-lg text-text">
                  <AlertCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  State-Specific Considerations
                </h4>
                <ul className="space-y-2">
                  {valuation.warnings
                    .filter(w => !w.includes('CRITICAL') && !w.includes('URGENT'))
                    .map((warning, i) => (
                      <li key={i} className="text-sm md:text-base text-text/80 leading-relaxed flex items-start gap-2">
                        <span className="text-primary mt-1 flex-shrink-0">•</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </>
        )}

        {/* Disclaimer */}
        <div className="mt-8 p-5 bg-accent/20 border-2 border-accent/40 rounded-xl flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
          <p className="text-sm md:text-base text-text/80 leading-relaxed font-medium">
            {t.disclaimer}
          </p>
        </div>

        {/* Share Results Button - only show for non-shared results */}
        {!isSharedResult && onGenerateShareUrl && (
          <div className="mt-8 pt-8 border-t-2 border-primary/20">
            {!shareUrl ? (
              // Initial state - show "Share Results" button
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={handleShowShareUrl}
                  className="flex items-center gap-3 px-6 py-3 rounded-xl font-bold text-base transition-all transform hover:scale-105 bg-primary/20 border-2 border-primary/40 hover:bg-primary/30 text-text"
                  aria-label="Share case value estimate"
                >
                  <Share2 className="w-5 h-5" aria-hidden="true" />
                  {t.shareResults}
                </button>
                <span className="text-sm text-text/50">
                  {t.linkExpires.replace('{days}', '10')}
                </span>
              </div>
            ) : (
              // After clicking - show the URL with copy button
              <div className="space-y-4">
                <p className="text-center text-text/70 text-sm font-medium">
                  {t.shareResults} - {t.linkExpires.replace('{days}', '10')}
                </p>
                <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                  <input
                    ref={inputRef}
                    type="text"
                    readOnly
                    value={shareUrl}
                    className="flex-1 px-4 py-3 bg-primary/10 border-2 border-primary/30 rounded-xl text-text text-sm font-mono focus:outline-none focus:border-accent/50"
                    onClick={(e) => e.target.select()}
                    aria-label="Share URL for this case value estimate"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-base transition-all whitespace-nowrap ${
                      linkCopied
                        ? 'bg-green-500/30 border-2 border-green-500/50 text-green-300'
                        : 'bg-accent/20 border-2 border-accent/40 hover:bg-accent/30 text-accent'
                    }`}
                    aria-label={linkCopied ? 'Link copied to clipboard' : 'Copy link to clipboard'}
                  >
                    {linkCopied ? (
                      <>
                        <CheckCircle className="w-5 h-5" aria-hidden="true" />
                        <span aria-live="polite">{t.linkCopied}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-5 h-5" aria-hidden="true" />
                        {t.copyLink}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Show expiration notice for shared results */}
        {isSharedResult && sharedLinkDaysRemaining !== null && (
          <div className="mt-8 pt-6 border-t-2 border-primary/20 text-center">
            <p className="text-sm text-text/50 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              {t.linkExpires.replace('{days}', sharedLinkDaysRemaining.toString())}
            </p>
          </div>
        )}
      </div>

      {/* CTA for shared results viewers */}
      {isSharedResult && (
        <div className="text-center">
          <button
            onClick={onBack}
            className="px-8 py-4 bg-gradient-gold hover:opacity-90 text-textDark rounded-xl shadow-2xl hover:shadow-accent/50 transition-all font-bold text-lg transform hover:scale-105"
          >
            {t.generateNewEstimate}
          </button>
        </div>
      )}
    </div>
  );
}

ResultsPage.propTypes = {
  t: PropTypes.object.isRequired,
  valuation: PropTypes.shape({
    value: PropTypes.number.isRequired,
    lowRange: PropTypes.number.isRequired,
    highRange: PropTypes.number.isRequired,
    factors: PropTypes.arrayOf(PropTypes.string).isRequired,
    warnings: PropTypes.arrayOf(PropTypes.string),
    weeklyBenefitRate: PropTypes.number,
    breakdown: PropTypes.shape({
      ttdBenefits: PropTypes.number,
      tpdBenefits: PropTypes.number,
      ppdBenefits: PropTypes.number,
      medicalBenefits: PropTypes.number,
      futureMedical: PropTypes.number,
      vocationalBenefits: PropTypes.number,
      deathBenefits: PropTypes.number
    }),
    referOut: PropTypes.bool,
    stateSpecificInfo: PropTypes.object
  }),
  onBack: PropTypes.func.isRequired,
  isSharedResult: PropTypes.bool,
  sharedLinkExpired: PropTypes.bool,
  sharedLinkDaysRemaining: PropTypes.number,
  selectedCase: PropTypes.string,
  selectedState: PropTypes.string,
  onGenerateShareUrl: PropTypes.func
};

export default memo(ResultsPage);
