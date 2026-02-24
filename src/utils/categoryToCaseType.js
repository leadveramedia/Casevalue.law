/**
 * Mapping utility for blog categories to case type questionnaires
 */

export const categoryToCaseType = {
  'motor-vehicle': 'motor',
  'medical-malpractice': 'medical',
  'premises-liability': 'premises',
  'product-liability': 'product',
  'wrongful-death': 'wrongful_death',
  'dog-bites': 'dog_bite',
  'civil-rights': 'civil_rights',
  'employment-law': 'wrongful_term',
  'wage-and-hour': 'wage',
  'class-action': 'class_action',
  'insurance-bad-faith': 'insurance',
  'disability': 'disability',
  'professional-malpractice': 'professional',
  'intellectual-property': 'ip',
  'workers-compensation': 'workers_comp',
  'personal-injury': 'motor', // default to motor for generic PI
};

/**
 * Get the case type ID from a blog category
 * @param {string} category - The blog category slug
 * @returns {string|null} The case type ID or null if not mapped
 */
export function getCaseTypeFromCategory(category) {
  return categoryToCaseType[category] || null;
}

/**
 * Get the questionnaire link for a blog category
 * @param {string|string[]} categories - Single category or array of categories
 * @returns {string} The questionnaire deep link or homepage
 */
export function getQuestionnaireLink(categories) {
  const categoryList = Array.isArray(categories) ? categories : [categories];

  // First pass: look for specific categories (not personal-injury)
  for (const category of categoryList) {
    if (category === 'personal-injury') continue;
    const caseType = getCaseTypeFromCategory(category);
    if (caseType) {
      return `/#case/${caseType}/0`;
    }
  }

  // Second pass: use personal-injury as fallback if present
  if (categoryList.includes('personal-injury')) {
    return `/#case/${categoryToCaseType['personal-injury']}/0`;
  }

  // Fallback to homepage
  return '/';
}
