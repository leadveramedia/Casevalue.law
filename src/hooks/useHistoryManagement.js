import { useCallback, useRef, useEffect } from 'react';
import { stateNameToSlug, parseDeepLinkHash } from '../constants/stateSlugs';

/**
 * Custom hook to manage browser history and navigation
 * Handles history state, URL hashes, modals, and back/forward navigation
 *
 * @param {Object} state - Current application state
 * @param {Object} setters - State setter functions
 * @returns {Object} - { openModal, closeModal, pushStateToHistory }
 */
export function useHistoryManagement(state, setters) {
  const {
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
  } = state;

  const {
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
  } = setters;

  // Track if we're restoring from history to avoid pushing duplicate states
  const isRestoringFromHistory = useRef(false);

  // Build history state object
  const buildStateObject = useCallback(() => {
    return {
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
    };
  }, [step, selectedCase, selectedState, qIdx, lang, showPrivacy, showHelpModal,
      showMissingDataWarning, showPrivacyPage, showTermsPage, answers, contact]);

  // Build URL hash based on current state
  // On /calculator/ routes, skip the hash — the case type is in the path
  // and back-button navigation uses the history state object, not the hash.
  const buildUrlHash = useCallback(() => {
    if (window.location.pathname.startsWith('/calculator/')) return '';
    let hash = '';
    if (step === 'select') {
      hash = '#select';
    } else if (step === 'questionnaire' && selectedCase) {
      // Include state and language in URL for deep linking
      if (selectedState && stateNameToSlug[selectedState]) {
        // Include language if not English (default)
        hash = lang !== 'en'
          ? `#case/${selectedCase}/${stateNameToSlug[selectedState]}/${qIdx}/${lang}`
          : `#case/${selectedCase}/${stateNameToSlug[selectedState]}/${qIdx}`;
      } else {
        hash = `#case/${selectedCase}/${qIdx}`;
      }
    } else if (step === 'contact') {
      hash = '#contact';
    } else if (step === 'results') {
      hash = '#results';
    } else if (showPrivacyPage) {
      hash = '#privacy';
    } else if (showTermsPage) {
      hash = '#terms';
    }
    return hash;
  }, [step, selectedCase, selectedState, qIdx, lang, showPrivacyPage, showTermsPage]);

  // Push current state to history
  const pushStateToHistory = useCallback(() => {
    if (isRestoringFromHistory.current) {
      return; // Don't push when restoring from history
    }

    const stateObj = buildStateObject();
    const hash = buildUrlHash();
    const url = `${window.location.pathname}${window.location.search}${hash}`;
    window.history.pushState(stateObj, '', url);
  }, [buildStateObject, buildUrlHash]);

  // Helper to open modal and push to history
  const openModal = useCallback((modalSetter, value = true) => {
    modalSetter(value);
    setTimeout(() => {
      if (!isRestoringFromHistory.current) {
        const stateObj = buildStateObject();
        window.history.pushState(stateObj, '', window.location.href);
      }
    }, 0);
  }, [buildStateObject]);

  // Helper to close modal - directly close without browser back
  const closeModal = useCallback(() => {
    // Close all modals
    setShowHelpModal(false);
    setShowPrivacy(false);
    setShowMissingDataWarning(false);
    // Update history to reflect closed state
    setTimeout(() => pushStateToHistory(), 0);
  }, [pushStateToHistory, setShowHelpModal, setShowPrivacy, setShowMissingDataWarning]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state) {
        isRestoringFromHistory.current = true;

        // Restore the state from history
        setStep(event.state.step);
        setSelectedCase(event.state.selectedCase);
        setSelectedState(event.state.selectedState || '');
        setQIdx(event.state.qIdx);
        setLang(event.state.lang);

        // For main navigation steps (questions, state, select), always close modals
        // This prevents modal history from interfering with question-by-question navigation
        const isMainNavStep = ['questions', 'questionnaire', 'state', 'select'].includes(event.state.step);

        if (isMainNavStep) {
          // Always close modals when navigating through main steps
          setShowPrivacy(false);
          setShowHelpModal(false);
          setShowMissingDataWarning(false);
        } else {
          // For other steps (landing, contact, results), restore modal states
          setShowPrivacy(event.state.showPrivacy || false);
          setShowHelpModal(event.state.showHelpModal || false);
          setShowMissingDataWarning(event.state.showMissingDataWarning || false);
        }

        // Restore Privacy and Terms page states
        setShowPrivacyPage(event.state.showPrivacyPage || false);
        setShowTermsPage(event.state.showTermsPage || false);

        // Restore answers and contact info if available
        if (event.state.answers) {
          setAnswers(event.state.answers);
        }
        if (event.state.contact) {
          setContact(event.state.contact);
        }

        // Reset the flag after a brief delay to allow state updates to complete
        setTimeout(() => {
          isRestoringFromHistory.current = false;
        }, 100);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [setStep, setSelectedCase, setSelectedState, setQIdx, setLang, setShowPrivacy,
      setShowHelpModal, setShowMissingDataWarning, setShowPrivacyPage, setShowTermsPage,
      setAnswers, setContact]);

  // Initialize history and handle URL hash on mount
  useEffect(() => {
    // Skip hash-based deep link parsing on /calculator/ routes
    // (the route param already sets the initial state via initialCaseType prop)
    const isCalculatorRoute = window.location.pathname.startsWith('/calculator/');

    // Parse URL hash on mount for deep linking
    const hash = window.location.hash;
    let hasDeepLink = false;

    if (hash && !isCalculatorRoute) {
      if (hash === '#select') {
        setStep('select');
        hasDeepLink = true;
      } else if (hash === '#contact') {
        setStep('contact');
        hasDeepLink = true;
      } else if (hash === '#results') {
        setStep('results');
        hasDeepLink = true;
      } else if (hash === '#privacy') {
        setShowPrivacyPage(true);
        hasDeepLink = true;
      } else if (hash === '#terms') {
        setShowTermsPage(true);
        hasDeepLink = true;
      } else {
        // Try parsing as a case deep link
        const parsed = parseDeepLinkHash(hash);
        if (parsed) {
          setSelectedCase(parsed.selectedCase);
          setSelectedState(parsed.selectedState);
          setQIdx(parsed.qIdx);
          setLang(parsed.lang);
          setStep('questionnaire');
          hasDeepLink = true;
        }
      }
    }

    // Only initialize history with current state if there's no deep link
    if (!hasDeepLink) {
      const stateObj = buildStateObject();
      window.history.replaceState(stateObj, '', window.location.href);
    }

    // Listen for hash changes
    const handleHashChange = () => {
      const newHash = window.location.hash;
      if (newHash === '#select') {
        setStep('select');
      } else if (newHash === '#contact') {
        setStep('contact');
      } else if (newHash === '#privacy') {
        setShowPrivacyPage(true);
        setShowTermsPage(false);
      } else if (newHash === '#terms') {
        setShowTermsPage(true);
        setShowPrivacyPage(false);
      } else if (newHash === '') {
        setShowPrivacyPage(false);
        setShowTermsPage(false);
        if (step !== 'results') {
          setStep('landing');
        }
      } else {
        // Try parsing as a case deep link
        const parsed = parseDeepLinkHash(newHash);
        if (parsed) {
          setSelectedCase(parsed.selectedCase);
          setSelectedState(parsed.selectedState);
          setQIdx(parsed.qIdx);
          setLang(parsed.lang);
          setStep('questionnaire');
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    openModal,
    closeModal,
    pushStateToHistory
  };
}
