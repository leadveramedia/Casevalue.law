/**
 * CaseSelection Component
 * Displays a grid of case types for the user to select from
 */
import { memo } from 'react';
import PropTypes from 'prop-types';
import { ChevronRight } from 'lucide-react';
import { SHARED_STYLES } from '../shared/sharedStyles';

function CaseSelection({ t, caseTypes, onBack, onCaseSelect }) {
  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <h1 className="sr-only">{t.selectCase}</h1>
      {/* Back to Home Button */}
      <button
        onClick={onBack}
        className={SHARED_STYLES.backToHomeButton}
      >
        {t.backHome}
      </button>

      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-10 md:mb-14 px-4 text-text">
        {t.selectCase}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
        {caseTypes.map((c, index) => (
          <button
            key={c.id}
            onClick={() => onCaseSelect(c.id)}
            className="relative overflow-hidden rounded-2xl border-2 border-cardBorder hover:border-accent transition-all text-left group h-56 md:h-64 hover:scale-[1.03] transform shadow-xl hover:shadow-2xl"
            style={{ contain: 'layout' }}
          >
            {/* Image with fallback - First 3 images load immediately for LCP optimization */}
            <img
              src={c.img}
              alt={t.caseTypes[c.id]}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading={index < 3 ? 'eager' : 'lazy'}
              fetchPriority={index === 0 ? 'high' : undefined}
              width="400"
              height="300"
              style={{ aspectRatio: '4/3' }}
              onError={(e) => {
                e.target.style.display = 'none';
                const parent = e.target.parentElement;
                if (parent) {
                  parent.classList.add('bg-gradient-to-br', ...c.gradient.split(' '));
                }
              }}
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent group-hover:from-black/85 transition-all duration-300"></div>

            {/* Text content */}
            <div className="relative z-10 p-6 md:p-7 h-full flex items-end">
              <h3 className="font-bold text-xl md:text-2xl text-text drop-shadow-2xl leading-tight group-hover:text-accent transition-colors">
                {t.caseTypes[c.id]}
              </h3>
            </div>

            {/* Hover arrow */}
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
              <ChevronRight className="w-8 h-8 text-accent" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

CaseSelection.propTypes = {
  t: PropTypes.object.isRequired,
  caseTypes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    img: PropTypes.string,
    gradient: PropTypes.string
  })).isRequired,
  onBack: PropTypes.func.isRequired,
  onCaseSelect: PropTypes.func.isRequired
};

export default memo(CaseSelection);
