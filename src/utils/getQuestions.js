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
  CLASS_ACTION_TYPE_OPTIONS,
  FRAUD_TYPE_OPTIONS,
  DATA_TYPE_EXPOSED_OPTIONS,
  DEFECT_TYPE_OPTIONS,
  INJURY_SEVERITY_DP_OPTIONS,
  SECURITIES_FRAUD_TYPE_OPTIONS,
  INVESTMENT_TYPE_OPTIONS,
  EMPLOYMENT_VIOLATION_TYPE_OPTIONS,
  OTHER_CLAIM_TYPE_OPTIONS,
  WORKERS_COMP_BODY_PART_OPTIONS,
  DISABILITY_TYPE_OPTIONS,
  VEHICLE_TYPE_OPTIONS,
  DEFECT_SEVERITY_OPTIONS,
  MANUFACTURER_RESPONSE_OPTIONS
} from '../constants/caseTypes';

export const getQuestions = (caseType) => {
  // Case-type-specific question sets (maximum 6 questions each)
  const questionsByType = {
    motor: [
      { id: 'incident_date', type: 'date' },
      { id: 'injury_severity', type: 'select', options: INJURY_SEVERITY_OPTIONS },
      { id: 'medical_bills', type: 'number' },
      { id: 'annual_income', type: 'number' },
      { id: 'weeks_unable_to_work', type: 'number' },
      { id: 'fault_percentage', type: 'slider', min: 0, max: 100 },
      { id: 'permanent_injury', type: 'boolean' },
      { id: 'hospitalized_overnight', type: 'boolean' },
      { id: 'still_in_treatment', type: 'boolean' },
      { id: 'other_driver_insured', type: 'boolean' }
    ],
    medical: [
      { id: 'incident_date', type: 'date' },
      { id: 'injury_severity', type: 'select', options: INJURY_SEVERITY_OPTIONS },
      { id: 'medical_bills', type: 'number' },
      { id: 'annual_income', type: 'number' },
      { id: 'weeks_unable_to_work', type: 'number' },
      { id: 'permanent_injury', type: 'boolean' },
      { id: 'surgery_error', type: 'boolean' }
    ],
    premises: [
      { id: 'incident_date', type: 'date' },
      { id: 'hazard_type', type: 'select', options: HAZARD_TYPE_OPTIONS },
      { id: 'injury_severity', type: 'select', options: INJURY_SEVERITY_OPTIONS },
      { id: 'medical_bills', type: 'number' },
      { id: 'annual_income', type: 'number' },
      { id: 'weeks_unable_to_work', type: 'number' },
      { id: 'permanent_injury', type: 'boolean' },
      { id: 'commercial_property', type: 'boolean' },
      { id: 'property_owner_warned', type: 'boolean' }
    ],
    product: [
      { id: 'incident_date', type: 'date' },
      { id: 'product_name', type: 'text' },
      { id: 'injury_severity', type: 'select', options: INJURY_SEVERITY_OPTIONS },
      { id: 'medical_bills', type: 'number' },
      { id: 'annual_income', type: 'number' },
      { id: 'weeks_unable_to_work', type: 'number' },
      { id: 'permanent_injury', type: 'boolean' },
      { id: 'product_recalled', type: 'boolean' }
    ],
    wrongful_death: [
      { id: 'incident_date', type: 'date' },
      { id: 'victim_annual_income', type: 'number' },
      { id: 'num_dependents', type: 'number' },
      { id: 'victim_age', type: 'number', min: 0, max: 125 },
      { id: 'relationship_to_victim', type: 'select', options: RELATIONSHIP_OPTIONS },
      { id: 'conscious_pain_suffering', type: 'boolean' },
      { id: 'medical_bills', type: 'number' },
      { id: 'funeral_costs', type: 'number' }
    ],
    dog_bite: [
      { id: 'incident_date', type: 'date' },
      { id: 'injury_severity', type: 'select', options: INJURY_SEVERITY_OPTIONS },
      { id: 'medical_bills', type: 'number' },
      { id: 'permanent_injury', type: 'boolean' },
      { id: 'scarring', type: 'boolean' },
      { id: 'child_victim', type: 'boolean' },
      { id: 'dog_prior_aggression', type: 'boolean' },
      { id: 'facial_injuries', type: 'boolean' }
    ],
    wrongful_term: [
      { id: 'incident_date', type: 'date' },
      { id: 'annual_salary', type: 'number' },
      { id: 'lost_benefits', type: 'number' },
      { id: 'years_employed', type: 'number' },
      { id: 'discrimination', type: 'boolean' },
      { id: 'filed_eeoc_complaint', type: 'boolean' },
      { id: 'have_termination_docs', type: 'boolean' },
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
      // Universal
      { id: 'incident_date', type: 'date' },
      { id: 'class_action_type', type: 'select', options: CLASS_ACTION_TYPE_OPTIONS },
      // Shared across all subtypes
      { id: 'has_documentation', type: 'boolean', showIf: { questionId: 'class_action_type', operator: 'includes', value: CLASS_ACTION_TYPE_OPTIONS } },
      { id: 'others_affected', type: 'boolean', showIf: { questionId: 'class_action_type', operator: 'includes', value: CLASS_ACTION_TYPE_OPTIONS } },
      // Consumer Fraud
      { id: 'fraud_type', type: 'select', options: FRAUD_TYPE_OPTIONS, showIf: { questionId: 'class_action_type', operator: 'equals', value: 'consumer_fraud' } },
      { id: 'personal_financial_loss', type: 'number', showIf: { questionId: 'class_action_type', operator: 'equals', value: 'consumer_fraud' } },
      { id: 'fraud_duration_months', type: 'number', showIf: { questionId: 'class_action_type', operator: 'equals', value: 'consumer_fraud' } },
      { id: 'received_refund_or_credit', type: 'boolean', showIf: { questionId: 'class_action_type', operator: 'equals', value: 'consumer_fraud' } },
      { id: 'company_acknowledged_issue', type: 'boolean', showIf: { questionId: 'class_action_type', operator: 'equals', value: 'consumer_fraud' } },
      // Data Breach
      { id: 'data_type_exposed', type: 'select', options: DATA_TYPE_EXPOSED_OPTIONS, showIf: { questionId: 'class_action_type', operator: 'equals', value: 'data_breach' } },
      { id: 'breach_notification_received', type: 'boolean', showIf: { questionId: 'class_action_type', operator: 'equals', value: 'data_breach' } },
      { id: 'experienced_identity_theft', type: 'boolean', showIf: { questionId: 'class_action_type', operator: 'equals', value: 'data_breach' } },
      { id: 'out_of_pocket_costs', type: 'number', showIf: { questionId: 'class_action_type', operator: 'equals', value: 'data_breach' } },
      { id: 'credit_frozen', type: 'boolean', showIf: { questionId: 'class_action_type', operator: 'equals', value: 'data_breach' } },
      { id: 'company_offered_remediation', type: 'boolean', showIf: { questionId: 'class_action_type', operator: 'equals', value: 'data_breach' } },
      // Defective Product
      { id: 'defect_type', type: 'select', options: DEFECT_TYPE_OPTIONS, showIf: { questionId: 'class_action_type', operator: 'equals', value: 'defective_product' } },
      { id: 'injury_severity_dp', type: 'select', options: INJURY_SEVERITY_DP_OPTIONS, showIf: { questionId: 'class_action_type', operator: 'equals', value: 'defective_product' } },
      { id: 'personal_medical_costs', type: 'number', showIf: { questionId: 'class_action_type', operator: 'equals', value: 'defective_product' } },
      { id: 'product_recalled', type: 'boolean', showIf: { questionId: 'class_action_type', operator: 'equals', value: 'defective_product' } },
      { id: 'reported_to_manufacturer', type: 'boolean', showIf: { questionId: 'class_action_type', operator: 'equals', value: 'defective_product' } },
      { id: 'has_product_or_evidence', type: 'boolean', showIf: { questionId: 'class_action_type', operator: 'equals', value: 'defective_product' } },
      // Securities Fraud
      { id: 'securities_fraud_type', type: 'select', options: SECURITIES_FRAUD_TYPE_OPTIONS, showIf: { questionId: 'class_action_type', operator: 'equals', value: 'securities' } },
      { id: 'personal_investment_loss', type: 'number', showIf: { questionId: 'class_action_type', operator: 'equals', value: 'securities' } },
      { id: 'investment_type', type: 'select', options: INVESTMENT_TYPE_OPTIONS, showIf: { questionId: 'class_action_type', operator: 'equals', value: 'securities' } },
      { id: 'relied_on_false_info', type: 'boolean', showIf: { questionId: 'class_action_type', operator: 'equals', value: 'securities' } },
      { id: 'still_holding_investment', type: 'boolean', showIf: { questionId: 'class_action_type', operator: 'equals', value: 'securities' } },
      { id: 'sec_action_reported', type: 'boolean', showIf: { questionId: 'class_action_type', operator: 'equals', value: 'securities' } },
      // Employment
      { id: 'employment_violation_type', type: 'select', options: EMPLOYMENT_VIOLATION_TYPE_OPTIONS, showIf: { questionId: 'class_action_type', operator: 'equals', value: 'employment' } },
      { id: 'personal_lost_wages', type: 'number', showIf: { questionId: 'class_action_type', operator: 'equals', value: 'employment' } },
      { id: 'violation_duration_months', type: 'number', showIf: { questionId: 'class_action_type', operator: 'equals', value: 'employment' } },
      { id: 'reported_to_employer', type: 'boolean', showIf: { questionId: 'class_action_type', operator: 'equals', value: 'employment' } },
      { id: 'retaliation_experienced', type: 'boolean', showIf: { questionId: 'class_action_type', operator: 'equals', value: 'employment' } },
      { id: 'still_employed', type: 'boolean', showIf: { questionId: 'class_action_type', operator: 'equals', value: 'employment' } },
      // Other
      { id: 'other_claim_type', type: 'select', options: OTHER_CLAIM_TYPE_OPTIONS, showIf: { questionId: 'class_action_type', operator: 'equals', value: 'other' } },
      { id: 'personal_damages_est', type: 'number', showIf: { questionId: 'class_action_type', operator: 'equals', value: 'other' } },
      { id: 'harm_duration_months', type: 'number', showIf: { questionId: 'class_action_type', operator: 'equals', value: 'other' } },
      { id: 'harm_still_ongoing', type: 'boolean', showIf: { questionId: 'class_action_type', operator: 'equals', value: 'other' } },
    ],
    insurance: [
      { id: 'claim_filed_date', type: 'date' },
      { id: 'incident_date', type: 'date' },
      { id: 'insurance_type', type: 'select', options: INSURANCE_TYPE_OPTIONS },
      { id: 'claim_amount', type: 'number' },
      { id: 'policy_limits', type: 'number' },
      { id: 'claim_denied', type: 'boolean' },
      { id: 'multiple_denials', type: 'boolean' },
      { id: 'written_denials', type: 'boolean' },
      { id: 'emotional_distress', type: 'select', options: EMOTIONAL_DISTRESS_OPTIONS }
    ],
    disability: [
      { id: 'claim_filed_date', type: 'date' },
      { id: 'claim_denied_date', type: 'date' },
      { id: 'policy_type', type: 'select', options: POLICY_TYPE_OPTIONS },
      { id: 'monthly_benefit', type: 'number' },
      { id: 'lost_wages', type: 'number' },
      { id: 'permanent_disability', type: 'boolean' },
      { id: 'appeal_denied', type: 'boolean' },
      { id: 'medical_evidence', type: 'boolean' },
      { id: 'unable_work', type: 'boolean' },
      { id: 'still_unable_to_work', type: 'boolean' }
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
      { id: 'annual_income', type: 'number' },
      { id: 'weeks_unable_to_work', type: 'number' },
      { id: 'duration_of_violation', type: 'number' },
      { id: 'government_entity', type: 'boolean' },
      { id: 'physical_injury', type: 'boolean' },
      { id: 'pattern_of_conduct', type: 'boolean' },
      { id: 'emotional_distress', type: 'select', options: EMOTIONAL_DISTRESS_OPTIONS }
    ],
    ip: [
      { id: 'discovery_date', type: 'date' },
      { id: 'infringement_start_date', type: 'date' },
      { id: 'ip_type', type: 'select', options: IP_TYPE_OPTIONS },
      { id: 'revenue_lost', type: 'number' },
      { id: 'infringer_profits', type: 'number' },
      { id: 'registered_ip', type: 'boolean' },
      { id: 'willful_infringement', type: 'boolean' },
      { id: 'ongoing_infringement', type: 'boolean' }
    ],
    // Worker's Compensation - streamlined 10-question flow
    workers_comp: [
      { id: 'employer_has_wc_insurance', type: 'boolean' },
      { id: 'injury_date', type: 'date' },
      { id: 'average_weekly_wage', type: 'number' },
      { id: 'weeks_off_work', type: 'number' },
      { id: 'disability_type', type: 'select', options: DISABILITY_TYPE_OPTIONS },
      { id: 'body_part_injured', type: 'select', options: WORKERS_COMP_BODY_PART_OPTIONS },
      { id: 'wc_medical_treatment_cost', type: 'number' },
      { id: 'future_medical_needed', type: 'boolean' },
      {
        id: 'vocational_rehab_needed',
        type: 'boolean',
        showIf: { questionId: 'disability_type', operator: 'includes', value: ['permanent_partial', 'permanent_total'] }
      },
      {
        id: 'can_return_same_job',
        type: 'boolean',
        showIf: { questionId: 'vocational_rehab_needed', operator: 'equals', value: true }
      }
    ],
    // Lemon Law - defective vehicle claims with vehicle-type conditionals
    lemon_law: [
      { id: 'purchase_date', type: 'date' },
      { id: 'vehicle_type', type: 'select', options: VEHICLE_TYPE_OPTIONS },
      { id: 'vehicle_purchase_price', type: 'number' },
      { id: 'defect_severity', type: 'select', options: DEFECT_SEVERITY_OPTIONS },
      { id: 'repair_attempts', type: 'number' },
      { id: 'days_out_of_service', type: 'number' },
      { id: 'vehicle_new_when_purchased', type: 'boolean' },
      { id: 'manufacturer_response', type: 'select', options: MANUFACTURER_RESPONSE_OPTIONS },
      { id: 'manufacturer_notified', type: 'boolean' },
      {
        id: 'mileage_at_first_defect',
        type: 'number',
        showIf: { questionId: 'vehicle_type', operator: 'includes', value: ['car', 'truck', 'motorcycle'] }
      },
      {
        id: 'rv_chassis_defect',
        type: 'boolean',
        showIf: { questionId: 'vehicle_type', operator: 'equals', value: 'rv' }
      },
      {
        id: 'boat_engine_defect',
        type: 'boolean',
        showIf: { questionId: 'vehicle_type', operator: 'equals', value: 'boat' }
      }
    ]
  };

  return questionsByType[caseType] || questionsByType.motor;
};
