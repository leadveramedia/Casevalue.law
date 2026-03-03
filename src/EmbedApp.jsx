/**
 * EmbedApp - Stripped-down calculator for iframe embedding on law firm websites.
 *
 * Supports query params:
 *   ?caseType=motor             - Pre-select a single case type (skips case selection)
 *   &caseTypes=motor,medical    - Limit available case types (comma-separated IDs)
 *   &state=California           - Pre-select state (skips state selection)
 *   &lang=en                    - Language (en|es|zh)
 *   &partner=acme-law           - Partner ID for lead attribution
 *   &intakeEmail=intake@firm.com - Partner intake email for lead delivery
 */
import { useState, useEffect, useCallback, useRef, useMemo, lazy, Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { AlertCircle, Scale } from 'lucide-react';
import { caseTypes, usStates, NON_CURRENCY_NUMBER_FIELDS } from './constants/caseTypes';
import { useTranslations, getQuestionExplanations } from './hooks/useTranslations';
import { useFormValidation } from './hooks/useFormValidation';
import { useModals } from './hooks/useModals';
import { useAppNavigation } from './hooks/useAppNavigation';
import { EmbedProvider } from './contexts/EmbedContext';
import {
  getCalculateValuation,
  shouldShowDontKnow,
  buildFormSubmissionPayload
} from './utils/helpers';

// Lightweight analytics for embed events (fire-and-forget via sendBeacon)
function trackEmbedEvent(eventName, extra = {}) {
  try {
    const payload = JSON.stringify({
      event: eventName,
      partner: new URLSearchParams(window.location.search).get('partner') || '',
      referrer: document.referrer || '',
      timestamp: new Date().toISOString(),
      ...extra,
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/.netlify/functions/embed-analytics', payload);
    }
  } catch {
    // Analytics should never break the app
  }
}

// Color conversion utilities for CSS variable injection
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  return [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)];
}

function hexToHsl(hex) {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  const [rr, gg, bb] = rgb.map(v => v / 255);
  const max = Math.max(rr, gg, bb), min = Math.min(rr, gg, bb);
  let h = 0, s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === rr) h = ((gg - bb) / d + (gg < bb ? 6 : 0)) / 6;
    else if (max === gg) h = ((bb - rr) / d + 2) / 6;
    else h = ((rr - gg) / d + 4) / 6;
  }
  return [Math.round(h * 360), s, l];
}

function hslToRgb(h, s, l) {
  const hNorm = ((h % 360) + 360) % 360 / 360;
  if (s === 0) { const v = Math.round(l * 255); return [v, v, v]; }
  const hue2rgb = (p, q, t) => {
    if (t < 0) t += 1; if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  return [
    Math.round(hue2rgb(p, q, hNorm + 1/3) * 255),
    Math.round(hue2rgb(p, q, hNorm) * 255),
    Math.round(hue2rgb(p, q, hNorm - 1/3) * 255),
  ];
}

// Lazy load page components
const CaseSelection = lazy(() => import('./components/pages/CaseSelection'));
const StateSelection = lazy(() => import('./components/pages/StateSelection'));
const Questionnaire = lazy(() => import('./components/pages/Questionnaire'));
const ContactForm = lazy(() => import('./components/pages/ContactForm'));
const ResultsPage = lazy(() => import('./components/pages/ResultsPage'));
const HelpModal = lazy(() => import('./components/HelpModal'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));

function SuspenseFallback({ logoUrl }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <div className="flex items-center gap-2 animate-pulse">
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="h-8 max-w-[200px] object-contain" />
        ) : (
          <>
            <Scale className="w-6 h-6 text-accent" />
            <span className="text-lg font-bold text-text tracking-tight">
              case<span className="px-1.5 py-0.5 bg-gradient-gold text-textDark rounded-sm mx-0.5 text-lg font-black">value</span>.law
            </span>
          </>
        )}
      </div>
      <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
    </div>
  );
}

