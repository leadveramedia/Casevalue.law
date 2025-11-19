/**
 * StateSelection Component
 * Allows user to select the state where the incident occurred
 */
import { SHARED_STYLES } from '../shared/sharedStyles';

export default function StateSelection({
  t,
  usStates,
  selectedState,
  onStateChange,
  onBack,
  onNext
}) {
  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      {/* Back to Home Button */}
      <button
        onClick={onBack}
        className={SHARED_STYLES.backToHomeButton}
      >
        {t.backHome}
      </button>

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
          <option value="" className="bg-primary">Choose a state...</option>
          {usStates.map(s => (
            <option key={s} value={s} className="bg-primary">{s}</option>
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
