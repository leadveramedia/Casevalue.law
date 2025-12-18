/**
 * Centralized Design System - Legal Aesthetic
 *
 * This file contains all shared style patterns used across the site.
 * Updating styles here will automatically update all components that use them.
 *
 * Design principles:
 * - Light backgrounds (cream/white)
 * - Brass accent color
 * - Subtle shadows
 * - Professional, authoritative appearance
 */

// ============================================================================
// BUTTON STYLES
// ============================================================================

/**
 * Back to Home Button - Used on all pages with navigation
 * Usage: <button className={SHARED_STYLES.backToHomeButton}>...</button>
 */
export const BACK_TO_HOME_BUTTON = "mb-6 px-6 py-3 bg-white hover:bg-gray-50 rounded-lg transition-all text-text flex items-center gap-2 text-base font-semibold border-2 border-accent hover:border-accentHover shadow-legal-sm hover:shadow-legal-md";

/**
 * Primary Action Button (e.g., Next, Submit)
 */
export const PRIMARY_BUTTON_ACTIVE = "bg-accent hover:bg-accentHover text-white border-2 border-accent hover:border-accentHover shadow-legal-md hover:shadow-legal-lg";

/**
 * Primary Action Button - Inactive/Disabled State
 */
export const PRIMARY_BUTTON_INACTIVE = "bg-buttonInactive cursor-not-allowed text-textMuted border-2 border-cardBorder";

/**
 * Navigation Button (Back button on questionnaire pages)
 */
export const NAV_BUTTON = "px-8 py-4 bg-white hover:bg-gray-50 rounded-lg transition-all text-lg font-semibold text-text border-2 border-accent hover:border-accentHover shadow-legal-sm hover:shadow-legal-md";

/**
 * Gold/Brass Button (Submit buttons, CTA)
 */
export const GOLD_BUTTON = "bg-accent hover:bg-accentHover rounded-lg shadow-legal-md hover:shadow-legal-lg transition-all text-xl font-bold transform hover:scale-[1.02] active:scale-95 text-white";

// ============================================================================
// CARD STYLES
// ============================================================================

/**
 * Question Card - Main card style for questionnaires and forms
 * Clean white card with subtle border and shadow
 * Usage: <div className={SHARED_STYLES.questionCard} style={SHARED_STYLES.questionCardBg}>
 */
export const QUESTION_CARD = "bg-white rounded-2xl p-8 md:p-10 border-2 border-cardBorder animate-scale-in shadow-legal-lg";

/**
 * Question Card Background - Inline style (now just white)
 * Usage: style={SHARED_STYLES.questionCardBg}
 */
export const QUESTION_CARD_BG = {
  background: '#ffffff'
};

/**
 * Simple Card - For less prominent content areas
 */
export const SIMPLE_CARD = "bg-white rounded-xl p-6 md:p-8 border border-cardBorder shadow-legal-sm";

// ============================================================================
// INPUT STYLES
// ============================================================================

/**
 * Form Input Background - Light ivory
 * Usage: style={SHARED_STYLES.formInputBg}
 */
export const FORM_INPUT_BG = {
  background: '#f5f3ef'
};

/**
 * Text Input - Default state (no validation)
 */
export const TEXT_INPUT = "w-full p-4 md:p-5 border-2 border-cardBorder rounded-lg text-text placeholder:text-textMuted text-base md:text-lg focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none transition-all shadow-legal-sm";

/**
 * Text Input - With validation states
 * Returns different border colors based on validation state
 */
export const getTextInputWithValidation = (validationState) => {
  const baseClasses = "w-full p-4 md:p-5 border-2 rounded-lg text-text placeholder:text-textMuted text-base md:text-lg focus:ring-2 focus:outline-none transition-all shadow-legal-sm";

  if (validationState === null) {
    return `${baseClasses} border-cardBorder focus:border-accent focus:ring-accent/30`;
  } else if (validationState === true) {
    return `${baseClasses} border-green-500 focus:border-green-500 focus:ring-green-500/30`;
  } else {
    return `${baseClasses} border-red-500 focus:border-red-500 focus:ring-red-500/30`;
  }
};

/**
 * Select Dropdown
 */
