/**
 * State Content Engine
 * Derives genuinely unique, insight-driven prose from stateLegalDatabase.js data.
 * Pure functions — no side effects, no API calls.
 *
 * Launch case types (full prose): motor vehicle, workers' comp, medical malpractice
 * Other case types: returns null for graceful degradation
 */

import { STATE_LEGAL_DATABASE, NEGLIGENCE_TYPES } from './stateLegalDatabase';
import { caseTypeToDbKey, negligenceLabels, stateCodeToSlug } from './stateSlugMap';
import { caseIdToSlug } from './caseTypeSlugs';

// ============================================================================
// CONSTANTS
// ============================================================================

const LAUNCH_CASE_TYPES = ['motor', 'workers_comp', 'medical'];

const ALL_STATE_CODES = Object.keys(STATE_LEGAL_DATABASE);

const CASE_TYPE_LABELS = {
  motor: 'Motor Vehicle Accident',
  medical: 'Medical Malpractice',
  premises: 'Premises Liability',
  product: 'Product Liability',
  wrongful_death: 'Wrongful Death',
  dog_bite: 'Dog Bite',
  wrongful_term: 'Wrongful Termination',
  wage: 'Wage & Hour',
  class_action: 'Class Action',
  insurance: 'Insurance Bad Faith',
  disability: 'Disability Denial',
  professional: 'Professional Malpractice',
  civil_rights: 'Civil Rights',
  ip: 'Intellectual Property',
  workers_comp: "Workers' Compensation",
  lemon_law: 'Lemon Law',
};

const ALL_CASE_TYPE_IDS = Object.keys(CASE_TYPE_LABELS);

// ============================================================================
// PROSE POST-PROCESSING — bold key legal terms for scannability
// ============================================================================

/**
 * Wrap key legal terms in <strong> tags for CRO emphasis.
 * Only targets high-value scannable terms: deadlines, system names, cap amounts.
 */
function boldKeyTerms(text) {
  return text
    // Deadlines: "2 years", "3-year", "30 days", "90-day", etc.
    .replace(/\b(\d+(?:\.\d+)?)[\s-](year|yr|day|week)s?\b/gi, (match) => `<strong>${match}</strong>`)
    // Dollar amounts: $250,000 or $1,200/week patterns
    .replace(/\$[\d,]+(?:K)?(?:\/week)?/g, '<strong>$&</strong>')
    // Negligence system names
    .replace(/\b(pure comparative negligence|modified comparative fault|comparative negligence|contributory negligence|pure comparative fault|modified comparative negligence)\b/gi, '<strong>$&</strong>')
    // No-fault state designation
    .replace(/\b(no-fault)\b/gi, '<strong>$&</strong>')
    // Strict liability
    .replace(/\b(strict liability)\b/gi, '<strong>$&</strong>')
    // Discovery rule
    .replace(/\b(discovery rule)\b/gi, '<strong>$&</strong>')
    // Statute of repose
    .replace(/\b(statute of repose)\b/gi, '<strong>$&</strong>')
    // Clean up any nested strong tags
    .replace(/<strong><strong>/g, '<strong>')
    .replace(/<\/strong><\/strong>/g, '</strong>');
}

/**
 * Strip any HTML tags except <strong> from prose content.
 * Prevents XSS through dangerouslySetInnerHTML while preserving bold emphasis.
 */
function sanitizeProseHTML(html) {
  return html.replace(/<(?!\/?strong\b)[^>]*>/gi, '');
}

// ============================================================================
// 1A. CORE UTILITIES
// ============================================================================

/**
 * Simple deterministic hash for sentence variation selection.
 * Returns an integer for indexing into variation arrays.
 */
function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/**
 * Select a variation from an array based on deterministic hash of state + case type.
 * Ensures the same state+caseType always gets the same phrasing.
 */
function pickVariation(variations, stateCode, caseTypeId) {
  const idx = hashCode(stateCode + (caseTypeId || '')) % variations.length;
  return variations[idx];
}

/**
 * Compute national averages for a given case type.
 * Iterates all 51 entries and returns aggregated stats.
 */
export function getNationalAverages(caseTypeId) {
  const dbKey = caseTypeToDbKey[caseTypeId];
  if (!dbKey) return null;

  const sols = [];
  let capCount = 0;
  let noFaultCount = 0;
  let strictLiabilityCount = 0;
  const weeklyBenefits = [];
  const ttdRates = [];

  for (const code of ALL_STATE_CODES) {
    const state = STATE_LEGAL_DATABASE[code];
    const rules = state[dbKey];
    if (!rules) continue;

    if (rules.statuteOfLimitations != null) sols.push(rules.statuteOfLimitations);
    if (rules.nonEconomicDamageCap != null) capCount++;
    if (rules.noFaultState) noFaultCount++;
    if (rules.strictLiability) strictLiabilityCount++;
    if (rules.maxWeeklyBenefit != null) weeklyBenefits.push(rules.maxWeeklyBenefit);
    if (rules.ttdRate != null) ttdRates.push(rules.ttdRate);
  }

  const avgSOL = sols.length ? +(sols.reduce((a, b) => a + b, 0) / sols.length).toFixed(1) : null;
  const avgWeeklyBenefit = weeklyBenefits.length
    ? Math.round(weeklyBenefits.reduce((a, b) => a + b, 0) / weeklyBenefits.length)
    : null;
  const avgTTDRate = ttdRates.length
    ? +(ttdRates.reduce((a, b) => a + b, 0) / ttdRates.length).toFixed(2)
    : null;

  return {
    avgSOL,
    minSOL: sols.length ? Math.min(...sols) : null,
    maxSOL: sols.length ? Math.max(...sols) : null,
    statesWithCaps: capCount,
    statesWithNoCaps: ALL_STATE_CODES.length - capCount,
    noFaultCount,
    strictLiabilityCount,
    avgWeeklyBenefit,
    avgTTDRate,
    totalStates: ALL_STATE_CODES.length,
  };
}

/**
 * Translate punitive damage cap DB strings into human-readable prose
 * with a worked example at $100K compensatory damages.
 */
export function formatPunitiveCap(capString) {
  if (!capString) return null;

  const caps = {
    'lesserOf3xCompensatoryOr500k': {
      prose: 'the lesser of 3 times compensatory damages or $500,000',
      example: 'On $100,000 in compensatory damages, punitive damages would be capped at $300,000.',
    },
    'greaterOf3xCompensatoryOr500k': {
      prose: 'the greater of 3 times compensatory damages or $500,000',
      example: 'On $100,000 in compensatory damages, punitive damages could reach up to $500,000.',
    },
    'lesserOf3xCompensatoryOr250kOr500k': {
      prose: 'the lesser of 3 times compensatory damages or $250,000\u2013$500,000 depending on the claim',
      example: 'On $100,000 in compensatory damages, punitive damages would be capped at $250,000\u2013$300,000.',
    },
    'lesserOf3xCompensatoryOr250k': {
      prose: 'the lesser of 3 times compensatory damages or $250,000',
      example: 'On $100,000 in compensatory damages, punitive damages would be capped at $250,000.',
    },
    'equalToCompensatory': {
      prose: 'an amount equal to compensatory damages',
      example: 'On $100,000 in compensatory damages, punitive damages would be capped at $100,000.',
    },
    'lesserOf5MillionOr1.5xCompensatory': {
      prose: 'the lesser of $5 million or 1.5 times compensatory damages',
      example: 'On $100,000 in compensatory damages, punitive damages would be capped at $150,000.',
    },
    'greaterOf500kOr2xCompensatory': {
      prose: 'the greater of $500,000 or 2 times compensatory damages',
      example: 'On $100,000 in compensatory damages, punitive damages could reach $500,000.',
    },
    'lesserOf2.5PercentDefendantNetWorthOr20Million': {
      prose: 'the lesser of 2.5% of the defendant\u2019s net worth or $20 million',
      example: 'The cap depends on the defendant\u2019s financial size, up to a maximum of $20 million.',
    },
    'lesserOf5xNetDamagesOr500k': {
      prose: 'the lesser of 5 times net damages or $500,000',
      example: 'On $100,000 in net damages, punitive damages would be capped at $500,000.',
    },
    'lesserOf3xCompensatoryOr10Million': {
      prose: 'the lesser of 3 times compensatory damages or $10 million',
      example: 'On $100,000 in compensatory damages, punitive damages would be capped at $300,000.',
    },
    'lesserOf3xCompensatoryOr300k': {
      prose: 'the lesser of 3 times compensatory damages or $300,000',
      example: 'On $100,000 in compensatory damages, punitive damages would be capped at $300,000.',
    },
    'greaterOf5xCompensatoryOr350k': {
      prose: 'the greater of 5 times compensatory damages or $350,000',
      example: 'On $100,000 in compensatory damages, punitive damages could reach $500,000.',
    },
    'greaterOf3xCompensatoryOr250k': {
      prose: 'the greater of 3 times compensatory damages or $250,000',
      example: 'On $100,000 in compensatory damages, punitive damages could reach $300,000.',
    },
    'greaterOf2xCompensatoryOr250k': {
      prose: 'the greater of 2 times compensatory damages or $250,000',
      example: 'On $100,000 in compensatory damages, punitive damages could reach $250,000.',
    },
    '2xCompensatory': {
      prose: '2 times compensatory damages',
      example: 'On $100,000 in compensatory damages, punitive damages would be capped at $200,000.',
    },
    'greaterOf100kOr2xActualDamages': {
      prose: 'the greater of $100,000 or 2 times actual damages',
      example: 'On $100,000 in actual damages, punitive damages could reach $200,000.',
    },
    'lesserOf2xCompensatoryOr500k': {
      prose: 'the lesser of 2 times compensatory damages or $500,000',
      example: 'On $100,000 in compensatory damages, punitive damages would be capped at $200,000.',
    },
    'lesserOf2xEconomicPlus750kNonEconomicOr750k': {
      prose: 'the lesser of 2 times economic damages plus $750,000 in non-economic damages, or $750,000',
      example: 'Punitive damages are capped at $750,000 in most cases, with adjustments for economic damages.',
    },
    '2xCompensatoryOr200k': {
      prose: '2 times compensatory damages or $200,000, whichever is greater',
      example: 'On $100,000 in compensatory damages, punitive damages could reach $200,000.',
    },
  };

  return caps[capString] || { prose: capString, example: '' };
}

/**
 * Returns urgency framing for a statute of limitations relative to the national average.
 */
export function getSOLContext(sol, caseTypeId) {
  if (sol == null) return null;
  const avgs = getNationalAverages(caseTypeId);
  if (!avgs || avgs.avgSOL == null) return { label: 'typical', comparison: '' };

  const diff = sol - avgs.avgSOL;
  if (diff <= -0.8) {
    return {
      label: 'shorter',
      comparison: `shorter than the national average of ${avgs.avgSOL} years`,
      urgency: 'This compressed timeline means you need to consult an attorney and begin gathering evidence quickly.',
    };
  }
  if (diff >= 0.8) {
    return {
      label: 'longer',
      comparison: `longer than the national average of ${avgs.avgSOL} years`,
      urgency: 'While you have more time than most states, delaying still weakens your case as evidence degrades and witnesses become harder to locate.',
    };
  }
  return {
    label: 'typical',
    comparison: `in line with the national average of ${avgs.avgSOL} years`,
    urgency: 'This is a standard timeframe, but acting sooner preserves evidence and strengthens your position.',
  };
}

/**
 * Build a factual comparison profile of a state.
 * Returns specific factual observations rather than subjective labels.
 */
export function classifyState(stateCode) {
  const state = STATE_LEGAL_DATABASE[stateCode];
  if (!state) return null;

  const observations = [];
  const negligence = state.negligenceSystem;

  // Negligence system classification
  if (negligence === NEGLIGENCE_TYPES.CONTRIBUTORY) {
    observations.push(
      `${state.name} is one of only 4 states and the District of Columbia that use contributory negligence, which can bar recovery entirely if the injured party is found even 1% at fault.`
    );
  } else if (negligence === NEGLIGENCE_TYPES.PURE_COMPARATIVE) {
    observations.push(
      `${state.name} uses pure comparative fault, allowing injured parties to recover damages even if they are 99% at fault, though the award is reduced by their percentage of responsibility.`
    );
  } else if (negligence === NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_50) {
    observations.push(
      `${state.name} uses modified comparative fault with a 50% bar, meaning you cannot recover if you are 50% or more at fault for the accident.`
    );
  } else if (negligence === NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_51) {
    observations.push(
      `${state.name} uses modified comparative fault with a 51% bar, meaning you can still recover as long as your fault does not exceed 50%.`
    );
  }

  // Count damage caps across case types
  let capCount = 0;
  const capsDetails = [];
  for (const key of Object.keys(caseTypeToDbKey)) {
    const dbKey = caseTypeToDbKey[key];
    const rules = state[dbKey];
    if (rules?.nonEconomicDamageCap != null) {
      capCount++;
      capsDetails.push({ caseType: key, cap: rules.nonEconomicDamageCap });
    }
  }
  if (capCount > 0) {
    observations.push(
      `${state.name} imposes non-economic damage caps on ${capCount} case type${capCount > 1 ? 's' : ''}, which can significantly limit pain and suffering awards.`
    );
  }

  // No-fault auto insurance
  if (state.motorVehicle?.noFaultState) {
    observations.push(
      `${state.name} is a no-fault auto insurance state, requiring drivers to first seek compensation through their own personal injury protection (PIP) coverage before filing a lawsuit.`
    );
  }

  // Workers' comp special features
  const wc = state.workersCompensation;
  if (wc?.monopolisticStateFund) {
    observations.push(
      `${state.name} operates a monopolistic state workers' compensation fund, meaning employers must obtain coverage through the state rather than private insurers.`
    );
  }
  if (wc?.nonSubscriberState) {
    observations.push(
      `${state.name} allows employers to opt out of the workers' compensation system entirely (non-subscriber status), which removes the exclusive remedy protection and exposes them to civil lawsuits for workplace injuries.`
    );
  }

  // Unique impairment guides
  if (wc?.impairmentGuide === 'PDRS') {
    observations.push(
      `${state.name} uses its own Permanent Disability Rating Schedule (PDRS) rather than the AMA Guides, which can produce significantly different impairment ratings.`
    );
  }

  // Discovery rule for medical malpractice
  if (state.medicalMalpractice?.discoveryRule) {
    observations.push(
      `${state.name} applies a discovery rule for medical malpractice, meaning the statute of limitations may begin when the patient discovers (or should have discovered) the injury rather than when it occurred.`
    );
  }

  return {
    stateName: state.name,
    negligenceSystem: negligence,
    negligenceLabel: negligenceLabels[negligence],
    observations,
    capCount,
    capsDetails,
    hasNoFault: !!state.motorVehicle?.noFaultState,
    hasMonopolisticFund: !!wc?.monopolisticStateFund,
    hasNonSubscriber: !!wc?.nonSubscriberState,
    hasDiscoveryRule: !!state.medicalMalpractice?.discoveryRule,
    impairmentGuide: wc?.impairmentGuide,
  };
}

