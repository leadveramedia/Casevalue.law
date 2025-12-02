/**
 * Logo Component
 * Reusable CaseValue.law logo for navigation and branding
 */
import { memo } from 'react';

export default memo(function Logo() {
  return (
    <>
      <span className="sr-only">CaseValue.law</span>
      {/* Desktop Logo */}
      <div className="hidden sm:flex flex-col leading-none text-left">
        <span className="text-2xl md:text-3xl font-serif tracking-tight text-text">case</span>
        <span className="relative mt-1 inline-flex">
          <span className="absolute inset-0 translate-x-1.5 translate-y-1.5 border-2 border-[#FFA000] rounded-sm pointer-events-none z-0"></span>
          <span className="relative z-10 px-3 py-1 bg-gradient-gold text-textDark font-black uppercase tracking-tight text-2xl md:text-3xl rounded-sm">
            value
          </span>
        </span>
        <span className="text-2xl md:text-3xl font-serif tracking-tight mt-1 self-end text-text">.law</span>
      </div>
      {/* Mobile Logo */}
      <div className="sm:hidden flex items-center gap-1 text-xl font-extrabold">
        <span className="text-text">case</span>
        <span className="relative inline-flex">
          <span className="absolute inset-0 translate-x-[3px] translate-y-[3px] border border-[#FFA000] rounded-sm pointer-events-none z-0"></span>
          <span className="relative z-10 px-2 py-0.5 bg-gradient-gold text-textDark rounded-sm">value</span>
        </span>
        <span className="text-text">.law</span>
      </div>
    </>
  );
});
