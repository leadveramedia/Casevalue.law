/**
 * StateSelection Component
 * Allows user to select the state where the incident occurred
 */
import { memo } from 'react';
import PropTypes from 'prop-types';
import { SHARED_STYLES } from '../shared/sharedStyles';

function StateSelection({
  t,
  usStates,
  selectedCase,
  selectedState,
  onStateChange,
  onBack,
  onNext
}) {
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <h1 className="sr-only">{t.selectState}</h1>
      {/* Back to Home Button */}
      <button
        onClick={onBack}
        className={SHARED_STYLES.backToHomeButton}
      >
        {t.backHome}
      </button>

      {selectedCase && t.caseTypes[selectedCase] && (
        <p className="text-center text-lg text-accent font-semibold mb-2">
          {t.caseTypes[selectedCase]}
        </p>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10 px-4 text-text">
        {t.selectState}
      </h2>
      <div
        className={SHARED_STYLES.questionCard}
        style={SHARED_STYLES.questionCardBg}
      >
        <label htmlFor="state-select" className="block text-lg font-semibold mb-3 text-text">
          State where the incident occurred
        </label>
        <select
          id="state-select"
          value={selectedState}
          onChange={(e) => onStateChange(e.target.value)}
          style={SHARED_STYLES.formInputBg}
          className={`${SHARED_STYLES.selectInput} mb-3`}
        >
          <option value="" className="bg-primary text-white">Choose a state...</option>
          {usStates.map(s => (
            <option key={s} value={s} className="bg-primary text-white">{s}</option>
          ))}
        </select>
        <p className="text-sm text-textMuted mb-8">Different states have different laws that affect case values</p>
        <div className="flex gap-4">
          <button
            onClick={onBack}
            className={SHARED_STYLES.navButton}
          >
            {t.back}
          </button>
          <button
            onClick={onNext}
            disabled={!selectedState}
            className={`flex-1 px-8 py-4 rounded-xl transition-all text-lg font-bold ${
              !selectedState
                ? SHARED_STYLES.primaryButtonInactive
                : SHARED_STYLES.primaryButtonActive
            }`}
          >
            {t.next}
          </button>
        </div>
      </div>
    </div>
  );
}

StateSelection.propTypes = {
  t: PropTypes.object.isRequired,
  usStates: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedCase: PropTypes.string,
  selectedState: PropTypes.string,
  onStateChange: PropTypes.func.isRequired,
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired
};

export default memo(StateSelection);
