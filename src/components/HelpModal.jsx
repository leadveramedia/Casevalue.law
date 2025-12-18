import React from 'react';

const HelpModal = ({ show, onClose, title, content, closeText }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border-2 border-cardBorder shadow-legal-lg my-auto">
        <div className="sticky top-0 bg-accent border-b-2 border-cardBorder p-6 md:p-8 z-10">
          {/* Header with title and close button */}
          <div className="flex justify-between items-start gap-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white leading-tight flex-1">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="px-5 py-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all text-white text-base font-bold flex-shrink-0 shadow-legal-sm"
            >
              {closeText}
            </button>
          </div>
        </div>

        <div className="p-6 md:p-10 space-y-6 text-text">
          <div className="bg-gray-50 border-2 border-cardBorder rounded-2xl p-6 md:p-8 hover:border-accent/40 transition-all shadow-legal-sm">
            <div className="prose prose-lg max-w-none">
              {content.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-base md:text-lg text-textMuted leading-relaxed mb-5 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div className="text-center pt-4">
            <button
              onClick={onClose}
              className="px-10 py-4 bg-accent hover:bg-accentHover rounded-xl shadow-legal-lg transition-all font-bold text-lg text-white transform hover:scale-105"
            >
              Got It
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
