/**
 * useScrollToTop Hook
 * Provides scroll-to-top functionality with reduced motion support
 */
import { useEffect, useCallback } from 'react';

/**
 * Scrolls to top on mount
 * @param {boolean} enabled - Whether to scroll on mount (default: true)
 * @param {string} behavior - Scroll behavior: 'instant' | 'smooth' | 'auto' (default: 'instant')
 */
export function useScrollToTop(enabled = true, behavior = 'instant') {
  useEffect(() => {
    if (enabled) {
      window.scrollTo({ top: 0, left: 0, behavior });
    }
  }, [enabled, behavior]);
}

/**
 * Scrolls to top with reduced motion preference support
 * @param {Array} dependencies - Dependencies array to trigger scroll
 */
export function useScrollToTopOnChange(dependencies = []) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);
}

/**
 * Returns a scroll-to-top function
 * @returns {Function} scrollToTop function
 */
export function useScrollToTopCallback() {
  return useCallback((behavior = 'instant') => {
    window.scrollTo({ top: 0, left: 0, behavior });
  }, []);
}

export default useScrollToTop;
