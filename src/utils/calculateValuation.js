// ============================================================================
// CASE VALUATION ENGINE - WITH STATE-SPECIFIC LEGAL RULES
// ============================================================================
// This file contains the core valuation logic for all case types
// Updated: 2025-11-17 - Added comprehensive state legal database integration
import { getStateRules } from '../constants/stateLegalDatabase';

export const calculateValuation = (caseType, answers, state) => {
  let baseValue = 0;
  let multiplier = 1.0;
  let factors = [];
  let economicDamages = 0;
  let nonEconomicDamages = 0;

  // Get state-specific legal rules
  const stateRules = getStateRules(state, caseType);
  const warnings = [];

  // Pre-parse common economic fields shared across multiple case types
  const medicalBills = Math.min(parseFloat(answers.medical_bills) || 0, 50000000);
  const annualIncome = Math.min(parseFloat(answers.annual_income) || 0, 10000000);
  const weeksUnableToWork = parseFloat(answers.weeks_unable_to_work) || 0;
  const lostWages = (annualIncome / 52) * weeksUnableToWork;

  // Severity multipliers for emotional distress and injury severity
  const injurySeverityMultipliers = {
    minor: 1.5,
    moderate: 2.5,
    severe: 4.0,
    catastrophic: 6.0
  };

  const emotionalDistressMultipliers = {
    distress_mild: 1.3,
    distress_moderate: 1.7,
    distress_severe: 2.3,
    distress_extreme: 3.2
  };

  // Case-specific calculations
  switch(caseType) {
    case 'motor':
      const faultPercentage = parseInt(answers.fault_percentage) || 0;

      baseValue = medicalBills + lostWages;

      // Apply severity multiplier
      if (answers.injury_severity) {
        multiplier = injurySeverityMultipliers[answers.injury_severity] || 2.5;
      }

      // Permanent injury adds significant value
      if (answers.permanent_injury === true) {
        multiplier *= 1.8;
      }

      // Hospitalized overnight indicates serious injury
      if (answers.hospitalized_overnight === true) {
        multiplier *= 1.4;
      }

      // Still in treatment indicates ongoing medical needs
      if (answers.still_in_treatment === true) {
        multiplier *= 1.3;
      }

      // Other driver uninsured significantly reduces recovery potential
      if (answers.other_driver_insured === false) {
        multiplier *= 0.4; // Dramatic reduction if no insurance
      }

      // Apply comparative negligence
      if (faultPercentage > 0) {
        multiplier *= (1 - faultPercentage / 100);
      }

      baseValue = baseValue * multiplier;

      factors.push(`Medical bills: $${medicalBills.toLocaleString()}`);
      if (annualIncome > 0 && weeksUnableToWork > 0) {
        factors.push(`Lost wages: $${lostWages.toLocaleString()} (${weeksUnableToWork} weeks)`);
      }
      if (answers.injury_severity) factors.push(`Injury severity: ${answers.injury_severity}`);
      if (answers.permanent_injury) factors.push('Permanent injury present');
      if (answers.hospitalized_overnight) factors.push('Hospitalized overnight');
      if (answers.still_in_treatment) factors.push('Still receiving medical treatment');
      if (answers.other_driver_insured === false) factors.push('⚠️ Other driver uninsured (limits recovery)');
      if (faultPercentage > 0) factors.push(`Your fault: ${faultPercentage}%`);
      break;

    case 'medical':
      baseValue = medicalBills + lostWages;
      multiplier = injurySeverityMultipliers[answers.injury_severity] || 3.0;

      if (answers.permanent_injury === true) multiplier *= 2.0;
      if (answers.surgery_error === true) multiplier *= 1.5;

      baseValue = baseValue * multiplier;

      factors.push(`Medical bills: $${medicalBills.toLocaleString()}`);
      if (annualIncome > 0 && weeksUnableToWork > 0) {
        factors.push(`Lost wages: $${lostWages.toLocaleString()} (${weeksUnableToWork} weeks)`);
      }
      if (answers.injury_severity) factors.push(`Injury severity: ${answers.injury_severity}`);
      if (answers.surgery_error) factors.push('Surgery error involved');
      if (answers.permanent_injury) factors.push('Permanent injury present');
      break;

    case 'premises':
      baseValue = medicalBills + lostWages;
      multiplier = injurySeverityMultipliers[answers.injury_severity] || 2.5;

      // Hazard type multipliers (some are more egregious)
      const hazardTypeMultipliers = {
        inadequate_security: 1.5,
        structural_failure: 1.4,
        falling_object: 1.3,
        slip_fall: 1.1,
        trip_fall: 1.1,
        other: 1.0
      };
      if (answers.hazard_type) {
        multiplier *= hazardTypeMultipliers[answers.hazard_type] || 1.0;
      }

      if (answers.permanent_injury === true) multiplier *= 1.7;

      // Commercial property has higher duty of care
      if (answers.commercial_property === true) multiplier *= 1.3;

      if (answers.property_owner_warned === true) multiplier *= 1.3;

      baseValue = baseValue * multiplier;

      factors.push(`Medical bills: $${medicalBills.toLocaleString()}`);
      if (annualIncome > 0 && weeksUnableToWork > 0) {
        factors.push(`Lost wages: $${lostWages.toLocaleString()} (${weeksUnableToWork} weeks)`);
      }
      if (answers.hazard_type) factors.push(`Hazard type: ${answers.hazard_type}`);
      if (answers.injury_severity) factors.push(`Injury severity: ${answers.injury_severity}`);
      if (answers.commercial_property) factors.push('Commercial property (higher duty of care)');
      if (answers.property_owner_warned) factors.push('Property owner was warned');
      if (answers.permanent_injury) factors.push('Permanent injury present');
      break;

    case 'product':
      baseValue = medicalBills + lostWages;
      multiplier = injurySeverityMultipliers[answers.injury_severity] || 3.0;

      if (answers.permanent_injury === true) multiplier *= 1.8;
      if (answers.product_recalled === true) multiplier *= 1.5;

      baseValue = baseValue * multiplier;

      factors.push(`Medical bills: $${medicalBills.toLocaleString()}`);
      if (annualIncome > 0 && weeksUnableToWork > 0) {
        factors.push(`Lost wages: $${lostWages.toLocaleString()} (${weeksUnableToWork} weeks)`);
      }
      if (answers.injury_severity) factors.push(`Injury severity: ${answers.injury_severity}`);
      if (answers.product_recalled) factors.push('Product was recalled');
      if (answers.permanent_injury) factors.push('Permanent injury present');
      break;

    case 'wrongful_death':
      const victimIncome = parseFloat(answers.victim_annual_income) || 50000;
      const victimAge = parseFloat(answers.victim_age) || 40;
      // Calculate life expectancy based on age (average US life expectancy ~78 years)
      const lifeExpectancy = Math.max(78 - victimAge, 5);
      const numDependents = parseFloat(answers.num_dependents) || 1;
      const funeralCosts = parseFloat(answers.funeral_costs) || 15000;

      // Economic damages: lost future income
      const futureEarnings = victimIncome * lifeExpectancy * 0.7; // 70% for household consumption
      baseValue = futureEarnings + medicalBills + funeralCosts;

      // Multiplier based on dependents
      multiplier = 1.0 + (numDependents * 0.3);

      // Relationship multipliers (emotional impact varies)
      const relationshipMultipliers = {
        spouse: 1.3,
        child: 1.4,
        parent: 1.2,
        sibling: 1.1,
        other_family: 1.05,
        other: 1.0
      };
      if (answers.relationship_to_victim) {
        multiplier *= relationshipMultipliers[answers.relationship_to_victim] || 1.0;
      }

      // Conscious pain and suffering before death
      if (answers.conscious_pain_suffering === true) {
        multiplier *= 1.5;
      }

      baseValue = baseValue * multiplier;

      factors.push(`Future earnings lost: $${futureEarnings.toLocaleString()}`);
      factors.push(`Medical bills: $${medicalBills.toLocaleString()}`);
      factors.push(`Funeral costs: $${funeralCosts.toLocaleString()}`);
      factors.push(`Dependents: ${numDependents}`);
      factors.push(`Life expectancy: ${lifeExpectancy} years (based on age ${victimAge})`);
      if (answers.relationship_to_victim) factors.push(`Relationship: ${answers.relationship_to_victim}`);
      if (answers.conscious_pain_suffering) factors.push('Conscious pain and suffering before death');
      break;

    case 'dog_bite':
      baseValue = medicalBills;
      multiplier = injurySeverityMultipliers[answers.injury_severity] || 2.0;

      if (answers.permanent_injury === true) multiplier *= 1.5;
      if (answers.scarring === true) multiplier *= 1.4;
      if (answers.child_victim === true) multiplier *= 1.6;

      // Dog's prior aggression history strengthens case
      if (answers.dog_prior_aggression === true) multiplier *= 1.3;

      // Facial injuries significantly increase damages
      if (answers.facial_injuries === true) multiplier *= 1.5;

      baseValue = baseValue * multiplier;

      factors.push(`Medical bills: $${medicalBills.toLocaleString()}`);
      if (answers.injury_severity) factors.push(`Injury severity: ${answers.injury_severity}`);
      if (answers.scarring) factors.push('Permanent scarring');
      if (answers.child_victim) factors.push('Child victim');
      if (answers.permanent_injury) factors.push('Permanent injury');
      if (answers.dog_prior_aggression) factors.push('Dog had prior aggression history');
      if (answers.facial_injuries) factors.push('Facial injuries present');
      break;

    case 'wrongful_term':
      const annualSalary = parseFloat(answers.annual_salary) || 60000;
      const lostBenefits = parseFloat(answers.lost_benefits) || 10000;
      const yearsEmployed = parseFloat(answers.years_employed) || 3;

      // Calculate lost wages from incident date to today
      let wagesLost = 0;
      let monthsUnemployed = 0;

      const incidentDate = answers.incident_date ? new Date(answers.incident_date) : null;
      const today = new Date();
      if (incidentDate) {
        monthsUnemployed = Math.max(1, Math.min(24, Math.round((today - incidentDate) / (1000 * 60 * 60 * 24 * 30))));
      } else {
        monthsUnemployed = 6; // default fallback
      }
      wagesLost = (annualSalary / 12) * monthsUnemployed;

      // Base: lost wages during unemployment + benefits
      baseValue = wagesLost + lostBenefits;

      // Emotional distress multiplier
      multiplier = emotionalDistressMultipliers[answers.emotional_distress] || 1.5;

      // Additional factors
      if (answers.discrimination === true) multiplier *= 2.0;
      if (yearsEmployed >= 5) multiplier *= 1.3;

      // Positive performance reviews strengthen case
      if (answers.positive_performance_reviews === true) multiplier *= 1.3;

      // Position filled quickly suggests pretextual termination
      if (answers.position_filled === true) multiplier *= 1.2;

      // EEOC complaint filed strengthens case significantly
      if (answers.filed_eeoc_complaint === true) multiplier *= 1.4;

      // Termination documentation helps prove case
      if (answers.have_termination_docs === true) multiplier *= 1.2;

      baseValue = baseValue * multiplier;

      factors.push(`Lost wages: $${wagesLost.toLocaleString()}`);
      factors.push(`Months unemployed: ${monthsUnemployed}`);
      factors.push(`Lost benefits: $${lostBenefits.toLocaleString()}`);
      if (answers.discrimination) factors.push('Discrimination involved');
      if (answers.filed_eeoc_complaint) factors.push('EEOC complaint filed');
      if (answers.have_termination_docs) factors.push('Termination documentation available');
      if (answers.positive_performance_reviews) factors.push('Positive performance reviews on record');
      if (answers.position_filled) factors.push('Position was quickly filled');
      factors.push(`Years employed: ${yearsEmployed}`);
      break;

    case 'wage':
      const unpaidWages = parseFloat(answers.unpaid_wages) || 0;
      const unpaidOvertime = parseFloat(answers.unpaid_overtime) || 0;
      const monthsUnpaid = parseFloat(answers.months_unpaid) || 12;
      const numEmployees = parseFloat(answers.num_employees_affected) || 1;

      baseValue = unpaidWages + unpaidOvertime;

      // Liquidated damages (double damages for willful violations)
      multiplier = 2.0;

      // Class action potential
      if (numEmployees > 1) {
        multiplier *= 1.2;
      }

      // Additional penalties
      if (answers.time_records === true) multiplier *= 1.2;
      if (answers.misclassified === true) multiplier *= 1.3;

      baseValue = baseValue * multiplier;

      factors.push(`Unpaid wages: $${unpaidWages.toLocaleString()}`);
      factors.push(`Unpaid overtime: $${unpaidOvertime.toLocaleString()}`);
      factors.push(`Duration: ${monthsUnpaid} months`);
      factors.push(`Employees affected: ${numEmployees}`);
      if (answers.time_records) factors.push('Time records available');
      if (answers.misclassified) factors.push('Misclassification involved');
      break;

    case 'class_action': {
      multiplier = 1.0;

      // Shared multipliers
      if (answers.has_documentation === true) multiplier *= 1.3;
      if (answers.others_affected === true) multiplier *= 1.3;

      switch (answers.class_action_type) {
        case 'consumer_fraud': {
          const personalLoss = Math.min(parseFloat(answers.personal_financial_loss) || 1000, 10000000);
          const fraudMonths = parseFloat(answers.fraud_duration_months) || 0;
          baseValue = personalLoss;
          const fraudMultipliers = { deceptive_advertising: 1.3, hidden_fees: 1.2, bait_and_switch: 1.4, false_labeling: 1.2, unauthorized_charges: 1.5, other_fraud: 1.0 };
          multiplier *= fraudMultipliers[answers.fraud_type] || 1.0;
          if (fraudMonths > 24) multiplier *= 1.4;
          else if (fraudMonths > 12) multiplier *= 1.2;
          if (answers.received_refund_or_credit === true) multiplier *= 0.5;
          if (answers.company_acknowledged_issue === true) multiplier *= 1.3;
          factors.push(`Personal loss: $${personalLoss.toLocaleString()}`);
          if (answers.fraud_type) factors.push(`Fraud type: ${answers.fraud_type}`);
          if (fraudMonths > 0) factors.push(`Duration: ${fraudMonths} months`);
          if (answers.received_refund_or_credit) factors.push('Partial refund/credit received');
          if (answers.company_acknowledged_issue) factors.push('Company acknowledged issue');
          break;
        }
        case 'data_breach': {
          const oopCosts = Math.min(parseFloat(answers.out_of_pocket_costs) || 0, 1000000);
          const statutoryFloors = { ssn_financial: 150, medical_records: 200, payment_cards: 100, login_credentials: 50, basic_pii: 25 };
          const floor = statutoryFloors[answers.data_type_exposed] || 50;
          baseValue = Math.max(oopCosts, floor);
          if (answers.breach_notification_received === false) multiplier *= 1.3;
          if (answers.experienced_identity_theft === true) multiplier *= 2.0;
          if (answers.credit_frozen === true) multiplier *= 1.2;
          if (answers.company_offered_remediation === true) multiplier *= 0.8;
          if (answers.data_type_exposed) factors.push(`Data exposed: ${answers.data_type_exposed}`);
          factors.push(`Out-of-pocket costs: $${oopCosts.toLocaleString()}`);
          if (answers.experienced_identity_theft) factors.push('Identity theft documented');
          if (answers.credit_frozen) factors.push('Credit frozen');
          if (!answers.breach_notification_received) factors.push('Late/no breach notification');
          if (answers.company_offered_remediation) factors.push('Remediation offered');
          break;
        }
        case 'defective_product': {
          const medCosts = Math.min(parseFloat(answers.personal_medical_costs) || 0, 50000000);
          const severityBases = { no_injury: Math.max(medCosts, 500), minor_injury: Math.max(medCosts, 2000) * 2, moderate_injury: Math.max(medCosts, 10000) * 3, serious_injury: Math.max(medCosts, 50000) * 4, death_of_loved_one: 500000 };
          baseValue = severityBases[answers.injury_severity_dp] || Math.max(medCosts, 500);
          const defectMultipliers = { design_defect: 1.3, manufacturing_defect: 1.1, inadequate_warning: 1.0 };
          multiplier *= defectMultipliers[answers.defect_type] || 1.0;
          if (answers.product_recalled === true) multiplier *= 1.3;
          if (answers.reported_to_manufacturer === true) multiplier *= 1.1;
          if (answers.has_product_or_evidence === true) multiplier *= 1.3;
          if (answers.injury_severity_dp) factors.push(`Injury severity: ${answers.injury_severity_dp}`);
          if (medCosts > 0) factors.push(`Medical costs: $${medCosts.toLocaleString()}`);
          if (answers.defect_type) factors.push(`Defect type: ${answers.defect_type}`);
          if (answers.product_recalled) factors.push('Product recalled');
          if (answers.has_product_or_evidence) factors.push('Physical evidence preserved');
          break;
        }
        case 'securities': {
          const investLoss = Math.min(parseFloat(answers.personal_investment_loss) || 10000, 50000000);
          baseValue = investLoss;
          const secMultipliers = { false_statements: 1.2, insider_trading: 1.4, accounting_fraud: 1.5, ponzi_scheme: 1.3, misleading_omission: 1.1 };
          multiplier *= secMultipliers[answers.securities_fraud_type] || 1.0;
          const investTypeMultipliers = { stocks: 1.0, bonds: 0.9, mutual_fund: 1.0, crypto: 0.8, other_investment: 0.9 };
          multiplier *= investTypeMultipliers[answers.investment_type] || 1.0;
          if (answers.relied_on_false_info === true) multiplier *= 1.4;
          if (answers.still_holding_investment === true) multiplier *= 0.8;
          if (answers.sec_action_reported === true) multiplier *= 1.5;
          factors.push(`Investment loss: $${investLoss.toLocaleString()}`);
          if (answers.securities_fraud_type) factors.push(`Fraud type: ${answers.securities_fraud_type}`);
          if (answers.investment_type) factors.push(`Investment: ${answers.investment_type}`);
          if (answers.relied_on_false_info) factors.push('Relied on false information');
          if (answers.sec_action_reported) factors.push('SEC action or media coverage');
          if (answers.still_holding_investment) factors.push('Still holding investment');
          break;
        }
        case 'employment': {
          const lostWagesCA = Math.min(parseFloat(answers.personal_lost_wages) || 5000, 10000000);
          const violMonths = parseFloat(answers.violation_duration_months) || 0;
          baseValue = lostWagesCA;
          const empMultipliers = { unpaid_wages: 1.2, misclassification: 1.3, discrimination: 1.5, harassment: 1.4, retaliation: 1.5, unpaid_overtime: 1.3 };
          multiplier *= empMultipliers[answers.employment_violation_type] || 1.0;
          if (violMonths > 24) multiplier *= 1.5;
          else if (violMonths > 12) multiplier *= 1.3;
          if (answers.reported_to_employer === true) multiplier *= 1.2;
          if (answers.retaliation_experienced === true) multiplier *= 1.5;
          if (answers.still_employed === false) multiplier *= 1.3;
          factors.push(`Lost wages: $${lostWagesCA.toLocaleString()}`);
          if (answers.employment_violation_type) factors.push(`Violation: ${answers.employment_violation_type}`);
          if (violMonths > 0) factors.push(`Duration: ${violMonths} months`);
          if (answers.reported_to_employer) factors.push('Reported to employer');
          if (answers.retaliation_experienced) factors.push('Retaliation experienced');
          if (answers.still_employed === false) factors.push('No longer employed');
          break;
        }
        default: {
          // "other" subtype
          const personalDmg = Math.min(parseFloat(answers.personal_damages_est) || 1000, 50000000);
          const harmMonths = parseFloat(answers.harm_duration_months) || 0;
          baseValue = personalDmg;
          const otherMultipliers = { environmental: 1.3, antitrust: 1.4, civil_rights: 1.4, healthcare: 1.2, government_overreach: 1.1, other_misc: 1.0 };
          multiplier *= otherMultipliers[answers.other_claim_type] || 1.0;
          if (harmMonths > 24) multiplier *= 1.4;
          else if (harmMonths > 12) multiplier *= 1.2;
          if (answers.harm_still_ongoing === true) multiplier *= 1.2;
          factors.push(`Personal damages: $${personalDmg.toLocaleString()}`);
          if (answers.other_claim_type) factors.push(`Claim type: ${answers.other_claim_type}`);
          if (harmMonths > 0) factors.push(`Duration: ${harmMonths} months`);
          if (answers.harm_still_ongoing) factors.push('Harm still ongoing');
          break;
        }
      }

      baseValue = baseValue * multiplier;
      if (answers.has_documentation) factors.push('Strong documentation');
      if (answers.others_affected) factors.push('Others affected');
      break;
    }

    case 'insurance':
      const claimAmount = parseFloat(answers.claim_amount) || 50000;
      const policyLimits = parseFloat(answers.policy_limits) || 100000;

      // Calculate delay from claim filed date to incident date
      const insClaimFiledDate = answers.claim_filed_date ? new Date(answers.claim_filed_date) : null;
      const insIncidentDate = answers.incident_date ? new Date(answers.incident_date) : null;
      let monthsDelayed = 6; // default
      if (insClaimFiledDate && insIncidentDate) {
        monthsDelayed = Math.max(0, Math.round((insClaimFiledDate - insIncidentDate) / (1000 * 60 * 60 * 24 * 30)));
      }

      baseValue = claimAmount;

      // Bad faith multiplier
      multiplier = 1.5;

      // Insurance type multipliers (some types have higher bad faith potential)
      const insuranceTypeMultipliers = {
        health: 1.4,
        disability: 1.5,
        life: 1.3,
        auto: 1.2,
        homeowners: 1.2,
        other: 1.0
      };
      if (answers.insurance_type) {
        multiplier *= insuranceTypeMultipliers[answers.insurance_type] || 1.0;
      }

      // Emotional distress
      if (answers.emotional_distress) {
        multiplier *= emotionalDistressMultipliers[answers.emotional_distress] || 1.0;
      }

      // Punitive potential
      if (answers.claim_denied === true) multiplier *= 1.5;
      if (answers.multiple_denials === true) multiplier *= 1.6;
      if (answers.written_denials === true) multiplier *= 1.3;
      if (monthsDelayed > 12) multiplier *= 1.4;

      baseValue = baseValue * multiplier;
      baseValue = Math.min(baseValue, policyLimits * 3); // Bad faith can exceed policy limits

      factors.push(`Claim amount: $${claimAmount.toLocaleString()}`);
      factors.push(`Policy limits: $${policyLimits.toLocaleString()}`);
      factors.push(`Months delayed: ${monthsDelayed}`);
      if (answers.insurance_type) factors.push(`Insurance type: ${answers.insurance_type}`);
      if (answers.claim_denied) factors.push('Claim denied');
      if (answers.multiple_denials) factors.push('Multiple denials');
      if (answers.written_denials) factors.push('Written denials exist');
      break;

    case 'disability':
      const monthlyBenefit = parseFloat(answers.monthly_benefit) || 2000;
      const disabilityWages = parseFloat(answers.lost_wages) || 0;

      // Calculate denial duration from claim dates
      const disClaimFiledDate = answers.claim_filed_date ? new Date(answers.claim_filed_date) : null;
      const disClaimDeniedDate = answers.claim_denied_date ? new Date(answers.claim_denied_date) : null;
      let monthsDenied = 12; // default
      if (disClaimFiledDate && disClaimDeniedDate) {
        monthsDenied = Math.max(1, Math.round((disClaimDeniedDate - disClaimFiledDate) / (1000 * 60 * 60 * 24 * 30)));
      }

      baseValue = (monthlyBenefit * monthsDenied) + disabilityWages;

      multiplier = 1.5; // Attorney fees typically awarded

      // Policy type multipliers (ERISA vs non-ERISA, etc.)
      const policyTypeMultipliers = {
        employer_group: 1.0,  // ERISA - harder to recover
        individual: 1.3,       // Non-ERISA - better recovery
        social_security: 1.2,
        veterans: 1.2,
        other: 1.0
      };
      if (answers.policy_type) {
        multiplier *= policyTypeMultipliers[answers.policy_type] || 1.0;
      }

      if (answers.permanent_disability === true) multiplier *= 1.5;

      // Appeal denied strengthens bad faith case
      if (answers.appeal_denied === true) multiplier *= 1.4;

      if (answers.medical_evidence === true) multiplier *= 1.2;
      if (answers.unable_work === true) multiplier *= 1.3;

      // Still unable to work increases future damages potential
      if (answers.still_unable_to_work === true) multiplier *= 1.3;

      baseValue = baseValue * multiplier;

      factors.push(`Monthly benefit: $${monthlyBenefit.toLocaleString()}`);
      factors.push(`Months denied: ${monthsDenied}`);
      if (disabilityWages > 0) factors.push(`Lost wages: $${disabilityWages.toLocaleString()}`);
      if (answers.policy_type) factors.push(`Policy type: ${answers.policy_type}`);
      if (answers.permanent_disability) factors.push('Permanent disability');
      if (answers.appeal_denied) factors.push('Appeal was denied');
      if (answers.medical_evidence) factors.push('Strong medical evidence');
      if (answers.unable_work) factors.push('Unable to work');
      if (answers.still_unable_to_work) factors.push('Still unable to work');
      break;

    case 'professional':
      const financialLoss = parseFloat(answers.financial_loss) || 0;
      const feesPaid = parseFloat(answers.professional_fees_paid) || 0;
      const businessRevenueLost = parseFloat(answers.business_revenue_lost) || 0;
      const yearsRelationship = parseFloat(answers.years_relationship) || 1;

      baseValue = financialLoss + feesPaid + businessRevenueLost;

      multiplier = 1.0;

      // Professional type multipliers (some have higher standards of care)
      const professionalTypeMultipliers = {
        attorney: 1.4,
        accountant: 1.3,
        financial_advisor: 1.3,
        architect: 1.2,
        engineer: 1.2,
        real_estate_agent: 1.1,
        other: 1.0
      };
      if (answers.professional_type) {
        multiplier *= professionalTypeMultipliers[answers.professional_type] || 1.0;
      }

      if (answers.written_agreement === true) multiplier *= 1.3;
      if (answers.clear_negligence === true) multiplier *= 1.5;
      if (yearsRelationship >= 5) multiplier *= 1.2;

      baseValue = baseValue * multiplier;

      factors.push(`Financial loss: $${financialLoss.toLocaleString()}`);
      factors.push(`Professional fees: $${feesPaid.toLocaleString()}`);
      factors.push(`Revenue lost: $${businessRevenueLost.toLocaleString()}`);
      if (answers.professional_type) factors.push(`Professional type: ${answers.professional_type}`);
      factors.push(`Years of relationship: ${yearsRelationship}`);
      if (answers.written_agreement) factors.push('Written agreement exists');
      if (answers.clear_negligence) factors.push('Clear negligence');
      break;

    case 'civil_rights':
      const economicDamages = parseFloat(answers.economic_damages) || 0;
      const violationDuration = parseFloat(answers.duration_of_violation) || 12;

      baseValue = economicDamages + lostWages;

      // Civil rights cases often have punitive damages
      multiplier = 2.0;

      // Violation type multipliers (some are inherently more egregious)
      const violationTypeMultipliers = {
        police_excessive_force: 1.5,
        false_arrest: 1.4,
        discrimination_employment: 1.2,
        discrimination_housing: 1.3,
        discrimination_public: 1.3,
        free_speech: 1.2,
        other: 1.0
      };
      if (answers.violation_type) {
        multiplier *= violationTypeMultipliers[answers.violation_type] || 1.0;
      }

      if (answers.emotional_distress) {
        multiplier *= emotionalDistressMultipliers[answers.emotional_distress] || 1.0;
      }

      // Physical injury increases damages
      if (answers.physical_injury === true) multiplier *= 1.5;

      if (answers.government_entity === true) multiplier *= 1.3;
      if (answers.pattern_of_conduct === true) multiplier *= 1.5;
      if (violationDuration > 24) multiplier *= 1.3;

      baseValue = baseValue * multiplier;

      factors.push(`Economic damages: $${economicDamages.toLocaleString()}`);
      if (annualIncome > 0 && weeksUnableToWork > 0) {
        factors.push(`Lost wages: $${lostWages.toLocaleString()} (${weeksUnableToWork} weeks)`);
      }
      factors.push(`Duration: ${violationDuration} months`);
      if (answers.violation_type) factors.push(`Violation type: ${answers.violation_type}`);
      if (answers.physical_injury) factors.push('Physical injury present');
      if (answers.government_entity) factors.push('Government entity involved');
      if (answers.pattern_of_conduct) factors.push('Pattern of conduct');
      break;

    case 'ip':
      const revenueLost = parseFloat(answers.revenue_lost) || 0;
      const infringerProfits = parseFloat(answers.infringer_profits) || 0;

      // Calculate infringement duration from dates
      const ipDiscoveryDate = answers.discovery_date ? new Date(answers.discovery_date) : null;
      const ipInfringementStartDate = answers.infringement_start_date ? new Date(answers.infringement_start_date) : null;
      let yearsInfringement = 1; // default
      if (ipDiscoveryDate && ipInfringementStartDate) {
        yearsInfringement = Math.max(0.5, (ipDiscoveryDate - ipInfringementStartDate) / (1000 * 60 * 60 * 24 * 365.25));
      }

      baseValue = Math.max(revenueLost, infringerProfits);

      multiplier = 1.0;

      // IP type multipliers (different recovery potential)
      const ipTypeMultipliers = {
        patent: 1.5,      // Highest statutory damages
        copyright: 1.3,   // Good statutory damages
        trademark: 1.2,
        trade_secret: 1.4,
      };
      if (answers.ip_type) {
        multiplier *= ipTypeMultipliers[answers.ip_type] || 1.0;
      }

      if (answers.registered_ip === true) multiplier *= 1.5;
      if (answers.willful_infringement === true) multiplier *= 3.0; // Treble damages
      if (answers.ongoing_infringement === true) multiplier *= 1.3;
      if (yearsInfringement >= 3) multiplier *= 1.2;

      baseValue = baseValue * multiplier;

      factors.push(`Revenue lost: $${revenueLost.toLocaleString()}`);
      factors.push(`Infringer profits: $${infringerProfits.toLocaleString()}`);
      factors.push(`Years of infringement: ${yearsInfringement.toFixed(1)}`);
      if (answers.ip_type) factors.push(`IP type: ${answers.ip_type}`);
      if (answers.registered_ip) factors.push('IP is registered');
      if (answers.willful_infringement) factors.push('Willful infringement (treble damages)');
      if (answers.ongoing_infringement) factors.push('Ongoing infringement');
      break;

    case 'workers_comp': {
      // Get WC-specific state rules
      const wcStateRules = getStateRules(state, 'workers_comp');

      // TEXAS NON-SUBSCRIBER CHECK - Refer out immediately
      if (state === 'Texas' && answers.employer_has_wc_insurance === false) {
        return {
          value: 0,
          lowRange: 0,
          highRange: 0,
          weeklyBenefitRate: 0,
          factors: [
            'Your employer is a Texas non-subscriber (no workers\' compensation insurance)',
            'Texas non-subscriber cases follow tort law, not workers\' compensation rules',
            'You may have the right to sue your employer directly for negligence',
            'Non-subscriber cases often result in higher settlements than standard workers\' comp claims'
          ],
          warnings: [
            'IMPORTANT: Texas Non-Subscriber Employer Detected',
            'This calculator cannot estimate non-subscriber cases.',
            'Please consult with a personal injury attorney immediately.'
          ],
          breakdown: null,
          referOut: true
        };
      }

      // Parse answers
      const aww = parseFloat(answers.average_weekly_wage) || 0;
      const weeksOff = parseFloat(answers.weeks_off_work) || 0;
      const medicalCost = parseFloat(answers.wc_medical_treatment_cost) || 0;

      // Default state rules if not found
      const ttdRate = wcStateRules?.ttdRate || 0.6667;
      const maxWeeklyBenefit = wcStateRules?.maxWeeklyBenefit || 1000;
      const minWeeklyBenefit = wcStateRules?.minWeeklyBenefit || 200;
      const waitingPeriod = wcStateRules?.waitingPeriod || 7;
      const retroactivePeriod = wcStateRules?.retroactivePeriod || 14;
      const maxWeeksTTD = wcStateRules?.maxWeeksTTD || null;
      const maxWeeksPPD = wcStateRules?.maxWeeksPPD || 300;

      // Calculate weekly benefit rate
      let weeklyRate = aww * ttdRate;
      weeklyRate = Math.min(weeklyRate, maxWeeklyBenefit);
      if (minWeeklyBenefit) {
        weeklyRate = Math.max(weeklyRate, minWeeklyBenefit);
      }

      // Initialize breakdown
      const wcBreakdown = {
        ttdBenefits: 0,
        tpdBenefits: 0,
        ppdBenefits: 0,
        medicalBenefits: 0,
        futureMedical: 0,
        vocationalBenefits: 0
      };

      // Calculate temporary disability benefits (TTD)
      if (weeksOff > 0) {
        const waitingDays = waitingPeriod;
        const waitingWeeks = waitingDays / 7;
        let compensableWeeks = Math.max(0, weeksOff - waitingWeeks);

        // Add back waiting period if off long enough (retroactive)
        if (weeksOff * 7 >= retroactivePeriod) {
          compensableWeeks = weeksOff;
        }

        // Apply max weeks cap if exists
        if (maxWeeksTTD && compensableWeeks > maxWeeksTTD) {
          compensableWeeks = maxWeeksTTD;
          factors.push(`TTD capped at ${maxWeeksTTD} weeks`);
        }

        wcBreakdown.ttdBenefits = weeklyRate * compensableWeeks;
      }

      // Calculate permanent partial disability benefits (PPD)
      // Estimate impairment percentage from disability type (simplified - no longer asking for rating)
      const getEstimatedImpairment = (disabilityType) => {
        switch (disabilityType) {
          case 'temporary_total':
          case 'temporary_partial':
            return 0;  // No PPD for temporary disabilities
          case 'permanent_partial':
            return 25; // Conservative average estimate
          case 'permanent_total':
            return 100;
          default:
            return 0;
        }
      };

      const impairmentPercent = getEstimatedImpairment(answers.disability_type);
      if (impairmentPercent > 0 && ['permanent_partial', 'permanent_total'].includes(answers.disability_type)) {
        // Calculate PPD weeks based on estimated impairment percentage
        const ppdWeeks = maxWeeksPPD ? Math.round(maxWeeksPPD * (impairmentPercent / 100)) : 0;
        wcBreakdown.ppdBenefits = weeklyRate * ppdWeeks;
        factors.push(`Estimated impairment: ${impairmentPercent}%`);
      }

      // Permanent total disability (PTD) - lifetime benefits
      if (answers.disability_type === 'permanent_total') {
        // Estimate 20 years of benefits for PTD
        const ptdYears = 20;
        wcBreakdown.ppdBenefits = weeklyRate * 52 * ptdYears;
        factors.push('Permanent total disability - lifetime benefits');
      }

      // Medical benefits (typically unlimited in WC)
      wcBreakdown.medicalBenefits = medicalCost;

      // Estimate future medical if needed
      if (answers.future_medical_needed === true) {
        wcBreakdown.futureMedical = medicalCost * 0.5;
        factors.push('Future medical treatment needed');
      }

      // Vocational rehabilitation
      if (answers.vocational_rehab_needed === true && !answers.can_return_same_job) {
        wcBreakdown.vocationalBenefits = aww * 52 * 0.25; // Estimate 25% of annual wage
        factors.push('Vocational rehabilitation needed');
      }

      // Calculate total value
      const totalWCValue = wcBreakdown.ttdBenefits +
                           wcBreakdown.tpdBenefits +
                           wcBreakdown.ppdBenefits +
                           wcBreakdown.medicalBenefits +
                           wcBreakdown.futureMedical +
                           wcBreakdown.vocationalBenefits;

      baseValue = totalWCValue;

      // Add factors
      factors.push(`Average weekly wage: $${aww.toLocaleString()}`);
      factors.push(`Weekly benefit rate: $${Math.round(weeklyRate).toLocaleString()}/week`);
      if (weeksOff > 0) factors.push(`Weeks off work: ${weeksOff}`);
      if (answers.disability_type) factors.push(`Disability type: ${answers.disability_type}`);
      if (answers.body_part_injured) factors.push(`Body part: ${answers.body_part_injured}`);

      // Add state-specific info
      if (wcStateRules) {
        if (wcStateRules.monopolisticStateFund) {
          factors.push(`${wcStateRules.stateName} uses a state-run workers' compensation fund`);
        }
        factors.push(`Waiting period: ${waitingPeriod} days`);
        factors.push(`Retroactive threshold: ${retroactivePeriod} days`);
      }

      // Return with WC-specific breakdown
      return {
        value: Math.max(5000, Math.round(totalWCValue / 1000) * 1000),
        lowRange: Math.max(5000, Math.round(totalWCValue * 0.75 / 1000) * 1000),
        highRange: Math.round(totalWCValue * 1.25 / 1000) * 1000,
        weeklyBenefitRate: Math.round(weeklyRate * 100) / 100,
        factors: factors,
        warnings: warnings.length > 0 ? warnings : undefined,
        breakdown: wcBreakdown,
        stateSpecificInfo: wcStateRules ? {
          stateName: wcStateRules.stateName || state,
          ttdRate: ttdRate,
          maxWeeklyBenefit: maxWeeklyBenefit,
          waitingPeriod: waitingPeriod,
          impairmentGuide: wcStateRules.impairmentGuide,
          choiceOfDoctor: wcStateRules.choiceOfDoctor,
          monopolisticStateFund: wcStateRules.monopolisticStateFund
        } : undefined
      };
    }

    // ========================================================================
    // LEMON LAW — early return (buyback recovery, not injury damages)
    // ========================================================================
    case 'lemon_law': {
      const llStateRules = getStateRules(state, 'lemon_law');

      // Parse answers with input clamping
      const vehiclePurchasePrice = Math.min(parseFloat(answers.vehicle_purchase_price) || 0, 5000000);
      const repairAttempts = Math.min(parseInt(answers.repair_attempts) || 0, 50);
      const daysOutOfService = Math.min(parseInt(answers.days_out_of_service) || 0, 365);
      const mileageAtFirstDefect = parseInt(answers.mileage_at_first_defect) || 0;

      // Base value = vehicle purchase price
      let lemonValue = vehiclePurchasePrice;

      // Defect severity multiplier
      const defectSeverityMultipliers = {
        safety_critical: 1.0,
        drivetrain: 0.9,
        electrical: 0.8,
        comfort_convenience: 0.5,
        cosmetic: 0.3
      };
      const severityMult = defectSeverityMultipliers[answers.defect_severity] || 0.7;
      lemonValue *= severityMult;
      if (answers.defect_severity) {
        factors.push(`Defect severity: ${answers.defect_severity.replace(/_/g, ' ')}`);
      }

      // Repair attempts multiplier
      let repairMult = 1.0;
      if (repairAttempts >= 4) {
        repairMult = 1.3;
        factors.push(`${repairAttempts} repair attempts (strong presumption)`);
      } else if (repairAttempts === 3) {
        repairMult = 1.2;
        factors.push(`${repairAttempts} repair attempts`);
      } else if (repairAttempts === 2) {
        repairMult = 1.0;
        factors.push(`${repairAttempts} repair attempts`);
      } else if (repairAttempts === 1) {
        repairMult = 0.7;
        factors.push(`Only ${repairAttempts} repair attempt (weak presumption)`);
      }
      lemonValue *= repairMult;

      // Days out of service multiplier
      let daysMult = 1.0;
      if (daysOutOfService >= 30) {
        daysMult = 1.2;
        factors.push(`${daysOutOfService} days out of service (meets threshold)`);
      } else if (daysOutOfService >= 15) {
        daysMult = 1.0;
        factors.push(`${daysOutOfService} days out of service`);
      } else if (daysOutOfService > 0) {
        daysMult = 0.8;
        factors.push(`Only ${daysOutOfService} days out of service (below threshold)`);
      }
      lemonValue *= daysMult;

      // Used vehicle factor
      if (answers.vehicle_new_when_purchased === false) {
        lemonValue *= 0.7;
        factors.push('Used vehicle (weaker lemon law protections in most states)');
      }

      // Manufacturer response factor
      const responseMult = { no_response: 1.2, denied: 1.1, partial_fix: 1.0, acknowledged: 0.8 };
      if (answers.manufacturer_response) {
        lemonValue *= responseMult[answers.manufacturer_response] || 1.0;
        factors.push(`Manufacturer response: ${answers.manufacturer_response.replace(/_/g, ' ')}`);
      }

      // Manufacturer notified in writing
      if (answers.manufacturer_notified === true) {
        lemonValue *= 1.15;
        factors.push('Manufacturer notified in writing');
      } else if (answers.manufacturer_notified === false) {
        lemonValue *= 0.85;
        factors.push('Manufacturer not yet notified in writing');
      }

      // Vehicle type factor
      const vehicleTypeMult = { car: 1.0, truck: 1.0, motorcycle: 1.0, rv: 1.1, boat: 0.8 };
      if (answers.vehicle_type) {
        lemonValue *= vehicleTypeMult[answers.vehicle_type] || 1.0;
        factors.push(`Vehicle type: ${answers.vehicle_type}`);
      }

      // Mileage at first defect (car/truck/motorcycle only)
      if (mileageAtFirstDefect > 0 && ['car', 'truck', 'motorcycle'].includes(answers.vehicle_type)) {
        if (mileageAtFirstDefect < 12000) {
          lemonValue *= 1.2;
          factors.push(`Low mileage at first defect (${mileageAtFirstDefect.toLocaleString()} mi)`);
        } else if (mileageAtFirstDefect > 50000) {
          lemonValue *= 0.7;
          factors.push(`High mileage at first defect (${mileageAtFirstDefect.toLocaleString()} mi)`);
        } else {
          factors.push(`Mileage at first defect: ${mileageAtFirstDefect.toLocaleString()} mi`);
        }
      }

      // RV conditional: chassis vs coach defect
      if (answers.vehicle_type === 'rv' && answers.rv_chassis_defect === true) {
        lemonValue *= 1.1;
        factors.push('Chassis defect (auto manufacturer responsible)');
      }

      // Boat conditional: engine defect
      if (answers.vehicle_type === 'boat' && answers.boat_engine_defect === true) {
        lemonValue *= 1.2;
        factors.push('Engine/motor defect (most commonly covered)');
      }

      // ==== STATE-SPECIFIC ADJUSTMENTS ====
      const llBreakdown = {
        vehiclePurchasePrice: vehiclePurchasePrice,
        estimatedRecovery: 0,
        mileageOffset: 0,
        attorneyFees: 0
      };

      if (llStateRules) {
        // Used vehicle coverage check
        if (answers.vehicle_new_when_purchased === false && llStateRules.coversUsedVehicles === false) {
          lemonValue *= 0.3;
          warnings.push(`${llStateRules.stateName}'s lemon law does NOT cover used vehicles. Your claim may require a different legal theory (e.g., breach of warranty).`);
        }

        // RV coverage check
        if (answers.vehicle_type === 'rv' && llStateRules.coversRVs === false) {
          lemonValue *= 0.3;
          warnings.push(`${llStateRules.stateName}'s lemon law does NOT cover recreational vehicles (RVs). You may need to pursue a breach of warranty or UCC claim instead.`);
        }

        // Boat coverage check
        if (answers.vehicle_type === 'boat' && llStateRules.coversBoats === false) {
          lemonValue *= 0.2;
          warnings.push(`${llStateRules.stateName}'s lemon law does NOT cover boats. You may need to pursue a Magnuson-Moss Warranty Act or UCC claim instead.`);
        }

        // Repair attempts below state presumption threshold
        if (llStateRules.presumptionRepairAttempts && repairAttempts > 0 && repairAttempts < llStateRules.presumptionRepairAttempts) {
          warnings.push(`${llStateRules.stateName} requires at least ${llStateRules.presumptionRepairAttempts} repair attempts to trigger the lemon law presumption. You have ${repairAttempts}.`);
        }

        // Days out of service below state threshold
        if (llStateRules.presumptionDaysOutOfService && daysOutOfService > 0 && daysOutOfService < llStateRules.presumptionDaysOutOfService) {
          warnings.push(`${llStateRules.stateName} requires at least ${llStateRules.presumptionDaysOutOfService} cumulative days out of service. You have ${daysOutOfService} days.`);
        }

        // Mileage limit check
        if (llStateRules.mileageLimit && mileageAtFirstDefect > llStateRules.mileageLimit) {
          lemonValue *= 0.5;
          warnings.push(`${llStateRules.stateName}'s lemon law applies to defects appearing within ${llStateRules.mileageLimit.toLocaleString()} miles. Your defect appeared at ${mileageAtFirstDefect.toLocaleString()} miles.`);
        }

        // Time limit check (months from purchase)
        if (llStateRules.timeLimit && answers.purchase_date) {
          const purchaseDate = new Date(answers.purchase_date);
          const today = new Date();
          const monthsSincePurchase = (today.getFullYear() - purchaseDate.getFullYear()) * 12 +
            (today.getMonth() - purchaseDate.getMonth());

          if (monthsSincePurchase > llStateRules.timeLimit) {
            lemonValue *= 0.5;
            warnings.push(`${llStateRules.stateName}'s lemon law covers vehicles within ${llStateRules.timeLimit} months of purchase. Your vehicle was purchased ${monthsSincePurchase} months ago.`);
          } else {
            const monthsRemaining = llStateRules.timeLimit - monthsSincePurchase;
            if (monthsRemaining <= 3) {
              warnings.push(`Your lemon law protection in ${llStateRules.stateName} expires in approximately ${monthsRemaining} month${monthsRemaining !== 1 ? 's' : ''}. Act promptly.`);
            }
            factors.push(`${llStateRules.stateName} coverage: ${monthsRemaining} months remaining`);
          }
        }

        // Statute of limitations check
        if (llStateRules.statuteOfLimitations && answers.purchase_date) {
          const purchaseDate = new Date(answers.purchase_date);
          const today = new Date();
          const yearsSincePurchase = (today - purchaseDate) / (1000 * 60 * 60 * 24 * 365.25);
          if (yearsSincePurchase > llStateRules.statuteOfLimitations) {
            warnings.push(`CRITICAL: Your case may be time-barred. The vehicle was purchased ${yearsSincePurchase.toFixed(1)} years ago, potentially exceeding ${llStateRules.stateName}'s ${llStateRules.statuteOfLimitations}-year statute of limitations.`);
          }
        }

        // Mileage offset deduction
        if (llStateRules.mileageOffsetAllowed && mileageAtFirstDefect > 0 && vehiclePurchasePrice > 0) {
          const mileageOffset = (mileageAtFirstDefect / 120000) * vehiclePurchasePrice;
          llBreakdown.mileageOffset = Math.round(mileageOffset);
          lemonValue -= mileageOffset;
          if (mileageOffset > 0) {
            factors.push(`Mileage offset deduction: -$${Math.round(mileageOffset).toLocaleString()}`);
          }
        }

        // Attorney fee shifting note
        if (llStateRules.attorneyFeeShifting) {
          const estimatedAttorneyFees = Math.max(0, lemonValue) * 0.33;
          llBreakdown.attorneyFees = Math.round(estimatedAttorneyFees);
          factors.push(`${llStateRules.stateName} requires the manufacturer to pay your attorney fees if you prevail`);
        }

        // Manufacturer buyback required
        if (llStateRules.manufacturerBuybackRequired) {
          factors.push(`${llStateRules.stateName} law allows you to demand a vehicle buyback or replacement`);
        }

        factors.push(`State: ${llStateRules.stateName}`);
      } else {
        factors.push(`State: ${state}`);
      }

      // Ensure minimum value
      lemonValue = Math.max(1000, lemonValue);
      llBreakdown.estimatedRecovery = Math.round(lemonValue);

      factors.push(`Case type: lemon_law`);

      return {
        value: Math.max(1000, Math.round(lemonValue / 1000) * 1000),
        lowRange: Math.max(1000, Math.round(lemonValue * 0.75 / 1000) * 1000),
        highRange: Math.round(lemonValue * 1.25 / 1000) * 1000,
        factors: factors,
        warnings: warnings.length > 0 ? warnings : undefined,
        breakdown: llBreakdown,
        stateSpecificInfo: llStateRules ? {
          stateName: llStateRules.stateName,
          coversUsedVehicles: llStateRules.coversUsedVehicles,
          coversRVs: llStateRules.coversRVs,
          coversBoats: llStateRules.coversBoats,
          presumptionRepairAttempts: llStateRules.presumptionRepairAttempts,
          presumptionDaysOutOfService: llStateRules.presumptionDaysOutOfService,
          mileageLimit: llStateRules.mileageLimit,
          timeLimit: llStateRules.timeLimit,
          attorneyFeeShifting: llStateRules.attorneyFeeShifting,
          manufacturerBuybackRequired: llStateRules.manufacturerBuybackRequired
        } : undefined
      };
    }

    default:
      baseValue = 50000;
      factors.push('General case estimate');
  }

  // ============================================================================
  // STATE-SPECIFIC ADJUSTMENTS
  // ============================================================================

  // For cases with economic and non-economic damage breakdowns
  // We'll estimate the split (typically non-economic is 2-3x economic for injury cases)
  if (baseValue > 0) {
    // Rough estimate: 30% economic, 70% non-economic for injury cases
    // For purely economic cases (wage theft, etc.), reverse the split
    const isInjuryCase = ['motor', 'medical', 'premises', 'product', 'wrongful_death', 'dog_bite'].includes(caseType);

    if (isInjuryCase) {
      economicDamages = baseValue * 0.35;
      nonEconomicDamages = baseValue * 0.65;
    } else {
      economicDamages = baseValue * 0.85;
      nonEconomicDamages = baseValue * 0.15;
    }
  }

  // Apply state-specific damage caps
  if (stateRules) {
    // Apply non-economic damage cap
    if (stateRules.nonEconomicDamageCap) {
      if (typeof stateRules.nonEconomicDamageCap === 'number') {
        if (nonEconomicDamages > stateRules.nonEconomicDamageCap) {
          nonEconomicDamages = stateRules.nonEconomicDamageCap;
          baseValue = economicDamages + nonEconomicDamages;
          factors.push(`⚠️ ${stateRules.stateName} caps non-economic damages at $${stateRules.nonEconomicDamageCap.toLocaleString()}`);
        }
      } else if (typeof stateRules.nonEconomicDamageCap === 'string') {
        // Handle complex cap formulas like Ohio's
        if (stateRules.nonEconomicDamageCap === 'lesserOf250kOr3xEconomic') {
          const cap = Math.min(250000, economicDamages * 3);
          if (nonEconomicDamages > cap) {
            nonEconomicDamages = cap;
            baseValue = economicDamages + nonEconomicDamages;
            factors.push(`⚠️ ${stateRules.stateName} caps non-economic damages at lesser of $250k or 3x economic damages`);
          }
        }
      }
    }

    // Apply total economic damage cap (rare, but exists in some states like Indiana medical malpractice)
    if (stateRules.economicDamageCap && typeof stateRules.economicDamageCap === 'number') {
      if (baseValue > stateRules.economicDamageCap) {
        baseValue = stateRules.economicDamageCap;
        factors.push(`⚠️ ${stateRules.stateName} caps total damages at $${stateRules.economicDamageCap.toLocaleString()}`);
      }
    }

    // Check statute of limitations and incident date
    if (stateRules.statuteOfLimitations && answers.incident_date) {
      const sol = stateRules.statuteOfLimitations;
      const incidentDate = new Date(answers.incident_date);
      const today = new Date();

      // Calculate years since incident
      const yearsSinceIncident = (today - incidentDate) / (1000 * 60 * 60 * 24 * 365.25);

      // Check if case is time-barred
      if (yearsSinceIncident > sol) {
        warnings.push(`🚨 CRITICAL: Your case may be time-barred. The incident occurred ${yearsSinceIncident.toFixed(1)} years ago, exceeding ${stateRules.stateName}'s ${sol}-year statute of limitations. You may no longer be able to file this lawsuit. Consult an attorney immediately.`);
        factors.push(`🚨 Case may be OUT OF STATUTE OF LIMITATIONS (${yearsSinceIncident.toFixed(1)} years > ${sol} year limit)`);
      } else {
        // Calculate time remaining
        const yearsRemaining = sol - yearsSinceIncident;
        if (yearsRemaining < 1) {
          // Less than 1 year remaining - urgent warning
          const monthsRemaining = Math.floor(yearsRemaining * 12);
          warnings.push(`⚠️ URGENT: Only ${monthsRemaining} month${monthsRemaining !== 1 ? 's' : ''} remaining to file lawsuit in ${stateRules.stateName} (${sol}-year statute of limitations)`);
          factors.push(`⚠️ URGENT: ${monthsRemaining} month${monthsRemaining !== 1 ? 's' : ''} left to file`);
        } else {
          // Standard SOL warning
          warnings.push(`Statute of limitations in ${stateRules.stateName}: ${sol} year${sol !== 1 ? 's' : ''} (${yearsRemaining.toFixed(1)} years remaining)`);
          factors.push(`⏱️ Statute of limitations: ${sol} year${sol !== 1 ? 's' : ''} (${yearsRemaining.toFixed(1)} years left)`);
        }
      }
    } else if (stateRules.statuteOfLimitations) {
      // No incident date provided, show general SOL info
      const sol = stateRules.statuteOfLimitations;
      warnings.push(`Statute of limitations in ${stateRules.stateName}: ${sol} year${sol !== 1 ? 's' : ''}`);
      factors.push(`⏱️ Statute of limitations: ${sol} year${sol !== 1 ? 's' : ''} in ${stateRules.stateName}`);
    }

    // Add negligence system information for motor vehicle cases
    if (caseType === 'motor' && stateRules.negligenceSystem) {
      const negligenceSystems = {
        'pure_comparative': 'Pure comparative negligence (can recover even if 99% at fault)',
        'modified_50': 'Modified comparative negligence (can recover if less than 50% at fault)',
        'modified_51': 'Modified comparative negligence (can recover if 50% or less at fault)',
        'contributory': '⚠️ Contributory negligence (cannot recover if ANY fault)'
      };
      const systemDesc = negligenceSystems[stateRules.negligenceSystem];
      if (systemDesc) {
        factors.push(`${stateRules.stateName}: ${systemDesc}`);
      }
    }

    // Add no-fault state warning for motor vehicle cases
    if (caseType === 'motor' && stateRules.noFaultState) {
      factors.push(`⚠️ ${stateRules.stateName} is a no-fault state - PIP insurance applies first`);
      warnings.push(`${stateRules.stateName} is a no-fault state. Personal Injury Protection (PIP) insurance applies first, and you may need to meet a "serious injury threshold" to sue the at-fault driver.`);
    }

    // Add strict liability note for dog bites
    if (caseType === 'dog_bite') {
      if (stateRules.strictLiability === true) {
        factors.push(`${stateRules.stateName} has strict liability for dog bites (easier to prove)`);
      } else if (stateRules.strictLiability === false) {
        factors.push(`⚠️ ${stateRules.stateName} follows "one-bite rule" (must prove owner knew dog was dangerous)`);
        warnings.push(`${stateRules.stateName} follows the "one-bite rule" - you must prove the owner knew or should have known the dog had vicious propensities.`);
      }
    }
  }

  // Ensure minimum value
  let finalValue = Math.max(5000, Math.round(baseValue / 1000) * 1000);

  // Create range (±25%)
  const lowRange = Math.round(finalValue * 0.75 / 1000) * 1000;
  const highRange = Math.round(finalValue * 1.25 / 1000) * 1000;

  // Add state and case type to factors
  if (stateRules) {
    factors.push(`State: ${stateRules.stateName}`);
  } else {
    factors.push(`State: ${state}`);
  }
  factors.push(`Case type: ${caseType}`);

  return {
    value: finalValue,
    lowRange,
    highRange,
    factors: factors,
    warnings: warnings.length > 0 ? warnings : undefined,
    stateSpecificInfo: stateRules ? {
      stateName: stateRules.stateName,
      negligenceSystem: stateRules.negligenceSystem,
      statuteOfLimitations: stateRules.statuteOfLimitations,
      hasNonEconomicCap: !!stateRules.nonEconomicDamageCap,
      nonEconomicCap: stateRules.nonEconomicDamageCap,
      isNoFaultState: stateRules.noFaultState
    } : undefined
  };
};
