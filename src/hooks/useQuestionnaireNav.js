/**
 * useQuestionnaireNav Hook
 * Handles questionnaire navigation, "don't know" toggle, and help display
 */
import { useCallback } from 'react';
import { getQuestionExplanations } from './useTranslations';

export function useQuestionnaireNav({
  questions,
  qIdx,
  answers,
  lang,
  selectedState,
  setQuestionIndex,
  updateAnswer,
  clearAnswer,
  setStep,
  openHelpModal,
  openMissingDataWarning,
  pushStateToHistory,
}) {
  const currentQuestion = questions[qIdx];
  const isLastQuestion = qIdx === questions.length - 1;
  const progress = questions.length > 0
    ? Math.round(((qIdx + 1) / questions.length) * 100)
    : 0;

  // Handle updating an answer
  const handleUpdateAnswer = useCallback((questionId, value) => {
    // If user is entering a value and it was previously 'unknown', clear the unknown status
    if (answers[questionId] === 'unknown' && value !== 'unknown' && value !== '') {
      updateAnswer(questionId, value);
    } else {
      updateAnswer(questionId, value);
    }
  }, [answers, updateAnswer]);

  // Handle "Don't Know" button click
  const handleDontKnow = useCallback((questionId) => {
    const currentValue = answers[questionId];
    // Toggle: if already 'unknown', remove it; otherwise set to 'unknown'
    if (currentValue === 'unknown') {
      clearAnswer(questionId);
    } else {
      updateAnswer(questionId, 'unknown');
      // Show warning on first "don't know" click
      if (openMissingDataWarning) {
        openMissingDataWarning();
      }
    }
  }, [answers, clearAnswer, updateAnswer, openMissingDataWarning]);

  // Navigate to next question or contact form
  const handleNextQuestion = useCallback(() => {
    if (qIdx < questions.length - 1) {
      setQuestionIndex(qIdx + 1);
    } else {
      setStep('contact');
    }
    if (pushStateToHistory) {
      setTimeout(() => pushStateToHistory(), 0);
    }
  }, [qIdx, questions.length, setQuestionIndex, setStep, pushStateToHistory]);

  // Navigate to previous question or state selection
  const handlePreviousQuestion = useCallback(() => {
    if (qIdx > 0) {
      setQuestionIndex(qIdx - 1);
    } else {
      setStep('state');
    }
    if (pushStateToHistory) {
      setTimeout(() => pushStateToHistory(), 0);
    }
  }, [qIdx, setQuestionIndex, setStep, pushStateToHistory]);

  // Show question help modal
  const handleShowQuestionHelp = useCallback(async (questionId) => {
    const explanations = await getQuestionExplanations(lang);
    const explanation = explanations[questionId];
    if (explanation && openHelpModal) {
      openHelpModal(explanation.title, explanation.getContent(selectedState));
    }
  }, [lang, selectedState, openHelpModal]);

  return {
    // Current state
    currentQuestion,
    isLastQuestion,
    progress,

    // Actions
    handleUpdateAnswer,
    handleDontKnow,
    handleNextQuestion,
    handlePreviousQuestion,
    handleShowQuestionHelp,
  };
}
