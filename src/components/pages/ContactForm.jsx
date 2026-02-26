/**
 * ContactForm Component
 * Contact information form with validation
 */
import { memo } from 'react';
import PropTypes from 'prop-types';
import { Check, AlertCircle } from 'lucide-react';
import { SHARED_STYLES } from '../shared/sharedStyles';

function ContactForm({
  t,
  contact,
  validationState,
  error,
  loading,
  onBack,
  onUpdateContact,
  onTermsClick,
  onSubmit
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto animate-fade-in" noValidate>
      <h1 className="sr-only">{t.enterInfo}</h1>
      {/* Back to Home Button */}
      <button
        onClick={onBack}
        className={SHARED_STYLES.backToHomeButton}
      >
        {t.backHome}
      </button>

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10 px-4 text-text">
        {t.enterInfo}
      </h2>
      <div
        className={`${SHARED_STYLES.questionCard} space-y-5`}
        style={SHARED_STYLES.questionCardBg}
      >
        {/* Error Message */}
        {error && (
          <div role="alert" aria-live="assertive" className="p-5 bg-red-500/20 border-2 border-red-500/50 rounded-xl flex items-start gap-4 animate-shake">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm md:text-base text-red-200 font-medium">{error}</p>
          </div>
        )}

        {/* Input Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="relative">
            <input
              type="text"
              name="firstName"
              autoComplete="given-name"
              placeholder={t.firstName}
              value={contact.firstName}
              onChange={(e) => onUpdateContact('firstName', e.target.value)}
              style={SHARED_STYLES.formInputBg}
              className={SHARED_STYLES.getTextInputWithValidation(validationState.firstName)}
              required
              aria-label="First name"
            />
            {validationState.firstName === true && (
              <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" aria-hidden="true" />
            )}
            {validationState.firstName === false && (
              <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" aria-hidden="true" />
            )}
          </div>
          <input
            type="text"
            name="lastName"
            autoComplete="family-name"
            placeholder={t.lastName}
            value={contact.lastName}
            onChange={(e) => onUpdateContact('lastName', e.target.value)}
            style={SHARED_STYLES.formInputBg}
            className={SHARED_STYLES.textInput}
            aria-label="Last name"
          />
        </div>

        <div className="relative">
          <input
            type="email"
            name="email"
            inputMode="email"
            autoComplete="email"
            placeholder={t.email}
            value={contact.email}
            onChange={(e) => onUpdateContact('email', e.target.value)}
            style={SHARED_STYLES.formInputBg}
            className={`${SHARED_STYLES.getTextInputWithValidation(validationState.email)} pr-12`}
            required
            aria-label="Email address"
            aria-invalid={validationState.email === false ? 'true' : 'false'}
            aria-describedby={validationState.email === false ? 'email-error' : undefined}
          />
          {validationState.email === true && (
            <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" aria-hidden="true" />
          )}
          {validationState.email === false && (
            <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" aria-hidden="true" />
          )}
          {validationState.email === false && (
            <p id="email-error" className="mt-2 text-sm text-red-300">Please enter a valid email address</p>
          )}
        </div>

        <div className="relative">
          <input
            type="tel"
            name="phone"
            inputMode="tel"
            autoComplete="tel"
            placeholder={t.phone}
            value={contact.phone}
            onChange={(e) => onUpdateContact('phone', e.target.value)}
            style={SHARED_STYLES.formInputBg}
            className={`${SHARED_STYLES.getTextInputWithValidation(validationState.phone)} pr-12`}
            required
            aria-label="Phone number"
            aria-invalid={validationState.phone === false ? 'true' : 'false'}
            aria-describedby={validationState.phone === false ? 'phone-error' : undefined}
          />
          {validationState.phone === true && (
            <Check className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" aria-hidden="true" />
          )}
          {validationState.phone === false && (
            <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" aria-hidden="true" />
          )}
          {validationState.phone === false && (
            <p id="phone-error" className="mt-2 text-sm text-red-300">Please enter a valid phone number (10 digits)</p>
          )}
        </div>

        {/* Consent Checkbox */}
        <div className="p-6 md:p-8 bg-accent/10 rounded-2xl border-2 border-accent/30 shadow-lg">
          <label className="flex items-start gap-4 cursor-pointer">
            <input
              type="checkbox"
              checked={contact.consent}
              onChange={(e) => onUpdateContact('consent', e.target.checked)}
              className="mt-1 flex-shrink-0 w-6 h-6 accent-accent cursor-pointer rounded"
              required
              aria-label="I consent to receive contact about my case"
            />
            <span className="text-sm md:text-base text-text leading-relaxed">
              {t.consentTextPart1}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onTermsClick();
                }}
                className="text-accent hover:text-accentHover underline font-semibold"
              >
                {t.termsOfServiceLink}
              </button>
              {t.consentTextPart2}
            </span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full px-8 py-5 ${SHARED_STYLES.goldButton} disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-3" role="status" aria-live="polite">
              <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              {t.loading}
            </span>
          ) : t.viewResults}
        </button>
      </div>
    </form>
  );
}

ContactForm.propTypes = {
  t: PropTypes.object.isRequired,
  contact: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    consent: PropTypes.bool
  }).isRequired,
  validationState: PropTypes.shape({
    firstName: PropTypes.bool,
    email: PropTypes.bool,
    phone: PropTypes.bool
  }).isRequired,
  error: PropTypes.string,
  loading: PropTypes.bool,
  onBack: PropTypes.func.isRequired,
  onUpdateContact: PropTypes.func.isRequired,
  onTermsClick: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

export default memo(ContactForm);
