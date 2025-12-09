/**
 * Application-wide configuration constants
 * Centralizes magic numbers and configuration values
 */

// ============================================================================
// ANIMATION TIMINGS (in milliseconds)
// ============================================================================
export const ANIMATION = {
  // Cookie consent banner delay
  COOKIE_CONSENT_DELAY: 2000,

  // Counter animation settings
  COUNTER_START_VALUE: 15000,
  COUNTER_END_VALUE: 25000,
  COUNTER_SPEED_PER_SECOND: 10,

  // Intersection observer thresholds
  OBSERVER_THRESHOLD_LOW: 0.1,
  OBSERVER_THRESHOLD_MEDIUM: 0.3,

  // History state restoration delay
  HISTORY_RESTORE_DELAY: 100,
};

// ============================================================================
// FORM VALIDATION
// ============================================================================
export const VALIDATION = {
  // Minimum phone number digits
  MIN_PHONE_DIGITS: 10,

  // Date input limits
  MIN_DATE: '1900-01-01',
};

// ============================================================================
// NAVIGATION STEPS
// ============================================================================
export const STEPS = {
  LANDING: 'landing',
  SELECT: 'select',
  STATE: 'state',
  QUESTIONNAIRE: 'questionnaire',
  CONTACT: 'contact',
  RESULTS: 'results',
};

// ============================================================================
// LOCAL STORAGE KEYS
// ============================================================================
export const STORAGE_KEYS = {
  COOKIE_CONSENT: 'cookie-consent',
  PROGRESS: 'casevalue_progress',
};

// ============================================================================
// SCROLL BEHAVIOR
// ============================================================================
export const SCROLL = {
  INSTANT: 'instant',
  SMOOTH: 'smooth',
  AUTO: 'auto',
};
