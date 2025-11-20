// ============================================================================
// CASE TYPES DATA
// ============================================================================
// Images optimized with WebP format for better performance (70% smaller file sizes)
export const caseTypes = [
  { id: 'motor', gradient: 'from-red-600 to-orange-600', img: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400&fm=webp&q=80' },
  { id: 'medical', gradient: 'from-blue-600 to-cyan-600', img: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=400&fm=webp&q=80' },
  { id: 'premises', gradient: 'from-gray-600 to-slate-600', img: 'https://images.unsplash.com/photo-1663579392095-6dd5c71d0368?w=400&fm=webp&q=80' },
  { id: 'product', gradient: 'from-purple-600 to-pink-600', img: 'https://images.unsplash.com/photo-1616093053570-0143f27b994d?w=400&fm=webp&q=80' },
  { id: 'wrongful_death', gradient: 'from-slate-700 to-gray-800', img: 'https://images.unsplash.com/photo-1598146621261-7cdbb2b30d4b?w=400&fm=webp&q=80' },
  { id: 'dog_bite', gradient: 'from-amber-600 to-yellow-600', img: 'https://images.unsplash.com/photo-1656409200455-901bf3435b56?w=400&fm=webp&q=80' },
  { id: 'wrongful_term', gradient: 'from-indigo-600 to-blue-600', img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&fm=webp&q=80' },
  { id: 'wage', gradient: 'from-green-600 to-emerald-600', img: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&fm=webp&q=80' },
  { id: 'class_action', gradient: 'from-violet-600 to-purple-600', img: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&fm=webp&q=80' },
  { id: 'insurance', gradient: 'from-teal-600 to-cyan-600', img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&fm=webp&q=80' },
  { id: 'disability', gradient: 'from-sky-600 to-blue-600', img: 'https://images.unsplash.com/photo-1653130892007-6d74996a7978?w=400&fm=webp&q=80' },
  { id: 'professional', gradient: 'from-slate-600 to-zinc-600', img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&fm=webp&q=80' },
  { id: 'civil_rights', gradient: 'from-rose-600 to-red-600', img: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=400&fm=webp&q=80' },
  { id: 'ip', gradient: 'from-fuchsia-600 to-pink-600', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&fm=webp&q=80' }
];

// ============================================================================
// US STATES DATA
// ============================================================================
export const usStates = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'Washington D.C.',
  'West Virginia', 'Wisconsin', 'Wyoming'
];

// ============================================================================
// FIELD OPTIONS
// ============================================================================
export const INJURY_SEVERITY_OPTIONS = ['minor', 'moderate', 'severe', 'catastrophic'];
export const EMOTIONAL_DISTRESS_OPTIONS = ['distress_mild', 'distress_moderate', 'distress_severe', 'distress_extreme'];
export const HAZARD_TYPE_OPTIONS = ['slip_fall', 'trip_fall', 'falling_object', 'inadequate_security', 'structural_failure', 'other'];
export const VIOLATION_TYPE_OPTIONS = ['discrimination_employment', 'discrimination_housing', 'discrimination_public', 'police_excessive_force', 'false_arrest', 'free_speech', 'other'];
export const RELATIONSHIP_OPTIONS = ['spouse', 'child', 'parent', 'sibling', 'other_family', 'other'];
export const INSURANCE_TYPE_OPTIONS = ['auto', 'health', 'homeowners', 'disability', 'life', 'other'];
export const PROFESSIONAL_TYPE_OPTIONS = ['attorney', 'accountant', 'architect', 'engineer', 'financial_advisor', 'real_estate_agent', 'other'];
export const POLICY_TYPE_OPTIONS = ['employer_group', 'individual', 'social_security', 'veterans', 'other'];
export const IP_TYPE_OPTIONS = ['patent', 'trademark', 'copyright', 'trade_secret'];
export const CLASS_ACTION_TYPE_OPTIONS = ['consumer_fraud', 'data_breach', 'defective_product', 'securities', 'employment', 'other'];

export const NON_CURRENCY_NUMBER_FIELDS = new Set([
  'hospital_days',
  'months_recovery',
  'age',
  'victim_age',
  'future_treatment_years',
  'months_unemployed',
  'months_unpaid',
  'months_delayed',
  'months_denied',
  'years_employed',
  'years_relationship',
  'years_life_expectancy',
  'years_infringement',
  'num_dependents',
  'num_employees_affected',
  'num_class_members',
  'duration_of_harm',
  'duration_of_violation'
]);
