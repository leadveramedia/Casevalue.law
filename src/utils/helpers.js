/**
 * Utility helper functions for the CaseValue application
 */
import { uiTranslationsEN as englishTranslations } from '../translations/ui-en';
import { NON_CURRENCY_NUMBER_FIELDS } from '../constants/caseTypes';

// ============================================================================
// LAZY-LOADED MODULES
// ============================================================================

// Lazy-loaded calculateValuation function
let calculateValuationFunc = null;
export const getCalculateValuation = async () => {
  if (!calculateValuationFunc) {
    const module = await import('./calculateValuation');
    calculateValuationFunc = module.calculateValuation;
  }
  return calculateValuationFunc;
};

// Lazy-loaded getQuestions function
let getQuestionsFunc = null;
export const getGetQuestions = async () => {
  if (!getQuestionsFunc) {
    const module = await import('./getQuestions');
    getQuestionsFunc = module.getQuestions;
  }
  return getQuestionsFunc;
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Determines if the "Don't Know" button should be shown for a question
 * @param {Object} question - The question object
 * @returns {boolean} - Whether to show the "Don't Know" button
 */
export const shouldShowDontKnow = (question) => {
  if (!question) return false;
  if (question.type === 'date') return false;
  if (question.id === 'injury_severity') return false;
  return true;
};

/**
 * Checks if a question should be visible based on its showIf condition
 * @param {Object} question - The question object (may have showIf property)
 * @param {Object} answers - Current answers object
 * @returns {boolean} - Whether the question should be displayed
 */
export const isQuestionVisible = (question, answers) => {
  // If no showIf condition, always show the question
  if (!question.showIf) return true;

  const { questionId, operator, value } = question.showIf;
  const answer = answers[questionId];

  // If the dependent question hasn't been answered yet, hide this question
  if (answer === undefined || answer === null) return false;

  switch (operator) {
    case 'equals':
      return answer === value;
    case 'notEquals':
      return answer !== value;
    case 'greaterThan':
      return Number(answer) > value;
    case 'lessThan':
      return Number(answer) < value;
    case 'includes':
      // Check if the answer is included in an array of values
      return Array.isArray(value) ? value.includes(answer) : false;
    default:
      return true;
  }
};

/**
 * Filters an array of questions to only include visible ones based on current answers
 * @param {Array} questions - Array of question objects
 * @param {Object} answers - Current answers object
 * @returns {Array} - Filtered array of visible questions
 */
export const getVisibleQuestions = (questions, answers) => {
  return questions.filter(q => isQuestionVisible(q, answers));
};

/**
 * Formats an answer value for display in the summary
 * @param {Object} question - The question object
 * @param {*} rawValue - The raw answer value
 * @returns {string} - The formatted answer
 */
export const formatAnswerForSummary = (question, rawValue) => {
  const english = englishTranslations;
  if (rawValue === undefined || rawValue === null || rawValue === '') {
    return 'Not provided';
  }
  if (rawValue === 'unknown') {
    return 'Unknown';
  }
  if (question.type === 'boolean') {
    return rawValue ? english.yes : english.no;
  }
  if (question.type === 'select') {
    return english.options?.[rawValue] || String(rawValue);
  }
  if (question.type === 'slider') {
    const numericValue = Number(rawValue);
    return Number.isNaN(numericValue) ? String(rawValue) : `${numericValue}%`;
  }
  if (question.type === 'number') {
    const numericValue = Number(rawValue);
    if (Number.isNaN(numericValue)) {
      return String(rawValue);
    }
    const formattedNumber = numericValue.toLocaleString();
    return NON_CURRENCY_NUMBER_FIELDS.has(question.id)
      ? formattedNumber
      : `$${formattedNumber}`;
  }
  return String(rawValue);
};

/**
 * Builds the form submission payload for Netlify Forms
 * @param {Object} params - The parameters object
 * @param {Object} params.contact - Contact information
 * @param {string} params.lang - Selected language
 * @param {string} params.selectedCase - Selected case type
 * @param {string} params.selectedState - Selected state
 * @param {Array} params.questions - Array of question objects
 * @param {Object} params.answers - User answers object
 * @param {Object} params.valuationResult - Valuation result object
 * @returns {Object} - The form submission payload
 */
export const buildFormSubmissionPayload = ({
  contact,
  lang,
  selectedCase,
  selectedState,
  questions,
  answers,
  valuationResult
}) => {
  const english = englishTranslations;
  const caseLabel = selectedCase ? (english.caseTypes[selectedCase] || selectedCase) : 'Not selected';
  const subjectParts = ['CaseValue Submission'];

  if (contact.firstName || contact.lastName) {
    subjectParts.push([contact.firstName, contact.lastName].filter(Boolean).join(' '));
  }
  if (selectedCase) {
    subjectParts.push(caseLabel);
  }

  const subject = subjectParts.filter(Boolean).join(' - ');
  const lines = [];
  lines.push('CaseValue.law Submission');
  lines.push(`Submitted At: ${new Date().toLocaleString()}`);
  lines.push(`Selected Language: ${lang ? lang.toUpperCase() : 'N/A'}`);
  lines.push(`Case Type: ${caseLabel}`);
  lines.push(`State: ${selectedState || 'Not provided'}`);
  lines.push('');
  lines.push('Contact Information');
  lines.push(`First Name: ${contact.firstName || 'Not provided'}`);
  lines.push(`Last Name: ${contact.lastName || 'Not provided'}`);
  lines.push(`Email: ${contact.email || 'Not provided'}`);
  lines.push(`Phone: ${contact.phone || 'Not provided'}`);
  lines.push(`Consent To Contact: ${contact.consent ? english.yes : english.no}`);
  lines.push('');
  lines.push('Questionnaire Responses');

  if (questions.length === 0) {
    lines.push('No case-specific questions were answered.');
  } else {
    questions.forEach((question) => {
      const label = english.questions[question.id] || question.id;
      const response = formatAnswerForSummary(question, answers[question.id]);
      lines.push(`${label}: ${response}`);
    });
  }

  if (valuationResult) {
    lines.push('');
    lines.push('Valuation Results');
    lines.push(`Estimated Value: $${valuationResult.value.toLocaleString()}`);
    lines.push(`Low Range: $${valuationResult.lowRange.toLocaleString()}`);
    lines.push(`High Range: $${valuationResult.highRange.toLocaleString()}`);

    if (Array.isArray(valuationResult.factors) && valuationResult.factors.length > 0) {
      lines.push('');
      lines.push('Key Factors:');
      valuationResult.factors.forEach((factor) => {
        lines.push(`- ${factor}`);
      });
    }
  }

  lines.push('');
  lines.push('--- End of Submission ---');

  const message = lines.join('\n');

  return {
    subject: subject,
    language: lang || 'N/A',
    case_type: caseLabel,
    state: selectedState || 'Not provided',
    first_name: contact.firstName || '',
    last_name: contact.lastName || '',
    email: contact.email || '',
    phone: contact.phone || '',
    consent_to_contact: contact.consent ? english.yes : english.no,
    questionnaire_summary: message
  };
};
