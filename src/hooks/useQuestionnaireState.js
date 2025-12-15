/**
 * useQuestionnaireState Hook
 * Manages questionnaire answers and related state
 */
import { useState, useEffect, useCallback } from 'react';
import { getQuestionExplanations } from './useTranslations';

/**
 * Hook for managing questionnaire state
 * @param {Function} openMissingDataWarning - Function to open missing data warning modal
 * @returns {Object} Questionnaire state and handlers
 */
export function useQuestionnaireState(openMissingDataWarning) {
  const [answers, setAnswers] = useState({});
  const [hasHelpForQuestion, setHasHelpForQuestion] = useState({});

  /**
   * Update an answer for a question
   */
  const handleUpdateAnswer = useCallback((questionId, value) => {
    setAnswers(prev => {
      // If user is entering a value and it was previously 'unknown', clear the unknown status
      if (prev[questionId] === 'unknown' && value !== 'unknown' && value !== '') {
        return { ...prev, [questionId]: value };
      }
      return { ...prev, [questionId]: value };
    });
  }, []);

  /**
   * Toggle "Don't Know" status for a question
   */
  const handleDontKnow = useCallback((questionId) => {
    setAnswers(prev => {
      const currentValue = prev[questionId];
      // Toggle: if already 'unknown', remove it; otherwise set to 'unknown'
      if (currentValue === 'unknown') {
        const newAnswers = { ...prev };
        delete newAnswers[questionId];
        return newAnswers;
      } else {
        // Show warning before setting unknown (if not already unknown)
        if (openMissingDataWarning) {
          openMissingDataWarning();
        }
        return { ...prev, [questionId]: 'unknown' };
      }
    });
  }, [openMissingDataWarning]);

  /**
   * Reset answers (e.g., when case type changes)
   */
  const resetAnswers = useCallback(() => {
    setAnswers({});
  }, []);

  /**
   * Check if help is available for a question
   */
  const checkHelpAvailability = useCallback(async (questionId, lang) => {
    const explanations = await getQuestionExplanations(lang);
    setHasHelpForQuestion(prev => ({
      ...prev,
      [questionId]: !!explanations[questionId]
    }));
  }, []);

  return {
    answers,
    setAnswers,
    hasHelpForQuestion,
    setHasHelpForQuestion,
    handleUpdateAnswer,
    handleDontKnow,
    resetAnswers,
    checkHelpAvailability
  };
}

/**
 * Hook to check help availability when question changes
 * @param {Object} currentQuestion - Current question object
 * @param {string} lang - Current language
 * @param {Function} checkHelpAvailability - Function to check help availability
 */
export function useQuestionHelpAvailability(currentQuestion, lang, checkHelpAvailability) {
  useEffect(() => {
    if (!currentQuestion) return;
    checkHelpAvailability(currentQuestion.id, lang);
  }, [currentQuestion, lang, checkHelpAvailability]);
}