export default function EmbedApp() {
  const [searchParams] = useSearchParams();

  // Parse query params
  const initialCaseType = searchParams.get('caseType') || null;
  const caseTypesParam = searchParams.get('caseTypes') || '';
  const initialState = searchParams.get('state') || null;
  const initialLang = searchParams.get('lang') || 'en';
  const partnerId = searchParams.get('partner') || '';
  const intakeEmail = searchParams.get('intakeEmail') || '';

  // White-label theming params
  const accentColor = searchParams.get('accentColor') || '';
  const logoUrl = searchParams.get('logoUrl') || '';
  const hideBranding = searchParams.get('hideBranding') === '1';

  // Compute CSS variable overrides — derives entire palette from accent color
  const themeStyle = useMemo(() => {
    if (!accentColor) return {};
    const rgb = hexToRgb(accentColor);
    const hsl = hexToHsl(accentColor);
    if (!rgb || !hsl) return {};
    const [r, g, b] = rgb;
    const [h] = hsl;
    const darker = [Math.round(r * 0.82), Math.round(g * 0.82), Math.round(b * 0.82)];

    // Derive full palette from accent hue
    const bg = hslToRgb(h, 0.35, 0.06);
    const primary = hslToRgb(h, 0.25, 0.12);
    const card = hslToRgb(h, 0.40, 0.20);
    const questionCard = hslToRgb(h, 0.35, 0.25);
    const btnActive = hslToRgb(h, 0.50, 0.45);
    const btnInactive = hslToRgb(h, 0.35, 0.30);
    const border = hslToRgb(h, 0.15, 0.55);

    return {
      '--cv-accent-rgb': `${r} ${g} ${b}`,
      '--cv-accent-hover-rgb': `${darker[0]} ${darker[1]} ${darker[2]}`,
      '--cv-gradient-gold': `linear-gradient(90deg, rgb(${r},${g},${b}), rgb(${darker[0]},${darker[1]},${darker[2]}))`,
      '--cv-gradient-text': `linear-gradient(90deg, rgb(${r},${g},${b}), rgb(${darker[0]},${darker[1]},${darker[2]}))`,
      '--cv-bg': `rgb(${bg[0]},${bg[1]},${bg[2]})`,
      '--cv-primary-rgb': `${primary[0]} ${primary[1]} ${primary[2]}`,
      '--cv-card-rgb': `${card[0]} ${card[1]} ${card[2]}`,
      '--cv-card-border-rgb': `${border[0]} ${border[1]} ${border[2]}`,
      '--cv-question-card': `rgba(${questionCard[0]},${questionCard[1]},${questionCard[2]},0.75)`,
      '--cv-button-active': `rgba(${btnActive[0]},${btnActive[1]},${btnActive[2]},0.85)`,
      '--cv-button-inactive': `rgba(${btnInactive[0]},${btnInactive[1]},${btnInactive[2]},0.4)`,
      '--cv-progress-fill': accentColor,
      '--cv-slider-fill': accentColor,
    };
  }, [accentColor]);

  // Filter available case types: caseTypes param limits which practice areas are shown.
  // If only one is allowed, treat it like caseType (auto-select it).
  const allowedCaseTypeIds = caseTypesParam
    ? caseTypesParam.split(',').map(s => s.trim()).filter(Boolean)
    : null;
  const filteredCaseTypes = allowedCaseTypeIds
    ? caseTypes.filter(c => allowedCaseTypeIds.includes(c.id))
    : caseTypes;
  const effectiveCaseType = initialCaseType
    || (filteredCaseTypes.length === 1 ? filteredCaseTypes[0].id : null);

  // Translations
  const { lang, uiTranslations } = useTranslations(initialLang);
  const t = uiTranslations;

  // No-op history ref (embed doesn't use browser history)
  const pushStateToHistoryRef = useRef(() => {});

  // Answers state
  const [answers, setAnswers] = useState({});

  // Navigation state machine
  const {
    step, setStep,
    selectedCase,
    selectedState, setSelectedState,
    qIdx,
    questions,
    visibleQuestions,
    currentQuestion: q,
    navigateToStep,
    handleCaseSelect,
    handleNextQuestion,
    handlePreviousQuestion
  } = useAppNavigation(pushStateToHistoryRef, answers, { initialCaseType: effectiveCaseType, initialState, initialStep: 'select' });

  const [contact, setContact] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    consent: false
  });
  const [valuation, setValuation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTermsPage, setShowTermsPage] = useState(false);

  // Modal state
  const {
    showMissingDataWarning,
    showHelpModal,
    helpModalContent,
    setShowMissingDataWarning,
    setShowHelpModal,
    openHelpModal,
    openMissingDataWarning,
  } = useModals();

  const [hasHelpForQuestion, setHasHelpForQuestion] = useState({});

  // Form validation
  const { validationState, validateEmail, validatePhone, handleUpdateContact } = useFormValidation(
    contact,
    setContact,
    setError
  );

  // Track embed load and step transitions
  useEffect(() => { trackEmbedEvent('embed_loaded'); }, []);
  useEffect(() => {
    if (step === 'contact') trackEmbedEvent('questionnaire_completed', { caseType: selectedCase, state: selectedState });
    if (step === 'results') trackEmbedEvent('results_shown', { caseType: selectedCase, state: selectedState });
  }, [step, selectedCase, selectedState]);

  // Derive target origin from document.referrer for secure postMessage
  const targetOrigin = (() => {
    try {
      if (document.referrer) {
        return new URL(document.referrer).origin;
      }
    } catch (e) {
      // Invalid referrer URL
    }
    return '*'; // Fallback when referrer is unavailable (e.g., privacy settings)
  })();

  // ResizeObserver — post height to parent for iframe auto-sizing
  const rootRef = useRef(null);
  useEffect(() => {
    if (!rootRef.current) return;
    let debounceTimer;

    const observer = new ResizeObserver((entries) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        for (const entry of entries) {
          const height = entry.borderBoxSize?.[0]?.blockSize ?? entry.target.scrollHeight;
          window.parent.postMessage(
            { type: 'casevalue-resize', height: Math.ceil(height) },
            targetOrigin
          );
        }
      }, 100);
    });

    observer.observe(rootRef.current);
    return () => {
      clearTimeout(debounceTimer);
      observer.disconnect();
    };
  }, [targetOrigin]);

  // Update HTML lang attribute
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Load help availability when question changes
  useEffect(() => {
    if (!q) return;
    const checkHelpAvailability = async () => {
      const explanations = await getQuestionExplanations(lang);
      setHasHelpForQuestion(prev => ({
        ...prev,
        [q.id]: !!explanations[q.id]
      }));
    };
    checkHelpAvailability();
  }, [q, lang]);

  // Prevent body scroll when modals are open
  useEffect(() => {
    if (showHelpModal || showMissingDataWarning) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          setShowHelpModal(false);
          setShowMissingDataWarning(false);
        }
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'unset';
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [showHelpModal, showMissingDataWarning, setShowHelpModal, setShowMissingDataWarning]);

  // ============================================================================
  // CALLBACKS
  // ============================================================================

  const handleShowQuestionHelp = useCallback(async (questionId) => {
    const explanations = await getQuestionExplanations(lang);
    const explanation = explanations[questionId];
    if (explanation) {
      openHelpModal(explanation.title, explanation.getContent(selectedState));
    }
  }, [selectedState, lang, openHelpModal]);

  const handleUpdateAnswer = useCallback((questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  }, []);

  const handleDontKnow = useCallback((questionId) => {
    setAnswers(prev => {
      const currentValue = prev[questionId];
      if (currentValue === 'unknown') {
        const newAnswers = { ...prev };
        delete newAnswers[questionId];
        return newAnswers;
      } else {
        return { ...prev, [questionId]: 'unknown' };
      }
    });
    if (answers[questionId] !== 'unknown') {
      openMissingDataWarning();
    }
  }, [answers, openMissingDataWarning]);

  const resetAnswers = useCallback(() => setAnswers({}), []);
  const onCaseSelect = useCallback((caseId) => {
    trackEmbedEvent('case_selected', { caseType: caseId });
    handleCaseSelect(caseId, resetAnswers);
  }, [handleCaseSelect, resetAnswers]);

  const submit = useCallback(async () => {
    setError('');

    if (!contact.firstName || !contact.email || !contact.phone || !contact.consent) {
      setError(t.fillAllFields);
      return;
    }
    if (!validateEmail(contact.email)) {
      setError(t.invalidEmail);
      return;
    }
    if (!validatePhone(contact.phone)) {
      setError(t.invalidPhone);
      return;
    }
    setLoading(true);

    try {
      const calculateValuation = await getCalculateValuation();
      const result = calculateValuation(selectedCase, answers, selectedState);
      const payload = buildFormSubmissionPayload({
        contact,
        lang,
        selectedCase,
        selectedState,
        questions,
        answers,
        valuationResult: result
      });

      // Add embed-specific fields
      payload.source = 'embed';
      payload.embed_referrer = document.referrer || 'unknown';
      if (partnerId) payload.partner_id = partnerId;

      if (intakeEmail) {
        // Route through process-lead function (emails lead to partner intake)
        payload.intake_email = intakeEmail;
        const response = await fetch('/.netlify/functions/process-lead', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!response.ok) {
          throw new Error(`Lead submission failed with status ${response.status}`);
        }
      } else {
        // Fallback: submit to Netlify Forms (no partner intake email)
        const formData = new URLSearchParams();
        formData.append('form-name', 'casevalue-submission');
        Object.keys(payload).forEach(key => {
          formData.append(key, payload[key]);
        });
        const response = await fetch('/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
        });
        if (!response.ok) {
          throw new Error(`Form submission failed with status ${response.status}`);
        }
      }

      trackEmbedEvent('contact_form_submitted', { caseType: selectedCase, state: selectedState });
      setValuation(result);
      setLoading(false);
      setStep('results');
    } catch (err) {
      console.error('Embed form submission error:', err);
      setLoading(false);
      setError('We could not send your information. Please try again.');
    }
  }, [contact, selectedCase, answers, selectedState, t, validateEmail, validatePhone, lang, questions, partnerId, intakeEmail, setStep]);

  // ============================================================================
  // RENDER
  // ============================================================================

  if (showTermsPage) {
    return (
      <EmbedProvider isEmbed={true}>
        <Suspense fallback={<div className="min-h-screen bg-background" />}>
          <TermsOfService lang={lang} onClose={() => setShowTermsPage(false)} />
        </Suspense>
      </EmbedProvider>
    );
  }

  return (
    <EmbedProvider isEmbed={true}>
      <div ref={rootRef} style={themeStyle} className="min-h-[400px] bg-background text-text flex flex-col">
        <Helmet>
          <meta name="robots" content="noindex, nofollow" />
          <title>CaseValue.law - Calculator</title>
        </Helmet>

        {/* Subtle background pattern */}
        <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30 pointer-events-none"></div>

        {/* Main content */}
        <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-12">

          {step === 'select' && (
            <Suspense fallback={<SuspenseFallback logoUrl={logoUrl} />}>
              <CaseSelection
                t={t}
                caseTypes={filteredCaseTypes}
                onCaseSelect={onCaseSelect}
                showBackButton={false}
              />
            </Suspense>
          )}

          {step === 'state' && (
            <Suspense fallback={<SuspenseFallback logoUrl={logoUrl} />}>
              <StateSelection
                t={t}
                usStates={usStates}
                selectedCase={selectedCase}
                selectedState={selectedState}
                onStateChange={setSelectedState}
                onBack={() => effectiveCaseType ? null : navigateToStep('select')}
                onNext={() => { if (selectedState) { trackEmbedEvent('state_selected', { state: selectedState }); navigateToStep('questionnaire'); } }}
                showBackButton={!effectiveCaseType}
              />
            </Suspense>
          )}

          {step === 'questionnaire' && q && (
            <Suspense fallback={<SuspenseFallback logoUrl={logoUrl} />}>
              <Questionnaire
                t={t}
                q={q}
                qIdx={qIdx}
                questions={visibleQuestions}
                answers={answers}
                selectedCase={selectedCase}
                selectedState={selectedState}
                hasHelpForQuestion={hasHelpForQuestion}
                NON_CURRENCY_NUMBER_FIELDS={NON_CURRENCY_NUMBER_FIELDS}
                onBack={() => {}}
                onShowHelp={handleShowQuestionHelp}
                onUpdateAnswer={handleUpdateAnswer}
                onDontKnow={handleDontKnow}
                onPrevious={handlePreviousQuestion}
                onNext={() => handleNextQuestion()}
                shouldShowDontKnow={shouldShowDontKnow}
                showBackButton={!effectiveCaseType}
              />
            </Suspense>
          )}

          {step === 'contact' && (
            <Suspense fallback={<SuspenseFallback logoUrl={logoUrl} />}>
              <ContactForm
                t={t}
                contact={contact}
                validationState={validationState}
                error={error}
                loading={loading}
                onBack={() => {}}
                onUpdateContact={handleUpdateContact}
                onTermsClick={() => setShowTermsPage(true)}
                onSubmit={submit}
                showBackButton={!effectiveCaseType}
              />
            </Suspense>
          )}

          {step === 'results' && valuation && (
            <Suspense fallback={<SuspenseFallback logoUrl={logoUrl} />}>
              <ResultsPage
                t={t}
                valuation={valuation}
                onBack={() => navigateToStep('select')}
                isSharedResult={false}
                sharedLinkExpired={false}
                sharedLinkDaysRemaining={null}
                selectedCase={selectedCase}
                selectedState={selectedState}
              />
            </Suspense>
          )}
        </main>

        {/* Help Modal */}
        <Suspense fallback={null}>
          <HelpModal
            show={showHelpModal}
            onClose={() => setShowHelpModal(false)}
            title={helpModalContent.title}
            content={helpModalContent.content}
            closeText={t.closePrivacy}
          />
        </Suspense>

        {/* Missing Data Warning Modal */}
        {showMissingDataWarning && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="warning-title">
            <div className="bg-card/60 rounded-3xl w-full max-w-2xl border-2 border-accent/40 shadow-card animate-fade-in">
              <div className="bg-accent/20 border-b-2 border-accent/30 p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-10 h-10 text-accent flex-shrink-0" />
                  <h2 id="warning-title" className="text-2xl md:text-3xl font-bold text-accent">
                    {t.missingDataWarning}
                  </h2>
                </div>
              </div>
              <div className="p-6 md:p-8 space-y-6">
                <p className="text-base md:text-lg text-text leading-relaxed">
                  {t.missingDataMessage}
                </p>
                <div className="bg-accent/10 border-2 border-accent/30 rounded-xl p-5">
                  <p className="text-sm md:text-base text-textMuted leading-relaxed">
                    <strong className="text-accent">Tip:</strong> Gathering documents like medical bills, pay stubs, and insurance information before completing the questionnaire will give you the most accurate estimate.
                  </p>
                </div>
                <div className="text-center pt-4">
                  <button
                    onClick={() => setShowMissingDataWarning(false)}
                    className="px-10 py-4 bg-gradient-gold hover:opacity-90 rounded-xl shadow-2xl transition-all font-bold text-lg text-textDark transform hover:scale-105"
                  >
                    {t.understood}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Powered by footer (hidden when white-labeled) */}
        {!hideBranding && (
          <div className="relative z-10 border-t border-cardBorder/40 py-3 px-4">
            <a
              href="https://casevalue.law/embed/docs?utm_source=embed&utm_medium=widget&utm_campaign=powered_by"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2 text-sm text-textMuted hover:text-accent transition-colors"
              title="Free case value calculator for your website"
              onClick={() => trackEmbedEvent('powered_by_clicked')}
            >
              <Scale className="w-4 h-4 text-accent/70 group-hover:text-accent transition-colors" />
              <span>Powered by</span>
              <span className="font-bold text-text group-hover:text-accent transition-colors tracking-tight">
                case<span className="px-1 py-0.5 bg-gradient-gold text-textDark rounded-sm mx-0.5 text-xs font-black">value</span>.law
              </span>
            </a>
          </div>
        )}

        {/* Shake animation for error states */}
        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
          }
          .animate-shake {
            animation: shake 0.3s ease-in-out;
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-shake { animation: none; }
          }
        `}</style>
      </div>
    </EmbedProvider>
  );
}
