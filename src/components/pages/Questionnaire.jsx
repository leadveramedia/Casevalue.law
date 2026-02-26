/**
 * Questionnaire Component
 * Handles the dynamic questionnaire with multiple input types
 */
import { memo, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { HelpCircle, Check, Calendar } from 'lucide-react';
import { SHARED_STYLES } from '../shared/sharedStyles';
import { QUESTION_PLACEHOLDERS, QUESTION_HELP_TEXT } from '../../constants/questionConfig';

/**
 * DateInputField - Custom date input with reliable calendar button
 * Fixes issues with native date picker icon being finicky
 */
function DateInputField({ value, onChange, helpText, questionId }) {
  const dateInputRef = useRef(null);

  const openDatePicker = useCallback(() => {
    const input = dateInputRef.current;
    if (input) {
      // Focus first, then try to show picker
      input.focus();
      // Use showPicker API if available (modern browsers)
      if (typeof input.showPicker === 'function') {
        try {
          input.showPicker();
        } catch (e) {
          // Fallback: just focus the input
          input.click();
        }
      }
    }
  }, []);

  return (
    <div>
      <div className="relative">
        <input
          ref={dateInputRef}
          type="date"
          aria-labelledby={questionId ? `question-${questionId}` : undefined}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min="1900-01-01"
          max={new Date().toISOString().split('T')[0]}
          style={SHARED_STYLES.formInputBg}
          className="w-full p-4 md:p-5 pr-14 border-3 border-accent rounded-xl text-textDark placeholder:text-textDark/60 text-base md:text-lg focus:border-accent focus:ring-2 focus:ring-accent/50 focus:outline-none transition-all shadow-md [color-scheme:light] cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:top-0 [&::-webkit-calendar-picker-indicator]:w-14 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          onClick={openDatePicker}
        />
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); openDatePicker(); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center bg-accent hover:bg-accent/80 rounded-lg transition-all shadow-md hover:shadow-lg active:scale-95"
          aria-label="Open date picker"
        >
          <Calendar className="w-5 h-5 md:w-6 md:h-6 text-textDark" aria-hidden="true" />
        </button>
      </div>
      <p className="mt-2 text-sm text-text/60">
        {helpText}
      </p>
    </div>
  );
}

function DontKnowButton({ questionId, answer, onDontKnow, t, className }) {
  return (
    <button
      onClick={() => onDontKnow(questionId)}
      aria-pressed={answer === 'unknown'}
      className={`${className} px-6 py-2.5 rounded-lg transition-all font-semibold text-sm ${
        answer === 'unknown'
          ? 'bg-accent text-textDark border-2 border-accent'
          : 'bg-card/50 hover:bg-card/70 text-text border-2 border-cardBorder'
      }`}
    >
      {answer === 'unknown' ? '✓ ' : ''}{t.dontKnow}
    </button>
  );
}

