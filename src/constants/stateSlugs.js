// State slug mapping for deep linking URLs
// Converts URL-friendly slugs to proper state names

export const stateSlugToName = {
  'alabama': 'Alabama',
  'alaska': 'Alaska',
  'arizona': 'Arizona',
  'arkansas': 'Arkansas',
  'california': 'California',
  'colorado': 'Colorado',
  'connecticut': 'Connecticut',
  'delaware': 'Delaware',
  'florida': 'Florida',
  'georgia': 'Georgia',
  'hawaii': 'Hawaii',
  'idaho': 'Idaho',
  'illinois': 'Illinois',
  'indiana': 'Indiana',
  'iowa': 'Iowa',
  'kansas': 'Kansas',
  'kentucky': 'Kentucky',
  'louisiana': 'Louisiana',
  'maine': 'Maine',
  'maryland': 'Maryland',
  'massachusetts': 'Massachusetts',
  'michigan': 'Michigan',
  'minnesota': 'Minnesota',
  'mississippi': 'Mississippi',
  'missouri': 'Missouri',
  'montana': 'Montana',
  'nebraska': 'Nebraska',
  'nevada': 'Nevada',
  'new-hampshire': 'New Hampshire',
  'new-jersey': 'New Jersey',
  'new-mexico': 'New Mexico',
  'new-york': 'New York',
  'north-carolina': 'North Carolina',
  'north-dakota': 'North Dakota',
  'ohio': 'Ohio',
  'oklahoma': 'Oklahoma',
  'oregon': 'Oregon',
  'pennsylvania': 'Pennsylvania',
  'rhode-island': 'Rhode Island',
  'south-carolina': 'South Carolina',
  'south-dakota': 'South Dakota',
  'tennessee': 'Tennessee',
  'texas': 'Texas',
  'utah': 'Utah',
  'vermont': 'Vermont',
  'virginia': 'Virginia',
  'washington': 'Washington',
  'west-virginia': 'West Virginia',
  'wisconsin': 'Wisconsin',
  'wyoming': 'Wyoming',
  'washington-dc': 'Washington D.C.',
  'district-of-columbia': 'Washington D.C.'
};

// Reverse mapping: state name to URL slug
export const stateNameToSlug = Object.fromEntries(
  Object.entries(stateSlugToName).map(([slug, name]) => [name, slug])
);

// Supported language codes
const SUPPORTED_LANGUAGES = ['en', 'es', 'zh'];

/**
 * Parse a deep link hash for case/state/question/language
 * @param {string} hash - The URL hash (e.g., '#case/motor/california/0/es')
 * @returns {Object|null} - Parsed state or null if not a valid case hash
 */
export function parseDeepLinkHash(hash) {
  if (!hash || !hash.startsWith('#case/')) {
    return null;
  }

  const parts = hash.substring(6).split('/');

  // Format with state: #case/motor/california/0 or #case/motor/california/0/es
  if (parts.length >= 3 && stateSlugToName[parts[1]]) {
    const lang = parts[3] && SUPPORTED_LANGUAGES.includes(parts[3]) ? parts[3] : 'en';
    return {
      selectedCase: parts[0],
      selectedState: stateSlugToName[parts[1]],
      qIdx: parseInt(parts[2]) || 0,
      lang
    };
  }

  // Old format without state: #case/motor/0
  if (parts.length >= 2) {
    return {
      selectedCase: parts[0],
      selectedState: '',
      qIdx: parseInt(parts[1]) || 0,
      lang: 'en'
    };
  }

  return null;
}
