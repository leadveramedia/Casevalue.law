/**
 * Conversion Tracking Utilities
 * Handles PPC conversion tracking for Google Ads, Facebook, Bing, and LinkedIn
 *
 * CONFIGURATION: Replace the placeholder IDs below with your actual tracking IDs
 * Search for "YOUR_" to find all placeholders that need to be configured
 */

// ============================================================================
// TRACKING IDS - REPLACE THESE WITH YOUR ACTUAL IDS
// ============================================================================
const TRACKING_CONFIG = {
  // Google Ads - Get from: Google Ads → Tools → Conversions
  googleAds: {
    conversionId: 'YOUR_GOOGLE_ADS_ID', // e.g., 'AW-123456789'
    conversionLabel: 'YOUR_GOOGLE_CONVERSION_LABEL', // e.g., 'AbCdEfGhIjKlMnOp'
  },

  // Facebook Pixel - Get from: Facebook Business Manager → Events Manager
  facebook: {
    pixelId: 'YOUR_FACEBOOK_PIXEL_ID', // e.g., '1234567890123456'
  },

  // Bing UET - Get from: Microsoft Advertising → Tools → UET tags
  bing: {
    tagId: 'YOUR_BING_UET_ID', // e.g., '12345678'
  },

  // LinkedIn - Get from: LinkedIn Campaign Manager → Account Assets
  linkedin: {
    partnerId: 'YOUR_LINKEDIN_PARTNER_ID', // e.g., '123456'
    conversionId: 'YOUR_LINKEDIN_CONVERSION_ID', // e.g., '7890123'
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if user has accepted cookie consent
 * @returns {boolean}
 */
function hasConsentedToTracking() {
  const consent = localStorage.getItem('cookie-consent');
  return consent === 'accepted';
}

/**
 * Check if a tracking ID is configured (not a placeholder)
 * @param {string} id - The tracking ID to check
 * @returns {boolean}
 */
function isConfigured(id) {
  return id && !id.startsWith('YOUR_');
}

// ============================================================================
// PLATFORM-SPECIFIC TRACKING FUNCTIONS
// ============================================================================

/**
 * Track conversion in Google Ads via gtag
 * @param {Object} data - Conversion data
 */
function trackGoogleAdsConversion({ value, currency = 'USD' }) {
  if (!isConfigured(TRACKING_CONFIG.googleAds.conversionId)) {
    console.log('[Tracking] Google Ads not configured - skipping');
    return;
  }

  if (typeof window.gtag !== 'function') {
    console.log('[Tracking] gtag not loaded - skipping Google Ads conversion');
    return;
  }

  const sendTo = `${TRACKING_CONFIG.googleAds.conversionId}/${TRACKING_CONFIG.googleAds.conversionLabel}`;

  window.gtag('event', 'conversion', {
    send_to: sendTo,
    value: value,
    currency: currency,
  });

  console.log('[Tracking] Google Ads conversion fired:', { value, currency });
}

/**
 * Track conversion in Facebook Pixel
 * @param {Object} data - Conversion data
 */
function trackFacebookConversion({ value, currency = 'USD', caseType }) {
  if (!isConfigured(TRACKING_CONFIG.facebook.pixelId)) {
    console.log('[Tracking] Facebook Pixel not configured - skipping');
    return;
  }

  if (typeof window.fbq !== 'function') {
    console.log('[Tracking] fbq not loaded - skipping Facebook conversion');
    return;
  }

  window.fbq('track', 'Lead', {
    value: value,
    currency: currency,
    content_name: caseType,
    content_category: 'Case Valuation',
  });

  console.log('[Tracking] Facebook conversion fired:', { value, currency, caseType });
}

/**
 * Track conversion in Bing UET
 * @param {Object} data - Conversion data
 */
function trackBingConversion({ value, currency = 'USD' }) {
  if (!isConfigured(TRACKING_CONFIG.bing.tagId)) {
    console.log('[Tracking] Bing UET not configured - skipping');
    return;
  }

  window.uetq = window.uetq || [];

  window.uetq.push('event', 'lead', {
    revenue_value: value,
    currency: currency,
  });

  console.log('[Tracking] Bing conversion fired:', { value, currency });
}

/**
 * Track conversion in LinkedIn Insight Tag
 * @param {Object} data - Conversion data
 */
function trackLinkedInConversion() {
  if (!isConfigured(TRACKING_CONFIG.linkedin.conversionId)) {
    console.log('[Tracking] LinkedIn not configured - skipping');
    return;
  }

  if (typeof window.lintrk !== 'function') {
    console.log('[Tracking] lintrk not loaded - skipping LinkedIn conversion');
    return;
  }

  window.lintrk('track', {
    conversion_id: TRACKING_CONFIG.linkedin.conversionId
  });

  console.log('[Tracking] LinkedIn conversion fired');
}

// ============================================================================
// MAIN TRACKING FUNCTION
// ============================================================================

/**
 * Track a conversion across all configured platforms
 * Only fires if user has consented to tracking cookies
 *
 * @param {Object} data - Conversion data
 * @param {number} data.value - The conversion value (case valuation estimate)
 * @param {string} [data.currency='USD'] - Currency code
 * @param {string} data.caseType - The type of case (e.g., 'motor', 'medical')
 * @param {string} data.state - The state where the case occurred
 */
export function trackConversion({ value, currency = 'USD', caseType, state }) {
  // Check cookie consent first
  if (!hasConsentedToTracking()) {
    console.log('[Tracking] User has not consented to tracking - skipping all conversions');
    return;
  }

  console.log('[Tracking] Firing conversions:', { value, currency, caseType, state });

  // Fire all platform conversions
  try {
    trackGoogleAdsConversion({ value, currency });
  } catch (e) {
    console.error('[Tracking] Google Ads error:', e);
  }

  try {
    trackFacebookConversion({ value, currency, caseType });
  } catch (e) {
    console.error('[Tracking] Facebook error:', e);
  }

  try {
    trackBingConversion({ value, currency });
  } catch (e) {
    console.error('[Tracking] Bing error:', e);
  }

  try {
    trackLinkedInConversion();
  } catch (e) {
    console.error('[Tracking] LinkedIn error:', e);
  }
}

/**
 * Check which tracking platforms are configured
 * Useful for debugging
 * @returns {Object} - Status of each platform
 */
export function getTrackingStatus() {
  return {
    googleAds: isConfigured(TRACKING_CONFIG.googleAds.conversionId),
    facebook: isConfigured(TRACKING_CONFIG.facebook.pixelId),
    bing: isConfigured(TRACKING_CONFIG.bing.tagId),
    linkedin: isConfigured(TRACKING_CONFIG.linkedin.conversionId),
    hasConsent: hasConsentedToTracking(),
  };
}