// ============================================================================
// 1B. STATE HUB CONTENT GENERATORS
// ============================================================================

const LANDSCAPE_INTROS = [
  (name, negLabel) => `${name} operates under a ${negLabel.toLowerCase()} system, which directly shapes how personal injury claims are evaluated and what you can recover.`,
  (name, negLabel) => `Under ${name}'s ${negLabel.toLowerCase()} framework, the rules governing fault and recovery differ from many other states, affecting the value of nearly every type of claim.`,
  (name, negLabel) => `${name}'s legal landscape is defined by its ${negLabel.toLowerCase()} rules, which play a central role in determining how much compensation an injured party can receive.`,
  (name, negLabel) => `The ${negLabel.toLowerCase()} system in ${name} establishes the ground rules for personal injury recovery, influencing everything from fault allocation to damage awards.`,
  (name, negLabel) => `Personal injury law in ${name} is built on a ${negLabel.toLowerCase()} foundation, which determines how fault is assigned and how much of your damages you can actually recover.`,
  (name, negLabel) => `${name}\u2019s approach to personal injury claims is shaped by its ${negLabel.toLowerCase()} rules \u2014 a framework that affects the strategy, value, and outcome of nearly every case filed in the state.`,
];

const CONTRIBUTORY_PARAGRAPHS = [
  (name) => `This is one of the most restrictive negligence systems in the country. In ${name}, if the defendant can show you were even 1% at fault for the incident, you may be barred from recovering any compensation. This makes gathering evidence of the other party's sole negligence critical in ${name} cases.`,
  (name) => `${name}'s contributory negligence standard is among the strictest in the nation. Any finding of fault on your part \u2014 even a small percentage \u2014 can completely eliminate your right to compensation. Strong evidence of the defendant's exclusive responsibility is essential.`,
  (name) => `Because ${name} follows contributory negligence, claimants face a uniquely high bar. Even minimal fault on your part can result in zero recovery. This makes pre-suit investigation and evidence preservation more important here than in most states.`,
];

const PURE_COMPARATIVE_PARAGRAPHS = [
  (name) => `${name}'s pure comparative fault system is among the most permissive in the country. Even if you are found 90% at fault, you can still recover 10% of your damages. This means nearly every claim has some recovery potential, though your award is reduced proportionally to your share of fault.`,
  (name) => `Under ${name}'s pure comparative fault rules, fault percentages are applied as reductions rather than barriers. A claimant who is 70% at fault still recovers 30% of their total damages. This system ensures that even heavily contested cases have settlement value.`,
  (name) => `In ${name}, pure comparative fault allows recovery at any fault level. Your damages are simply reduced by your percentage of responsibility. This approach means that even cases where you share significant fault can result in meaningful compensation.`,
];

const MODIFIED_50_PARAGRAPHS = [
  (name) => `Under ${name}'s modified comparative fault system, you can recover as long as your fault is less than 50%. If you are found 50% or more at fault, you are barred from recovery entirely. At 49% fault, your damages are reduced by 49% but you still receive compensation.`,
  (name) => `${name} uses a 50% bar rule for comparative fault. This means the fault threshold is critical: at 49% fault you recover (reduced by 49%), but at 50% fault you recover nothing. Cases near the threshold often hinge on how fault is allocated by the jury.`,
  (name) => `The 50% bar in ${name}'s comparative fault system creates a hard cutoff. Claimants must demonstrate they were less than half at fault to recover anything, making fault analysis and evidence of the other party's responsibility especially important.`,
];

const MODIFIED_51_PARAGRAPHS = [
  (name) => `${name}'s modified comparative fault system sets the bar at 51%. You can recover damages as long as your fault does not exceed 50%. At 51% fault or higher, you are completely barred from recovery. This 1% difference from the 50% bar states can be outcome-determinative.`,
  (name) => `Under ${name}'s 51% bar rule, you can recover compensation if you are 50% or less at fault, but not if you are 51% or more at fault. Your award is reduced by your fault percentage. This system is slightly more permissive than the 50% bar used in some other states.`,
  (name) => `${name} follows a modified comparative fault system with a 51% threshold. Claimants who are equally at fault (50%) can still recover, unlike in 50% bar states. Once fault crosses the 51% line, however, recovery is completely barred.`,
];

/**
 * Generate 2-3 paragraphs describing a state's legal landscape.
 */
export function getStateLandscapeSummary(stateCode) {
  const state = STATE_LEGAL_DATABASE[stateCode];
  if (!state) return null;

  const name = state.name;
  const classification = classifyState(stateCode);
  if (!classification) return null;

  const negLabel = classification.negligenceLabel || 'comparative fault';
  const paragraphs = [];

  // Paragraph 1: State archetype intro
  paragraphs.push(pickVariation(LANDSCAPE_INTROS, stateCode, 'hub')(name, negLabel));

  // Paragraph 2: Negligence system explained with implications
  const negligence = state.negligenceSystem;
  if (negligence === NEGLIGENCE_TYPES.CONTRIBUTORY) {
    paragraphs.push(pickVariation(CONTRIBUTORY_PARAGRAPHS, stateCode, 'neg')(name));
  } else if (negligence === NEGLIGENCE_TYPES.PURE_COMPARATIVE) {
    paragraphs.push(pickVariation(PURE_COMPARATIVE_PARAGRAPHS, stateCode, 'neg')(name));
  } else if (negligence === NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_50) {
    paragraphs.push(pickVariation(MODIFIED_50_PARAGRAPHS, stateCode, 'neg')(name));
  } else if (negligence === NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_51) {
    paragraphs.push(pickVariation(MODIFIED_51_PARAGRAPHS, stateCode, 'neg')(name));
  }

  // Paragraph 3: Notable features (pick top 2-3 observations)
  const extraObs = classification.observations.filter(
    o => !o.includes(negLabel.toLowerCase()) && !o.includes('comparative') && !o.includes('contributory')
  );
  if (extraObs.length > 0) {
    paragraphs.push(extraObs.slice(0, 3).join(' '));
  }

  return paragraphs;
}

/**
 * Generate 2-3 callout cards highlighting state differentiators.
 */
export function getStateDifferentiators(stateCode) {
  const state = STATE_LEGAL_DATABASE[stateCode];
  if (!state) return null;

  const cards = [];
  const name = state.name;
  const wc = state.workersCompensation;
  const negligence = state.negligenceSystem;

  // Priority order for callout cards
  if (negligence === NEGLIGENCE_TYPES.CONTRIBUTORY) {
    cards.push({
      title: 'Contributory Negligence State',
      description: `${name} is one of only a handful of jurisdictions where any fault on your part can bar your entire recovery. This is the strictest standard in the U.S.`,
      severity: 'warning',
    });
  }

  if (state.motorVehicle?.noFaultState) {
    cards.push({
      title: 'No-Fault Auto Insurance',
      description: `${name} requires drivers to carry personal injury protection (PIP) and file claims through their own insurer first. You must meet a serious injury threshold to file a lawsuit against the at-fault driver.`,
      severity: 'info',
    });
  }

  if (wc?.monopolisticStateFund) {
    cards.push({
      title: 'Monopolistic State Fund',
      description: `${name} requires employers to purchase workers' compensation insurance exclusively through the state fund, not private insurers. This affects how claims are processed and benefits are paid.`,
      severity: 'info',
    });
  }

  if (wc?.nonSubscriberState) {
    cards.push({
      title: 'Non-Subscriber Option',
      description: `Employers in ${name} may opt out of workers' compensation entirely. Non-subscribing employers lose the exclusive remedy defense and can be sued directly for workplace injuries.`,
      severity: 'info',
    });
  }

  // Damage caps
  const classification = classifyState(stateCode);
  if (classification?.capCount > 0) {
    const capLines = classification.capsDetails
      .slice(0, 3)
      .map(c => `${CASE_TYPE_LABELS[c.caseType]}: $${(c.cap / 1000).toFixed(0)}K`)
      .join(', ');
    cards.push({
      title: `Damage Caps (${classification.capCount} Case Type${classification.capCount > 1 ? 's' : ''})`,
      description: `${name} limits non-economic damages in certain case types: ${capLines}. These caps can significantly reduce pain and suffering awards.`,
      severity: 'warning',
    });
  }

  // Notable SOLs (very short: 1 year in any area)
  const shortSOLs = [];
  for (const caseType of ALL_CASE_TYPE_IDS) {
    const dbKey = caseTypeToDbKey[caseType];
    const rules = state[dbKey];
    if (rules?.statuteOfLimitations === 1) {
      shortSOLs.push(CASE_TYPE_LABELS[caseType]);
    }
  }
  if (shortSOLs.length > 0 && cards.length < 3) {
    cards.push({
      title: '1-Year Filing Deadlines',
      description: `${name} imposes a 1-year statute of limitations for: ${shortSOLs.join(', ')}. This is shorter than most states and requires immediate action.`,
      severity: 'warning',
    });
  }

  if (wc?.impairmentGuide === 'PDRS' && cards.length < 3) {
    cards.push({
      title: 'Unique Disability Rating System',
      description: `${name} uses its own Permanent Disability Rating Schedule (PDRS) rather than the AMA Guides used by most states. This can produce different impairment ratings and benefit amounts.`,
      severity: 'info',
    });
  }

  return cards.slice(0, 3);
}

/**
 * Generate SOL comparison table data for all 15 case types in this state.
 */
export function getStateSOLTable(stateCode) {
  const state = STATE_LEGAL_DATABASE[stateCode];
  if (!state) return null;

  const rows = [];
  for (const caseTypeId of ALL_CASE_TYPE_IDS) {
    const dbKey = caseTypeToDbKey[caseTypeId];
    const rules = state[dbKey];
    const sol = rules?.statuteOfLimitations;
    if (sol == null) continue;

    const avgs = getNationalAverages(caseTypeId);
    const avgSOL = avgs?.avgSOL;

    let comparison = 'average';
    if (avgSOL != null) {
      if (sol < avgSOL - 0.4) comparison = 'below';
      else if (sol > avgSOL + 0.4) comparison = 'above';
    }

    rows.push({
      caseTypeId,
      label: CASE_TYPE_LABELS[caseTypeId],
      sol,
      avgSOL,
      comparison,
      slug: caseIdToSlug[caseTypeId],
    });
  }

  return rows;
}

// ============================================================================
// 1C. STATE × CASE TYPE CONTENT GENERATORS
// ============================================================================

// --- Negligence prose templates (case-type-specific) ---

