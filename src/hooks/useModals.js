/**
 * useModals Hook
 * Centralized modal state management for the application
 */
import { useState, useCallback } from 'react';

export function useModals() {
  // Modal visibility states
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showPrivacyPage, setShowPrivacyPage] = useState(false);
  const [showTermsPage, setShowTermsPage] = useState(false);
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [showMissingDataWarning, setShowMissingDataWarning] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [hasShownWarning, setHasShownWarning] = useState(false);

  // Help modal content
  const [helpModalContent, setHelpModalContent] = useState({ title: '', content: '' });

  // Open specific modals
  const openPrivacyModal = useCallback(() => setShowPrivacy(true), []);
  const openPrivacyPage = useCallback(() => setShowPrivacyPage(true), []);
  const openTermsPage = useCallback(() => setShowTermsPage(true), []);
  const openCookieConsent = useCallback(() => setShowCookieConsent(true), []);
  const openMissingDataWarning = useCallback(() => {
    if (!hasShownWarning) {
      setShowMissingDataWarning(true);
      setHasShownWarning(true);
    }
  }, [hasShownWarning]);
  const openHelpModal = useCallback((title, content) => {
    setHelpModalContent({ title, content });
    setShowHelpModal(true);
  }, []);

  // Close all modals
  const closeAllModals = useCallback(() => {
    setShowPrivacy(false);
    setShowPrivacyPage(false);
    setShowTermsPage(false);
    setShowMissingDataWarning(false);
    setShowHelpModal(false);
  }, []);

  // Close specific modal (useful for individual close buttons)
  const closePrivacyModal = useCallback(() => setShowPrivacy(false), []);
  const closePrivacyPage = useCallback(() => setShowPrivacyPage(false), []);
  const closeTermsPage = useCallback(() => setShowTermsPage(false), []);
  const closeCookieConsent = useCallback(() => setShowCookieConsent(false), []);
  const closeMissingDataWarning = useCallback(() => setShowMissingDataWarning(false), []);
  const closeHelpModal = useCallback(() => setShowHelpModal(false), []);

  // Check if any modal is open (for body scroll lock)
  const isAnyModalOpen = showPrivacy || showHelpModal || showMissingDataWarning;

  return {
    // Visibility states
    showPrivacy,
    showPrivacyPage,
    showTermsPage,
    showCookieConsent,
    showMissingDataWarning,
    showHelpModal,
    hasShownWarning,

    // Help modal content
    helpModalContent,

    // Computed
    isAnyModalOpen,

    // Setters (for history management compatibility)
    setShowPrivacy,
    setShowPrivacyPage,
    setShowTermsPage,
    setShowCookieConsent,
    setShowMissingDataWarning,
    setShowHelpModal,

    // Open actions
    openPrivacyModal,
    openPrivacyPage,
    openTermsPage,
    openCookieConsent,
    openMissingDataWarning,
    openHelpModal,

    // Close actions
    closeAllModals,
    closePrivacyModal,
    closePrivacyPage,
    closeTermsPage,
    closeCookieConsent,
    closeMissingDataWarning,
    closeHelpModal,
  };
}
