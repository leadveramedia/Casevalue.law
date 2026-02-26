import { useEffect, useRef } from 'react';

/**
 * useModalFocus - Manages focus for modal dialogs
 * On open: stores the trigger element and moves focus into the modal
 * On close: returns focus to the trigger element
 */
export function useModalFocus(isOpen) {
  const triggerRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Store the element that triggered the modal
      triggerRef.current = document.activeElement;

      // Move focus into the modal after render
      requestAnimationFrame(() => {
        const modal = document.querySelector('[role="dialog"]');
        if (modal) {
          const firstFocusable = modal.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (firstFocusable) {
            firstFocusable.focus();
          } else {
            modal.setAttribute('tabindex', '-1');
            modal.focus();
          }
        }
      });
    } else if (triggerRef.current) {
      // Return focus to the trigger element
      triggerRef.current.focus();
      triggerRef.current = null;
    }
  }, [isOpen]);
}
