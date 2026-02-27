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

    case 'class_action':
      const individualDamages = parseFloat(answers.individual_damages) || 1000;
      const classMembers = Math.min(parseFloat(answers.num_class_members) || 100, 100000);
      const durationHarm = parseFloat(answers.duration_of_harm) || 12;

      baseValue = individualDamages * classMembers;

      multiplier = 1.0;

      // Class action type multipliers (different recovery potential)
      const classActionTypeMultipliers = {
        data_breach: 1.5,           // High statutory damages
        consumer_fraud: 1.3,
        defective_product: 1.4,
        securities: 1.5,            // High damages potential
        employment: 1.2,
        other: 1.0
      };
      if (answers.class_action_type) {
        multiplier *= classActionTypeMultipliers[answers.class_action_type] || 1.0;
      }

      if (answers.documented_evidence === true) multiplier *= 1.3;
      if (answers.pattern_of_conduct === true) multiplier *= 1.4;
      if (answers.regulatory_violations === true) multiplier *= 1.5;

      // Duration factor
      if (durationHarm > 24) multiplier *= 1.3;

      baseValue = baseValue * multiplier;

      factors.push(`Individual damages: $${individualDamages.toLocaleString()}`);
      factors.push(`Class members: ${classMembers}`);
      factors.push(`Duration: ${durationHarm} months`);
      if (answers.class_action_type) factors.push(`Class action type: ${answers.class_action_type}`);
      if (answers.documented_evidence) factors.push('Strong documentation');
      if (answers.pattern_of_conduct) factors.push('Pattern of conduct');
      if (answers.regulatory_violations) factors.push('Regulatory violations');
      break;

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
