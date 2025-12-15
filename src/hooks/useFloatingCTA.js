/**
 * useFloatingCTA Hook
 * Manages floating CTA visibility based on primary CTA intersection
 */
import { useState, useEffect } from 'react';

/**
 * Hook for managing floating CTA visibility
 * Shows floating CTA when primary CTA is not visible on screen
 *
 * @param {string} step - Current step in the app flow
 * @param {React.RefObject} primaryCTARef - Ref to the primary CTA button
 * @returns {boolean} Whether to show the floating CTA
 */
export function useFloatingCTA(step, primaryCTARef) {
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);

  useEffect(() => {
    // Only show floating CTA on landing page
    if (step !== 'landing') {
      setShowFloatingCTA(false);
      return;
    }

    const node = primaryCTARef.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show floating CTA when primary CTA is not intersecting (not visible)
        setShowFloatingCTA(!entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [step, primaryCTARef]);

  return showFloatingCTA;
}
