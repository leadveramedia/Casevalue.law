/**
 * StateSelection Component
 * Allows user to select the state where the incident occurred
 */

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
        className="mb-6 px-6 py-3 bg-primary/10 hover:bg-primary/20 rounded-xl transition-all text-text flex items-center gap-2 text-base font-semibold"
      >
        {t.backHome}
      </button>

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-10 px-4 text-text">
        {t.selectState}
      </h2>
      <div className="bg-questionCard backdrop-blur-3xl rounded-3xl p-8 md:p-10 border-3 border-accent shadow-2xl animate-scale-in">
        <label htmlFor="state-select" className="block text-lg font-semibold mb-3 text-text">
          State where the incident occurred
        </label>
        <select
          id="state-select"
          value={selectedState}
          onChange={(e) => onStateChange(e.target.value)}
          className="w-full p-4 md:p-5 bg-formInput border-3 border-accent rounded-xl text-text text-base md:text-lg mb-3 focus:border-accent focus:ring-2 focus:ring-accent/50 focus:outline-none transition-all shadow-md"
        >
          <option value="" className="bg-primary">Choose a state...</option>
          {usStates.map(s => (
            <option key={s} value={s} className="bg-primary">{s}</option>
          ))}
        </select>
        <p className="text-sm text-textMuted mb-8">Different states have different laws that affect case values</p>
        <div className="flex gap-4">
          <button
            onClick={() => window.history.back()}
            className="px-8 py-4 bg-primary/10 hover:bg-primary/20 rounded-xl transition-all text-lg font-semibold shadow-md hover:shadow-lg text-text"
          >
            {t.back}
          </button>
          <button
            onClick={onNext}
            disabled={!selectedState}
            className={`flex-1 px-8 py-4 rounded-xl transition-all text-lg font-bold ${
              !selectedState
                ? 'bg-buttonInactive cursor-not-allowed text-text/40 border-2 border-cardBorder/50'
                : 'bg-buttonActive hover:bg-opacity-90 text-text border-2 border-accent/50 hover:border-accent shadow-lg hover:shadow-xl'
            }`}
          >
            {t.next}
          </button>
        </div>
      </div>
    </div>
  );
}
