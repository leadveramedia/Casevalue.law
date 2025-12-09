import { useState, useEffect } from 'react';
import { uiTranslationsEN as englishTranslations } from '../translations/ui-en';

// ============================================================================
// TRANSLATION CACHING
// ============================================================================
// Cache for loaded UI translations - English is pre-loaded to prevent layout shift
const uiTranslationCache = {
  en: englishTranslations  // Pre-cache English since it's the default language
};

// Cache for loaded help text translations
const helpTextTranslationCache = {};

// ============================================================================
// UI TRANSLATIONS LOADER
// ============================================================================
const getUITranslations = async (lang) => {
  // Check cache first
  if (uiTranslationCache[lang]) {
    return uiTranslationCache[lang];
  }

  // Dynamically import UI translations for non-English languages
  try {
    if (lang === 'zh') {
      const { uiTranslationsZH } = await import('../translations/ui-zh');
      uiTranslationCache.zh = uiTranslationsZH;
      return uiTranslationsZH;
    }
    if (lang === 'es') {
      const { uiTranslationsES } = await import('../translations/ui-es');
      uiTranslationCache.es = uiTranslationsES;
      return uiTranslationsES;
    }
  } catch (error) {
    console.error(`Failed to load ${lang} UI translations:`, error);
  }

  // Fallback to English if loading fails
  return englishTranslations;
};

// ============================================================================
// HELP TEXT TRANSLATIONS LOADER
// ============================================================================
export const getQuestionExplanations = async (lang) => {
  // Check cache first
  if (helpTextTranslationCache[lang]) {
    return helpTextTranslationCache[lang];
  }

  // Dynamically import help text translations for all languages
  try {
    if (lang === 'zh') {
      const { helpTextZH } = await import('../translations/zh');
      helpTextTranslationCache.zh = helpTextZH;
      return helpTextZH;
    }
    if (lang === 'es') {
      const { helpTextES } = await import('../translations/es');
      helpTextTranslationCache.es = helpTextES;
      return helpTextES;
    }
    // English is also lazy-loaded now
    if (lang === 'en') {
      const { helpTextEN } = await import('../translations/en');
      helpTextTranslationCache.en = helpTextEN;
      return helpTextEN;
    }
  } catch (error) {
    console.error(`Failed to load ${lang} help text:`, error);
  }

  // If loading fails, return empty object
  return {};
};

// ============================================================================
// CUSTOM HOOK
// ============================================================================
/**
 * Custom hook to manage translations
 * @param {string} initialLang - Initial language code (en, es, zh)
 * @returns {Object} - { lang, setLang, uiTranslations, isLoading }
 */
export function useTranslations(initialLang = 'en') {
  // Check URL parameter for language on mount
  const getInitialLang = () => {
    const params = new URLSearchParams(window.location.search);
    const urlLang = params.get('lang');
    const validLangs = ['en', 'es', 'zh'];
    return validLangs.includes(urlLang) ? urlLang : initialLang;
  };

  const [lang, setLang] = useState(getInitialLang);
  const [uiTranslations, setUiTranslations] = useState(englishTranslations);
  const [isLoading, setIsLoading] = useState(false);

  // Load UI translations when language changes
  useEffect(() => {
    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        const translations = await getUITranslations(lang);
        setUiTranslations(translations);
      } catch (error) {
        console.error('Failed to load translations:', error);
        // Fallback to English on error
        setUiTranslations(englishTranslations);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [lang]);

  // Update URL parameter when language changes
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const currentLang = params.get('lang');

    // Only update URL if language is different from current URL parameter
    if (currentLang !== lang) {
      params.set('lang', lang);
      // Preserve the hash when updating URL
      const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
      window.history.replaceState({}, '', newUrl);
    }
  }, [lang]);

  return {
    lang,
    setLang,
    uiTranslations,
    isLoading
  };
}
