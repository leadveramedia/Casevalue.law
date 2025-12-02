import { useState, useEffect, useCallback, useRef, lazy, Suspense } from 'react';
import { ChevronRight, AlertCircle } from 'lucide-react';
import { caseTypes, usStates, NON_CURRENCY_NUMBER_FIELDS } from './constants/caseTypes';
import { LANGUAGE_OPTIONS } from './constants/languages';
import { useTranslations, getQuestionExplanations } from './hooks/useTranslations';
import { useHistoryManagement } from './hooks/useHistoryManagement';
import { useFormValidation } from './hooks/useFormValidation';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useMetadata } from './hooks/useMetadata';
import { useModals } from './hooks/useModals';
import {
  getCalculateValuation,
  getGetQuestions,
  shouldShowDontKnow,
  buildFormSubmissionPayload
} from './utils/helpers';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import LandingPage from './components/pages/LandingPage';

// Lazy load page components for code splitting
// LandingPage is kept as direct import for instant initial load
const CaseSelection = lazy(() => import('./components/pages/CaseSelection'));
const StateSelection = lazy(() => import('./components/pages/StateSelection'));
const Questionnaire = lazy(() => import('./components/pages/Questionnaire'));
const ContactForm = lazy(() => import('./components/pages/ContactForm'));
const ResultsPage = lazy(() => import('./components/pages/ResultsPage'));

