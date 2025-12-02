import { useEffect } from 'react';

/**
 * Custom hook to manage localStorage for progress saving/loading
 * Automatically saves progress and restores on mount
 *
 * @param {Object} state - Current application state to save
 * @param {Object} setters - State setter functions for restoration
 * @returns {void}
 */
export function useLocalStorage(state, setters) {
  const {
    step,
    selectedCase,
    selectedState,
    qIdx,
    lang,
    answers,
    contact
  } = state;

  const {
    setStep,
    setSelectedCase,
    setSelectedState,
    setQIdx,
    setLang,
    setAnswers,
    setContact
  } = setters;

  // Load saved progress from localStorage on mount
  useEffect(() => {
    // Skip restoration if URL has a hash (deep linking takes priority)
    const hash = window.location.hash;
    if (hash && hash !== '#') {
      return; // Let useHistoryManagement handle hash-based navigation
    }

    try {
      const savedProgress = localStorage.getItem('casevalue_progress');
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        const now = Date.now();
        const savedTime = parsed.timestamp || 0;
        const hoursSinceLastSave = (now - savedTime) / (1000 * 60 * 60);

        // Only restore if saved within last 24 hours
        if (hoursSinceLastSave < 24) {
          if (parsed.step && parsed.step !== 'landing' && parsed.step !== 'results') {
            // Validate and normalize step value
            const validSteps = ['select', 'state', 'questionnaire', 'contact'];
            let restoredStep = parsed.step;

            // Handle old step names from previous versions
            if (parsed.step === 'home') {
              restoredStep = 'landing'; // Don't restore 'home', let it stay on landing
            } else if (parsed.step === 'questions') {
              restoredStep = 'questionnaire'; // Normalize old 'questions' to 'questionnaire'
            }

            // Only restore if it's a valid step
            if (validSteps.includes(restoredStep)) {
              setStep(restoredStep);
              setSelectedCase(parsed.selectedCase || null);
              setSelectedState(parsed.selectedState || '');
              setQIdx(parsed.qIdx || 0);
              setLang(parsed.lang || 'en');
              setAnswers(parsed.answers || {});
              setContact(parsed.contact || { firstName: '', lastName: '', email: '', phone: '', consent: false });
            } else {
              // Invalid step, clear the saved data
              localStorage.removeItem('casevalue_progress');
            }
          }
        } else {
          // Clear old data
          localStorage.removeItem('casevalue_progress');
        }
      }
    } catch (error) {
      console.error('Failed to restore progress:', error);
      localStorage.removeItem('casevalue_progress');
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Save progress to localStorage whenever key state changes
  useEffect(() => {
    // Don't save landing page or results page
    if (step === 'landing' || step === 'results') {
      return;
    }

    try {
      const progressData = {
        step,
        selectedCase,
        selectedState,
        qIdx,
        lang,
        answers,
        contact,
        timestamp: Date.now()
      };
      localStorage.setItem('casevalue_progress', JSON.stringify(progressData));
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  }, [step, selectedCase, selectedState, qIdx, lang, answers, contact]);
}
