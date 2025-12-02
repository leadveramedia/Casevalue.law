/**
 * AppContext - Core application state management
 * Manages wizard flow: step navigation, case selection, answers, and results
 */
import { createContext, useContext, useReducer, useCallback } from 'react';

// Action types
const ACTIONS = {
  SET_STEP: 'SET_STEP',
  SELECT_CASE: 'SELECT_CASE',
  SELECT_STATE: 'SELECT_STATE',
  SET_QUESTION_INDEX: 'SET_QUESTION_INDEX',
  UPDATE_ANSWER: 'UPDATE_ANSWER',
  SET_ANSWERS: 'SET_ANSWERS',
  CLEAR_ANSWER: 'CLEAR_ANSWER',
  SET_QUESTIONS: 'SET_QUESTIONS',
  SET_VALUATION: 'SET_VALUATION',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  RESET_WIZARD: 'RESET_WIZARD',
  RESTORE_STATE: 'RESTORE_STATE',
};

// Initial state
const initialState = {
  step: 'landing',
  selectedCase: null,
  selectedState: '',
  qIdx: 0,
  answers: {},
  questions: [],
  valuation: null,
  loading: false,
  error: '',
};

// Reducer function
function appReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_STEP:
      return { ...state, step: action.payload };

    case ACTIONS.SELECT_CASE:
      // Reset questionnaire when case changes
      return {
        ...state,
        selectedCase: action.payload,
        qIdx: 0,
        answers: {},
        questions: [],
      };

    case ACTIONS.SELECT_STATE:
      return { ...state, selectedState: action.payload };

    case ACTIONS.SET_QUESTION_INDEX:
      return { ...state, qIdx: action.payload };

    case ACTIONS.UPDATE_ANSWER:
      return {
        ...state,
        answers: { ...state.answers, [action.payload.questionId]: action.payload.value },
      };

    case ACTIONS.SET_ANSWERS:
      return { ...state, answers: action.payload };

    case ACTIONS.CLEAR_ANSWER:
      const newAnswers = { ...state.answers };
      delete newAnswers[action.payload];
      return { ...state, answers: newAnswers };

    case ACTIONS.SET_QUESTIONS:
      return { ...state, questions: action.payload };

    case ACTIONS.SET_VALUATION:
      return { ...state, valuation: action.payload };

    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };

    case ACTIONS.RESET_WIZARD:
      return { ...initialState };

    case ACTIONS.RESTORE_STATE:
      return { ...state, ...action.payload };

    default:
      return state;
  }
}

// Create context
const AppContext = createContext(null);

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Action creators
  const setStep = useCallback((step) => {
    dispatch({ type: ACTIONS.SET_STEP, payload: step });
  }, []);

  const selectCase = useCallback((caseId) => {
    dispatch({ type: ACTIONS.SELECT_CASE, payload: caseId });
  }, []);

  const selectState = useCallback((stateCode) => {
    dispatch({ type: ACTIONS.SELECT_STATE, payload: stateCode });
  }, []);

  const setQuestionIndex = useCallback((index) => {
    dispatch({ type: ACTIONS.SET_QUESTION_INDEX, payload: index });
  }, []);

  const updateAnswer = useCallback((questionId, value) => {
    dispatch({ type: ACTIONS.UPDATE_ANSWER, payload: { questionId, value } });
  }, []);

  const setAnswers = useCallback((answers) => {
    dispatch({ type: ACTIONS.SET_ANSWERS, payload: answers });
  }, []);

  const clearAnswer = useCallback((questionId) => {
    dispatch({ type: ACTIONS.CLEAR_ANSWER, payload: questionId });
  }, []);

  const setQuestions = useCallback((questions) => {
    dispatch({ type: ACTIONS.SET_QUESTIONS, payload: questions });
  }, []);

  const setValuation = useCallback((valuation) => {
    dispatch({ type: ACTIONS.SET_VALUATION, payload: valuation });
  }, []);

  const setLoading = useCallback((loading) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: loading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: error });
  }, []);

  const resetWizard = useCallback(() => {
    dispatch({ type: ACTIONS.RESET_WIZARD });
  }, []);

  const restoreState = useCallback((savedState) => {
    dispatch({ type: ACTIONS.RESTORE_STATE, payload: savedState });
  }, []);

  const value = {
    // State
    ...state,
    // Computed
    currentQuestion: state.questions[state.qIdx],
    isLastQuestion: state.qIdx === state.questions.length - 1,
    progress: state.questions.length > 0
      ? Math.round(((state.qIdx + 1) / state.questions.length) * 100)
      : 0,
    // Actions
    setStep,
    selectCase,
    selectState,
    setQuestionIndex,
    updateAnswer,
    setAnswers,
    clearAnswer,
    setQuestions,
    setValuation,
    setLoading,
    setError,
    resetWizard,
    restoreState,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

// Export action types for external use if needed
export { ACTIONS };