export const SELECT_INPUT = "w-full p-4 md:p-5 border-2 border-cardBorder rounded-lg text-text placeholder:text-textMuted text-base md:text-lg focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none transition-all shadow-legal-sm";

/**
 * Date Input
 */
export const DATE_INPUT = "w-full p-4 md:p-5 border-2 border-cardBorder rounded-lg text-text placeholder:text-textMuted text-base md:text-lg focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none transition-all shadow-legal-sm [color-scheme:light]";

/**
 * Number Input (with or without currency symbol)
 */
export const NUMBER_INPUT = (hasCurrencySymbol = false) =>
  `w-full p-4 md:p-5 ${hasCurrencySymbol ? 'pl-10 md:pl-12' : ''} border-2 border-cardBorder rounded-lg text-text placeholder:text-textMuted text-base md:text-lg focus:border-accent focus:ring-2 focus:ring-accent/30 focus:outline-none transition-all shadow-legal-sm`;

/**
 * Currency Symbol for Number Inputs
 */
export const CURRENCY_SYMBOL = "absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-xl md:text-2xl text-text font-bold";

// ============================================================================
// BOOLEAN BUTTON STYLES
// ============================================================================

/**
 * Boolean Button - Active/Selected State
 * Light background with brass border accent
 */
export const BOOLEAN_BUTTON_ACTIVE = "border-accent scale-105 text-text bg-accent/10 shadow-legal-md";

/**
 * Boolean Button - Inactive State (with scale and opacity for better differentiation)
 */
export const getBooleanButtonInactive = () => ({
  className: "border-cardBorder hover:border-accent text-text scale-90 opacity-70 hover:opacity-100",
  style: FORM_INPUT_BG
});

// ============================================================================
// USAGE EXAMPLES
// ============================================================================

/**
 * Example 1: Back to Home Button
 *
 * import { BACK_TO_HOME_BUTTON } from '../shared/sharedStyles';
 *
 * <button
 *   onClick={onBack}
 *   className={BACK_TO_HOME_BUTTON}
 * >
 *   Back to Home
 * </button>
 */

/**
 * Example 2: Question Card
 *
 * import { QUESTION_CARD, QUESTION_CARD_BG } from '../shared/sharedStyles';
 *
 * <div
 *   className={QUESTION_CARD}
 *   style={QUESTION_CARD_BG}
 * >
 *   {/* Card content *\/}
 * </div>
 */

/**
 * Example 3: Form Input
 *
 * import { TEXT_INPUT, FORM_INPUT_BG } from '../shared/sharedStyles';
 *
 * <input
 *   type="text"
 *   className={TEXT_INPUT}
 *   style={FORM_INPUT_BG}
 *   placeholder="Enter your name"
 * />
 */

/**
 * Example 4: Form Input with Validation
 *
 * import { getTextInputWithValidation, FORM_INPUT_BG } from '../shared/sharedStyles';
 *
 * <input
 *   type="email"
 *   className={getTextInputWithValidation(validationState.email)}
 *   style={FORM_INPUT_BG}
 *   placeholder="Enter your email"
 * />
 */

// Export all styles as a single object for easier importing
export const SHARED_STYLES = {
  // Buttons
  backToHomeButton: BACK_TO_HOME_BUTTON,
  primaryButtonActive: PRIMARY_BUTTON_ACTIVE,
  primaryButtonInactive: PRIMARY_BUTTON_INACTIVE,
  navButton: NAV_BUTTON,
  goldButton: GOLD_BUTTON,

  // Cards
  questionCard: QUESTION_CARD,
  questionCardBg: QUESTION_CARD_BG,
  simpleCard: SIMPLE_CARD,

  // Inputs
  formInputBg: FORM_INPUT_BG,
  textInput: TEXT_INPUT,
  selectInput: SELECT_INPUT,
  dateInput: DATE_INPUT,
  numberInput: NUMBER_INPUT,
  currencySymbol: CURRENCY_SYMBOL,
  getTextInputWithValidation,

  // Boolean Buttons
  booleanButtonActive: BOOLEAN_BUTTON_ACTIVE,
  getBooleanButtonInactive
};

export default SHARED_STYLES;