const MOTOR_NEGLIGENCE_PROSE = {
  [NEGLIGENCE_TYPES.CONTRIBUTORY]: [
    (name) => `In ${name}, the contributory negligence rule makes car accident cases exceptionally high-stakes. If the other driver's attorney can demonstrate you were even slightly at fault \u2014 perhaps for driving 2 mph over the speed limit or for not wearing a seatbelt \u2014 your entire claim could be dismissed. This makes dashcam footage, police reports, and witness statements critical evidence in ${name} motor vehicle cases.`,
    (name) => `${name}'s contributory negligence doctrine applies full force to motor vehicle accidents. Even a minor finding of shared fault \u2014 such as a brief distraction or a rolling stop \u2014 can eliminate your right to any compensation. This strict standard means building an airtight liability case is the single most important factor in ${name} car accident claims.`,
    (name) => `Motor vehicle accidents in ${name} are governed by contributory negligence \u2014 one of the harshest fault standards in the country. If the defense establishes any degree of fault on your part, your recovery drops to zero. This all-or-nothing rule means that even routine traffic violations at the time of the crash can be used to defeat your entire claim.`,
    (name) => `${name} is among only a handful of jurisdictions that still follow contributory negligence for car accident cases. The practical effect: insurance companies will investigate every detail of your driving behavior at the time of the crash, looking for any basis to assign even 1% fault and eliminate your claim completely. Preserving evidence of the other driver\u2019s exclusive fault is paramount.`,
  ],
  [NEGLIGENCE_TYPES.PURE_COMPARATIVE]: [
    (name) => `${name}'s pure comparative fault system means you can recover damages from a car accident even if you were mostly at fault. If you are found 70% responsible for a collision and your damages total $100,000, you would still receive $30,000. This makes virtually every motor vehicle accident claim worth evaluating, regardless of the fault split.`,
    (name) => `Under ${name}'s pure comparative fault rules, motor vehicle accident compensation is proportional to the other party's fault. A driver who is 80% at fault still recovers 20% of their damages. Insurance adjusters in ${name} focus heavily on fault percentages because every point directly affects the payout.`,
    (name) => `${name} follows a pure comparative fault rule for motor vehicle accidents, meaning there is no threshold that bars recovery. Whether you are 10% or 90% at fault, you can still recover the remaining percentage of your damages. Every car accident claim in ${name} has some settlement value, making fault allocation the central negotiation point.`,
    (name) => `Car accident claims in ${name} benefit from the state\u2019s pure comparative fault system, which never completely bars recovery based on fault. Your compensation is simply reduced by your share of responsibility. This approach means that even contested multi-vehicle accidents where fault is widely distributed can result in meaningful recovery for each injured party.`,
  ],
  [NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_50]: [
    (name) => `In ${name} motor vehicle accident cases, you can recover damages only if your fault is less than 50%. If the jury finds you equally at fault (50/50), you recover nothing. This threshold makes the fault determination in car accident cases especially consequential \u2014 the difference between 49% and 50% fault is the difference between receiving compensation and receiving nothing.`,
    (name) => `${name} applies its 50% bar to car accident claims, meaning you must be less than half at fault to recover. In practice, insurance companies in ${name} aggressively argue for higher fault percentages on the injured driver to push them over the 50% threshold and eliminate the claim entirely.`,
    (name) => `Under ${name}\u2019s 50% comparative fault bar, motor vehicle accident cases often hinge on the fault percentage assigned to each driver. If a jury or adjuster places you at 50% fault or higher, you lose your right to compensation entirely. This makes gathering strong evidence of the other driver\u2019s primary fault critical from the outset.`,
    (name) => `${name}\u2019s modified comparative fault system creates a bright line at 50%. Below it, you recover (reduced by your fault percentage). At or above it, you recover nothing. In car accident cases, this threshold means that small evidentiary details \u2014 a traffic camera, a witness statement, a skid mark analysis \u2014 can swing the outcome dramatically.`,
  ],
  [NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_51]: [
    (name) => `${name}'s 51% bar for comparative fault means you can still recover in a car accident case as long as you are not more than 50% at fault. In a two-car collision where fault is split 50/50, you can still recover 50% of your damages. This is slightly more favorable than 50% bar states, where equal fault eliminates recovery entirely.`,
    (name) => `Under ${name}'s modified comparative fault system, motor vehicle accident claimants can recover as long as their fault does not exceed 50%. Your damages are reduced by your fault percentage, and the critical question in every ${name} car accident case is whether the at-fault driver bears the majority of responsibility.`,
    (name) => `${name} uses a 51% fault threshold for car accident claims. You can recover compensation as long as you are no more than 50% at fault \u2014 even in a perfectly even 50/50 split, you still receive half your damages. This is more permissive than states using a 50% bar, where equal fault results in zero recovery.`,
    (name) => `In ${name}, motor vehicle accident recovery is available to drivers who bear half or less of the total fault. The 51% bar means that equal-fault scenarios still produce compensation, and insurance negotiations in ${name} often center on whether the claimant\u2019s fault can be pushed past the critical 50% mark.`,
  ],
};

const MEDMAL_NEGLIGENCE_PROSE = {
  [NEGLIGENCE_TYPES.CONTRIBUTORY]: [
    (name) => `${name}'s contributory negligence rule creates an additional hurdle for medical malpractice plaintiffs. If the defense can argue that the patient's own actions \u2014 such as failing to follow post-operative instructions or not disclosing relevant medical history \u2014 contributed to the harm, the claim could be barred entirely. Expert medical testimony establishing the provider's sole responsibility is critical.`,
    (name) => `In ${name}, medical malpractice claims face the full weight of contributory negligence. Defense attorneys routinely argue patient non-compliance or delayed treatment-seeking to establish contributory fault. Even a finding that the patient bears minimal responsibility can eliminate the entire claim.`,
    (name) => `Because ${name} follows contributory negligence, medical malpractice defendants have a powerful defense: any evidence that the patient contributed to the adverse outcome \u2014 by missing appointments, ignoring warning signs, or not following prescribed treatment \u2014 can eliminate the entire claim. This makes thorough documentation of patient compliance critical.`,
    (name) => `${name}\u2019s contributory negligence standard applies to medical malpractice with the same force as other injury claims. A patient who failed to disclose allergies, skipped follow-up visits, or delayed seeking care for worsening symptoms may find their entire claim barred if the defense can tie that behavior to the injury.`,
  ],
  [NEGLIGENCE_TYPES.PURE_COMPARATIVE]: [
    (name) => `${name}'s pure comparative fault system allows medical malpractice plaintiffs to recover even when patient non-compliance is a factor. If a patient is found 20% at fault for not following discharge instructions, they still recover 80% of their damages. This makes ${name} more favorable for med mal cases where the defense argues patient contribution.`,
    (name) => `Under ${name}'s pure comparative fault rules, medical malpractice damages are reduced by the patient's share of responsibility but never eliminated by it. This system means that even complex cases with some patient non-compliance still have significant recovery potential.`,
    (name) => `Medical malpractice cases in ${name} benefit from pure comparative fault, which ensures that a patient\u2019s partial responsibility does not destroy the claim. Damages are reduced proportionally, so even if the defense successfully argues some patient contribution, the provider\u2019s share of fault still produces meaningful compensation.`,
    (name) => `${name}\u2019s pure comparative fault framework is relatively favorable for medical malpractice plaintiffs. The system recognizes that healthcare providers bear primary responsibility for meeting the standard of care, and patient behavior that may have contributed to the outcome merely reduces \u2014 but does not eliminate \u2014 the recovery.`,
  ],
  [NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_50]: [
    (name) => `${name}'s 50% bar applies to medical malpractice claims, meaning the patient must be less than 50% at fault for their own injury. While patients are rarely found primarily at fault in med mal cases, the defense may argue delayed treatment-seeking or non-compliance to increase the patient's fault share.`,
    (name) => `In ${name}, medical malpractice claimants must keep their fault below the 50% threshold. Defense attorneys may argue the patient contributed to the adverse outcome by not following medical advice, seeking treatment too late, or failing to disclose medical history.`,
    (name) => `Under ${name}\u2019s 50% bar, medical malpractice patients can recover as long as their share of fault stays below half. While juries rarely assign majority fault to patients in malpractice cases, the defense\u2019s contributory fault arguments can still reduce the total award significantly even when they don\u2019t cross the threshold.`,
    (name) => `${name}\u2019s modified comparative fault system requires medical malpractice plaintiffs to bear less than 50% fault. The healthcare provider\u2019s deviation from the standard of care is the primary focus, but defense teams will look for any patient behavior \u2014 missed appointments, unreported symptoms, medication non-compliance \u2014 that could shift the fault balance.`,
  ],
  [NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_51]: [
    (name) => `${name}'s 51% bar allows medical malpractice patients to recover as long as they are not more than 50% at fault. In practice, patients are rarely assigned majority fault in malpractice cases, but the threshold still matters when the defense argues contributory patient behavior.`,
    (name) => `Under ${name}'s modified comparative fault rules, medical malpractice claimants can recover if their responsibility for the injury does not exceed 50%. The provider's deviation from the standard of care is the central issue, with patient fault arguments typically playing a secondary role.`,
    (name) => `Medical malpractice claims in ${name} are subject to the 51% comparative fault bar. Patients can recover even when they share some fault \u2014 up to 50% \u2014 which is slightly more permissive than 50% bar states. The healthcare provider\u2019s failure to meet the standard of care remains the central legal question.`,
    (name) => `${name}\u2019s 51% fault threshold allows medical malpractice patients to recover in most scenarios where the provider deviated from accepted standards. Equal-fault determinations (50/50) still permit recovery, giving plaintiffs a slight edge compared to states where the bar is set at 50%.`,
  ],
};

const WC_NEGLIGENCE_PROSE = {
  // Workers' comp is a no-fault system, so negligence system matters differently
  general: [
    (name) => `Workers' compensation in ${name} operates as a no-fault system \u2014 your own negligence generally does not reduce or bar your benefits. However, benefits may be denied if the injury resulted from intoxication, willful self-harm, or a violation of specific safety rules. ${name}'s negligence system primarily affects third-party liability claims that may exist alongside the workers' comp claim.`,
    (name) => `Unlike personal injury lawsuits, ${name}'s workers' compensation system does not require proving fault. You are generally entitled to benefits regardless of whether you or your employer caused the injury. The exception: claims may be denied for injuries caused by intoxication, horseplay, or deliberate violation of safety regulations.`,
    (name) => `${name}'s workers' compensation benefits are available regardless of who caused the workplace injury. The state's negligence rules become relevant only if you pursue a separate third-party claim \u2014 for example, suing a equipment manufacturer or a negligent contractor alongside your workers' comp claim.`,
    (name) => `The workers\u2019 compensation system in ${name} is designed as a no-fault trade-off: employees receive guaranteed benefits without proving employer negligence, and in exchange employers are generally protected from personal injury lawsuits. Your own carelessness typically does not reduce your benefits, though intentional misconduct, intoxication, or horseplay may disqualify a claim.`,
    (name) => `In ${name}, workers\u2019 compensation is a no-fault benefit system. You do not need to prove your employer was negligent to receive benefits, and your employer cannot argue that your own carelessness caused the injury. This differs fundamentally from ${name}\u2019s civil negligence system, which only becomes relevant if you have a separate third-party claim alongside your workers\u2019 comp case.`,
  ],
};

/**
 * Generate SOL prose with context and urgency framing.
 */
function getSOLProse(stateCode, caseTypeId, sol, stateName, stateRules) {
  const context = getSOLContext(sol, caseTypeId);
  if (!context) return null;

  const templates = [
    () => {
      let prose = `${stateName} gives you ${sol} year${sol !== 1 ? 's' : ''} from the date of the incident to file a lawsuit, which is ${context.comparison}.`;
      if (context.urgency) prose += ` ${context.urgency}`;
      if (stateRules?.discoveryRule) {
        prose += ` ${stateName} applies a discovery rule, meaning the clock may start when you discover (or should have discovered) the injury rather than when the incident occurred.`;
      }
      return prose;
    },
    () => {
      let prose = `The statute of limitations for this type of claim in ${stateName} is ${sol} year${sol !== 1 ? 's' : ''} \u2014 ${context.comparison}.`;
      if (context.urgency) prose += ` ${context.urgency}`;
      if (stateRules?.discoveryRule) {
        prose += ` Importantly, ${stateName} recognizes a discovery rule, which can extend the filing window in cases where the harm was not immediately apparent.`;
      }
      return prose;
    },
    () => {
      let prose = `You have ${sol} year${sol !== 1 ? 's' : ''} to file suit in ${stateName}, a deadline that is ${context.comparison}.`;
      if (context.urgency) prose += ` ${context.urgency}`;
      if (stateRules?.discoveryRule) {
        prose += ` ${stateName} does apply a discovery rule, which can adjust the starting point of the limitations period when the injury was not immediately discoverable.`;
      }
      return prose;
    },
  ];

  return pickVariation(templates, stateCode, caseTypeId + 'sol')();
}

/**
 * Generate damage cap prose with worked examples.
 */
function getDamageCapProse(stateCode, caseTypeId, stateRules, stateName) {
  const parts = [];

  const nonEconCap = stateRules?.nonEconomicDamageCap;
  if (nonEconCap != null) {
    parts.push(
      `${stateName} caps non-economic damages (pain and suffering, emotional distress, loss of enjoyment of life) at $${nonEconCap.toLocaleString()} for this type of case. This means that regardless of the severity of your non-economic losses, the maximum you can receive for those damages is $${nonEconCap.toLocaleString()}.`
    );
  }

  const punitiveCapStr = stateRules?.punitiveDamageCap;
  if (punitiveCapStr) {
    const capInfo = formatPunitiveCap(punitiveCapStr);
    if (capInfo) {
      parts.push(
        `Punitive damages in ${stateName} are capped at ${capInfo.prose}. ${capInfo.example}`
      );
    }
  } else if (punitiveCapStr === null) {
    // Explicitly null means no cap on punitives
    parts.push(
      `${stateName} does not impose a statutory cap on punitive damages for this type of case, which means exceptionally reckless or malicious conduct can result in substantial punitive awards determined by the jury.`
    );
  }

  if (parts.length === 0) return null;
  return parts.join(' ');
}

// ============================================================================
// 1C-ii. NEW PROSE GENERATORS (Content Deepening)
// ============================================================================

/**
 * Format insurance minimums as compact "25/50/25" string.
 */
function formatInsuranceMinimums(mins) {
  if (!mins) return null;
  const bi1 = mins.bodilyInjuryPerPerson / 1000;
  const bi2 = mins.bodilyInjuryPerAccident / 1000;
  const pd = mins.propertyDamage / 1000;
  return `${bi1}/${bi2}/${pd}`;
}

/**
 * Compute national average BI per-person minimum for comparison.
 */
function getNationalAvgBIPerPerson() {
  let total = 0;
  let count = 0;
  for (const code of ALL_STATE_CODES) {
    const bi = STATE_LEGAL_DATABASE[code]?.motorVehicle?.insuranceMinimums?.bodilyInjuryPerPerson;
    if (bi != null) { total += bi; count++; }
  }
  return count ? Math.round(total / count) : 25000;
}

/**
 * Generate prose about mandatory auto insurance minimums.
 */