function Questionnaire({
  t,
  q,
  qIdx,
  questions,
  answers,
  selectedCase,
  selectedState,
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
      <h1 className="sr-only">{t.questionnaire || 'Questionnaire'}</h1>
      {/* Back to Home Button */}
      <button
        onClick={onBack}
        className={SHARED_STYLES.backToHomeButton}
      >
        {t.backHome}
      </button>

      {/* Case type + state badge */}
      {selectedCase && t.caseTypes[selectedCase] && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-accent/20 text-accent border border-accent/30">
            {t.caseTypes[selectedCase]}
          </span>
          {selectedState && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-card text-text/70 border border-text/10">
              {selectedState}
            </span>
          )}
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex justify-between text-sm text-text/60 mb-3 px-1">
          <span className="font-semibold">{t.question} {qIdx + 1} {t.of} {questions.length}</span>
          <span className="font-bold text-accent">{Math.round(((qIdx + 1) / questions.length) * 100)}%</span>
        </div>
        <div className="h-3 bg-card rounded-full overflow-hidden shadow-inner" role="progressbar" aria-valuenow={qIdx + 1} aria-valuemin={1} aria-valuemax={questions.length} aria-label={`${t.question} ${qIdx + 1} ${t.of} ${questions.length}`}>
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
          <h2 id={`question-${q.id}`} className="text-2xl md:text-3xl lg:text-4xl font-bold break-words leading-tight flex-1 text-text">
            {t.questions[q.id]}
          </h2>
          {hasHelpForQuestion[q.id] && (
            <button
              onClick={() => onShowHelp(q.id)}
              className="flex-shrink-0 p-2 md:p-3 min-h-[44px] min-w-[44px] flex items-center justify-center bg-accent/20 hover:bg-accent/40 rounded-full transition-all group"
              aria-label="Learn more about this question"
            >
              <HelpCircle className="w-6 h-6 md:w-7 md:h-7 text-accent group-hover:text-accent/80 transition-colors" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Select Input */}
        {q.type === 'select' && (
          <div>
            <select
              aria-labelledby={`question-${q.id}`}
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
              <option value="" className="bg-primary text-white">{t.selectOption}</option>
              {q.options.map(o => (
                <option key={o} value={o} className="bg-primary text-white">{t.options[o]}</option>
              ))}
            </select>
            {shouldShowDontKnow(q) && (
              <DontKnowButton questionId={q.id} answer={answers[q.id]} onDontKnow={onDontKnow} t={t} className="mt-3" />
            )}
          </div>
        )}

        {/* Date Input */}
        {q.type === 'date' && (
          <DateInputField
            questionId={q.id}
            value={answers[q.id] === 'unknown' ? '' : (answers[q.id] || '')}
            onChange={(newValue) => {
              if (newValue !== '') {
                const enteredDate = new Date(newValue);
                const minDate = new Date('1900-01-01');
                const maxDate = new Date();

                if (enteredDate >= minDate && enteredDate <= maxDate) {
                  onUpdateAnswer(q.id, newValue);
                }
              } else {
                onUpdateAnswer(q.id, newValue);
              }
            }}
            helpText={QUESTION_HELP_TEXT[q.id] || 'Select the date'}
          />
        )}

        {/* Number Input */}
        {q.type === 'number' && (
          <div>
            <div className="relative">
              {!NON_CURRENCY_NUMBER_FIELDS.has(q.id) && (
                <span className={SHARED_STYLES.currencySymbol}>$</span>
              )}
              <input
                type="text"
                inputMode={NON_CURRENCY_NUMBER_FIELDS.has(q.id) ? 'numeric' : 'decimal'}
                value={answers[q.id] === 'unknown' ? '' : (answers[q.id] || '')}
                onKeyDown={(e) => {
                  // Handle Enter key - blur input to close mobile keyboard and advance
                  if (e.key === 'Enter' || e.keyCode === 13) {
                    e.target.blur();
                    if (answers[q.id] !== undefined && answers[q.id] !== '') {
                      onNext();
                    }
                    return;
                  }
                  // Allow: backspace, delete, tab, escape, decimal point (for currency)
                  if ([8, 9, 27, 46].includes(e.keyCode) ||
                      // Allow: Ctrl/Cmd+A, Ctrl/Cmd+C, Ctrl/Cmd+V, Ctrl/Cmd+X
                      (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                      (e.keyCode === 67 && (e.ctrlKey === true || e.metaKey === true)) ||
                      (e.keyCode === 86 && (e.ctrlKey === true || e.metaKey === true)) ||
                      (e.keyCode === 88 && (e.ctrlKey === true || e.metaKey === true)) ||
                      // Allow: home, end, left, right
                      (e.keyCode >= 35 && e.keyCode <= 39)) {
                    // Allow decimal point only for currency fields and only once
                    if (e.keyCode === 190 || e.keyCode === 110) {
                      if (NON_CURRENCY_NUMBER_FIELDS.has(q.id) || (e.target.value && e.target.value.includes('.'))) {
                        e.preventDefault();
                      }
                    }
                    return;
                  }
                  // Ensure that it is a number and prevent any non-numeric characters
                  if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                  }
                }}
                onPaste={(e) => {
                  // Get pasted data
                  const pastedData = e.clipboardData.getData('text');
                  // Check if pasted data is a valid positive number
                  const isValidNumber = /^\d*\.?\d+$/.test(pastedData) && parseFloat(pastedData) >= 0;
                  if (!isValidNumber) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  let newValue = e.target.value;

                  // Remove any non-numeric characters except decimal point
                  newValue = newValue.replace(/[^0-9.]/g, '');

                  // Ensure only one decimal point
                  const parts = newValue.split('.');
                  if (parts.length > 2) {
                    newValue = parts[0] + '.' + parts.slice(1).join('');
                  }

                  // For non-currency fields, remove decimal point
                  if (NON_CURRENCY_NUMBER_FIELDS.has(q.id)) {
                    newValue = newValue.replace(/\./g, '');
                  }

                  if (newValue !== '') {
                    const numValue = parseFloat(newValue);
                    if (!isNaN(numValue) && numValue >= 0) {
                      const minValue = q.min !== undefined ? q.min : 0;

                      if (numValue < minValue) {
                        newValue = minValue.toString();
                      } else if (q.max !== undefined && numValue > q.max) {
                        newValue = q.max.toString();
                      }
                    } else if (numValue < 0) {
                      // Prevent negative numbers
                      return;
                    }
                  }

                  onUpdateAnswer(q.id, newValue);
                }}
                style={SHARED_STYLES.formInputBg}
                className={SHARED_STYLES.numberInput(!NON_CURRENCY_NUMBER_FIELDS.has(q.id))}
                placeholder={QUESTION_PLACEHOLDERS[q.id] || (NON_CURRENCY_NUMBER_FIELDS.has(q.id) ? 'Enter number' : t.enterAmount)}
                pattern="[0-9]*\.?[0-9]*"
                aria-labelledby={`question-${q.id}`}
              />
            </div>
            <p className="mt-2 text-sm text-text/60">
              {QUESTION_HELP_TEXT[q.id] || (NON_CURRENCY_NUMBER_FIELDS.has(q.id) ? 'Enter the number' : 'Enter the total amount in dollars')}
            </p>
            {shouldShowDontKnow(q) && (
              <DontKnowButton questionId={q.id} answer={answers[q.id]} onDontKnow={onDontKnow} t={t} className="mt-3" />
            )}
          </div>
        )}

        {/* Text Input */}
        {q.type === 'text' && (
          <div>
            <input
              type="text"
              aria-labelledby={`question-${q.id}`}
              value={answers[q.id] || ''}
              onChange={(e) => onUpdateAnswer(q.id, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.keyCode === 13) {
                  e.target.blur();
                  if (answers[q.id]) {
                    onNext();
                  }
                }
              }}
              style={SHARED_STYLES.formInputBg}
              className={SHARED_STYLES.textInput}
              placeholder={QUESTION_PLACEHOLDERS[q.id] || 'Enter text'}
            />
            <p className="mt-2 text-sm text-text/60">
              {QUESTION_HELP_TEXT[q.id] || 'Enter the requested information'}
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
                      <Check className="w-6 h-6" aria-hidden="true" />
                      {t.yes}
                    </span>
                  ) : t.no}
                </button>
            ))}
          </div>
            {shouldShowDontKnow(q) && (
              <DontKnowButton questionId={q.id} answer={answers[q.id]} onDontKnow={onDontKnow} t={t} className="mt-3 w-full" />
            )}
        </div>
        )}

        {/* Slider Input */}
        {q.type === 'slider' && (
          <div>
            <div className="relative">
              <input
                type="range"
                aria-labelledby={`question-${q.id}`}
                aria-valuetext={`${answers[q.id] === 'unknown' ? 0 : (answers[q.id] || 0)}% - ${answers[q.id] === 'unknown' ? 'Unknown' : answers[q.id] > 50 ? 'Mostly my fault' : answers[q.id] > 0 ? 'Partially my fault' : 'Not my fault at all'}`}
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
              <DontKnowButton questionId={q.id} answer={answers[q.id]} onDontKnow={onDontKnow} t={t} className="mt-4 w-full" />
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
      {answers[q.id] === undefined && (
        <p className="text-center text-sm text-textMuted mt-2">{t.answerToContinue}</p>
      )}
    </div>
  );
}

DateInputField.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  helpText: PropTypes.string,
  questionId: PropTypes.string
};

Questionnaire.propTypes = {
  t: PropTypes.object.isRequired,
  q: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['select', 'date', 'number', 'text', 'boolean', 'slider']).isRequired,
    options: PropTypes.array,
    min: PropTypes.number,
    max: PropTypes.number
  }).isRequired,
  qIdx: PropTypes.number.isRequired,
  questions: PropTypes.array.isRequired,
  answers: PropTypes.object.isRequired,
  selectedCase: PropTypes.string,
  selectedState: PropTypes.string,
  hasHelpForQuestion: PropTypes.object.isRequired,
  NON_CURRENCY_NUMBER_FIELDS: PropTypes.instanceOf(Set).isRequired,
  onBack: PropTypes.func.isRequired,
  onShowHelp: PropTypes.func.isRequired,
  onUpdateAnswer: PropTypes.func.isRequired,
  onDontKnow: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
  shouldShowDontKnow: PropTypes.func.isRequired
};

export default memo(Questionnaire);
