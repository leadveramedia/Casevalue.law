/**
 * Centralized Design System
 *
 * This file contains all shared style patterns used across the site.
 * Updating styles here will automatically update all components that use them.
 */

// ============================================================================
// BUTTON STYLES
// ============================================================================

/**
 * Back to Home Button - Used on all pages with navigation
 * Usage: <button className={SHARED_STYLES.backToHomeButton}>...</button>
 */
export const BACK_TO_HOME_BUTTON = "mb-6 px-6 py-3 bg-buttonActive hover:bg-opacity-90 rounded-xl transition-all text-text flex items-center gap-2 text-base font-semibold border-2 border-accent/50 hover:border-accent shadow-lg hover:shadow-xl";

/**
 * Primary Action Button (e.g., Next, Submit)
 */
export const PRIMARY_BUTTON_ACTIVE = "bg-buttonActive hover:bg-opacity-90 text-text border-2 border-accent/50 hover:border-accent shadow-lg hover:shadow-xl";

/**
 * Primary Action Button - Inactive/Disabled State
 */
export const PRIMARY_BUTTON_INACTIVE = "bg-buttonInactive cursor-not-allowed text-text/40 border-2 border-cardBorder/50";

/**
 * Navigation Button (Back button on questionnaire pages)
 */
export const NAV_BUTTON = "px-8 py-4 bg-buttonActive hover:bg-opacity-90 rounded-xl transition-all text-lg font-semibold text-text border-2 border-accent/50 hover:border-accent shadow-lg hover:shadow-xl";

/**
 * Gold Gradient Button (Submit buttons, CTA)
 */
export const GOLD_BUTTON = "bg-gradient-gold hover:opacity-90 rounded-xl shadow-2xl hover:shadow-accent/50 transition-all text-xl font-bold transform hover:scale-[1.02] active:scale-95 text-textDark";

// ============================================================================
// CARD STYLES
// ============================================================================

/**
 * 3D Question Card - Main card style for questionnaires and forms
 * Includes: multi-layered shadows, slate border, ring effects
 * Usage: <div className={SHARED_STYLES.questionCard} style={SHARED_STYLES.questionCardBg}>
 */
export const QUESTION_CARD = "bg-questionCard backdrop-blur-3xl rounded-3xl p-8 md:p-10 border-4 border-slate-500 ring-2 ring-slate-400/30 ring-offset-2 ring-offset-background animate-scale-in shadow-[0_25px_60px_rgba(0,0,0,0.8),0_10px_25px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.1)]";

/**
 * Question Card Background - Inline style for gradient lighting effect
 * Usage: style={SHARED_STYLES.questionCardBg}
 */
export const QUESTION_CARD_BG = {
  background: 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(40,75,140,0.75) 40%, rgba(0,0,0,0.15) 100%)'
};

/**
 * Simple Card - For less prominent content areas
 */
export const SIMPLE_CARD = "bg-card backdrop-blur-xl rounded-2xl p-6 md:p-8 border-2 border-cardBorder shadow-card";

// ============================================================================
// INPUT STYLES
// ============================================================================

/**
 * Form Input Background - Light grey gradient
 * Usage: style={SHARED_STYLES.formInputBg}
 */
export const FORM_INPUT_BG = {
  background: 'linear-gradient(145deg, rgba(220, 220, 225, 0.95) 0%, rgba(200, 200, 205, 0.98) 100%)'
};

/**
 * Text Input - Default state (no validation)
 */
export const TEXT_INPUT = "w-full p-4 md:p-5 border-2 border-accent rounded-xl text-textDark placeholder:text-textDark/60 text-base md:text-lg focus:border-accent focus:ring-2 focus:ring-accent/50 focus:outline-none transition-all shadow-md";

/**
 * Text Input - With validation states
 * Returns different border colors based on validation state
 */
export const getTextInputWithValidation = (validationState) => {
  const baseClasses = "w-full p-4 md:p-5 border-2 rounded-xl text-textDark placeholder:text-textDark/60 text-base md:text-lg focus:ring-2 focus:outline-none transition-all shadow-md";

  if (validationState === null) {
    return `${baseClasses} border-accent focus:border-accent focus:ring-accent/50`;
  } else if (validationState === true) {
    return `${baseClasses} border-green-500/50 focus:border-green-400 focus:ring-green-400/50`;
  } else {
    return `${baseClasses} border-red-500/50 focus:border-red-400 focus:ring-red-400/50`;
  }
};

/**
 * Select Dropdown
 */
export const SELECT_INPUT = "w-full p-4 md:p-5 border-3 border-accent rounded-xl text-textDark placeholder:text-textDark/60 text-base md:text-lg focus:border-accent focus:ring-2 focus:ring-accent/50 focus:outline-none transition-all shadow-md";

/**
 * Date Input
 */
export const DATE_INPUT = "w-full p-4 md:p-5 border-3 border-accent rounded-xl text-textDark placeholder:text-textDark/60 text-base md:text-lg focus:border-accent focus:ring-2 focus:ring-accent/50 focus:outline-none transition-all shadow-md [color-scheme:light]";

/**
 * Number Input (with or without currency symbol)
 */
export const NUMBER_INPUT = (hasCurrencySymbol = false) =>
  `w-full p-4 md:p-5 ${hasCurrencySymbol ? 'pl-10 md:pl-12' : ''} border-3 border-accent rounded-xl text-textDark placeholder:text-textDark/60 text-base md:text-lg focus:border-accent focus:ring-2 focus:ring-accent/50 focus:outline-none transition-all shadow-md`;

/**
 * Currency Symbol for Number Inputs
 */
export const CURRENCY_SYMBOL = "absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-xl md:text-2xl text-textDark font-bold";

// ============================================================================
// BOOLEAN BUTTON STYLES
// ============================================================================

/**
 * Boolean Button - Active/Selected State
 * Light grey background with 3D effect
 */
export const BOOLEAN_BUTTON_ACTIVE = "border-accent scale-105 text-textDark shadow-[0_8px_16px_rgba(0,0,0,0.6),0_4px_8px_rgba(0,0,0,0.4),inset_0_2px_4px_rgba(255,255,255,0.1),inset_0_-2px_4px_rgba(0,0,0,0.3)]";

/**
 * Boolean Button - Inactive State (with scale and opacity for better differentiation)
 */
export const getBooleanButtonInactive = () => ({
  className: "border-accent hover:border-accent text-textDark scale-75 opacity-50",
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
