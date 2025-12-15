/**
 * useFormSubmission Hook
 * Manages form submission state and logic
 */
import { useState, useCallback } from 'react';
import { getCalculateValuation, buildFormSubmissionPayload } from '../utils/helpers';

/**
 * Hook for managing form submission
 * @param {Object} options - Configuration options
 * @param {Object} options.contact - Contact form data
 * @param {string} options.selectedCase - Selected case type
 * @param {string} options.selectedState - Selected state
 * @param {Array} options.questions - Questionnaire questions
 * @param {Object} options.answers - Questionnaire answers
 * @param {string} options.lang - Current language
 * @param {Object} options.t - Translation strings
 * @param {Function} options.validateEmail - Email validation function
 * @param {Function} options.validatePhone - Phone validation function
 * @param {Function} options.onSuccess - Callback on successful submission
 * @returns {Object} Submission state and handlers
 */
export function useFormSubmission({
  contact,
  selectedCase,
  selectedState,
  questions,
  answers,
  lang,
  t,
  validateEmail,
  validatePhone,
  onSuccess
}) {
  const [valuation, setValuation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

      // Clear saved progress when reaching results
      localStorage.removeItem('casevalue_progress');

      // Call success callback
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setLoading(false);
      setError('We could not send your information. Please try again or contact us at info@leadveramedia.com.');
    }
  }, [contact, selectedCase, answers, selectedState, t, validateEmail, validatePhone, lang, questions, onSuccess]);

  const clearError = useCallback(() => setError(''), []);

  return {
    valuation,
    loading,
    error,
    submit,
    clearError
  };
}