// Lazy load modal/overlay components
const HelpModal = lazy(() => import('./components/HelpModal'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));
const CookieConsent = lazy(() => import('./components/CookieConsent'));

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function CaseValueWebsite() {
  // Translations hook
  const { lang, setLang, uiTranslations } = useTranslations('en');
  const t = uiTranslations;

  // State management
  const [step, setStep] = useState('landing');
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedState, setSelectedState] = useState('');
  const [qIdx, setQIdx] = useState(0);
  const [answers, setAnswers] = useState({});
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
  // Modal state management (centralized hook)
  const {
    showPrivacy,
    showPrivacyPage,
    showTermsPage,
    showCookieConsent,
    showMissingDataWarning,
    showHelpModal,
    helpModalContent,
    setShowPrivacy,
    setShowPrivacyPage,
    setShowTermsPage,
    setShowCookieConsent,
    setShowMissingDataWarning,
    setShowHelpModal,
    openHelpModal,
    openMissingDataWarning,
  } = useModals();

  const [hasAnimatedStats, setHasAnimatedStats] = useState(false);
  const [casesAnalyzedCount, setCasesAnalyzedCount] = useState(15000);
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);
  const [hasHelpForQuestion, setHasHelpForQuestion] = useState({});
  const howItWorksRef = useRef(null);
  const primaryCTARef = useRef(null);
  const wasOnPrivacyOrTermsPage = useRef(false);
  const [questions, setQuestions] = useState([]);
  const q = questions[qIdx];

  // History management hook
  const { openModal, closeModal, pushStateToHistory } = useHistoryManagement(
    {
      step,
      selectedCase,
      selectedState,
      qIdx,
      lang,
      showPrivacy,
      showHelpModal,
      showMissingDataWarning,
      showPrivacyPage,
      showTermsPage,
      answers,
      contact
    },
    {
      setStep,
      setSelectedCase,
      setSelectedState,
      setQIdx,
      setLang,
      setShowPrivacy,
      setShowHelpModal,
      setShowMissingDataWarning,
      setShowPrivacyPage,
      setShowTermsPage,
      setAnswers,
      setContact
    }
  );

  // Form validation hook
  const { validationState, validateEmail, validatePhone, handleUpdateContact } = useFormValidation(
    contact,
    setContact,
    setError
  );

  // LocalStorage hook for progress saving/loading
  useLocalStorage(
    { step, selectedCase, selectedState, qIdx, lang, answers, contact },
    { setStep, setSelectedCase, setSelectedState, setQIdx, setLang, setAnswers, setContact }
  );

  // Metadata hook for SEO management
  const { MetaTags } = useMetadata(step, selectedCase, t);

  // Load questions when case type changes
  useEffect(() => {
    const loadQuestions = async () => {
      if (selectedCase) {
        const getQuestions = await getGetQuestions();
        setQuestions(getQuestions(selectedCase));
      } else {
        setQuestions([]);
      }
    };
    loadQuestions();
  }, [selectedCase]);

  // Handler to show question help modal
  const handleShowQuestionHelp = useCallback(async (questionId) => {
    const explanations = await getQuestionExplanations(lang);
    const explanation = explanations[questionId];
    if (explanation) {
      openHelpModal(explanation.title, explanation.getContent(selectedState));
    }
  }, [selectedState, lang, openHelpModal]);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Check for cookie consent on mount
  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Show cookie consent banner after a delay if no consent found
      setTimeout(() => setShowCookieConsent(true), 2000);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to top when navigating away from Privacy/Terms pages
  useEffect(() => {
    const currentlyOnPrivacyOrTerms = showPrivacyPage || showTermsPage;

    // If we were on Privacy/Terms and now we're not, scroll to top
    if (wasOnPrivacyOrTermsPage.current && !currentlyOnPrivacyOrTerms) {
      // Use requestAnimationFrame to ensure DOM has updated
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        });
      });
    }

    // Update the ref for next render
    wasOnPrivacyOrTermsPage.current = currentlyOnPrivacyOrTerms;
  }, [showPrivacyPage, showTermsPage]);

  // Load help availability when language or question changes
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


  // Prevent body scroll when modals are open and manage focus
  useEffect(() => {
    if (showPrivacy || showHelpModal || showMissingDataWarning) {
      document.body.style.overflow = 'hidden';

      // Focus trap for modals
      const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
          closeModal();
        }

        // Tab key navigation trap
        if (e.key === 'Tab') {
          const modal = document.querySelector('[role="dialog"]');
          if (modal) {
            const focusableElements = modal.querySelectorAll(
              'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey && document.activeElement === firstElement) {
              e.preventDefault();
              lastElement.focus();
            } else if (!e.shiftKey && document.activeElement === lastElement) {
              e.preventDefault();
              firstElement.focus();
            }
          }
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
  }, [showPrivacy, showHelpModal, showMissingDataWarning, closeModal]);

  // Scroll to top on step change (respect reduced motion preference)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }, [step]);

  useEffect(() => {
    if (step !== 'landing') {
      setShowFloatingCTA(false);
      return;
    }
    const node = primaryCTARef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowFloatingCTA(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [step]);

  useEffect(() => {
    if (hasAnimatedStats) return;
    if (step !== 'landing') return;
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
  }, [step, hasAnimatedStats]);

  useEffect(() => {
    if (!hasAnimatedStats) return;
    const targetValue = 25000;
    const speedPerSecond = 10; // cases per second
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

  // ============================================================================
  // CALLBACK FUNCTIONS
  // ============================================================================

  const handleUpdateAnswer = useCallback((questionId, value) => {
    setAnswers(prev => {
      // If user is entering a value and it was previously 'unknown', clear the unknown status
      if (prev[questionId] === 'unknown' && value !== 'unknown' && value !== '') {
        return { ...prev, [questionId]: value };
      }
      return { ...prev, [questionId]: value };
    });
  }, []);

  const handleDontKnow = useCallback((questionId) => {
    setAnswers(prev => {
      const currentValue = prev[questionId];
      // Toggle: if already 'unknown', remove it; otherwise set to 'unknown'
      if (currentValue === 'unknown') {
        const newAnswers = { ...prev };
        delete newAnswers[questionId];
        return newAnswers;
      } else {
        return { ...prev, [questionId]: 'unknown' };
      }
    });
    // Show warning on first "don't know" click (openMissingDataWarning handles the hasShownWarning check)
    if (answers[questionId] !== 'unknown') {
      openMissingDataWarning();
    }
  }, [answers, openMissingDataWarning]);

  const handleCaseSelect = useCallback((caseId) => {
    setSelectedCase(caseId);
    // Reset questionnaire state when case type changes
    setQIdx(0);
    setAnswers({});
    setStep('state');
    // Push to history after state updates
    setTimeout(() => pushStateToHistory(), 0);
  }, [pushStateToHistory]);

  const handleNextQuestion = useCallback(() => {
    if (qIdx < questions.length - 1) {
      setQIdx(qIdx + 1);
    } else {
      setStep('contact');
    }
    // Push to history after state updates
    setTimeout(() => pushStateToHistory(), 0);
  }, [qIdx, questions.length, pushStateToHistory]);

  const handlePreviousQuestion = useCallback(() => {
    if (qIdx > 0) {
      setQIdx(qIdx - 1);
    } else {
      // If on first question, go back to state selection
      setStep('state');
    }
    // Push to history after state updates
    setTimeout(() => pushStateToHistory(), 0);
  }, [qIdx, pushStateToHistory]);

  // Helper to change step and push to history
  const navigateToStep = useCallback((newStep) => {
    setStep(newStep);
    setTimeout(() => pushStateToHistory(), 0);
  }, [pushStateToHistory]);

  const submit = useCallback(async () => {
    setError('');
    
    // Validation
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
      // Lazy-load the calculateValuation function
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

      // Encode payload as URL-encoded form data for Netlify Forms
      const formData = new URLSearchParams();
      formData.append('form-name', 'casevalue-submission');

      // Add all payload fields
      Object.keys(payload).forEach(key => {
        formData.append(key, payload[key]);
      });

      const response = await fetch('/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData.toString()
      });

      if (!response.ok) {
        throw new Error(`Form submission failed with status ${response.status}`);
      }

      setValuation(result);
      setLoading(false);
      setStep('results');
      // Clear saved progress when reaching results
      localStorage.removeItem('casevalue_progress');
      setTimeout(() => pushStateToHistory(), 0);
    } catch (err) {
      console.error('Form submission error:', err);
      setLoading(false);
      setError('We could not send your information. Please try again or contact us at info@leadveramedia.com.');
    }
  }, [contact, selectedCase, answers, selectedState, t, validateEmail, validatePhone, lang, questions, pushStateToHistory]);

  // ============================================================================
  // RENDER
  // ============================================================================

  // Show Privacy Policy or Terms of Service as full-page overlays
  if (showPrivacyPage) {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-background" />
      }>
        <PrivacyPolicy
          lang={lang}
          onClose={() => {
            setShowPrivacyPage(false);
            setStep('landing');
            setTimeout(() => pushStateToHistory(), 0);
          }}
        />
      </Suspense>
    );
  }

  if (showTermsPage) {
    return (
      <Suspense fallback={
        <div className="min-h-screen bg-background" />
      }>
        <TermsOfService
          lang={lang}
          onClose={() => {
            setShowTermsPage(false);
            setStep('landing');
            setTimeout(() => pushStateToHistory(), 0);
          }}
        />
      </Suspense>
    );
  }

  return (
    <div className="min-h-screen text-text flex flex-col">
      {/* SEO Meta Tags */}
      <MetaTags />

      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30 pointer-events-none"></div>

      {/* ========================================================================
          NAVIGATION
      ======================================================================== */}
      <Navigation
        lang={lang}
        onLanguageChange={(newLang) => {
          setLang(newLang);
          setTimeout(() => pushStateToHistory(), 0);
        }}
        onLogoClick={() => navigateToStep('landing')}
      />

      {/* ========================================================================
          MAIN CONTENT
      ======================================================================== */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-12 lg:py-16">
        
        {/* ====================================================================
            LANDING PAGE
        ==================================================================== */}
        {step === 'landing' && (
          <LandingPage
            t={t}
            primaryCTARef={primaryCTARef}
            howItWorksRef={howItWorksRef}
            casesAnalyzedCount={casesAnalyzedCount}
            onGetStarted={() => navigateToStep('select')}
          />
        )}

        {/* ====================================================================
            CASE SELECTION PAGE
        ==================================================================== */}
        {step === 'select' && (
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-textMuted">Loading...</div></div>}>
            <CaseSelection
              t={t}
              caseTypes={caseTypes}
              onBack={() => navigateToStep('landing')}
              onCaseSelect={handleCaseSelect}
            />
          </Suspense>
        )}

        {/* ====================================================================
            STATE SELECTION PAGE
        ==================================================================== */}
        {step === 'state' && (
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-textMuted">Loading...</div></div>}>
            <StateSelection
              t={t}
              usStates={usStates}
              selectedState={selectedState}
              onStateChange={setSelectedState}
              onBack={() => navigateToStep('select')}
              onNext={() => selectedState && navigateToStep('questionnaire')}
            />
          </Suspense>
        )}

        {/* ====================================================================
            QUESTIONNAIRE PAGE
        ==================================================================== */}
        {step === 'questionnaire' && q && (
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-textMuted">Loading...</div></div>}>
            <Questionnaire
              t={t}
              q={q}
              qIdx={qIdx}
              questions={questions}
              answers={answers}
              hasHelpForQuestion={hasHelpForQuestion}
              NON_CURRENCY_NUMBER_FIELDS={NON_CURRENCY_NUMBER_FIELDS}
              onBack={() => navigateToStep('landing')}
              onShowHelp={handleShowQuestionHelp}
              onUpdateAnswer={handleUpdateAnswer}
              onDontKnow={handleDontKnow}
              onPrevious={handlePreviousQuestion}
              onNext={handleNextQuestion}
              shouldShowDontKnow={shouldShowDontKnow}
            />
          </Suspense>
        )}

        {/* ====================================================================
            CONTACT FORM PAGE
        ==================================================================== */}
        {step === 'contact' && (
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-textMuted">Loading...</div></div>}>
            <ContactForm
              t={t}
              contact={contact}
              validationState={validationState}
              error={error}
              loading={loading}
              onBack={() => navigateToStep('landing')}
              onUpdateContact={handleUpdateContact}
              onPrivacyClick={() => openModal(setShowPrivacy, true)}
              onSubmit={submit}
            />
          </Suspense>
        )}

        {/* ====================================================================
            RESULTS PAGE
        ==================================================================== */}
        {step === 'results' && valuation && (
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-textMuted">Loading...</div></div>}>
            <ResultsPage
              t={t}
              valuation={valuation}
              onBack={() => navigateToStep('landing')}
            />
          </Suspense>
        )}
      </main>

      {step === 'landing' && showFloatingCTA && (
        <div className="fixed inset-x-0 bottom-6 sm:bottom-8 z-40 flex justify-center pointer-events-none px-4">
          <button
            onClick={() => navigateToStep('select')}
            className="pointer-events-auto w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-10 py-4 bg-gradient-gold hover:opacity-90 text-textDark rounded-full text-base sm:text-xl font-extrabold shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-accent/60 whitespace-nowrap"
            aria-label={t.cta}
          >
            {t.cta}
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      )}

      {/* ========================================================================
          PRIVACY MODAL
      ======================================================================== */}
      {showPrivacy && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="privacy-title">
          <div className="bg-card rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-y-auto border-2 border-cardBorder shadow-card my-auto">
            <div className="sticky top-0 bg-card border-b-2 border-cardBorder p-6 md:p-8 z-10">
              {/* Header with title and close button */}
              <div className="flex justify-between items-center gap-4 mb-4">
                <h2 id="privacy-title" className="text-2xl md:text-3xl lg:text-4xl font-bold text-text">
                  {t.privacyTitle}
                </h2>
                <button
                  onClick={closeModal}
                  className="px-5 py-3 bg-accent/20 hover:bg-accent/30 rounded-xl transition-all text-text text-base font-bold flex-shrink-0 shadow-lg"
                >
                  {t.closePrivacy}
                </button>
              </div>

              {/* Language Buttons */}
              <div className="flex items-center justify-center gap-1.5 bg-card/50 p-1 rounded-lg border border-cardBorder backdrop-blur w-fit mx-auto">
                {LANGUAGE_OPTIONS.map(option => (
                  <button
                    key={option.code}
                    onClick={() => {
                      setLang(option.code);
                      setTimeout(() => pushStateToHistory(), 0);
                    }}
                    className={`min-w-[44px] px-3 py-1.5 rounded-md transition-all text-sm font-bold uppercase ${
                      lang === option.code
                        ? 'bg-gradient-gold text-textDark shadow-md'
                        : 'bg-transparent hover:bg-accent/10 text-text/60 hover:text-text'
                    }`}
                    aria-label={`Switch to ${option.ariaLabel}`}
                  >
                    {option.desktopLabel}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="p-6 md:p-10 space-y-8 text-text">
              {[
                { color: 'red', title: t.notLawFirm, text: t.notLawFirmText },
                { color: 'yellow', title: t.consentToContact, text: t.consentToContactText },
                { color: 'blue', title: t.estimateDisclaimer, text: t.estimateDisclaimerText },
                { color: 'green', title: t.privacyCommitment, text: t.privacyCommitmentText }
              ].map((section, i) => (
                <div key={i} className="bg-card/50 border-2 border-cardBorder rounded-2xl p-6 md:p-8 hover:border-accent/40 transition-all shadow-card">
                  <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-text mb-4 break-words">
                    {section.title}
                  </h3>
                  <p className="text-base md:text-lg text-textMuted leading-relaxed">
                    {section.text}
                  </p>
                </div>
              ))}

              <div className="text-center pt-6">
                <button
                  onClick={() => {
                    setShowPrivacy(false);
                    navigateToStep('select');
                  }}
                  className="px-10 py-4 bg-gradient-gold hover:opacity-90 text-textDark rounded-xl shadow-2xl hover:shadow-accent/50 transition-all font-bold text-lg transform hover:scale-105"
                >
                  Find Out What Your Case is Worth
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================
          QUESTION HELP MODAL
      ======================================================================== */}
      <Suspense fallback={null}>
        <HelpModal
          show={showHelpModal}
          onClose={closeModal}
          title={helpModalContent.title}
          content={helpModalContent.content}
          closeText={t.closePrivacy}
        />
      </Suspense>

      {/* ========================================================================
          COOKIE CONSENT BANNER
      ======================================================================== */}
      {showCookieConsent && (
        <Suspense fallback={null}>
          <CookieConsent
            lang={lang}
            onAccept={() => {
              setShowCookieConsent(false);
            }}
            onDecline={() => {
              setShowCookieConsent(false);
            }}
          />
        </Suspense>
      )}

      {/* ========================================================================
          MISSING DATA WARNING MODAL
      ======================================================================== */}
      {showMissingDataWarning && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby="warning-title">
          <div className="bg-card rounded-3xl w-full max-w-2xl border-2 border-accent/40 shadow-card animate-fade-in">
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
                  onClick={closeModal}
                  className="px-10 py-4 bg-gradient-gold hover:opacity-90 rounded-xl shadow-2xl transition-all font-bold text-lg text-textDark transform hover:scale-105"
                >
                  {t.understood}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================
          FOOTER
      ======================================================================== */}
      <Footer
        t={t}
        onPrivacyClick={() => {
          setShowPrivacyPage(true);
          pushStateToHistory();
        }}
        onTermsClick={() => {
          setShowTermsPage(true);
          pushStateToHistory();
        }}
      />

      {/* Shake animation for error states - used in ContactForm */}
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
  );
}
