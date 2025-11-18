/**
 * ResultsPage Component
 * Displays the case valuation results with factors and disclaimer
 */
import { Check, AlertCircle } from 'lucide-react';

export default function ResultsPage({ t, valuation, onBack }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      {/* Back to Home Button */}
      <button
        onClick={onBack}
        className="mb-6 px-6 py-3 bg-buttonActive hover:bg-opacity-90 rounded-xl transition-all text-text flex items-center gap-2 text-base font-semibold border-2 border-accent/50 hover:border-accent shadow-lg hover:shadow-xl"
      >
        {t.backHome}
      </button>

      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center mb-12 px-4 text-text">
        {t.yourEstimate}
      </h2>

      {/* Valuation Card */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-xl rounded-3xl p-8 md:p-12 border-2 border-accent/40 shadow-2xl">
        <div className="text-center mb-10">
          <div className="text-text/70 mb-3 text-xl font-semibold">{t.range}</div>
          <div className="overflow-x-auto pb-2 -mx-4 px-4">
            <div className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-accent whitespace-nowrap mb-4 inline-block min-w-full text-center">
              ${valuation.value.toLocaleString()} USD
            </div>
          </div>
          <div className="text-base sm:text-lg text-text/60 overflow-x-auto pb-2">
            <div className="whitespace-nowrap inline-block">
              Range: ${valuation.lowRange.toLocaleString()} - ${valuation.highRange.toLocaleString()} USD
            </div>
          </div>
        </div>

        {/* Factors */}
        <div className="border-t-2 border-primary/20 pt-8">
          <h3 className="font-bold mb-6 flex items-center gap-3 text-xl md:text-2xl text-text">
            <Check className="w-7 h-7 text-green-400 flex-shrink-0" />
            {t.factors}
          </h3>
          <ul className="space-y-3">
            {valuation.factors.map((f, i) => (
              <li key={i} className="flex items-start gap-3 text-text/80 text-base md:text-lg break-words">
                <span className="text-accent mt-1 flex-shrink-0 text-2xl font-bold">•</span>
                <span className="leading-relaxed">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* State-Specific Warnings */}
        {valuation.warnings && valuation.warnings.length > 0 && (
          <>
            {/* Critical SOL Warning (if case is time-barred) */}
            {valuation.warnings.some(w => w.includes('CRITICAL') || w.includes('time-barred')) && (
              <div className="mt-8 p-6 bg-red-500/30 border-3 border-red-500/60 rounded-xl shadow-lg animate-pulse">
                <h4 className="font-bold mb-4 flex items-center gap-2 text-xl text-red-200">
                  <AlertCircle className="w-7 h-7 text-red-400 flex-shrink-0" />
                  CRITICAL: Case May Be Time-Barred
                </h4>
                <ul className="space-y-3">
                  {valuation.warnings
                    .filter(w => w.includes('CRITICAL') || w.includes('time-barred'))
                    .map((warning, i) => (
                      <li key={i} className="text-base md:text-lg text-red-100 leading-relaxed font-semibold flex items-start gap-3">
                        <span className="text-red-400 mt-1 flex-shrink-0 text-2xl">⚠</span>
                        <span>{warning.replace('🚨 ', '')}</span>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Urgent SOL Warning (less than 1 year remaining) */}
            {valuation.warnings.some(w => w.includes('URGENT') && !w.includes('CRITICAL')) && (
              <div className="mt-8 p-5 bg-orange-500/25 border-2 border-orange-500/50 rounded-xl">
                <h4 className="font-bold mb-3 flex items-center gap-2 text-lg text-orange-200">
                  <AlertCircle className="w-6 h-6 text-orange-400 flex-shrink-0" />
                  Urgent: Filing Deadline Approaching
                </h4>
                <ul className="space-y-2">
                  {valuation.warnings
                    .filter(w => w.includes('URGENT') && !w.includes('CRITICAL'))
                    .map((warning, i) => (
                      <li key={i} className="text-sm md:text-base text-orange-100 leading-relaxed font-medium flex items-start gap-2">
                        <span className="text-orange-400 mt-1 flex-shrink-0">•</span>
                        <span>{warning.replace('⚠️ ', '')}</span>
                      </li>
                    ))}
                </ul>
              </div>
            )}

            {/* Standard State-Specific Considerations */}
            {valuation.warnings.filter(w => !w.includes('CRITICAL') && !w.includes('URGENT')).length > 0 && (
              <div className="mt-8 p-5 bg-primary/20 border-2 border-primary/40 rounded-xl">
                <h4 className="font-bold mb-3 flex items-center gap-2 text-lg text-text">
                  <AlertCircle className="w-5 h-5 text-primary flex-shrink-0" />
                  State-Specific Considerations
                </h4>
                <ul className="space-y-2">
                  {valuation.warnings
                    .filter(w => !w.includes('CRITICAL') && !w.includes('URGENT'))
                    .map((warning, i) => (
                      <li key={i} className="text-sm md:text-base text-text/80 leading-relaxed flex items-start gap-2">
                        <span className="text-primary mt-1 flex-shrink-0">•</span>
                        <span>{warning}</span>
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </>
        )}

        {/* Disclaimer */}
        <div className="mt-8 p-5 bg-accent/20 border-2 border-accent/40 rounded-xl flex items-start gap-4">
          <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-0.5" />
          <p className="text-sm md:text-base text-text/80 leading-relaxed font-medium">
            {t.disclaimer}
          </p>
        </div>
      </div>
    </div>
  );
}
