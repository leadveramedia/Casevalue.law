/**
 * useAppNavigation Hook
 * Manages application navigation state and step transitions
 */
import { useState, useEffect, useCallback } from 'react';
import { parseDeepLinkHash } from '../constants/stateSlugs';
import { getGetQuestions } from '../utils/helpers';

/**
 * Parse initial step from URL hash
 */
function parseInitialStep() {
  const hash = window.location.hash;
  if (hash === '#select') return 'select';
  if (hash === '#contact') return 'contact';
  if (parseDeepLinkHash(hash)) return 'questionnaire';
  return 'landing';
}

/**
 * Parse initial case from URL hash
 */
function parseInitialCase() {
  const parsed = parseDeepLinkHash(window.location.hash);
  return parsed?.selectedCase || null;
}

/**
 * Parse initial state from URL hash
 */
function parseInitialState() {
  const parsed = parseDeepLinkHash(window.location.hash);
  return parsed?.selectedState || '';
}

/**
 * Parse initial question index from URL hash
 */
function parseInitialQIdx() {
  const parsed = parseDeepLinkHash(window.location.hash);
  return parsed?.qIdx || 0;
}

/**
 * Hook for managing app navigation state
 * @param {Object} pushStateToHistoryRef - Ref containing push state function (allows late binding)
 * @returns {Object} Navigation state and handlers
 */
export function useAppNavigation(pushStateToHistoryRef) {
  // Navigation state with lazy initialization from URL hash
  const [step, setStep] = useState(parseInitialStep);
  const [selectedCase, setSelectedCase] = useState(parseInitialCase);
  const [selectedState, setSelectedState] = useState(parseInitialState);
  const [qIdx, setQIdx] = useState(parseInitialQIdx);
  const [questions, setQuestions] = useState([]);

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

  // Scroll to top on step change (respect reduced motion preference)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
  }, [step]);

  // Helper to change step and push to history
  const navigateToStep = useCallback((newStep) => {
    setStep(newStep);
    setTimeout(() => pushStateToHistoryRef.current?.(), 0);
  }, [pushStateToHistoryRef]);

  // Handle case type selection
  const handleCaseSelect = useCallback((caseId, resetAnswers) => {
    setSelectedCase(caseId);
    // Reset questionnaire state when case type changes
    setQIdx(0);
    if (resetAnswers) resetAnswers();
    setStep('state');
    // Push to history after state updates
    setTimeout(() => pushStateToHistoryRef.current?.(), 0);
  }, [pushStateToHistoryRef]);

  // Navigate to next question or contact form
  const handleNextQuestion = useCallback(() => {
    if (qIdx < questions.length - 1) {
      setQIdx(qIdx + 1);
    } else {
      setStep('contact');
    }
    // Push to history after state updates
    setTimeout(() => pushStateToHistoryRef.current?.(), 0);
  }, [qIdx, questions.length, pushStateToHistoryRef]);

  // Navigate to previous question or state selection
  const handlePreviousQuestion = useCallback(() => {
    if (qIdx > 0) {
      setQIdx(qIdx - 1);
    } else {
      // If on first question, go back to state selection
      setStep('state');
    }
    // Push to history after state updates
    setTimeout(() => pushStateToHistoryRef.current?.(), 0);
  }, [qIdx, pushStateToHistoryRef]);

  return {
    // State
    step,
    setStep,
    selectedCase,
    setSelectedCase,
    selectedState,
    setSelectedState,
    qIdx,
    setQIdx,
    questions,
    currentQuestion: questions[qIdx],

    // Navigation handlers
    navigateToStep,
    handleCaseSelect,
    handleNextQuestion,
    handlePreviousQuestion
  };
}