function getInsuranceCoverageProse(stateCode, state, stateRules) {
  const mins = stateRules?.insuranceMinimums;
  if (!mins) return null;
  const name = state.name;
  const fmt = formatInsuranceMinimums(mins);
  const avgBI = getNationalAvgBIPerPerson();

  const templates = [
    () => {
      let prose = `${name} requires all drivers to carry minimum liability insurance of $${(mins.bodilyInjuryPerPerson / 1000).toFixed(0)}K per person / $${(mins.bodilyInjuryPerAccident / 1000).toFixed(0)}K per accident in bodily injury coverage and $${(mins.propertyDamage / 1000).toFixed(0)}K in property damage coverage (commonly written as ${fmt}).`;
      if (mins.bodilyInjuryPerPerson < avgBI) {
        prose += ` These minimums are below the national average, meaning many drivers in ${name} may carry only enough insurance to cover a fraction of the costs from a serious accident.`;
      } else if (mins.bodilyInjuryPerPerson > avgBI) {
        prose += ` These minimums are above the national average, providing somewhat better baseline protection for accident victims.`;
      }
      if (mins.um != null) {
        prose += ` ${name} also requires uninsured motorist (UM) coverage of at least $${(mins.um / 1000).toFixed(0)}K per person, which protects you if the at-fault driver has no insurance.`;
      } else {
        prose += ` ${name} does not require uninsured motorist coverage, leaving you potentially unprotected if the at-fault driver has no insurance. Purchasing UM/UIM coverage is strongly recommended.`;
      }
      if (mins.pip != null) {
        prose += ` As a no-fault state, ${name} also mandates personal injury protection (PIP) coverage of at least $${(mins.pip / 1000).toFixed(0)}K.`;
      }
      return prose;
    },
    () => {
      let prose = `Drivers in ${name} must carry at least ${fmt} in liability coverage \u2014 that\u2019s $${(mins.bodilyInjuryPerPerson / 1000).toFixed(0)}K bodily injury per person, $${(mins.bodilyInjuryPerAccident / 1000).toFixed(0)}K per accident, and $${(mins.propertyDamage / 1000).toFixed(0)}K property damage.`;
      if (mins.bodilyInjuryPerPerson <= 15000) {
        prose += ` This is among the lowest in the country. In a serious collision, the at-fault driver\u2019s policy may not come close to covering your medical bills and lost wages, making underinsured motorist coverage essential for ${name} drivers.`;
      } else if (mins.bodilyInjuryPerPerson >= 50000) {
        prose += ` This is higher than most states, which means at-fault drivers are more likely to carry coverage that can meaningfully cover your damages.`;
      } else {
        prose += ` While this meets the state minimum, a single ER visit can easily exceed these limits. The at-fault driver\u2019s policy may not fully cover your losses in a serious accident.`;
      }
      if (mins.uim != null) {
        prose += ` ${name} requires underinsured motorist (UIM) coverage, which provides additional protection when the at-fault driver\u2019s limits are too low.`;
      }
      return prose;
    },
    () => {
      let prose = `${name}\u2019s mandatory minimum auto insurance is ${fmt} (bodily injury per person / per accident / property damage).`;
      if (mins.bodilyInjuryPerPerson < avgBI) {
        prose += ` These are relatively low minimums. Medical costs from even a moderate car accident frequently exceed $${(mins.bodilyInjuryPerPerson / 1000).toFixed(0)}K, which means you may need to pursue additional recovery options if the at-fault driver carries only the minimum.`;
      } else {
        prose += ` These minimums provide a reasonable baseline, but serious injuries often generate costs well beyond any minimum coverage amount.`;
      }
      if (mins.um != null && mins.uim != null) {
        prose += ` ${name} requires both uninsured (UM) and underinsured (UIM) motorist coverage, adding important protection layers for accident victims.`;
      } else if (mins.um != null) {
        prose += ` ${name} requires uninsured motorist (UM) coverage but not underinsured motorist coverage. Adding UIM coverage to your own policy is recommended.`;
      }
      return prose;
    },
  ];

  return pickVariation(templates, stateCode, 'motor_ins')();
}

/**
 * Generate prose about government entity claim notice periods.
 */
function getGovtEntityProse(stateCode, state, stateRules) {
  const noticeDays = stateRules?.govtEntityNoticePeriod;
  if (noticeDays == null) return null;
  const name = state.name;

  const templates = [
    () => `If your car accident involved a government vehicle or occurred due to a government-maintained road defect in ${name}, you face a significantly shorter deadline. ${name} requires you to file a notice of claim within ${noticeDays} days of the incident \u2014 far shorter than the standard statute of limitations. Missing this notice deadline can permanently bar your claim against the government entity, even if the regular filing deadline has not yet passed.`,
    () => `Claims against government entities in ${name} \u2014 such as accidents involving government vehicles, city buses, or dangerous road conditions maintained by a municipality \u2014 require a formal notice of claim within ${noticeDays} days. This compressed timeline catches many accident victims off guard. If a government entity may be at fault, consulting an attorney immediately is critical to preserving your right to compensation.`,
    () => `${name} imposes a ${noticeDays}-day notice requirement for tort claims against government entities. If a government-owned vehicle caused your accident or a poorly maintained government road contributed to it, you must file a formal notice of claim well before the standard statute of limitations expires. Failure to provide timely notice is one of the most common reasons government tort claims are dismissed.`,
  ];

  return pickVariation(templates, stateCode, 'motor_govt')();
}

/**
 * Generate "steps after a car accident" prose.
 */
function getWhatToDoMotorProse(stateCode, state, stateRules) {
  const name = state.name;
  const sol = stateRules?.statuteOfLimitations;

  const templates = [
    () => {
      let prose = `After a car accident in ${name}, your immediate steps should include: documenting the scene with photos and video, exchanging insurance information with all parties, filing a police report, and seeking medical attention within 24\u201372 hours even if you feel fine \u2014 some injuries take days to manifest.`;
      if (stateRules?.noFaultState) {
        prose += ` Because ${name} is a no-fault state, you should notify your own insurance company and file a PIP claim promptly.`;
      }
      if (state.negligenceSystem === NEGLIGENCE_TYPES.CONTRIBUTORY) {
        prose += ` In ${name}\u2019s contributory negligence system, preserving evidence that the other driver was solely at fault is especially critical.`;
      }
      if (sol) prose += ` You have ${sol} year${sol !== 1 ? 's' : ''} to file a lawsuit, but evidence preservation and witness availability degrade over time.`;
      return prose;
    },
    () => {
      let prose = `If you are involved in a motor vehicle accident in ${name}, prioritize your safety, call 911, and document everything at the scene. Obtain a copy of the police report, photograph vehicle damage and road conditions, and collect contact information from witnesses.`;
      prose += ` Seek medical evaluation as soon as possible \u2014 a gap between the accident and medical treatment can be used by the insurance company to argue your injuries were not caused by the collision.`;
      if (stateRules?.govtEntityNoticePeriod) {
        prose += ` If a government vehicle or road defect was involved, note the ${stateRules.govtEntityNoticePeriod}-day notice requirement for government claims.`;
      }
      return prose;
    },
    () => {
      let prose = `The steps you take immediately after a ${name} car accident can significantly affect the value of your claim. Document the scene thoroughly, get medical attention promptly, and avoid giving recorded statements to the other driver\u2019s insurance company before consulting an attorney.`;
      if (stateRules?.noFaultState) {
        prose += ` In ${name}, file your PIP claim with your own insurer right away, as delays can complicate coverage.`;
      } else {
        prose += ` In ${name}\u2019s fault-based system, the strength of your evidence directly determines how much the insurance company will offer.`;
      }
      return prose;
    },
  ];

  return pickVariation(templates, stateCode, 'motor_steps')();
}

/**
 * Generate pre-suit requirements prose for medical malpractice.
 */
function getPreSuitProse(stateCode, state, stateRules) {
  const reqs = stateRules?.preSuitRequirements;
  if (!reqs) return null;
  const name = state.name;
  const hasAny = reqs.expertAffidavit || reqs.noticeToProvider || reqs.preLitigationPanel;

  if (!hasAny) {
    const templates = [
      () => `${name} does not impose significant pre-suit procedural hurdles for medical malpractice cases. Unlike many states, you are not required to file an expert affidavit, send formal notice to the provider, or go through a pre-litigation review panel before filing your lawsuit. This streamlined process allows cases to move to court more quickly, though expert testimony will still be needed to prove your claim.`,
      () => `Before filing a medical malpractice lawsuit in ${name}, you are not required to satisfy mandatory pre-suit steps like expert certificates of merit or pre-litigation panels. This makes ${name} somewhat easier to navigate procedurally than states with extensive pre-filing requirements, though building a strong case still requires qualified expert support.`,
    ];
    return pickVariation(templates, stateCode, 'med_presuit_none')();
  }

  const parts = [];
  if (reqs.expertAffidavit) {
    parts.push(`an expert affidavit or certificate of merit establishing that a qualified medical professional has reviewed the case and believes the standard of care was breached`);
  }
  if (reqs.noticeToProvider) {
    parts.push(`formal written notice to the healthcare provider before filing, giving them an opportunity to respond or settle`);
  }
  if (reqs.preLitigationPanel) {
    parts.push(`submission to a mandatory pre-litigation review panel that evaluates the merit of the claim before it can proceed to court`);
  }

  const reqCount = parts.length;
  const joinedReqs = reqCount === 1 ? parts[0] : reqCount === 2 ? `${parts[0]} and ${parts[1]}` : `${parts[0]}, ${parts[1]}, and ${parts[2]}`;

  const templates = [
    () => `Before filing a medical malpractice lawsuit in ${name}, you must satisfy ${reqCount === 1 ? 'a key pre-suit requirement' : `${reqCount} pre-suit requirements`}: ${joinedReqs}. ${reqCount >= 2 ? 'These combined requirements add time and cost to the early stages of a case and can result in dismissal if not followed correctly. Working with an experienced medical malpractice attorney from the outset is essential.' : 'This requirement adds a procedural step before your case can proceed but helps ensure only meritorious claims move forward.'}`,
    () => `${name} requires medical malpractice plaintiffs to complete ${reqCount === 1 ? 'a mandatory procedural step' : `${reqCount} mandatory procedural steps`} before filing suit: ${joinedReqs}. Failure to comply with ${reqCount === 1 ? 'this requirement' : 'any of these requirements'} can result in your case being dismissed regardless of its merits. These pre-suit obligations effectively shorten your filing window because they take time to complete within the statute of limitations.`,
    () => `Medical malpractice cases in ${name} face ${reqCount === 1 ? 'a specific pre-filing requirement' : `${reqCount} pre-filing requirements`} that must be satisfied before the lawsuit can proceed: ${joinedReqs}. ${reqCount >= 3 ? `With all three requirements in place, ${name} has one of the more demanding pre-suit processes in the country.` : reqCount === 2 ? `These dual requirements mean early preparation is critical.` : `While this adds a step, it helps filter claims before they reach court.`}`,
  ];

  return pickVariation(templates, stateCode, 'med_presuit_v2')();
}

/**
 * Generate statute of repose prose for medical malpractice.
 */
function getStatuteOfReposeProse(stateCode, state, stateRules) {
  const repose = stateRules?.statuteOfRepose;
  if (repose == null) return null;
  const name = state.name;
  const sol = stateRules?.statuteOfLimitations;
  const hasDiscovery = stateRules?.discoveryRule;

  const templates = [
    () => {
      let prose = `${name} imposes a ${repose}-year statute of repose on medical malpractice claims. Unlike the statute of limitations, which can be extended by the discovery rule, the statute of repose creates an absolute outer deadline: no medical malpractice lawsuit can be filed more than ${repose} years after the date of the treatment, regardless of when the injury was discovered.`;
      if (hasDiscovery && sol) {
        prose += ` This means that while ${name}\u2019s discovery rule may extend your ${sol}-year filing window, it cannot push your claim past the ${repose}-year repose deadline.`;
      }
      return prose;
    },
    () => {
      let prose = `In addition to the statute of limitations, ${name} has a ${repose}-year statute of repose for medical malpractice. This acts as a hard cutoff \u2014 even if you did not and could not have known about the malpractice until years later, your right to sue expires ${repose} years after the treatment date.`;
      if (hasDiscovery) {
        prose += ` The discovery rule can extend the standard limitations period, but it cannot override the statute of repose.`;
      }
      prose += ` This absolute deadline is particularly significant for cases involving misdiagnosis, retained surgical instruments, or slowly developing complications.`;
      return prose;
    },
    () => {
      let prose = `${name}\u2019s ${repose}-year statute of repose sets an absolute outer boundary for medical malpractice claims. Once ${repose} years have passed since the treatment date, no lawsuit can be filed \u2014 period.`;
      if (hasDiscovery && sol) {
        prose += ` While the discovery rule may adjust when the ${sol}-year statute of limitations begins to run, the repose period is fixed and immovable.`;
      }
      prose += ` Exceptions may exist for cases involving foreign objects left in the body or fraud by the provider, but these are narrow and state-specific.`;
      return prose;
    },
  ];

  return pickVariation(templates, stateCode, 'med_repose')();
}

/**
 * Generate "what to do" prose for medical malpractice.
 */
