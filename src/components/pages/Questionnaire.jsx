/**
 * Questionnaire Component
 * Handles the dynamic questionnaire with multiple input types
 */
import { HelpCircle, Check } from 'lucide-react';
import { SHARED_STYLES } from '../shared/sharedStyles';

export default function Questionnaire({
  t,
  q,
  qIdx,
  questions,
  answers,
  hasHelpForQuestion,
  NON_CURRENCY_NUMBER_FIELDS,
  onBack,
  onShowHelp,
  onUpdateAnswer,
  onDontKnow,
  onPrevious,
  onNext,
  shouldShowDontKnow
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

      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex justify-between text-sm text-text/60 mb-3 px-1">
          <span className="font-semibold">{t.question} {qIdx + 1} {t.of} {questions.length}</span>
          <span className="font-bold text-accent">{Math.round(((qIdx + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="h-3 bg-card rounded-full overflow-hidden shadow-inner">
          <div
            className="h-full transition-all duration-500 ease-out rounded-full shadow-lg"
            style={{
              width: `${((qIdx + 1) / questions.length) * 100}%`,
              background: `linear-gradient(90deg, #B8860B 0%, ${`hsl(${45 + ((qIdx + 1) / questions.length) * 10}, ${70 + ((qIdx + 1) / questions.length) * 30}%, ${40 + ((qIdx + 1) / questions.length) * 20}%)`} 100%)`
            }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div
        className={SHARED_STYLES.questionCard}
        style={SHARED_STYLES.questionCardBg}
      >
        <div className="flex items-start gap-3 mb-8">
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold break-words leading-tight flex-1 text-text">
            {t.questions[q.id]}
          </h3>
          {hasHelpForQuestion[q.id] && (
            <button
              onClick={() => onShowHelp(q.id)}
              className="flex-shrink-0 p-2 md:p-3 bg-accent/20 hover:bg-accent/40 rounded-full transition-all group"
              aria-label="Learn more about this question"
            >
              <HelpCircle className="w-6 h-6 md:w-7 md:h-7 text-accent group-hover:text-accent/80 transition-colors" />
            </button>
          )}
        </div>

        {/* Select Input */}
        {q.type === 'select' && (
          <div>
            <select
              value={answers[q.id] === 'unknown' ? '' : (answers[q.id] || '')}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue !== '') {
                  onUpdateAnswer(q.id, newValue);
                }
              }}
              style={SHARED_STYLES.formInputBg}
              className={SHARED_STYLES.selectInput}
            >
              <option value="" className="bg-primary">{t.selectOption}</option>
              {q.options.map(o => (
                <option key={o} value={o} className="bg-primary">{t.options[o]}</option>
              ))}
            </select>
            {shouldShowDontKnow(q) && (
              <button
                onClick={() => onDontKnow(q.id)}
                className={`mt-3 px-6 py-2.5 rounded-lg transition-all font-semibold text-sm ${
                  answers[q.id] === 'unknown'
                    ? 'bg-accent text-textDark border-2 border-accent'
                    : 'bg-card/50 hover:bg-card/70 text-text border-2 border-cardBorder'
                }`}
              >
                {answers[q.id] === 'unknown' ? '✓ ' : ''}{t.dontKnow}
              </button>
            )}
          </div>
        )}

        {/* Date Input */}
        {q.type === 'date' && (
          <div>
            <input
              type="date"
              value={answers[q.id] === 'unknown' ? '' : (answers[q.id] || '')}
              onChange={(e) => {
                const newValue = e.target.value;
                if (newValue !== '') {
                  const enteredDate = new Date(newValue);
                  const minDate = new Date('1900-01-01');
                  const maxDate = new Date();

                  if (enteredDate >= minDate && enteredDate <= maxDate) {
                    onUpdateAnswer(q.id, newValue);
                  } else {
                    e.target.value = '';
                  }
                } else {
                  onUpdateAnswer(q.id, newValue);
                }
              }}
              min="1900-01-01"
              max={new Date().toISOString().split('T')[0]}
              style={SHARED_STYLES.formInputBg}
              className={SHARED_STYLES.dateInput}
            />
            <p className="mt-2 text-sm text-text/60">
              {q.id === 'incident_date' ? 'Select the date when the incident occurred. This helps determine if your case is within the statute of limitations.' : 'Select the date'}
            </p>
          </div>
        )}

        {/* Number Input */}
        {q.type === 'number' && (
          <div>
            <div className="relative">
              {!NON_CURRENCY_NUMBER_FIELDS.has(q.id) && (
                <span className={SHARED_STYLES.currencySymbol}>$</span>
              )}
              <input
                type="number"
                inputMode={NON_CURRENCY_NUMBER_FIELDS.has(q.id) ? 'numeric' : 'decimal'}
                value={answers[q.id] === 'unknown' ? '' : (answers[q.id] || '')}
                onChange={(e) => {
                  let newValue = e.target.value;

                  if (newValue !== '') {
                    const numValue = parseFloat(newValue);
                    if (!isNaN(numValue)) {
                      const minValue = q.min !== undefined ? q.min : 0;

                      if (numValue < minValue) {
                        newValue = minValue.toString();
                      } else if (q.max !== undefined && numValue > q.max) {
                        newValue = q.max.toString();
                      }
                    }
                  }

                  onUpdateAnswer(q.id, newValue);
                }}
                style={SHARED_STYLES.formInputBg}
                className={SHARED_STYLES.numberInput(!NON_CURRENCY_NUMBER_FIELDS.has(q.id))}
                placeholder={
                  q.id === 'medical_bills' ? '50000' :
                  q.id === 'lost_wages' ? '10000' :
                  q.id === 'insurance_coverage' ? '100000' :
                  q.id === 'months_unemployed' ? '6' :
                  q.id === 'months_unpaid' ? '12' :
                  q.id === 'months_delayed' ? '3' :
                  q.id === 'months_denied' ? '12' :
                  q.id === 'years_employed' ? '5' :
                  q.id === 'years_relationship' ? '3' :
                  q.id === 'years_life_expectancy' ? '20' :
                  q.id === 'years_infringement' ? '2' :
                  q.id === 'num_dependents' ? '2' :
                  q.id === 'num_employees_affected' ? '10' :
                  q.id === 'num_class_members' ? '100' :
                  q.id === 'duration_of_harm' ? '12' :
                  q.id === 'duration_of_violation' ? '6' :
                  q.id === 'victim_age' ? '35' :
                  NON_CURRENCY_NUMBER_FIELDS.has(q.id) ? 'Enter number' : t.enterAmount
                }
                min={q.min !== undefined ? q.min : 0}
                max={q.max !== undefined ? q.max : undefined}
                step={NON_CURRENCY_NUMBER_FIELDS.has(q.id) ? '1' : '1000'}
              />
            </div>
            <p className="mt-2 text-sm text-text/60">
              {q.id === 'medical_bills' ? 'Include hospital bills, doctor visits, medication, physical therapy, etc.' :
               q.id === 'lost_wages' ? 'Include wages lost from missing work or reduced hours' :
               q.id === 'insurance_coverage' ? 'If you know their insurance policy limits, enter it here' :
               q.id === 'months_unemployed' ? 'Enter the number of months you were unemployed after termination' :
               q.id === 'months_unpaid' ? 'Enter the number of months wages were unpaid' :
               q.id === 'months_delayed' ? 'Enter the number of months the insurance payment was delayed' :
               q.id === 'months_denied' ? 'Enter the number of months benefits were denied' :
               q.id === 'years_employed' ? 'How many years were you employed at this company?' :
               q.id === 'years_relationship' ? 'How long was your professional relationship (in years)?' :
               q.id === 'years_life_expectancy' ? "Estimate the victim's remaining life expectancy in years" :
               q.id === 'years_infringement' ? 'For how many years did the infringement occur?' :
               q.id === 'num_dependents' ? 'How many people financially depended on the victim?' :
               q.id === 'num_employees_affected' ? 'How many employees were affected by this issue?' :
               q.id === 'num_class_members' ? 'Estimated number of people in the class action' :
               q.id === 'duration_of_harm' ? 'For how many months did the harmful conduct continue?' :
               q.id === 'duration_of_violation' ? 'For how many months did the violation continue?' :
               q.id === 'victim_age' ? 'How old was the victim at the time of death?' :
               NON_CURRENCY_NUMBER_FIELDS.has(q.id) ? 'Enter the number' : 'Enter the total amount in dollars'}
            </p>
            {shouldShowDontKnow(q) && (
              <button
                onClick={() => onDontKnow(q.id)}
                className={`mt-3 px-6 py-2.5 rounded-lg transition-all font-semibold text-sm ${
                  answers[q.id] === 'unknown'
                    ? 'bg-accent text-textDark border-2 border-accent'
                    : 'bg-card/50 hover:bg-card/70 text-text border-2 border-cardBorder'
                }`}
              >
                {answers[q.id] === 'unknown' ? '✓ ' : ''}{t.dontKnow}
              </button>
            )}
          </div>
        )}

        {/* Text Input */}
        {q.type === 'text' && (
          <div>
            <input
              type="text"
              value={answers[q.id] || ''}
              onChange={(e) => onUpdateAnswer(q.id, e.target.value)}
              style={SHARED_STYLES.formInputBg}
              className={SHARED_STYLES.textInput}
              placeholder={
                q.id === 'product_name' ? 'e.g., iPhone 12 Pro, Toyota Camry, etc.' :
                'Enter text'
              }
            />
            <p className="mt-2 text-sm text-text/60">
              {q.id === 'product_name' ? 'Enter the specific name or model of the product that caused the injury' :
               'Enter the requested information'}
            </p>
          </div>
        )}

        {/* Boolean Input */}
        {q.type === 'boolean' && (
          <div>
            <div className="grid grid-cols-2 gap-5">
              {[true, false].map(v => (
                <button
                  key={String(v)}
                  onClick={() => onUpdateAnswer(q.id, v)}
                  style={SHARED_STYLES.formInputBg}
                  className={`p-5 md:p-6 rounded-xl border-3 transition-all text-lg md:text-xl font-bold shadow-lg ${
                    answers[q.id] === v
                      ? SHARED_STYLES.booleanButtonActive
                      : 'border-accent hover:border-accent text-textDark scale-75 opacity-50'
                  }`}
                >
                  {v ? (
                    <span className="flex items-center justify-center gap-2">
                      <Check className="w-6 h-6" />
                      {t.yes}
                    </span>
                  ) : t.no}
                </button>
            ))}
          </div>
            {shouldShowDontKnow(q) && (
              <button
                onClick={() => onDontKnow(q.id)}
                className={`mt-3 w-full px-6 py-2.5 rounded-lg transition-all font-semibold text-sm ${
                  answers[q.id] === 'unknown'
                    ? 'bg-accent text-textDark border-2 border-accent'
                    : 'bg-card/50 hover:bg-card/70 text-text border-2 border-cardBorder'
                }`}
              >
                {answers[q.id] === 'unknown' ? '✓ ' : ''}{t.dontKnow}
              </button>
            )}
        </div>
        )}

        {/* Slider Input */}
        {q.type === 'slider' && (
          <div>
            <div className="relative">
              <input
                type="range"
                min={q.min}
                max={q.max}
                value={answers[q.id] === 'unknown' ? 0 : (answers[q.id] || 0)}
                onChange={(e) => {
                  const newValue = e.target.value;
                  onUpdateAnswer(q.id, newValue);
                }}
                className="w-full h-4 bg-card rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #FFD700 0%, #FFD700 ${(answers[q.id] === 'unknown' ? 0 : (answers[q.id] || 0))}%, rgba(30, 50, 100, 0.6) ${(answers[q.id] === 'unknown' ? 0 : (answers[q.id] || 0))}%, rgba(30, 50, 100, 0.6) 100%)`,
                  accentColor: 'transparent'
                }}
              />
              <div
                className="absolute pointer-events-none font-black drop-shadow-lg"
                style={{
                  left: `calc(${(answers[q.id] === 'unknown' ? 0 : (answers[q.id] || 0))}% - 15px)`,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '38px',
                  color: '#FFD700',
                  textShadow: '0 2px 8px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.6)',
                  zIndex: 10
                }}
              >
                %
              </div>
            </div>
            <div className="text-center mt-6">
              <div className="text-5xl md:text-6xl font-bold text-accent mb-2">
                {answers[q.id] === 'unknown' ? '?' : (answers[q.id] || 0)}%
              </div>
              <div className="text-sm text-text/60">
                {answers[q.id] === 'unknown' ? 'Unknown' :
                 answers[q.id] > 50 ? 'Mostly my fault' :
                 answers[q.id] > 0 ? 'Partially my fault' :
                 'Not my fault at all'}
              </div>
            </div>
            {shouldShowDontKnow(q) && (
              <button
                onClick={() => onDontKnow(q.id)}
                className={`mt-4 w-full px-6 py-2.5 rounded-lg transition-all font-semibold text-sm ${
                  answers[q.id] === 'unknown'
                    ? 'bg-accent text-textDark border-2 border-accent'
                    : 'bg-card/50 hover:bg-card/70 text-text border-2 border-cardBorder'
                }`}
              >
                {answers[q.id] === 'unknown' ? '✓ ' : ''}{t.dontKnow}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={onPrevious}
          className={SHARED_STYLES.navButton}
        >
          {t.back}
        </button>
        <button
          onClick={onNext}
          disabled={answers[q.id] === undefined}
          className={`flex-1 px-8 py-4 rounded-xl transition-all text-lg font-bold ${
            answers[q.id] === undefined
              ? SHARED_STYLES.primaryButtonInactive
              : SHARED_STYLES.primaryButtonActive
          }`}
        >
          {qIdx === questions.length - 1 ? t.getValuation : t.next}
        </button>
      </div>
    </div>
  );
}
