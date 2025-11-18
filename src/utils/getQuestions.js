// ============================================================================
// QUESTION SETS FOR EACH CASE TYPE
// ============================================================================
import {
  INJURY_SEVERITY_OPTIONS,
  EMOTIONAL_DISTRESS_OPTIONS,
  HAZARD_TYPE_OPTIONS,
  VIOLATION_TYPE_OPTIONS,
  RELATIONSHIP_OPTIONS,
  INSURANCE_TYPE_OPTIONS,
  PROFESSIONAL_TYPE_OPTIONS,
  POLICY_TYPE_OPTIONS,
  IP_TYPE_OPTIONS,
  CLASS_ACTION_TYPE_OPTIONS
} from '../constants/caseTypes';

export const getQuestions = (caseType) => {
  // Case-type-specific question sets (maximum 6 questions each)
  const questionsByType = {
    motor: [
      { id: 'incident_date', type: 'date' },
      { id: 'injury_severity', type: 'select', options: INJURY_SEVERITY_OPTIONS },
      { id: 'medical_bills', type: 'number' },
      { id: 'lost_wages', type: 'number' },
      { id: 'fault_percentage', type: 'slider', min: 0, max: 100 },
      { id: 'permanent_injury', type: 'boolean' },
      { id: 'police_report_filed', type: 'boolean' },
      { id: 'witnesses_available', type: 'boolean' },
      { id: 'insurance_coverage', type: 'number' }
    ],
    medical: [
      { id: 'incident_date', type: 'date' },
      { id: 'injury_severity', type: 'select', options: INJURY_SEVERITY_OPTIONS },
      { id: 'medical_bills', type: 'number' },
      { id: 'lost_wages', type: 'number' },
      { id: 'permanent_injury', type: 'boolean' },
      { id: 'surgery_error', type: 'boolean' },
      { id: 'insurance_coverage', type: 'number' }
    ],
    premises: [
      { id: 'incident_date', type: 'date' },
      { id: 'hazard_type', type: 'select', options: HAZARD_TYPE_OPTIONS },
      { id: 'injury_severity', type: 'select', options: INJURY_SEVERITY_OPTIONS },
      { id: 'medical_bills', type: 'number' },
      { id: 'lost_wages', type: 'number' },
      { id: 'permanent_injury', type: 'boolean' },
      { id: 'commercial_property', type: 'boolean' },
      { id: 'property_owner_warned', type: 'boolean' },
      { id: 'insurance_coverage', type: 'number' }
    ],
    product: [
      { id: 'incident_date', type: 'date' },
      { id: 'product_name', type: 'text' },
      { id: 'injury_severity', type: 'select', options: INJURY_SEVERITY_OPTIONS },
      { id: 'medical_bills', type: 'number' },
      { id: 'lost_wages', type: 'number' },
      { id: 'permanent_injury', type: 'boolean' },
      { id: 'product_recalled', type: 'boolean' },
      { id: 'insurance_coverage', type: 'number' }
    ],
    wrongful_death: [
      { id: 'incident_date', type: 'date' },
      { id: 'victim_annual_income', type: 'number' },
      { id: 'num_dependents', type: 'number' },
      { id: 'victim_age', type: 'number', min: 0, max: 125 },
      { id: 'relationship_to_victim', type: 'select', options: RELATIONSHIP_OPTIONS },
      { id: 'conscious_pain_suffering', type: 'boolean' },
      { id: 'medical_bills', type: 'number' },
      { id: 'funeral_costs', type: 'number' },
      { id: 'insurance_coverage', type: 'number' }
    ],
    dog_bite: [
      { id: 'incident_date', type: 'date' },
      { id: 'injury_severity', type: 'select', options: INJURY_SEVERITY_OPTIONS },
      { id: 'medical_bills', type: 'number' },
      { id: 'permanent_injury', type: 'boolean' },
      { id: 'scarring', type: 'boolean' },
      { id: 'child_victim', type: 'boolean' },
      { id: 'dog_prior_aggression', type: 'boolean' },
      { id: 'facial_injuries', type: 'boolean' },
      { id: 'insurance_coverage', type: 'number' }
    ],
    wrongful_term: [
      { id: 'incident_date', type: 'date' },
      { id: 'annual_salary', type: 'number' },
      { id: 'months_unemployed', type: 'number' },
      { id: 'lost_benefits', type: 'number' },
      { id: 'years_employed', type: 'number' },
      { id: 'discrimination', type: 'boolean' },
      { id: 'positive_performance_reviews', type: 'boolean' },
      { id: 'position_filled', type: 'boolean' },
      { id: 'emotional_distress', type: 'select', options: EMOTIONAL_DISTRESS_OPTIONS }
    ],
    wage: [
      { id: 'incident_date', type: 'date' },
      { id: 'unpaid_wages', type: 'number' },
      { id: 'unpaid_overtime', type: 'number' },
      { id: 'months_unpaid', type: 'number' },
      { id: 'num_employees_affected', type: 'number' },
      { id: 'time_records', type: 'boolean' },
      { id: 'misclassified', type: 'boolean' }
    ],
    class_action: [
      { id: 'incident_date', type: 'date' },
      { id: 'class_action_type', type: 'select', options: CLASS_ACTION_TYPE_OPTIONS },
      { id: 'individual_damages', type: 'number' },
      { id: 'num_class_members', type: 'number' },
      { id: 'duration_of_harm', type: 'number' },
      { id: 'documented_evidence', type: 'boolean' },
      { id: 'pattern_of_conduct', type: 'boolean' },
      { id: 'regulatory_violations', type: 'boolean' }
    ],
    insurance: [
      { id: 'incident_date', type: 'date' },
      { id: 'insurance_type', type: 'select', options: INSURANCE_TYPE_OPTIONS },
      { id: 'claim_amount', type: 'number' },
      { id: 'policy_limits', type: 'number' },
      { id: 'months_delayed', type: 'number' },
      { id: 'claim_denied', type: 'boolean' },
      { id: 'multiple_denials', type: 'boolean' },
      { id: 'written_denials', type: 'boolean' },
      { id: 'emotional_distress', type: 'select', options: EMOTIONAL_DISTRESS_OPTIONS }
    ],
    disability: [
      { id: 'incident_date', type: 'date' },
      { id: 'policy_type', type: 'select', options: POLICY_TYPE_OPTIONS },
      { id: 'monthly_benefit', type: 'number' },
      { id: 'months_denied', type: 'number' },
      { id: 'lost_wages', type: 'number' },
      { id: 'permanent_disability', type: 'boolean' },
      { id: 'appeal_denied', type: 'boolean' },
      { id: 'medical_evidence', type: 'boolean' },
      { id: 'unable_work', type: 'boolean' }
    ],
    professional: [
      { id: 'incident_date', type: 'date' },
      { id: 'professional_type', type: 'select', options: PROFESSIONAL_TYPE_OPTIONS },
      { id: 'financial_loss', type: 'number' },
      { id: 'professional_fees_paid', type: 'number' },
      { id: 'business_revenue_lost', type: 'number' },
      { id: 'years_relationship', type: 'number' },
      { id: 'written_agreement', type: 'boolean' },
      { id: 'clear_negligence', type: 'boolean' }
    ],
    civil_rights: [
      { id: 'incident_date', type: 'date' },
      { id: 'violation_type', type: 'select', options: VIOLATION_TYPE_OPTIONS },
      { id: 'economic_damages', type: 'number' },
      { id: 'lost_wages', type: 'number' },
      { id: 'duration_of_violation', type: 'number' },
      { id: 'government_entity', type: 'boolean' },
      { id: 'video_evidence', type: 'boolean' },
      { id: 'physical_injury', type: 'boolean' },
      { id: 'pattern_of_conduct', type: 'boolean' },
      { id: 'emotional_distress', type: 'select', options: EMOTIONAL_DISTRESS_OPTIONS }
    ],
    ip: [
      { id: 'incident_date', type: 'date' },
      { id: 'ip_type', type: 'select', options: IP_TYPE_OPTIONS },
      { id: 'revenue_lost', type: 'number' },
      { id: 'infringer_profits', type: 'number' },
      { id: 'years_infringement', type: 'number' },
      { id: 'registered_ip', type: 'boolean' },
      { id: 'willful_infringement', type: 'boolean' },
      { id: 'ongoing_infringement', type: 'boolean' }
    ]
  };

  return questionsByType[caseType] || questionsByType.motor;
};