function getWhatToDoMedMalProse(stateCode, state, stateRules) {
  const name = state.name;
  const reqs = stateRules?.preSuitRequirements;

  const templates = [
    () => {
      let prose = `If you suspect medical malpractice in ${name}, your first step should be to request and preserve complete copies of all medical records related to the treatment in question. Do not delay \u2014 healthcare facilities may have their own record retention policies.`;
      if (reqs?.expertAffidavit) {
        prose += ` Because ${name} requires an expert affidavit before filing, you will need a qualified medical expert to review your records early in the process.`;
      }
      prose += ` Consult with a medical malpractice attorney who can evaluate whether the provider deviated from the accepted standard of care and whether your injuries are sufficient to justify the cost of pursuing a claim.`;
      return prose;
    },
    () => {
      let prose = `Suspecting medical malpractice in ${name} requires prompt action. Gather all medical records, imaging, prescriptions, and correspondence with the healthcare provider. Document your symptoms and how they have affected your daily life, work, and well-being.`;
      if (reqs?.noticeToProvider) {
        prose += ` ${name} requires formal notice to the healthcare provider before filing suit, so working with an attorney early ensures this procedural step is handled correctly.`;
      }
      if (reqs?.preLitigationPanel) {
        prose += ` ${name}\u2019s mandatory pre-litigation panel process also requires preparation, which takes additional time within your filing window.`;
      }
      prose += ` The sooner you consult an attorney, the more time you have to build a strong case within ${name}\u2019s deadlines.`;
      return prose;
    },
    () => {
      let prose = `If you believe a healthcare provider\u2019s negligence caused you harm in ${name}, start by documenting everything: save all medical records, keep a journal of symptoms, and avoid discussing the case on social media. Medical malpractice cases are complex and expensive to litigate \u2014 most are handled on a contingency fee basis, meaning the attorney is paid only if you win.`;
      prose += ` An experienced ${name} medical malpractice attorney can assess whether your case has the elements needed to succeed: a clear breach of the standard of care, direct causation, and significant damages.`;
      return prose;
    },
  ];

  return pickVariation(templates, stateCode, 'med_steps')();
}

/**
 * Generate employer notification deadline prose for workers' comp.
 */
function getEmployerNotificationProse(stateCode, state, stateRules) {
  const deadline = stateRules?.employerNotificationDeadline;
  if (deadline == null) return null;
  const name = state.name;
  const sol = stateRules?.statuteOfLimitations;

  const templates = [
    () => {
      let prose = `In ${name}, you must report your workplace injury to your employer within ${deadline} days of the accident. This employer notification deadline is separate from \u2014 and much shorter than \u2014 the ${sol ? `${sol}-year` : ''} statute of limitations for filing a formal claim.`;
      prose += ` Failing to notify your employer within ${deadline} days can result in your claim being denied or your benefits being reduced, even if you file the formal claim on time. Report the injury in writing and keep a copy for your records.`;
      return prose;
    },
    () => {
      let prose = `${name} requires injured workers to notify their employer within ${deadline} days of the workplace injury. This notification should be in writing and include the date, time, location, and nature of the injury.`;
      if (deadline <= 10) {
        prose += ` This is one of the shorter notification deadlines in the country, so reporting your injury immediately is essential.`;
      } else if (deadline >= 90) {
        prose += ` While this is a relatively generous notification window, reporting sooner is always better \u2014 delays make it harder to establish that the injury occurred at work.`;
      }
      prose += ` The formal workers\u2019 compensation claim filing is a separate process with its own deadline, but missing the employer notification requirement can jeopardize your entire claim.`;
      return prose;
    },
    () => {
      let prose = `Your first obligation after a workplace injury in ${name} is to notify your employer within ${deadline} days. This is not the same as filing a workers\u2019 compensation claim \u2014 it\u2019s a prerequisite.`;
      prose += ` Even if you are unsure whether your injury is serious enough to require workers\u2019 comp benefits, it is safer to report it within the ${deadline}-day window. Late notification is a common reason claims are disputed or denied.`;
      return prose;
    },
  ];

  return pickVariation(templates, stateCode, 'wc_notify')();
}

/**
 * Generate occupational disease SOL prose for workers' comp.
 */
function getOccupationalDiseaseProse(stateCode, state, stateRules) {
  const occSol = stateRules?.occupationalDiseaseSol;
  const injurySol = stateRules?.statuteOfLimitations;
  if (occSol == null || occSol === injurySol) return null;
  const name = state.name;

  const templates = [
    () => `${name} applies a different statute of limitations to occupational diseases than to acute workplace injuries. For conditions like hearing loss from prolonged noise exposure, repetitive stress injuries, respiratory illness from chemical exposure, or occupational cancers, you have ${occSol} year${occSol !== 1 ? 's' : ''} from the date of diagnosis or the date you knew (or should have known) the condition was work-related${injurySol ? `, compared to ${injurySol} year${injurySol !== 1 ? 's' : ''} for standard workplace injuries` : ''}. This distinction matters because occupational diseases often develop gradually over years of exposure.`,
    () => `Occupational diseases in ${name} \u2014 conditions like carpal tunnel syndrome, mesothelioma, occupational asthma, or hearing loss from workplace noise \u2014 have a ${occSol}-year filing deadline that runs from the date of discovery or diagnosis${injurySol ? `, which differs from the ${injurySol}-year deadline for acute injuries` : ''}. Because these conditions develop slowly, the discovery date rather than the exposure date typically starts the clock. If you suspect a work-related illness, getting a formal diagnosis and connecting it to your employment as early as possible is critical.`,
  ];

  return pickVariation(templates, stateCode, 'wc_occ')();
}

/**
 * Generate vocational rehabilitation prose for workers' comp.
 */
function getVocationalRehabProse(stateCode, state, stateRules) {
  if (!stateRules?.vocationalRehab) return null;
  const name = state.name;

  const templates = [
    () => `${name} provides vocational rehabilitation benefits for injured workers who are unable to return to their previous job. These benefits may include job retraining, education assistance, resume preparation, job placement services, and maintenance allowances during the retraining period. If your workplace injury has permanently limited your ability to perform your previous occupation, vocational rehabilitation can help you transition to suitable alternative employment.`,
    () => `If your workplace injury prevents you from returning to your prior job in ${name}, you may be entitled to vocational rehabilitation benefits. These benefits are designed to help injured workers re-enter the workforce through skills training, education, job search assistance, and related support. The goal is to help you achieve employment at wages as close as possible to your pre-injury earnings. Your eligibility is typically determined through a vocational assessment.`,
    () => `${name}\u2019s workers\u2019 compensation system includes vocational rehabilitation benefits for workers whose injuries prevent them from returning to their former positions. This can include career counseling, job retraining programs, tuition assistance, and transitional work placement. These benefits are separate from your disability payments and represent an important resource for long-term recovery and financial stability.`,
  ];

  return pickVariation(templates, stateCode, 'wc_vr')();
}

/**
 * Generate case-type-specific content for motor vehicle cases.
 */
function getMotorVehicleProse(stateCode, state, stateRules) {
  const name = state.name;
  const paragraphs = [];
  const refs = stateRules?.statuteReferences;

  // 1. Negligence & fault
  const negProse = MOTOR_NEGLIGENCE_PROSE[state.negligenceSystem];
  if (negProse) {
    paragraphs.push(pickVariation(negProse, stateCode, 'motor_neg')(name));
  }

  // 2. Filing deadlines (SOL)
  const sol = stateRules?.statuteOfLimitations;
  if (sol != null) {
    let solProse = getSOLProse(stateCode, 'motor', sol, name, stateRules);
    if (refs?.sol) solProse += ` (${refs.sol})`;
    if (solProse) paragraphs.push(solProse);
  }

  // 3. Damage caps & limits
  const capProse = getDamageCapProse(stateCode, 'motor', stateRules, name);
  if (capProse) paragraphs.push(capProse);

  // 4. No-fault specific content
  if (stateRules?.noFaultState) {
    const noFaultTemplates = [
      () => `As a no-fault auto insurance state, ${name} requires you to file a claim with your own insurance company first under your personal injury protection (PIP) policy, regardless of who caused the accident. You can only file a lawsuit against the at-fault driver if your injuries meet ${name}'s serious injury threshold \u2014 typically involving significant disfigurement, permanent injury, or medical expenses exceeding the PIP limit. This two-step process means many minor car accident claims in ${name} are resolved entirely through PIP, while serious injury cases proceed as traditional lawsuits.`,
      () => `${name}'s no-fault insurance system changes how car accident claims work fundamentally. Instead of filing a claim against the at-fault driver, you first seek compensation through your own PIP coverage. To move beyond PIP and sue the other driver, your injuries must meet ${name}'s serious injury threshold. Understanding this threshold is critical for evaluating whether your ${name} car accident case can proceed as a lawsuit or must be resolved through your PIP policy.`,
    ];
    paragraphs.push(pickVariation(noFaultTemplates, stateCode, 'motor_nf')());
  }

  // 5. Insurance coverage minimums (NEW — always fires when data exists)
  const insProse = getInsuranceCoverageProse(stateCode, state, stateRules);
  if (insProse) paragraphs.push(insProse);

  // 6. Government entity notice (NEW — conditional)
  const govtProse = getGovtEntityProse(stateCode, state, stateRules);
  if (govtProse) paragraphs.push(govtProse);

  return paragraphs;
}

/**
 * Generate case-type-specific content for medical malpractice cases.
 */
function getMedMalProse(stateCode, state, stateRules) {
  const name = state.name;
  const paragraphs = [];
  const refs = stateRules?.statuteReferences;

  // 1. Negligence & fault
  const negProse = MEDMAL_NEGLIGENCE_PROSE[state.negligenceSystem];
  if (negProse) {
    paragraphs.push(pickVariation(negProse, stateCode, 'med_neg')(name));
  }

  // 2. Filing deadlines
  const sol = stateRules?.statuteOfLimitations;
  if (sol != null) {
    let solProse = getSOLProse(stateCode, 'medical', sol, name, stateRules);
    if (refs?.sol) solProse += ` (${refs.sol})`;
    if (solProse) paragraphs.push(solProse);
  }

  // 3. Damage caps
  const capProse = getDamageCapProse(stateCode, 'medical', stateRules, name);
  if (capProse) {
    let combined = capProse;
    if (refs?.caps) combined += ` (${refs.caps})`;
    paragraphs.push(combined);
  }

  // 4. MICRA or notable med mal caps
  if (stateCode === 'CA' && stateRules?.nonEconomicDamageCap) {
    paragraphs.push(
      `California's Medical Injury Compensation Reform Act (MICRA) has historically capped non-economic damages in medical malpractice cases. Recent amendments (AB 35, effective 2023) are gradually increasing the cap, but it remains significantly lower than what juries might otherwise award in serious cases involving permanent disability or wrongful death.`
    );
  }

  // 5. Pre-suit requirements (REPLACED — now uses specific data)
  const preSuitProse = getPreSuitProse(stateCode, state, stateRules);
  if (preSuitProse) paragraphs.push(preSuitProse);

  // 6. Discovery rule + statute of repose (NEW — conditional)
  const reposeProse = getStatuteOfReposeProse(stateCode, state, stateRules);
  if (reposeProse) paragraphs.push(reposeProse);

  return paragraphs;
}

/**
 * Generate case-type-specific content for workers' comp cases.
 */
