/**
 * State slug mapping for state × case type landing pages.
 * Slugs are lowercase hyphenated versions of state names.
 * Used for /[stateSlug]/[caseSlug]-calculator routes.
 */
import { STATE_LEGAL_DATABASE } from './stateLegalDatabase';

/**
 * Convert a state name to a URL slug.
 * e.g. "New York" → "new-york", "District of Columbia" → "district-of-columbia"
 */
function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z-]/g, '');
}

// Maps URL slug → { code, name }
// e.g. 'california' → { code: 'CA', name: 'California' }
export const stateSlugToInfo = Object.fromEntries(
  Object.entries(STATE_LEGAL_DATABASE).map(([code, data]) => [
    slugify(data.name),
    { code, name: data.name }
  ])
);

// Maps state code → URL slug
// e.g. 'CA' → 'california'
export const stateCodeToSlug = Object.fromEntries(
  Object.entries(STATE_LEGAL_DATABASE).map(([code, data]) => [
    code,
    slugify(data.name)
  ])
);

// All valid state slugs (sorted alphabetically)
export const allStateSlugs = Object.keys(stateSlugToInfo).sort();

// Maps case type ID → STATE_LEGAL_DATABASE field name
export const caseTypeToDbKey = {
  motor: 'motorVehicle',
  medical: 'medicalMalpractice',
  premises: 'premises',
  product: 'productLiability',
  wrongful_death: 'wrongfulDeath',
  dog_bite: 'dogBite',
  wrongful_term: 'wrongfulTermination',
  wage: 'wageTheft',
  class_action: 'classAction',
  insurance: 'insuranceBadFaith',
  disability: 'disability',
  professional: 'professionalMalpractice',
  civil_rights: 'civilRights',
  ip: 'intellectualProperty',
  workers_comp: 'workersCompensation',
  lemon_law: 'lemonLaw',
};

// Human-readable negligence system labels
export const negligenceLabels = {
  pure_comparative: 'Pure Comparative Fault',
  modified_50: 'Modified Comparative Fault (50% Bar)',
  modified_51: 'Modified Comparative Fault (51% Bar)',
  contributory: 'Contributory Negligence',
};
