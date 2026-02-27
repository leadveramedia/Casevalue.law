/**
 * Share URL Utilities
 * Handles encoding/decoding of share links with 10-day expiration
 */

const EXPIRATION_DAYS = 10;

/**
 * Encode share data into a URL-safe base64 string
 * @param {Object} data - The data to encode
 * @param {string} data.caseType - The selected case type
 * @param {string} data.state - The selected state
 * @param {Object} data.valuation - The valuation result
 * @returns {string} - Base64 encoded string
 */
export function encodeShareData({ caseType, state, valuation }) {
  const payload = {
    c: caseType,
    s: state,
    v: {
      val: valuation.value,
      low: valuation.lowRange,
      high: valuation.highRange,
      f: valuation.factors,
      w: valuation.warnings || []
    },
    exp: Date.now() + (EXPIRATION_DAYS * 24 * 60 * 60 * 1000)
  };

  const jsonString = JSON.stringify(payload);
  // Use base64url encoding (URL-safe)
  return btoa(jsonString)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Decode share data from a base64 string
 * @param {string} encoded - The base64 encoded string
 * @returns {Object|null} - Decoded data or null if invalid/expired
 */
export function decodeShareData(encoded) {
  try {
    // Restore base64 padding and characters
    let base64 = encoded
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    // Add padding if needed
    while (base64.length % 4) {
      base64 += '=';
    }

    const jsonString = atob(base64);
    const payload = JSON.parse(jsonString);

    // Check expiration
    if (payload.exp && Date.now() > payload.exp) {
      return { expired: true };
    }

    // Reconstruct valuation object
    return {
      caseType: payload.c,
      state: payload.s,
      valuation: {
        value: payload.v.val,
        lowRange: payload.v.low,
        highRange: payload.v.high,
        factors: payload.v.f,
        warnings: payload.v.w
      },
      expiresAt: payload.exp,
      isSharedResult: true
    };
  } catch (e) {
    console.error('Failed to decode share data:', e);
    return null;
  }
}

/**
 * Generate a shareable URL
 * @param {Object} data - The share data
 * @returns {string} - The full shareable URL
 */
export function generateShareUrl(data) {
  const encoded = encodeShareData(data);
  const baseUrl = window.location.origin;
  return `${baseUrl}/#share=${encoded}`;
}

/**
 * Parse share parameter from URL hash
 * @param {string} hash - The URL hash
 * @returns {Object|null} - Decoded share data or null
 */
export function parseShareHash(hash) {
  if (!hash || !hash.includes('share=')) {
    return null;
  }

  const match = hash.match(/share=([^&]+)/);
  if (!match) {
    return null;
  }

  return decodeShareData(match[1]);
}

/**
 * Calculate days until expiration
 * @param {number} expiresAt - Expiration timestamp
 * @returns {number} - Days remaining
 */
export function getDaysUntilExpiration(expiresAt) {
  const remaining = expiresAt - Date.now();
  return Math.ceil(remaining / (24 * 60 * 60 * 1000));
}