function getWorkersCompProse(stateCode, state, stateRules) {
  const name = state.name;
  const paragraphs = [];
  const refs = stateRules?.statuteReferences;

  // 1. No-fault nature + negligence context
  const wcNegProse = WC_NEGLIGENCE_PROSE.general;
  paragraphs.push(pickVariation(wcNegProse, stateCode, 'wc_neg')(name));

  // 2. Filing deadlines
  const sol = stateRules?.statuteOfLimitations;
  if (sol != null) {
    let solProse = getSOLProse(stateCode, 'workers_comp', sol, name, stateRules);
    if (refs?.sol) solProse += ` (${refs.sol})`;
    if (solProse) paragraphs.push(solProse);
  }

  // 3. Benefit rates and amounts
  if (stateRules?.ttdRate && stateRules?.maxWeeklyBenefit) {
    const ttdPercent = Math.round(stateRules.ttdRate * 100);
    const avgs = getNationalAverages('workers_comp');

    const benefitTemplates = [
      () => {
        let prose = `${name} pays temporary total disability (TTD) benefits at ${ttdPercent}% of your average weekly wage, up to a maximum of $${stateRules.maxWeeklyBenefit.toLocaleString()} per week.`;
        if (avgs?.avgWeeklyBenefit) {
          const comparison = stateRules.maxWeeklyBenefit > avgs.avgWeeklyBenefit
            ? `above the national average of $${avgs.avgWeeklyBenefit.toLocaleString()}`
            : stateRules.maxWeeklyBenefit < avgs.avgWeeklyBenefit
              ? `below the national average of $${avgs.avgWeeklyBenefit.toLocaleString()}`
              : `near the national average`;
          prose += ` This maximum is ${comparison}.`;
        }
        if (stateRules.maxWeeksTTD) {
          prose += ` TTD benefits in ${name} are limited to ${stateRules.maxWeeksTTD} weeks (approximately ${(stateRules.maxWeeksTTD / 52).toFixed(1)} years).`;
        } else {
          prose += ` ${name} does not impose a fixed week limit on TTD benefits, allowing them to continue as long as you remain unable to work.`;
        }
        return prose;
      },
      () => {
        let prose = `Temporary disability benefits in ${name} replace ${ttdPercent}% of your pre-injury wages, subject to a weekly cap of $${stateRules.maxWeeklyBenefit.toLocaleString()}.`;
        if (stateRules.minWeeklyBenefit) {
          prose += ` There is also a minimum benefit of $${stateRules.minWeeklyBenefit.toLocaleString()} per week.`;
        }
        if (stateRules.waitingPeriod) {
          prose += ` Benefits begin after a ${stateRules.waitingPeriod}-day waiting period.`;
          if (stateRules.retroactivePeriod) {
            prose += ` If your disability extends beyond ${stateRules.retroactivePeriod} days, the waiting period is paid retroactively.`;
          }
        }
        return prose;
      },
    ];
    paragraphs.push(pickVariation(benefitTemplates, stateCode, 'wc_ben')());
  }

  // 4. Impairment guide
  if (stateRules?.impairmentGuide) {
    const guideLabels = {
      AMA_3: 'AMA Guides to the Evaluation of Permanent Impairment, 3rd Edition',
      AMA_4: 'AMA Guides, 4th Edition',
      AMA_5: 'AMA Guides, 5th Edition',
      AMA_6: 'AMA Guides, 6th Edition',
      PDRS: "California's Permanent Disability Rating Schedule (PDRS)",
      FL_GUIDES: "Florida's Uniform Permanent Impairment Rating Schedule",
      MN_SCHEDULE: "Minnesota's Permanent Partial Disability Schedule",
      NJ_SCHEDULE: "New Jersey's Permanent Partial Disability Schedule",
      NY_SCHEDULE: "New York's Schedule of Losses",
      NC_SCHEDULE: "North Carolina's Disability Rating Schedule",
      WA_SCHEDULE: "Washington's Category System for Permanent Partial Disability",
      WI_SCHEDULE: "Wisconsin's Permanent Partial Disability Schedule",
    };
    const guideLabel = guideLabels[stateRules.impairmentGuide] || stateRules.impairmentGuide;

    const guideTemplates = [
      () => `Permanent impairment in ${name} is evaluated using the ${guideLabel}. The edition or rating system used matters significantly because different versions can produce substantially different impairment ratings for the same injury, directly affecting your permanent disability benefits.`,
      () => `${name} relies on the ${guideLabel} to assess permanent impairment. Your treating physician or an independent medical examiner assigns a whole-person impairment rating, which is then converted into a disability benefit amount. The specific guide version used in ${name} can produce ratings that differ meaningfully from those in states using different editions.`,
    ];
    paragraphs.push(pickVariation(guideTemplates, stateCode, 'wc_guide')());
  }

  // 5. Special features
  if (stateRules?.monopolisticStateFund) {
    paragraphs.push(
      `${name} operates a monopolistic state workers' compensation fund. Unlike most states where employers can purchase coverage from private insurers, ${name} requires employers to obtain coverage through the state fund. This centralized system affects how claims are filed, processed, and appealed.`
    );
  }

  if (stateRules?.nonSubscriberState) {
    paragraphs.push(
      `${name} is unique in allowing employers to opt out of the workers' compensation system entirely. These "non-subscriber" employers lose the exclusive remedy protection that workers' comp provides, meaning injured employees of non-subscribers can file personal injury lawsuits seeking full tort damages \u2014 including pain and suffering \u2014 rather than being limited to workers' comp benefits. If your employer is a non-subscriber, your case is fundamentally different from a standard workers' comp claim.`
    );
  }

  if (stateRules?.choiceOfDoctor) {
    paragraphs.push(
      `${name} allows injured workers to choose their own treating physician for workers' compensation claims. In states without this right, the employer or insurer selects the doctor, which can affect both the quality of care and the impairment rating you receive.`
    );
  }

  // 6. Employer notification deadline (NEW — always fires when data exists)
  const notifyProse = getEmployerNotificationProse(stateCode, state, stateRules);
  if (notifyProse) paragraphs.push(notifyProse);

  // 7. Occupational disease SOL (NEW — conditional)
  const occProse = getOccupationalDiseaseProse(stateCode, state, stateRules);
  if (occProse) paragraphs.push(occProse);

  // 8. Vocational rehabilitation (NEW — conditional)
  const vrProse = getVocationalRehabProse(stateCode, state, stateRules);
  if (vrProse) paragraphs.push(vrProse);

  return paragraphs;
}

/**
 * Generate 3-5 paragraphs of interpretive prose for a state × case type.
 * Returns null for non-launch case types.
 */
export function getCaseTypeProse(stateCode, caseTypeId) {
  if (!LAUNCH_CASE_TYPES.includes(caseTypeId)) return null;

  const state = STATE_LEGAL_DATABASE[stateCode];
  if (!state) return null;

  const dbKey = caseTypeToDbKey[caseTypeId];
  const stateRules = state[dbKey];
  if (!stateRules) return null;

  let paragraphs = null;
  if (caseTypeId === 'motor') paragraphs = getMotorVehicleProse(stateCode, state, stateRules);
  else if (caseTypeId === 'medical') paragraphs = getMedMalProse(stateCode, state, stateRules);
  else if (caseTypeId === 'workers_comp') paragraphs = getWorkersCompProse(stateCode, state, stateRules);

  return paragraphs ? paragraphs.map(p => sanitizeProseHTML(boldKeyTerms(p))) : null;
}

/**
 * Generate "what to do" actionable prose for a state × case type.
 * Returns a string or null. Rendered as a separate section in the JSX.
 */
export function getWhatToDoContent(stateCode, caseTypeId) {
  if (!LAUNCH_CASE_TYPES.includes(caseTypeId)) return null;

  const state = STATE_LEGAL_DATABASE[stateCode];
  if (!state) return null;

  const dbKey = caseTypeToDbKey[caseTypeId];
  const stateRules = state[dbKey];
  if (!stateRules) return null;

  let result = null;
  if (caseTypeId === 'motor') result = getWhatToDoMotorProse(stateCode, state, stateRules);
  else if (caseTypeId === 'medical') result = getWhatToDoMedMalProse(stateCode, state, stateRules);
  // Workers' comp doesn't have a "what to do" section — employer notification serves this role
  return result ? sanitizeProseHTML(boldKeyTerms(result)) : null;
}

/**
 * Generate 4-6 enhanced fact cards for a state × case type.
 */
export function getEnhancedStateFacts(stateCode, caseTypeId) {
  const state = STATE_LEGAL_DATABASE[stateCode];
  if (!state) return null;

  const dbKey = caseTypeToDbKey[caseTypeId];
  const stateRules = state[dbKey];
  if (!stateRules) return null;

  const facts = [];
  const sol = stateRules.statuteOfLimitations;
  const solCtx = sol != null ? getSOLContext(sol, caseTypeId) : null;

  // 1. Filing deadline with context
  if (sol != null) {
    facts.push({
      label: 'Filing Deadline',
      value: `${sol} year${sol !== 1 ? 's' : ''}`,
      context: solCtx?.comparison || null,
    });
  }

  // 2. Negligence system
  const negligence = state.negligenceSystem;
  if (negligence && negligenceLabels[negligence]) {
    facts.push({
      label: 'Negligence System',
      value: negligenceLabels[negligence],
      context: negligence === NEGLIGENCE_TYPES.CONTRIBUTORY
        ? 'One of only 5 jurisdictions with this strict rule'
        : null,
    });
  }

  // 3. Non-economic damage cap
  const nonEconCap = stateRules.nonEconomicDamageCap;
  if (nonEconCap != null) {
    facts.push({
      label: 'Non-Economic Damage Cap',
      value: `$${nonEconCap.toLocaleString()}`,
      context: 'Limits pain & suffering awards',
    });
  } else if (nonEconCap === null && ['medical', 'premises', 'professional'].includes(caseTypeId)) {
    facts.push({
      label: 'Non-Economic Damage Cap',
      value: 'None',
      context: 'No statutory limit on pain & suffering',
    });
  }

  // 4. Punitive damage cap
  const punitiveCapStr = stateRules.punitiveDamageCap;
  if (punitiveCapStr) {
    const capInfo = formatPunitiveCap(punitiveCapStr);
    facts.push({
      label: 'Punitive Damage Cap',
      value: capInfo.prose.length > 50 ? 'See cap formula' : capInfo.prose,
      context: capInfo.example || null,
    });
  }

  // 5. Case-type-specific facts
  if (caseTypeId === 'motor' && stateRules.noFaultState !== undefined) {
    facts.push({
      label: 'Insurance System',
      value: stateRules.noFaultState ? 'No-Fault (PIP Required)' : 'Tort (At-Fault)',
      context: stateRules.noFaultState
        ? 'Must file PIP claim first before suing'
        : 'Can sue the at-fault driver directly',
    });
  }

  if (caseTypeId === 'motor' && stateRules.insuranceMinimums) {
    const mins = stateRules.insuranceMinimums;
    facts.push({
      label: 'Min. Liability Coverage',
      value: `${(mins.bodilyInjuryPerPerson / 1000).toFixed(0)}/${(mins.bodilyInjuryPerAccident / 1000).toFixed(0)}/${(mins.propertyDamage / 1000).toFixed(0)}`,
      context: 'BI per person / BI per accident / PD (in thousands)',
    });
  }

  if (caseTypeId === 'motor' && stateRules.govtEntityNoticePeriod != null) {
    facts.push({
      label: 'Govt. Notice Deadline',
      value: `${stateRules.govtEntityNoticePeriod} days`,
      context: 'For claims against government entities',
    });
  }

  if (caseTypeId === 'dog_bite' && stateRules.strictLiability !== undefined) {
    facts.push({
      label: 'Liability Rule',
      value: stateRules.strictLiability ? 'Strict Liability' : 'One-Bite Rule',
      context: stateRules.strictLiability
        ? 'Owner liable regardless of prior knowledge'
        : 'Must prove owner knew of dangerous propensity',
    });
  }

  if (caseTypeId === 'workers_comp') {
    if (stateRules.maxWeeklyBenefit) {
      const avgs = getNationalAverages('workers_comp');
      let ctx = null;
      if (avgs?.avgWeeklyBenefit) {
        ctx = stateRules.maxWeeklyBenefit > avgs.avgWeeklyBenefit
          ? `Above avg ($${avgs.avgWeeklyBenefit.toLocaleString()})`
          : `Below avg ($${avgs.avgWeeklyBenefit.toLocaleString()})`;
      }
      facts.push({
        label: 'Max Weekly Benefit',
        value: `$${stateRules.maxWeeklyBenefit.toLocaleString()}`,
        context: ctx,
      });
    }
    if (stateRules.ttdRate) {
      facts.push({
        label: 'TTD Rate',
        value: `${Math.round(stateRules.ttdRate * 100)}% of wages`,
        context: stateRules.maxWeeksTTD
          ? `Limited to ${stateRules.maxWeeksTTD} weeks`
          : 'No fixed week limit',
      });
    }
    if (stateRules.waitingPeriod) {
      facts.push({
        label: 'Waiting Period',
        value: `${stateRules.waitingPeriod} days`,
        context: stateRules.retroactivePeriod
          ? `Retroactive after ${stateRules.retroactivePeriod} days`
          : null,
      });
    }
    if (stateRules.monopolisticStateFund) {
      facts.push({
        label: 'State Fund',
        value: 'Monopolistic',
        context: 'Employers must use state fund, not private insurers',
      });
    }
    if (stateRules.nonSubscriberState) {
      facts.push({
        label: 'Non-Subscriber Option',
        value: 'Allowed',
        context: 'Employers can opt out of workers\u2019 comp entirely',
      });
    }
  }

  if (caseTypeId === 'medical') {
    if (stateRules.discoveryRule) {
      facts.push({
        label: 'Discovery Rule',
        value: 'Applies',
        context: 'SOL starts when injury is discovered',
      });
    }
    if (stateRules.preSuitRequirements) {
      const reqs = stateRules.preSuitRequirements;
      const active = [
        reqs.expertAffidavit && 'Expert Affidavit',
        reqs.noticeToProvider && 'Provider Notice',
        reqs.preLitigationPanel && 'Review Panel',
      ].filter(Boolean);
      if (active.length > 0) {
        facts.push({
          label: 'Pre-Suit Requirements',
          value: active.join(', '),
          context: `${active.length} pre-filing step${active.length > 1 ? 's' : ''} required`,
        });
      } else {
        facts.push({
          label: 'Pre-Suit Requirements',
          value: 'None',
          context: 'No mandatory pre-filing steps',
        });
      }
    }
    if (stateRules.statuteOfRepose != null) {
      facts.push({
        label: 'Statute of Repose',
        value: `${stateRules.statuteOfRepose} years`,
        context: 'Absolute outer deadline from treatment date',
      });
    }
  }

  if (caseTypeId === 'workers_comp') {
    if (stateRules.employerNotificationDeadline != null) {
      facts.push({
        label: 'Employer Notice Deadline',
        value: `${stateRules.employerNotificationDeadline} days`,
        context: 'Must report injury to employer within this period',
      });
    }
    if (stateRules.vocationalRehab != null) {
      facts.push({
        label: 'Vocational Rehab',
        value: stateRules.vocationalRehab ? 'Available' : 'Not available',
        context: stateRules.vocationalRehab
          ? 'State provides job retraining benefits'
          : null,
      });
    }
  }

  return facts.slice(0, 8);
}

/**
 * Get 3-4 related case types for cross-linking from a state × case type page.
 */
export function getRelatedCaseTypes(stateCode, caseTypeId) {
  const relationships = {
    motor: ['wrongful_death', 'premises', 'insurance', 'product'],
    medical: ['wrongful_death', 'professional', 'product', 'insurance'],
    premises: ['motor', 'dog_bite', 'wrongful_death', 'insurance'],
    product: ['motor', 'medical', 'wrongful_death', 'class_action'],
    wrongful_death: ['motor', 'medical', 'premises', 'product'],
    dog_bite: ['premises', 'insurance', 'wrongful_death', 'motor'],
    wrongful_term: ['wage', 'civil_rights', 'disability', 'class_action'],
    wage: ['wrongful_term', 'class_action', 'civil_rights', 'disability'],
    class_action: ['product', 'wage', 'civil_rights', 'insurance'],
    insurance: ['motor', 'medical', 'premises', 'disability'],
    disability: ['workers_comp', 'insurance', 'wrongful_term', 'civil_rights'],
    professional: ['medical', 'insurance', 'product', 'civil_rights'],
    civil_rights: ['wrongful_term', 'wage', 'class_action', 'disability'],
    ip: ['class_action', 'professional', 'product', 'insurance'],
    workers_comp: ['motor', 'premises', 'disability', 'wrongful_death'],
    lemon_law: ['motor', 'product', 'insurance', 'class_action'],
  };

  const related = relationships[caseTypeId] || [];
  const stateSlug = stateCodeToSlug[stateCode];

  return related.slice(0, 4).map(relatedId => ({
    caseTypeId: relatedId,
    label: CASE_TYPE_LABELS[relatedId],
    slug: caseIdToSlug[relatedId],
    url: `/${stateSlug}/${caseIdToSlug[relatedId]}-calculator`,
  }));
}

