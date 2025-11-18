/**
 * Questionnaire Component
 * Handles the dynamic questionnaire with multiple input types
 */
import { HelpCircle, Check } from 'lucide-react';

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
        className="mb-6 px-6 py-3 bg-buttonActive hover:bg-opacity-90 rounded-xl transition-all text-text flex items-center gap-2 text-base font-semibold border-2 border-accent/50 hover:border-accent shadow-lg hover:shadow-xl"
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
      <div className="bg-questionCard backdrop-blur-3xl rounded-3xl p-8 md:p-10 border-3 border-accent shadow-2xl animate-scale-in">
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
              className="w-full p-4 md:p-5 bg-formInput border-3 border-accent rounded-xl text-text text-base md:text-lg focus:border-accent focus:ring-2 focus:ring-accent/50 focus:outline-none transition-all shadow-md"
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
              className="w-full p-4 md:p-5 bg-formInput border-3 border-accent rounded-xl text-text text-base md:text-lg focus:border-accent focus:ring-2 focus:ring-accent/50 focus:outline-none transition-all shadow-md [color-scheme:light]"
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
                <span className="absolute left-4 md:left-5 top-1/2 -translate-y-1/2 text-xl md:text-2xl text-text/60 font-bold">$</span>
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
                className={`w-full p-4 md:p-5 ${!NON_CURRENCY_NUMBER_FIELDS.has(q.id) ? 'pl-10 md:pl-12' : ''} bg-formInput border-3 border-accent rounded-xl text-text text-base md:text-lg focus:border-accent focus:ring-2 focus:ring-accent/50 focus:outline-none transition-all shadow-md`}
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
              className="w-full p-4 md:p-5 bg-formInput border-3 border-accent rounded-xl text-text text-base md:text-lg focus:border-accent focus:ring-2 focus:ring-accent/50 focus:outline-none transition-all shadow-md"
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
                  className={`p-5 md:p-6 rounded-xl border-3 transition-all text-lg md:text-xl font-bold shadow-lg ${
                    answers[q.id] === v
                      ? 'bg-gradient-gold border-accent scale-105 text-textDark'
                      : 'bg-formInput border-accent hover:border-accent hover:bg-formInput/80 hover:scale-102 text-text'
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
            <input
              type="range"
              min={q.min}
              max={q.max}
              value={answers[q.id] === 'unknown' ? 0 : (answers[q.id] || 0)}
              onChange={(e) => {
                const newValue = e.target.value;
                onUpdateAnswer(q.id, newValue);
              }}
              className="w-full h-4 bg-card rounded-lg appearance-none cursor-pointer accent-accent"
              style={{
                background: `linear-gradient(to right, #D4AF37 0%, #D4AF37 ${(answers[q.id] === 'unknown' ? 0 : (answers[q.id] || 0))}%, #F4F6F8 ${(answers[q.id] === 'unknown' ? 0 : (answers[q.id] || 0))}%, #F4F6F8 100%)`
              }}
            />
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
          className="px-8 py-4 bg-buttonActive hover:bg-opacity-90 rounded-xl transition-all text-lg font-semibold text-text border-2 border-accent/50 hover:border-accent shadow-lg hover:shadow-xl"
        >
          {t.back}
        </button>
        <button
          onClick={onNext}
          disabled={answers[q.id] === undefined}
          className={`flex-1 px-8 py-4 rounded-xl transition-all text-lg font-bold ${
            answers[q.id] === undefined
              ? 'bg-buttonInactive cursor-not-allowed text-text/40 border-2 border-cardBorder/50'
              : 'bg-buttonActive hover:bg-opacity-90 text-text border-2 border-accent/50 hover:border-accent shadow-lg hover:shadow-xl'
          }`}
        >
          {qIdx === questions.length - 1 ? t.getValuation : t.next}
        </button>
      </div>
    </div>
  );
}
