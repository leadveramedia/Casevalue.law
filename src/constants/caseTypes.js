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
  { id: 'wage', gradient: 'from-green-600 to-emerald-600', img: '/images/wage.webp' },
  { id: 'class_action', gradient: 'from-violet-600 to-purple-600', img: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=400&fm=webp&q=80' },
  { id: 'insurance', gradient: 'from-teal-600 to-cyan-600', img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&fm=webp&q=80' },
  { id: 'disability', gradient: 'from-sky-600 to-blue-600', img: 'https://images.unsplash.com/photo-1653130892007-6d74996a7978?w=400&fm=webp&q=80' },
  { id: 'professional', gradient: 'from-slate-600 to-zinc-600', img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&fm=webp&q=80' },
  { id: 'civil_rights', gradient: 'from-rose-600 to-red-600', img: 'https://images.unsplash.com/photo-1589391886645-d51941baf7fb?w=400&fm=webp&q=80' },
  { id: 'ip', gradient: 'from-fuchsia-600 to-pink-600', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&fm=webp&q=80' },
  { id: 'workers_comp', gradient: 'from-orange-600 to-amber-600', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&fm=webp&q=80' },
  { id: 'lemon_law', gradient: 'from-lime-600 to-green-600', img: 'https://images.unsplash.com/photo-1671719367451-7bf05ae9549c?w=400&fm=webp&q=80' }
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

// ============================================================================
// CLASS ACTION SUBTYPE OPTIONS
// ============================================================================
export const FRAUD_TYPE_OPTIONS = ['deceptive_advertising', 'hidden_fees', 'bait_and_switch', 'false_labeling', 'unauthorized_charges', 'other_fraud'];
export const DATA_TYPE_EXPOSED_OPTIONS = ['ssn_financial', 'medical_records', 'payment_cards', 'login_credentials', 'basic_pii'];
export const DEFECT_TYPE_OPTIONS = ['design_defect', 'manufacturing_defect', 'inadequate_warning'];
export const INJURY_SEVERITY_DP_OPTIONS = ['no_injury', 'minor_injury', 'moderate_injury', 'serious_injury', 'death_of_loved_one'];
export const SECURITIES_FRAUD_TYPE_OPTIONS = ['false_statements', 'insider_trading', 'accounting_fraud', 'ponzi_scheme', 'misleading_omission'];
export const INVESTMENT_TYPE_OPTIONS = ['stocks', 'bonds', 'mutual_fund', 'crypto', 'other_investment'];
export const EMPLOYMENT_VIOLATION_TYPE_OPTIONS = ['unpaid_wages', 'misclassification', 'discrimination', 'harassment', 'retaliation', 'unpaid_overtime'];
export const OTHER_CLAIM_TYPE_OPTIONS = ['environmental', 'antitrust', 'civil_rights', 'healthcare', 'government_overreach', 'other_misc'];

// ============================================================================
// WORKER'S COMPENSATION OPTIONS
// ============================================================================
export const WORKERS_COMP_CLAIM_STATUS_OPTIONS = [
  'not_filed',           // Pre-claim - injury happened but no claim filed
  'filed_pending',       // Claim filed, awaiting decision
  'accepted',            // Claim accepted by insurer
  'disputed',            // Employer/insurer disputing the claim
  'denied',              // Claim denied
  'appeal_pending',      // Appeal in progress
  'settlement_offered'   // Settlement negotiation phase
];

export const WORKERS_COMP_INJURY_TYPE_OPTIONS = [
  'traumatic_injury',       // Sudden workplace accident
  'repetitive_stress',      // RSI, carpal tunnel, etc.
  'occupational_disease',   // Toxic exposure, hearing loss
  'mental_stress',          // Work-related psychological injury
  'aggravation'             // Pre-existing condition worsened by work
];

export const WORKERS_COMP_BODY_PART_OPTIONS = [
  'head_brain',
  'eyes',
  'ears_hearing',
  'neck_cervical',
  'shoulder',
  'arm_elbow',
  'hand_wrist_fingers',
  'back_lumbar',
  'hip_pelvis',
  'leg_knee',
  'foot_ankle_toes',
  'internal_organs',
  'skin',
  'respiratory',
  'multiple_body_parts'
];

export const DISABILITY_TYPE_OPTIONS = [
  'temporary_total',      // TTD - cannot work at all temporarily
  'temporary_partial',    // TPD - can do light duty/reduced hours
  'permanent_partial',    // PPD - permanent but partial impairment
  'permanent_total'       // PTD - cannot work at all permanently
];

export const IMPAIRMENT_RATING_OPTIONS = [
  'none_0',           // 0% - No permanent impairment
  'minimal_1_10',     // 1-10%
  'mild_11_25',       // 11-25%
  'moderate_26_50',   // 26-50%
  'severe_51_75',     // 51-75%
  'extreme_76_100'    // 76-100%
];

// ============================================================================
// LEMON LAW OPTIONS
// ============================================================================
export const VEHICLE_TYPE_OPTIONS = ['car', 'truck', 'motorcycle', 'rv', 'boat'];
export const DEFECT_SEVERITY_OPTIONS = ['safety_critical', 'drivetrain', 'electrical', 'comfort_convenience', 'cosmetic'];
export const MANUFACTURER_RESPONSE_OPTIONS = ['no_response', 'denied', 'partial_fix', 'acknowledged'];

export const NON_CURRENCY_NUMBER_FIELDS = new Set([
  'hospital_days',
  'months_recovery',
  'weeks_unable_to_work',
  'weeks_off_work',          // Worker's comp - weeks off work
  'age',
  'victim_age',
  'future_treatment_years',
  'months_unpaid',
  'years_employed',
  'years_relationship',
  'years_life_expectancy',
  'num_dependents',
  'num_employees_affected',
  'fraud_duration_months',
  'violation_duration_months',
  'harm_duration_months',
  'duration_of_violation',
  'repair_attempts',
  'days_out_of_service',
  'mileage_at_first_defect'
]);