// ============================================================================
// 1D. CONDITIONAL FAQ POOL
// ============================================================================

/**
 * FAQ template factory. Each template returns { q, a } given state data,
 * and has a `condition` predicate to determine if it applies.
 */
function createFAQTemplate(condition, questionFn, answerFn) {
  return { condition, questionFn, answerFn };
}

const MOTOR_FAQ_POOL = [
  // Always shown
  createFAQTemplate(
    () => true,
    (_, __, name) => `How is a car accident settlement calculated in ${name}?`,
    (stateData, rules, name) => {
      const neg = negligenceLabels[stateData.negligenceSystem] || 'comparative fault';
      return `A car accident settlement in ${name} combines economic damages (medical bills, lost wages, future care costs) plus non-economic damages (pain and suffering). The total is then adjusted based on ${name}'s ${neg.toLowerCase()} rules, which reduce your recovery by your percentage of responsibility.`;
    }
  ),
  createFAQTemplate(
    () => true,
    (_, __, name) => `How long do I have to file a car accident claim in ${name}?`,
    (stateData, rules, name) => {
      const sol = rules?.statuteOfLimitations;
      let a = `In ${name}, you have ${sol} year${sol !== 1 ? 's' : ''} from the date of the accident to file a lawsuit.`;
      if (rules?.noFaultState) a += ` As a no-fault state, ${name} requires you to file a PIP claim with your own insurer first before pursuing a lawsuit.`;
      a += ` Claims against government entities may have shorter notice deadlines (typically 60\u2013180 days). Missing any deadline permanently bars your claim.`;
      return a;
    }
  ),
  // Negligence-conditional
  createFAQTemplate(
    (stateData) => stateData.negligenceSystem === NEGLIGENCE_TYPES.CONTRIBUTORY,
    (_, __, name) => `What happens if I was partially at fault for my car accident in ${name}?`,
    (_, __, name) => `${name} follows contributory negligence, one of the strictest fault rules in the country. If you are found even 1% at fault for the accident, you may be completely barred from recovering any damages. This makes proving the other driver's sole negligence critical in ${name} car accident cases.`
  ),
  createFAQTemplate(
    (stateData) => stateData.negligenceSystem === NEGLIGENCE_TYPES.PURE_COMPARATIVE,
    (_, __, name) => `What if I was partially at fault for my car accident in ${name}?`,
    (_, __, name) => `Under ${name}'s pure comparative fault system, you can recover damages even if you were mostly at fault. Your award is simply reduced by your fault percentage. For example, if you are found 70% at fault and your damages total $100,000, you would receive $30,000.`
  ),
  createFAQTemplate(
    (stateData) => stateData.negligenceSystem === NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_50,
    (_, __, name) => `Can I recover if I was partly at fault for my ${name} car accident?`,
    (_, __, name) => `Under ${name}'s modified comparative fault system, you can recover damages as long as your fault is less than 50%. If you are 50% or more at fault, you are barred from recovery. Your award is reduced by your fault percentage \u2014 at 30% fault, you receive 70% of your damages.`
  ),
  createFAQTemplate(
    (stateData) => stateData.negligenceSystem === NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_51,
    (_, __, name) => `Can I still recover if I share fault for a car accident in ${name}?`,
    (_, __, name) => `Under ${name}'s modified comparative fault rules (51% bar), you can recover damages as long as your fault does not exceed 50%. Even in a 50/50 fault split, you can still recover half of your damages. At 51% fault or higher, recovery is completely barred.`
  ),
  // No-fault conditional
  createFAQTemplate(
    (_, rules) => rules?.noFaultState === true,
    (_, __, name) => `How does ${name}'s no-fault insurance system affect my car accident claim?`,
    (_, __, name) => `As a no-fault state, ${name} requires you to first file a claim under your own personal injury protection (PIP) policy regardless of who caused the accident. You can only sue the at-fault driver if your injuries meet ${name}'s serious injury threshold \u2014 typically involving significant disfigurement, permanent injury, or medical expenses exceeding your PIP limit.`
  ),
  // Damage cap conditional
  createFAQTemplate(
    (_, rules) => rules?.nonEconomicDamageCap != null,
    (_, rules, name) => `Does ${name} cap car accident damages?`,
    (_, rules, name) => `${name} limits non-economic damages (pain, suffering, emotional distress) to $${rules.nonEconomicDamageCap.toLocaleString()} for motor vehicle accident cases. Economic damages such as medical bills and lost wages are not capped. This cap can significantly affect the value of cases with severe but non-economic injuries.`
  ),
  // Insurance minimums FAQ (always shown when data exists)
  createFAQTemplate(
    (_, rules) => rules?.insuranceMinimums != null,
    (_, rules, name) => `What are ${name}'s minimum car insurance requirements?`,
    (_, rules, name) => {
      const mins = rules.insuranceMinimums;
      let a = `${name} requires minimum liability coverage of $${(mins.bodilyInjuryPerPerson / 1000).toFixed(0)}K per person / $${(mins.bodilyInjuryPerAccident / 1000).toFixed(0)}K per accident in bodily injury and $${(mins.propertyDamage / 1000).toFixed(0)}K in property damage.`;
      if (mins.pip != null) a += ` As a no-fault state, ${name} also requires PIP coverage of at least $${(mins.pip / 1000).toFixed(0)}K.`;
      if (mins.um != null) a += ` Uninsured motorist coverage of $${(mins.um / 1000).toFixed(0)}K per person is also mandatory.`;
      a += ` These minimums often fall short of covering serious accident costs. If the at-fault driver carries only the minimum and your damages exceed their limits, you may need to pursue your own underinsured motorist coverage or other recovery options.`;
      return a;
    }
  ),
  // Government entity FAQ (conditional)
  createFAQTemplate(
    (_, rules) => rules?.govtEntityNoticePeriod != null,
    (_, __, name) => `What if I was hit by a government vehicle in ${name}?`,
    (_, rules, name) => `Claims against government entities in ${name} require a formal notice of claim within ${rules.govtEntityNoticePeriod} days of the incident \u2014 much shorter than the standard statute of limitations. Government tort claims also involve different procedures, potential damage caps, and sovereign immunity considerations. If a city bus, government vehicle, or poorly maintained public road caused your accident, consult an attorney immediately to ensure you meet the notice deadline.`
  ),
  // Discovery rule FAQ (conditional)
  createFAQTemplate(
    (_, rules) => rules?.discoveryRule === true,
    (_, __, name) => `What if I didn't realize my car accident injuries were serious right away?`,
    (_, __, name) => `${name} applies a discovery rule, which means the statute of limitations may begin when you discover (or reasonably should have discovered) that your injuries are more serious than initially thought. This is important for latent injuries like traumatic brain injuries, herniated discs, or internal damage that may not be apparent immediately after the crash. However, the discovery rule has limits \u2014 you are expected to seek medical attention promptly, and courts will evaluate whether a reasonable person would have discovered the injury sooner.`
  ),
  // General always-shown
  createFAQTemplate(
    () => true,
    (_, __, name) => `What factors most affect a car accident case value in ${name}?`,
    (stateData, rules, name) => {
      let a = `The most impactful factors are: injury severity and permanence, total medical costs (past and future), lost wages and earning capacity, your fault percentage under ${name}'s ${(negligenceLabels[stateData.negligenceSystem] || 'comparative fault').toLowerCase()} rules, and the other driver's insurance limits.`;
      if (rules?.noFaultState) a += ` In ${name}, your PIP coverage limits also affect how much of your claim is handled through no-fault versus through a lawsuit.`;
      return a;
    }
  ),
  createFAQTemplate(
    () => true,
    () => `Should I accept the insurance company's first settlement offer?`,
    (_, __, name) => `Initial offers from insurance companies in ${name} are typically 2\u20135 times lower than the case's actual value. Insurers make early offers hoping you will settle before understanding the full extent of your injuries and damages. Consulting with an attorney before accepting any offer \u2014 especially before you have reached maximum medical improvement \u2014 is strongly recommended.`
  ),
];

const MEDMAL_FAQ_POOL = [
  createFAQTemplate(
    () => true,
    (_, __, name) => `How is a medical malpractice settlement calculated in ${name}?`,
    (stateData, rules, name) => {
      let a = `Medical malpractice damages in ${name} include economic losses (additional medical costs, lost earnings) plus non-economic damages (pain, suffering, loss of enjoyment of life).`;
      if (rules?.nonEconomicDamageCap) {
        a += ` ${name} caps non-economic damages at $${rules.nonEconomicDamageCap.toLocaleString()}, which can significantly limit the total recovery in cases with severe but primarily non-economic harm.`;
      }
      a += ` Expert medical testimony is required to prove the healthcare provider breached the standard of care.`;
      return a;
    }
  ),
  createFAQTemplate(
    () => true,
    (_, __, name) => `How long do I have to file a medical malpractice claim in ${name}?`,
    (stateData, rules, name) => {
      const sol = rules?.statuteOfLimitations;
      let a = `In ${name}, you have ${sol} year${sol !== 1 ? 's' : ''} to file a medical malpractice lawsuit.`;
      if (rules?.discoveryRule) {
        a += ` ${name} applies a discovery rule, meaning the clock may start when you discover or should have discovered the injury, rather than when the malpractice occurred.`;
      }
      a += ` Pre-suit requirements such as expert certificates of merit can effectively shorten your window \u2014 begin the process early.`;
      return a;
    }
  ),
  createFAQTemplate(
    (_, rules) => rules?.nonEconomicDamageCap != null,
    (_, rules, name) => `How does ${name}'s damage cap affect my medical malpractice case?`,
    (_, rules, name) => `${name} caps non-economic damages at $${rules.nonEconomicDamageCap.toLocaleString()} in medical malpractice cases. This limits awards for pain and suffering, emotional distress, and loss of enjoyment of life, regardless of how severe your injuries are. Economic damages (medical bills, lost wages) are not subject to this cap.`
  ),
  createFAQTemplate(
    (_, rules) => rules?.discoveryRule === true,
    (_, __, name) => `What is ${name}'s discovery rule for medical malpractice?`,
    (_, __, name) => `${name}'s discovery rule means the statute of limitations clock starts when you discover or reasonably should have discovered the injury caused by malpractice, not necessarily when the treatment occurred. This is important for cases involving misdiagnosis, surgical errors that take time to manifest, or retained surgical instruments.`
  ),
  createFAQTemplate(
    (stateData) => stateData.negligenceSystem === NEGLIGENCE_TYPES.CONTRIBUTORY,
    (_, __, name) => `How does ${name}'s contributory negligence affect medical malpractice claims?`,
    (_, __, name) => `Under ${name}'s contributory negligence rule, if the defense can show you contributed to your injury in any way \u2014 such as failing to follow post-operative instructions or withholding medical history \u2014 your entire claim could be barred. This strict standard means documenting your compliance with all medical instructions is especially important.`
  ),
  createFAQTemplate(
    () => true,
    () => `What makes a strong medical malpractice case?`,
    (_, __, name) => `Strong cases in ${name} require: a clear departure from the accepted standard of care, direct causation between the provider's negligence and your injury, significant documented damages, and an expert witness willing to testify. Surgery errors, missed cancer diagnoses, and birth injuries tend to produce the strongest cases.`
  ),
  createFAQTemplate(
    () => true,
    (_, __, name) => `Do I need an expert witness for a ${name} medical malpractice case?`,
    (_, __, name) => `Yes. ${name}, like virtually all states, requires expert medical testimony to establish that the healthcare provider breached the standard of care. The expert must typically be a licensed physician in the same or a closely related specialty. Many ${name} courts require an expert affidavit or certificate of merit before the lawsuit can proceed.`
  ),
  createFAQTemplate(
    () => true,
    () => `What is the average medical malpractice settlement?`,
    () => `Average medical malpractice settlements range from $250,000 to $750,000, with serious cases involving permanent disability or wrongful death often exceeding $1 million. Jury verdicts can be significantly higher but may be subject to state caps on non-economic damages. The specific value depends heavily on injury severity, economic losses, and the strength of the expert testimony.`
  ),
  // Statute of repose FAQ (conditional)
  createFAQTemplate(
    (_, rules) => rules?.statuteOfRepose != null,
    (_, rules, name) => `Is there an absolute deadline for ${name} medical malpractice claims?`,
    (_, rules, name) => {
      let a = `Yes. ${name} has a ${rules.statuteOfRepose}-year statute of repose, which acts as an absolute outer deadline. Even if the discovery rule would otherwise extend your filing window, no medical malpractice lawsuit can be filed more than ${rules.statuteOfRepose} years after the treatment date.`;
      a += ` This hard cutoff is particularly important for cases involving slowly developing conditions, retained surgical instruments, or misdiagnoses that are not discovered until years later. Limited exceptions may apply for fraud, foreign objects, or minors.`;
      return a;
    }
  ),
  // Pre-litigation panel FAQ (conditional)
  createFAQTemplate(
    (_, rules) => rules?.preSuitRequirements?.preLitigationPanel === true,
    (_, __, name) => `Does ${name} require a review panel before filing a medical malpractice lawsuit?`,
    (_, __, name) => `Yes. ${name} requires medical malpractice claims to go through a mandatory pre-litigation review panel before the case can proceed to court. The panel typically includes medical and legal professionals who evaluate whether the claim has merit. While the panel's findings are usually not binding, they can be introduced as evidence at trial. This process adds time to the case \u2014 often several months \u2014 which effectively shortens your window for action within the statute of limitations.`
  ),
  // Cost/difficulty FAQ (always shown)
  createFAQTemplate(
    () => true,
    (_, __, name) => `How much does it cost to pursue a medical malpractice case in ${name}?`,
    (stateData, rules, name) => {
      let a = `Medical malpractice cases are among the most expensive to litigate. Expert witness fees alone often run $5,000\u2013$25,000 or more, and cases may require multiple experts. Most ${name} medical malpractice attorneys work on a contingency fee basis (typically 33\u201340% of the recovery), meaning you pay nothing upfront.`;
      if (rules?.preSuitRequirements?.expertAffidavit) {
        a += ` ${name}\u2019s requirement for a pre-filing expert affidavit means you will incur expert costs even before the lawsuit is filed.`;
      }
      a += ` Despite these costs, contingency arrangements make it possible to pursue meritorious claims without financial risk to the patient.`;
      return a;
    }
  ),
];

const WC_FAQ_POOL = [
  createFAQTemplate(
    () => true,
    (_, __, name) => `How are workers' compensation benefits calculated in ${name}?`,
    (stateData, rules, name) => {
      const rate = rules?.ttdRate ? Math.round(rules.ttdRate * 100) : 67;
      let a = `${name} calculates temporary disability benefits at ${rate}% of your average weekly wage, subject to a maximum of $${(rules?.maxWeeklyBenefit || 0).toLocaleString()} per week.`;
      if (rules?.minWeeklyBenefit) a += ` The minimum weekly benefit is $${rules.minWeeklyBenefit.toLocaleString()}.`;
      a += ` Permanent disability benefits are based on your impairment rating, which is evaluated using ${rules?.impairmentGuide === 'PDRS' ? "California's PDRS" : 'the AMA Guides'}.`;
      return a;
    }
  ),
  createFAQTemplate(
    () => true,
    (_, __, name) => `How long do I have to file a workers' compensation claim in ${name}?`,
    (stateData, rules, name) => {
      const sol = rules?.statuteOfLimitations;
      return `In ${name}, you generally have ${sol} year${sol !== 1 ? 's' : ''} from the date of injury to file a workers' compensation claim. However, you should report the injury to your employer in writing as soon as possible \u2014 many states require employer notification within 30 days. Missing filing deadlines can permanently bar your claim.`;
    }
  ),
  createFAQTemplate(
    (_, rules) => rules?.monopolisticStateFund === true,
    (_, __, name) => `What does it mean that ${name} has a monopolistic state fund?`,
    (_, __, name) => `${name} operates a monopolistic workers' compensation fund, meaning all employers must purchase coverage through the state rather than from private insurance companies. This centralized system can affect how claims are processed and appealed, and means your claim is handled by the state fund rather than a private insurer.`
  ),
  createFAQTemplate(
    (_, rules) => rules?.nonSubscriberState === true,
    (_, __, name) => `What if my ${name} employer opted out of workers' compensation?`,
    (_, __, name) => `${name} allows employers to opt out of the workers' compensation system ("non-subscriber" status). If your employer is a non-subscriber, you are not limited to workers' comp benefits \u2014 instead, you can file a personal injury lawsuit seeking full tort damages including pain and suffering. Non-subscribing employers cannot use the "exclusive remedy" defense, making these cases potentially much more valuable.`
  ),
  createFAQTemplate(
    (_, rules) => rules?.choiceOfDoctor === true,
    (_, __, name) => `Can I choose my own doctor for my ${name} workers' comp claim?`,
    (_, __, name) => `Yes. ${name} allows injured workers to select their own treating physician for workers' compensation claims. This is an important right because the treating doctor's opinions on your impairment rating, work restrictions, and treatment needs directly affect your benefits.`
  ),
  createFAQTemplate(
    (_, rules) => rules?.choiceOfDoctor === false,
    (_, __, name) => `Can I choose my own doctor for a workers' comp claim in ${name}?`,
    (_, __, name) => `In ${name}, the employer or its workers' compensation insurer generally has the right to select the treating physician, at least initially. You may be able to request a change of doctor after a period of treatment or under certain conditions. The treating doctor's opinions on impairment and work restrictions directly affect your benefits.`
  ),
  createFAQTemplate(
    () => true,
    () => `Should I accept a lump-sum workers' comp settlement?`,
    (_, __, name) => `Accepting a lump-sum (Compromise and Release) settlement in ${name} typically means giving up all future benefits, including lifetime medical care. This can be a serious risk if you have ongoing treatment needs. Always consult a workers' compensation attorney before accepting a settlement, especially if your injury is permanent \u2014 once settled, you generally cannot reopen the claim.`
  ),
  createFAQTemplate(
    () => true,
    (_, __, name) => `What injuries qualify for workers' compensation in ${name}?`,
    (_, __, name) => `Workers' compensation in ${name} covers injuries that arise out of and in the course of employment. This includes sudden accidents (falls, machinery injuries), repetitive stress injuries (carpal tunnel, back injuries from lifting), and occupational diseases (hearing loss, respiratory illness from workplace exposure). Pre-existing conditions aggravated by work may also be covered.`
  ),
  createFAQTemplate(
    () => true,
    (_, __, name) => `Can I sue my employer outside of workers' comp in ${name}?`,
    (stateData, rules, name) => {
      let a = `Generally no. ${name}'s workers' compensation system provides an "exclusive remedy," meaning you cannot sue your employer for a workplace injury in most cases.`;
      if (rules?.nonSubscriberState) {
        a += ` However, ${name} allows employers to opt out of workers' comp. If your employer is a non-subscriber, you can file a personal injury lawsuit for full tort damages.`;
      } else {
        a += ` Exceptions include: injuries caused by a third party (e.g., equipment manufacturer), employer's intentional conduct, or in rare cases, gross negligence.`;
      }
      return a;
    }
  ),
  // Employer notification FAQ (always shown when data exists)
  createFAQTemplate(
    (_, rules) => rules?.employerNotificationDeadline != null,
    (_, rules, name) => `How quickly must I report a workplace injury in ${name}?`,
    (_, rules, name) => {
      let a = `In ${name}, you must notify your employer of a workplace injury within ${rules.employerNotificationDeadline} days. This is separate from the formal workers\u2019 compensation claim filing deadline.`;
      a += ` Report the injury in writing, including the date, time, location, and nature of the injury. Late notification can result in reduced benefits or claim denial, even if your injury is legitimate. When in doubt, report immediately \u2014 you can always provide additional details later.`;
      return a;
    }
  ),
  // Occupational disease FAQ (conditional)
  createFAQTemplate(
    (_, rules) => rules?.occupationalDiseaseSol != null && rules?.occupationalDiseaseSol !== rules?.statuteOfLimitations,
    (_, rules, name) => `Are work-related illnesses covered by ${name} workers' comp?`,
    (_, rules, name) => {
      let a = `Yes. ${name}\u2019s workers\u2019 compensation system covers occupational diseases \u2014 conditions caused by workplace exposure or repetitive work activities. Common examples include hearing loss, respiratory diseases from chemical exposure, carpal tunnel syndrome, and occupational cancers.`;
      a += ` The filing deadline for occupational disease claims is ${rules.occupationalDiseaseSol} year${rules.occupationalDiseaseSol !== 1 ? 's' : ''} from the date of diagnosis or discovery${rules.statuteOfLimitations ? `, which differs from the ${rules.statuteOfLimitations}-year deadline for acute workplace injuries` : ''}. Because these conditions develop gradually, pinpointing the exact onset date can be complex.`;
      return a;
    }
  ),
];

/**
 * Get state-specific FAQs for a given state × case type.
 * Returns 6-8 FAQs selected from the conditional pool.
 */
export function getStateFAQs(stateCode, caseTypeId) {
  if (!LAUNCH_CASE_TYPES.includes(caseTypeId)) return null;

  const state = STATE_LEGAL_DATABASE[stateCode];
  if (!state) return null;

  const dbKey = caseTypeToDbKey[caseTypeId];
  const stateRules = state[dbKey];
  if (!stateRules) return null;

  const name = state.name;

  let pool;
  if (caseTypeId === 'motor') pool = MOTOR_FAQ_POOL;
  else if (caseTypeId === 'medical') pool = MEDMAL_FAQ_POOL;
  else if (caseTypeId === 'workers_comp') pool = WC_FAQ_POOL;
  else return null;

  const faqs = [];
  for (const template of pool) {
    if (template.condition(state, stateRules)) {
      faqs.push({
        q: template.questionFn(state, stateRules, name),
        a: template.answerFn(state, stateRules, name),
      });
    }
    if (faqs.length >= 8) break;
  }

  return faqs.length > 0 ? faqs : null;
}

// ============================================================================
// 1F. NEIGHBORING STATES
// ============================================================================

export const STATE_NEIGHBORS = {
  AL: ['MS', 'TN', 'GA', 'FL'],
  AK: [],
  AZ: ['CA', 'NV', 'UT', 'CO', 'NM'],
  AR: ['MO', 'TN', 'MS', 'LA', 'TX', 'OK'],
  CA: ['OR', 'NV', 'AZ'],
  CO: ['WY', 'NE', 'KS', 'OK', 'NM', 'UT'],
  CT: ['NY', 'MA', 'RI'],
  DE: ['PA', 'NJ', 'MD'],
  DC: ['MD', 'VA'],
  FL: ['GA', 'AL'],
  GA: ['FL', 'AL', 'TN', 'NC', 'SC'],
  HI: [],
  ID: ['WA', 'OR', 'NV', 'UT', 'WY', 'MT'],
  IL: ['WI', 'IA', 'MO', 'KY', 'IN'],
  IN: ['IL', 'MI', 'OH', 'KY'],
  IA: ['MN', 'WI', 'IL', 'MO', 'NE', 'SD'],
  KS: ['NE', 'MO', 'OK', 'CO'],
  KY: ['IN', 'OH', 'WV', 'VA', 'TN', 'IL', 'MO'],
  LA: ['TX', 'AR', 'MS'],
  ME: ['NH'],
  MD: ['PA', 'DE', 'WV', 'VA', 'DC'],
  MA: ['NH', 'VT', 'NY', 'CT', 'RI'],
  MI: ['OH', 'IN', 'WI'],
  MN: ['WI', 'IA', 'SD', 'ND'],
  MS: ['AL', 'TN', 'AR', 'LA'],
  MO: ['IA', 'IL', 'KY', 'TN', 'AR', 'OK', 'KS', 'NE'],
  MT: ['ND', 'SD', 'WY', 'ID'],
  NE: ['SD', 'IA', 'MO', 'KS', 'CO', 'WY'],
  NV: ['CA', 'OR', 'ID', 'UT', 'AZ'],
  NH: ['ME', 'MA', 'VT'],
  NJ: ['NY', 'PA', 'DE'],
  NM: ['AZ', 'CO', 'OK', 'TX'],
  NY: ['NJ', 'PA', 'CT', 'MA', 'VT'],
  NC: ['VA', 'TN', 'GA', 'SC'],
  ND: ['MN', 'SD', 'MT'],
  OH: ['PA', 'WV', 'KY', 'IN', 'MI'],
  OK: ['KS', 'MO', 'AR', 'TX', 'NM', 'CO'],
  OR: ['WA', 'CA', 'NV', 'ID'],
  PA: ['NY', 'NJ', 'DE', 'MD', 'WV', 'OH'],
  RI: ['CT', 'MA'],
  SC: ['NC', 'GA'],
  SD: ['ND', 'MN', 'IA', 'NE', 'WY', 'MT'],
  TN: ['KY', 'VA', 'NC', 'GA', 'AL', 'MS', 'AR', 'MO'],
  TX: ['NM', 'OK', 'AR', 'LA'],
  UT: ['ID', 'WY', 'CO', 'NV', 'AZ'],
  VT: ['NH', 'MA', 'NY'],
  VA: ['MD', 'DC', 'WV', 'KY', 'TN', 'NC'],
  WA: ['OR', 'ID'],
  WV: ['PA', 'MD', 'VA', 'KY', 'OH'],
  WI: ['MN', 'IA', 'IL', 'MI'],
  WY: ['MT', 'SD', 'NE', 'CO', 'UT', 'ID'],
};

/**
 * Get neighboring state comparison data.
 * Framed as "Had your accident in a different state?" for border-area incidents.
 */
export function getNeighboringComparison(stateCode, caseTypeId) {
  const neighbors = STATE_NEIGHBORS[stateCode];
  if (!neighbors || neighbors.length === 0) return null;

  const dbKey = caseTypeToDbKey[caseTypeId];
  const currentState = STATE_LEGAL_DATABASE[stateCode];
  const currentRules = currentState?.[dbKey];
  if (!currentRules) return null;

  const comparisons = [];
  for (const neighborCode of neighbors.slice(0, 4)) {
    const neighborState = STATE_LEGAL_DATABASE[neighborCode];
    if (!neighborState) continue;

    const neighborRules = neighborState[dbKey];
    if (!neighborRules) continue;

    const stateSlug = stateCodeToSlug[neighborCode];
    const caseSlug = caseIdToSlug[caseTypeId];

    comparisons.push({
      stateCode: neighborCode,
      stateName: neighborState.name,
      stateSlug,
      url: `/${stateSlug}/${caseSlug}-calculator`,
      hubUrl: `/states/${stateSlug}`,
      sol: neighborRules.statuteOfLimitations,
      negligenceSystem: neighborState.negligenceSystem,
      negligenceLabel: negligenceLabels[neighborState.negligenceSystem],
      noFault: neighborRules.noFaultState || false,
    });
  }

  return comparisons.length > 0 ? comparisons : null;
}
