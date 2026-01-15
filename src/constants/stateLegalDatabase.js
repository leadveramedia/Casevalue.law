/**
 * State Legal Database
 * Comprehensive database of state-specific legal rules, damage caps,
 * statute of limitations, and legal frameworks for case valuation
 *
 * Sources: State statutes, tort reform legislation, and legal precedents
 * Note: This database provides general guidelines. Actual cases may vary based on
 * specific circumstances, recent legislation changes, and court interpretations.
 */

// Negligence system types
export const NEGLIGENCE_TYPES = {
  PURE_COMPARATIVE: 'pure_comparative',           // Can recover even if 99% at fault
  MODIFIED_COMPARATIVE_50: 'modified_50',         // Can recover if less than 50% at fault
  MODIFIED_COMPARATIVE_51: 'modified_51',         // Can recover if 50% or less at fault
  CONTRIBUTORY: 'contributory'                     // Cannot recover if any fault
};

/**
 * State Legal Rules Database
 * Each state contains rules for different case types with damage caps, SOL, and special provisions
 */
export const STATE_LEGAL_DATABASE = {
  'AL': { // Alabama
    name: 'Alabama',
    negligenceSystem: NEGLIGENCE_TYPES.CONTRIBUTORY,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 1135,
      minWeeklyBenefit: 232,
      maxWeeksTTD: 300,
      maxWeeksPPD: 300,
      waitingPeriod: 3,
      retroactivePeriod: 21,
      statuteOfLimitations: 2,
      impairmentGuide: 'AMA_6',
      choiceOfDoctor: false,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: 294800,
      burialAllowance: 7500
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: null,
      punitiveDamageCap: 'lesserOf3xCompensatoryOr500k',
      statuteOfLimitations: 2, // years
      discoveryRule: true
    },
    motorVehicle: {
      economicDamageCap: null,
      nonEconomicDamageCap: null,
      punitiveDamageCap: 'lesserOf3xCompensatoryOr500k',
      statuteOfLimitations: 2,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 2,
      nonEconomicDamageCap: null
    },
    productLiability: {
      statuteOfLimitations: 2,
      punitiveDamageCap: 'lesserOf3xCompensatoryOr500k'
    },
    wrongfulDeath: {
      statuteOfLimitations: 2,
      punitiveDamageCap: 'lesserOf3xCompensatoryOr500k'
    },
    dogBite: {
      statuteOfLimitations: 2,
      strictLiability: false // One-bite rule
    },
    wrongfulTermination: {
      statuteOfLimitations: 2
    },
    wageTheft: {
      statuteOfLimitations: 2
    },
    classAction: {
      statuteOfLimitations: 2
    },
    insuranceBadFaith: {
      statuteOfLimitations: 2,
      punitiveDamageCap: 'lesserOf3xCompensatoryOr500k'
    },
    disability: {
      statuteOfLimitations: 2
    },
    professionalMalpractice: {
      statuteOfLimitations: 2,
      nonEconomicDamageCap: null
    },
    civilRights: {
      statuteOfLimitations: 1
    },
    intellectualProperty: {
      statuteOfLimitations: 3
    }
  },

  'AK': { // Alaska
    name: 'Alaska',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_50,
    workersCompensation: {
      ttdRate: 0.80,
      tpdRate: 0.80,
      ppdRate: 0.80,
      ptdRate: 0.80,
      maxWeeklyBenefit: 1516,
      minWeeklyBenefit: 284,
      maxWeeksTTD: null,
      maxWeeksPPD: null,
      waitingPeriod: 3,
      retroactivePeriod: 28,
      statuteOfLimitations: 2,
      impairmentGuide: 'AMA_6',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: null,
      burialAllowance: 10000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: 400000, // $400k for non-economic, $8M for severe
      punitiveDamageCap: 'greaterOf3xCompensatoryOr500k',
      statuteOfLimitations: 2
    },
    motorVehicle: {
      economicDamageCap: null,
      nonEconomicDamageCap: null,
      punitiveDamageCap: 'greaterOf3xCompensatoryOr500k',
      statuteOfLimitations: 2,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 2
    },
    productLiability: {
      statuteOfLimitations: 2
    },
    wrongfulDeath: {
      statuteOfLimitations: 2
    },
    dogBite: {
      statuteOfLimitations: 2,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 2
    },
    wageTheft: {
      statuteOfLimitations: 3
    },
    classAction: {
      statuteOfLimitations: 2
    },
    insuranceBadFaith: {
      statuteOfLimitations: 2
    },
    disability: {
      statuteOfLimitations: 2
    },
    professionalMalpractice: {
      statuteOfLimitations: 2
    },
    civilRights: {
      statuteOfLimitations: 2
    },
    intellectualProperty: {
      statuteOfLimitations: 3
    }
  },

  'AZ': { // Arizona
    name: 'Arizona',
    negligenceSystem: NEGLIGENCE_TYPES.PURE_COMPARATIVE,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 1135,
      minWeeklyBenefit: null,
      maxWeeksTTD: null,
      maxWeeksPPD: null,
      waitingPeriod: 7,
      retroactivePeriod: 14,
      statuteOfLimitations: 1,
      impairmentGuide: 'AMA_5',
      choiceOfDoctor: false,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: null,
      burialAllowance: 5000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: null,
      punitiveDamageCap: 'lesserOf3xCompensatoryOr250kOr500k',
      statuteOfLimitations: 2
    },
    motorVehicle: {
      economicDamageCap: null,
      nonEconomicDamageCap: null,
      statuteOfLimitations: 2,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 2
    },
    productLiability: {
      statuteOfLimitations: 2
    },
    wrongfulDeath: {
      statuteOfLimitations: 2
    },
    dogBite: {
      statuteOfLimitations: 1,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 1
    },
    wageTheft: {
      statuteOfLimitations: 1
    },
    classAction: {
      statuteOfLimitations: 2
    },
    insuranceBadFaith: {
      statuteOfLimitations: 2
    },
    disability: {
      statuteOfLimitations: 1
    },
    professionalMalpractice: {
      statuteOfLimitations: 2
    },
    civilRights: {
      statuteOfLimitations: 2
    },
    intellectualProperty: {
      statuteOfLimitations: 3
    }
  },

  'AR': { // Arkansas
    name: 'Arkansas',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_50,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 790,
      minWeeklyBenefit: 20,
      maxWeeksTTD: 450,
      maxWeeksPPD: 450,
      waitingPeriod: 7,
      retroactivePeriod: 14,
      statuteOfLimitations: 2,
      impairmentGuide: 'AMA_4',
      choiceOfDoctor: false,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: 75000,
      burialAllowance: 10000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: null,
      punitiveDamageCap: 'lesserOf3xCompensatoryOr250k',
      statuteOfLimitations: 2
    },
    motorVehicle: {
      statuteOfLimitations: 3,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 3
    },
    productLiability: {
      statuteOfLimitations: 3
    },
    wrongfulDeath: {
      statuteOfLimitations: 3
    },
    dogBite: {
      statuteOfLimitations: 3,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 3
    },
    wageTheft: {
      statuteOfLimitations: 3
    },
    classAction: {
      statuteOfLimitations: 3
    },
    insuranceBadFaith: {
      statuteOfLimitations: 3
    },
    disability: {
      statuteOfLimitations: 3
    },
    professionalMalpractice: {
      statuteOfLimitations: 3
    },
    civilRights: {
      statuteOfLimitations: 3
    },
    intellectualProperty: {
      statuteOfLimitations: 3
    }
  },

  'CA': { // California
    name: 'California',
    negligenceSystem: NEGLIGENCE_TYPES.PURE_COMPARATIVE,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 1619,
      minWeeklyBenefit: 242,
      maxWeeksTTD: 104,
      maxWeeksPPD: null,
      waitingPeriod: 3,
      retroactivePeriod: 14,
      statuteOfLimitations: 1,
      impairmentGuide: 'PDRS',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: false,
      deathBenefitMax: 390000,
      burialAllowance: 10000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: 250000, // MICRA cap
      punitiveDamageCap: null,
      statuteOfLimitations: 3, // 3 years from injury or 1 year from discovery
      discoveryRule: true
    },
    motorVehicle: {
      economicDamageCap: null,
      nonEconomicDamageCap: null,
      statuteOfLimitations: 2,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 2,
      nonEconomicDamageCap: null
    },
    productLiability: {
      statuteOfLimitations: 2,
      punitiveDamageCap: null
    },
    wrongfulDeath: {
      statuteOfLimitations: 2,
      nonEconomicDamageCap: null
    },
    dogBite: {
      statuteOfLimitations: 2,
      strictLiability: true // Strict liability for dog bites
    },
    wrongfulTermination: {
      statuteOfLimitations: 2
    },
    wageTheft: {
      statuteOfLimitations: 3
    },
    classAction: {
      statuteOfLimitations: 4
    },
    insuranceBadFaith: {
      statuteOfLimitations: 2
    },
    disability: {
      statuteOfLimitations: 2
    },
    professionalMalpractice: {
      statuteOfLimitations: 2,
      nonEconomicDamageCap: null
    },
    civilRights: {
      statuteOfLimitations: 2
    },
    intellectualProperty: {
      statuteOfLimitations: 3
    }
  },

  'CO': { // Colorado
    name: 'Colorado',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_50,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 1299,
      minWeeklyBenefit: 260,
      maxWeeksTTD: null,
      maxWeeksPPD: null,
      waitingPeriod: 3,
      retroactivePeriod: 14,
      statuteOfLimitations: 2,
      impairmentGuide: 'AMA_3',
      choiceOfDoctor: false,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: null,
      burialAllowance: 7000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: 300000, // Adjusted for inflation
      punitiveDamageCap: 'equalToCompensatory',
      statuteOfLimitations: 2
    },
    motorVehicle: {
      statuteOfLimitations: 3,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 2
    },
    productLiability: {
      statuteOfLimitations: 2
    },
    wrongfulDeath: {
      statuteOfLimitations: 2
    },
    dogBite: {
      statuteOfLimitations: 2,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 2
    },
    wageTheft: {
      statuteOfLimitations: 3
    },
    classAction: {
      statuteOfLimitations: 2
    },
    insuranceBadFaith: {
      statuteOfLimitations: 3
    },
    disability: {
      statuteOfLimitations: 2
    },
    professionalMalpractice: {
      statuteOfLimitations: 2,
      nonEconomicDamageCap: 300000
    },
    civilRights: {
      statuteOfLimitations: 2
    },
    intellectualProperty: {
      statuteOfLimitations: 3
    }
  },

  'CT': { // Connecticut
    name: 'Connecticut',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_51,
    workersCompensation: {
      ttdRate: 0.75,
      tpdRate: 0.75,
      ppdRate: 0.75,
      ptdRate: 0.75,
      maxWeeklyBenefit: 1659,
      minWeeklyBenefit: 316,
      maxWeeksTTD: 520,
      maxWeeksPPD: 520,
      waitingPeriod: 3,
      retroactivePeriod: 7,
      statuteOfLimitations: 1,
      impairmentGuide: 'AMA_5',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: null,
      burialAllowance: 4000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: null,
      punitiveDamageCap: null,
      statuteOfLimitations: 2
    },
    motorVehicle: {
      statuteOfLimitations: 2,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 2
    },
    productLiability: {
      statuteOfLimitations: 3
    },
    wrongfulDeath: {
      statuteOfLimitations: 2
    },
    dogBite: {
      statuteOfLimitations: 2,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 3
    },
    wageTheft: {
      statuteOfLimitations: 2
    },
    classAction: {
      statuteOfLimitations: 3
    },
    insuranceBadFaith: {
      statuteOfLimitations: 3
    },
    disability: {
      statuteOfLimitations: 3
    },
    professionalMalpractice: {
      statuteOfLimitations: 2
    },
    civilRights: {
      statuteOfLimitations: 3
    },
    intellectualProperty: {
      statuteOfLimitations: 3
    }
  },

  'DE': { // Delaware
    name: 'Delaware',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_51,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 882,
      minWeeklyBenefit: 220,
      maxWeeksTTD: null,
      maxWeeksPPD: 300,
      waitingPeriod: 3,
      retroactivePeriod: 7,
      statuteOfLimitations: 2,
      impairmentGuide: 'AMA_5',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: null,
      burialAllowance: 7500
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: null,
      punitiveDamageCap: null,
      statuteOfLimitations: 2
    },
    motorVehicle: {
      statuteOfLimitations: 2,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 2
    },
    productLiability: {
      statuteOfLimitations: 2
    },
    wrongfulDeath: {
      statuteOfLimitations: 2
    },
    dogBite: {
      statuteOfLimitations: 2,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 2
    },
    wageTheft: {
      statuteOfLimitations: 3
    },
    classAction: {
      statuteOfLimitations: 2
    },
    insuranceBadFaith: {
      statuteOfLimitations: 2
    },
    disability: {
      statuteOfLimitations: 2
    },
    professionalMalpractice: {
      statuteOfLimitations: 2
    },
    civilRights: {
      statuteOfLimitations: 2
    },
    intellectualProperty: {
      statuteOfLimitations: 3
    }
  },

  'FL': { // Florida
    name: 'Florida',
    negligenceSystem: NEGLIGENCE_TYPES.PURE_COMPARATIVE,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.75,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 1197,
      minWeeklyBenefit: 20,
      maxWeeksTTD: 104,
      maxWeeksPPD: 260,
      waitingPeriod: 7,
      retroactivePeriod: 21,
      statuteOfLimitations: 2,
      impairmentGuide: 'FL_GUIDES',
      choiceOfDoctor: false,
      exclusiveRemedy: true,
      secondInjuryFund: false,
      deathBenefitMax: 150000,
      burialAllowance: 7500
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: null, // Caps ruled unconstitutional in 2017
      punitiveDamageCap: 'lesserOf3xCompensatoryOr500k',
      statuteOfLimitations: 2
    },
    motorVehicle: {
      statuteOfLimitations: 4,
      noFaultState: true // PIP state
    },
    premises: {
      statuteOfLimitations: 4
    },
    productLiability: {
      statuteOfLimitations: 4
    },
    wrongfulDeath: {
      statuteOfLimitations: 2
    },
    dogBite: {
      statuteOfLimitations: 4,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 1
    },
    wageTheft: {
      statuteOfLimitations: 2
    },
    classAction: {
      statuteOfLimitations: 4
    },
    insuranceBadFaith: {
      statuteOfLimitations: 5
    },
    disability: {
      statuteOfLimitations: 4
    },
    professionalMalpractice: {
      statuteOfLimitations: 2
    },
    civilRights: {
      statuteOfLimitations: 4
    },
    intellectualProperty: {
      statuteOfLimitations: 4
    }
  },

  'GA': { // Georgia
    name: 'Georgia',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_50,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 800,
      minWeeklyBenefit: 75,
      maxWeeksTTD: 400,
      maxWeeksPPD: 350,
      waitingPeriod: 7,
      retroactivePeriod: 21,
      statuteOfLimitations: 1,
      impairmentGuide: 'AMA_5',
      choiceOfDoctor: false,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: 270000,
      burialAllowance: 7500
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: 350000, // Per defendant, $1.05M total cap
      punitiveDamageCap: 250000,
      statuteOfLimitations: 2
    },
    motorVehicle: {
      statuteOfLimitations: 2,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 2
    },
    productLiability: {
      statuteOfLimitations: 2
    },
    wrongfulDeath: {
      statuteOfLimitations: 2,
      nonEconomicDamageCap: null // No cap on wrongful death
    },
    dogBite: {
      statuteOfLimitations: 2,
      strictLiability: false // Knowledge of vicious propensity required
    },
    wrongfulTermination: {
      statuteOfLimitations: 2
    },
    wageTheft: {
      statuteOfLimitations: 2
    },
    classAction: {
      statuteOfLimitations: 2
    },
    insuranceBadFaith: {
      statuteOfLimitations: 6
    },
    disability: {
      statuteOfLimitations: 2
    },
    professionalMalpractice: {
      statuteOfLimitations: 2
    },
    civilRights: {
      statuteOfLimitations: 2
    },
    intellectualProperty: {
      statuteOfLimitations: 4
    }
  },

  'HI': { // Hawaii
    name: 'Hawaii',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_51,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 1265,
      minWeeklyBenefit: 253,
      maxWeeksTTD: null,
      maxWeeksPPD: null,
      waitingPeriod: 3,
      retroactivePeriod: 14,
      statuteOfLimitations: 2,
      impairmentGuide: 'AMA_5',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: null,
      burialAllowance: 5000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: 375000,
      punitiveDamageCap: null,
      statuteOfLimitations: 2
    },
    motorVehicle: {
      statuteOfLimitations: 2,
      noFaultState: true // PIP state
    },
    premises: {
      statuteOfLimitations: 2
    },
    productLiability: {
      statuteOfLimitations: 2
    },
    wrongfulDeath: {
      statuteOfLimitations: 2
    },
    dogBite: {
      statuteOfLimitations: 2,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 2
    },
    wageTheft: {
      statuteOfLimitations: 6
    },
    classAction: {
      statuteOfLimitations: 2
    },
    insuranceBadFaith: {
      statuteOfLimitations: 6
    },
    disability: {
      statuteOfLimitations: 2
    },
    professionalMalpractice: {
      statuteOfLimitations: 2,
      nonEconomicDamageCap: 375000
    },
    civilRights: {
      statuteOfLimitations: 2
    },
    intellectualProperty: {
      statuteOfLimitations: 4
    }
  },

  'ID': { // Idaho
    name: 'Idaho',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_50,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 813,
      minWeeklyBenefit: 203,
      maxWeeksTTD: null,
      maxWeeksPPD: 500,
      waitingPeriod: 5,
      retroactivePeriod: 14,
      statuteOfLimitations: 1,
      impairmentGuide: 'AMA_6',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: 200000,
      burialAllowance: 8000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: 250000,
      punitiveDamageCap: 'lesserOf3xCompensatoryOr250k',
      statuteOfLimitations: 2
    },
    motorVehicle: {
      statuteOfLimitations: 2,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 2
    },
    productLiability: {
      statuteOfLimitations: 2
    },
    wrongfulDeath: {
      statuteOfLimitations: 2
    },
    dogBite: {
      statuteOfLimitations: 2,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 4
    },
    wageTheft: {
      statuteOfLimitations: 2
    },
    classAction: {
      statuteOfLimitations: 2
    },
    insuranceBadFaith: {
      statuteOfLimitations: 5
    },
    disability: {
      statuteOfLimitations: 4
    },
    professionalMalpractice: {
      statuteOfLimitations: 2,
      nonEconomicDamageCap: 250000
    },
    civilRights: {
      statuteOfLimitations: 2
    },
    intellectualProperty: {
      statuteOfLimitations: 3
    }
  },

  'IL': { // Illinois
    name: 'Illinois',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_51,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.60,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 1896,
      minWeeklyBenefit: 284,
      maxWeeksTTD: null,
      maxWeeksPPD: null,
      waitingPeriod: 3,
      retroactivePeriod: 14,
      statuteOfLimitations: 3,
      impairmentGuide: 'AMA_6',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: null,
      burialAllowance: 8000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: null, // Caps ruled unconstitutional
      punitiveDamageCap: null,
      statuteOfLimitations: 2
    },
    motorVehicle: {
      statuteOfLimitations: 2,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 2
    },
    productLiability: {
      statuteOfLimitations: 2
    },
    wrongfulDeath: {
      statuteOfLimitations: 2
    },
    dogBite: {
      statuteOfLimitations: 2,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 2
    },
    wageTheft: {
      statuteOfLimitations: 3
    },
    classAction: {
      statuteOfLimitations: 2
    },
    insuranceBadFaith: {
      statuteOfLimitations: 5
    },
    disability: {
      statuteOfLimitations: 2
    },
    professionalMalpractice: {
      statuteOfLimitations: 2
    },
    civilRights: {
      statuteOfLimitations: 2
    },
    intellectualProperty: {
      statuteOfLimitations: 5
    }
  },

  'IN': { // Indiana
    name: 'Indiana',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_51,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 996,
      minWeeklyBenefit: 75,
      maxWeeksTTD: 500,
      maxWeeksPPD: 500,
      waitingPeriod: 7,
      retroactivePeriod: 21,
      statuteOfLimitations: 2,
      impairmentGuide: 'AMA_6',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: 300000,
      burialAllowance: 7500
    },
    medicalMalpractice: {
      economicDamageCap: 1800000, // Total cap including economic
      nonEconomicDamageCap: 1800000,
      punitiveDamageCap: 'greaterOf3xCompensatoryOr50k',
      statuteOfLimitations: 2
    },
    motorVehicle: {
      statuteOfLimitations: 2,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 2
    },
    productLiability: {
      statuteOfLimitations: 2
    },
    wrongfulDeath: {
      statuteOfLimitations: 2
    },
    dogBite: {
      statuteOfLimitations: 2,
      strictLiability: false
    },
    wrongfulTermination: {
      statuteOfLimitations: 2
    },
    wageTheft: {
      statuteOfLimitations: 6
    },
    classAction: {
      statuteOfLimitations: 2
    },
    insuranceBadFaith: {
      statuteOfLimitations: 6
    },
    disability: {
      statuteOfLimitations: 2
    },
    professionalMalpractice: {
      statuteOfLimitations: 2
    },
    civilRights: {
      statuteOfLimitations: 2
    },
    intellectualProperty: {
      statuteOfLimitations: 6
    }
  },

  'IA': { // Iowa
    name: 'Iowa',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_51,
    workersCompensation: {
      ttdRate: 0.80,
      tpdRate: 0.80,
      ppdRate: 0.80,
      ptdRate: 0.80,
      maxWeeklyBenefit: 2148,
      minWeeklyBenefit: 322,
      maxWeeksTTD: null,
      maxWeeksPPD: 500,
      waitingPeriod: 3,
      retroactivePeriod: 14,
      statuteOfLimitations: 2,
      impairmentGuide: 'AMA_5',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: null,
      burialAllowance: 10000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: null,
      punitiveDamageCap: null,
      statuteOfLimitations: 2
    },
    motorVehicle: {
      statuteOfLimitations: 2,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 2
    },
    productLiability: {
      statuteOfLimitations: 2
    },
    wrongfulDeath: {
      statuteOfLimitations: 2
    },
    dogBite: {
      statuteOfLimitations: 2,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 2
    },
    wageTheft: {
      statuteOfLimitations: 5
    },
    classAction: {
      statuteOfLimitations: 5
    },
    insuranceBadFaith: {
      statuteOfLimitations: 5
    },
    disability: {
      statuteOfLimitations: 2
    },
    professionalMalpractice: {
      statuteOfLimitations: 2
    },
    civilRights: {
      statuteOfLimitations: 2
    },
    intellectualProperty: {
      statuteOfLimitations: 5
    }
  },

  'KS': { // Kansas
    name: 'Kansas',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_50,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 782,
      minWeeklyBenefit: 25,
      maxWeeksTTD: null,
      maxWeeksPPD: 415,
      waitingPeriod: 7,
      retroactivePeriod: 21,
      statuteOfLimitations: 2,
      impairmentGuide: 'AMA_4',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: 325000,
      burialAllowance: 10000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: 325000,
      punitiveDamageCap: 'lesserOf5MillionOr1.5xCompensatory',
      statuteOfLimitations: 2
    },
    motorVehicle: {
      statuteOfLimitations: 2,
      noFaultState: true // PIP state
    },
    premises: {
      statuteOfLimitations: 2
    },
    productLiability: {
      statuteOfLimitations: 2
    },
    wrongfulDeath: {
      statuteOfLimitations: 2
    },
    dogBite: {
      statuteOfLimitations: 2,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 3
    },
    wageTheft: {
      statuteOfLimitations: 3
    },
    classAction: {
      statuteOfLimitations: 3
    },
    insuranceBadFaith: {
      statuteOfLimitations: 3
    },
    disability: {
      statuteOfLimitations: 3
    },
    professionalMalpractice: {
      statuteOfLimitations: 2,
      nonEconomicDamageCap: 325000
    },
    civilRights: {
      statuteOfLimitations: 2
    },
    intellectualProperty: {
      statuteOfLimitations: 3
    }
  },

  'KY': { // Kentucky
    name: 'Kentucky',
    negligenceSystem: NEGLIGENCE_TYPES.PURE_COMPARATIVE,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 1094,
      minWeeklyBenefit: 164,
      maxWeeksTTD: null,
      maxWeeksPPD: 520,
      waitingPeriod: 7,
      retroactivePeriod: 14,
      statuteOfLimitations: 2,
      impairmentGuide: 'AMA_5',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: 113880,
      burialAllowance: 10000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: null, // Caps ruled unconstitutional
      punitiveDamageCap: 'greaterOf500kOr2xCompensatory',
      statuteOfLimitations: 1
    },
    motorVehicle: {
      statuteOfLimitations: 2,
      noFaultState: true // PIP state
    },
    premises: {
      statuteOfLimitations: 1
    },
    productLiability: {
      statuteOfLimitations: 1
    },
    wrongfulDeath: {
      statuteOfLimitations: 1
    },
    dogBite: {
      statuteOfLimitations: 1,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 1
    },
    wageTheft: {
      statuteOfLimitations: 5
    },
    classAction: {
      statuteOfLimitations: 5
    },
    insuranceBadFaith: {
      statuteOfLimitations: 5
    },
    disability: {
      statuteOfLimitations: 1
    },
    professionalMalpractice: {
      statuteOfLimitations: 1
    },
    civilRights: {
      statuteOfLimitations: 5
    },
    intellectualProperty: {
      statuteOfLimitations: 5
    }
  },

  'LA': { // Louisiana
    name: 'Louisiana',
    negligenceSystem: NEGLIGENCE_TYPES.PURE_COMPARATIVE,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 892,
      minWeeklyBenefit: 178,
      maxWeeksTTD: null,
      maxWeeksPPD: 520,
      waitingPeriod: 7,
      retroactivePeriod: 42,
      statuteOfLimitations: 1,
      impairmentGuide: 'AMA_4',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: 150000,
      burialAllowance: 8500
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: 500000, // Per incident, plus $500k from fund
      punitiveDamageCap: null,
      statuteOfLimitations: 1
    },
    motorVehicle: {
      statuteOfLimitations: 1,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 1
    },
    productLiability: {
      statuteOfLimitations: 1
    },
    wrongfulDeath: {
      statuteOfLimitations: 1
    },
    dogBite: {
      statuteOfLimitations: 1,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 1
    },
    wageTheft: {
      statuteOfLimitations: 3
    },
    classAction: {
      statuteOfLimitations: 1
    },
    insuranceBadFaith: {
      statuteOfLimitations: 1
    },
    disability: {
      statuteOfLimitations: 1
    },
    professionalMalpractice: {
      statuteOfLimitations: 1
    },
    civilRights: {
      statuteOfLimitations: 1
    },
    intellectualProperty: {
      statuteOfLimitations: 1
    }
  },

  'ME': { // Maine
    name: 'Maine',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_51,
    workersCompensation: {
      ttdRate: 0.80,
      tpdRate: 0.80,
      ppdRate: 0.6667,
      ptdRate: 0.80,
      maxWeeklyBenefit: 1104,
      minWeeklyBenefit: 276,
      maxWeeksTTD: 400,
      maxWeeksPPD: null,
      waitingPeriod: 7,
      retroactivePeriod: 14,
      statuteOfLimitations: 2,
      impairmentGuide: 'AMA_5',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: null,
      burialAllowance: 4000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: null,
      punitiveDamageCap: null,
      statuteOfLimitations: 3
    },
    motorVehicle: {
      statuteOfLimitations: 6,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 6
    },
    productLiability: {
      statuteOfLimitations: 6
    },
    wrongfulDeath: {
      statuteOfLimitations: 2
    },
    dogBite: {
      statuteOfLimitations: 6,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 6
    },
    wageTheft: {
      statuteOfLimitations: 6
    },
    classAction: {
      statuteOfLimitations: 6
    },
    insuranceBadFaith: {
      statuteOfLimitations: 6
    },
    disability: {
      statuteOfLimitations: 6
    },
    professionalMalpractice: {
      statuteOfLimitations: 3
    },
    civilRights: {
      statuteOfLimitations: 6
    },
    intellectualProperty: {
      statuteOfLimitations: 6
    }
  },

  'MD': { // Maryland
    name: 'Maryland',
    negligenceSystem: NEGLIGENCE_TYPES.CONTRIBUTORY,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 1295,
      minWeeklyBenefit: 50,
      maxWeeksTTD: null,
      maxWeeksPPD: 500,
      waitingPeriod: 3,
      retroactivePeriod: 14,
      statuteOfLimitations: 2,
      impairmentGuide: 'AMA_5',
      choiceOfDoctor: false,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: 45000,
      burialAllowance: 10000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: 875000, // Adjusted annually
      punitiveDamageCap: null,
      statuteOfLimitations: 3
    },
    motorVehicle: {
      statuteOfLimitations: 3,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 3
    },
    productLiability: {
      statuteOfLimitations: 3
    },
    wrongfulDeath: {
      statuteOfLimitations: 3,
      nonEconomicDamageCap: 875000
    },
    dogBite: {
      statuteOfLimitations: 3,
      strictLiability: false
    },
    wrongfulTermination: {
      statuteOfLimitations: 3
    },
    wageTheft: {
      statuteOfLimitations: 3
    },
    classAction: {
      statuteOfLimitations: 3
    },
    insuranceBadFaith: {
      statuteOfLimitations: 3
    },
    disability: {
      statuteOfLimitations: 3
    },
    professionalMalpractice: {
      statuteOfLimitations: 3,
      nonEconomicDamageCap: 875000
    },
    civilRights: {
      statuteOfLimitations: 3
    },
    intellectualProperty: {
      statuteOfLimitations: 3
    }
  },

  'MA': { // Massachusetts
    name: 'Massachusetts',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_51,
    workersCompensation: {
      ttdRate: 0.60,
      tpdRate: 0.60,
      ppdRate: 0.60,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 1796,
      minWeeklyBenefit: 359,
      maxWeeksTTD: 156,
      maxWeeksPPD: 260,
      waitingPeriod: 5,
      retroactivePeriod: 21,
      statuteOfLimitations: 4,
      impairmentGuide: 'AMA_5',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: null,
      burialAllowance: 4000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: 500000, // For future pain and suffering only
      punitiveDamageCap: null,
      statuteOfLimitations: 3
    },
    motorVehicle: {
      statuteOfLimitations: 3,
      noFaultState: true // PIP state
    },
    premises: {
      statuteOfLimitations: 3
    },
    productLiability: {
      statuteOfLimitations: 3
    },
    wrongfulDeath: {
      statuteOfLimitations: 3
    },
    dogBite: {
      statuteOfLimitations: 3,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 3
    },
    wageTheft: {
      statuteOfLimitations: 3
    },
    classAction: {
      statuteOfLimitations: 3
    },
    insuranceBadFaith: {
      statuteOfLimitations: 3
    },
    disability: {
      statuteOfLimitations: 3
    },
    professionalMalpractice: {
      statuteOfLimitations: 3
    },
    civilRights: {
      statuteOfLimitations: 3
    },
    intellectualProperty: {
      statuteOfLimitations: 3
    }
  },

  'MI': { // Michigan
    name: 'Michigan',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_51,
    workersCompensation: {
      ttdRate: 0.80,
      tpdRate: 0.80,
      ppdRate: 0.80,
      ptdRate: 0.80,
      maxWeeklyBenefit: 1108,
      minWeeklyBenefit: 222,
      maxWeeksTTD: null,
      maxWeeksPPD: null,
      waitingPeriod: 7,
      retroactivePeriod: 14,
      statuteOfLimitations: 2,
      impairmentGuide: 'AMA_5',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: null,
      burialAllowance: 6000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: 500000, // $1M for certain injuries
      punitiveDamageCap: null,
      statuteOfLimitations: 2
    },
    motorVehicle: {
      statuteOfLimitations: 3,
      noFaultState: true // Pure no-fault
    },
    premises: {
      statuteOfLimitations: 3
    },
    productLiability: {
      statuteOfLimitations: 3
    },
    wrongfulDeath: {
      statuteOfLimitations: 3
    },
    dogBite: {
      statuteOfLimitations: 3,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 3
    },
    wageTheft: {
      statuteOfLimitations: 6
    },
    classAction: {
      statuteOfLimitations: 6
    },
    insuranceBadFaith: {
      statuteOfLimitations: 6
    },
    disability: {
      statuteOfLimitations: 3
    },
    professionalMalpractice: {
      statuteOfLimitations: 2,
      nonEconomicDamageCap: 500000
    },
    civilRights: {
      statuteOfLimitations: 3
    },
    intellectualProperty: {
      statuteOfLimitations: 6
    }
  },

  'MN': { // Minnesota
    name: 'Minnesota',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_51,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 1378,
      minWeeklyBenefit: 206,
      maxWeeksTTD: 130,
      maxWeeksPPD: 500,
      waitingPeriod: 3,
      retroactivePeriod: 10,
      statuteOfLimitations: 3,
      impairmentGuide: 'MN_SCHEDULE',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: 60000,
      burialAllowance: 25000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: null,
      punitiveDamageCap: null,
      statuteOfLimitations: 4
    },
    motorVehicle: {
      statuteOfLimitations: 6,
      noFaultState: true // PIP state
    },
    premises: {
      statuteOfLimitations: 6
    },
    productLiability: {
      statuteOfLimitations: 6
    },
    wrongfulDeath: {
      statuteOfLimitations: 3
    },
    dogBite: {
      statuteOfLimitations: 6,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 6
    },
    wageTheft: {
      statuteOfLimitations: 6
    },
    classAction: {
      statuteOfLimitations: 6
    },
    insuranceBadFaith: {
      statuteOfLimitations: 6
    },
    disability: {
      statuteOfLimitations: 6
    },
    professionalMalpractice: {
      statuteOfLimitations: 4
    },
    civilRights: {
      statuteOfLimitations: 6
    },
    intellectualProperty: {
      statuteOfLimitations: 6
    }
  },

  'MS': { // Mississippi
    name: 'Mississippi',
    negligenceSystem: NEGLIGENCE_TYPES.PURE_COMPARATIVE,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 604,
      minWeeklyBenefit: 25,
      maxWeeksTTD: 450,
      maxWeeksPPD: 450,
      waitingPeriod: 5,
      retroactivePeriod: 14,
      statuteOfLimitations: 2,
      impairmentGuide: 'AMA_4',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: 200000,
      burialAllowance: 5000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: 500000, // Per plaintiff
      punitiveDamageCap: 'lesserOf2.5PercentDefendantNetWorthOr20Million',
      statuteOfLimitations: 2
    },
    motorVehicle: {
      statuteOfLimitations: 3,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 3
    },
    productLiability: {
      statuteOfLimitations: 3
    },
    wrongfulDeath: {
      statuteOfLimitations: 3
    },
    dogBite: {
      statuteOfLimitations: 3,
      strictLiability: false
    },
    wrongfulTermination: {
      statuteOfLimitations: 3
    },
    wageTheft: {
      statuteOfLimitations: 3
    },
    classAction: {
      statuteOfLimitations: 3
    },
    insuranceBadFaith: {
      statuteOfLimitations: 3
    },
    disability: {
      statuteOfLimitations: 3
    },
    professionalMalpractice: {
      statuteOfLimitations: 2,
      nonEconomicDamageCap: 500000
    },
    civilRights: {
      statuteOfLimitations: 3
    },
    intellectualProperty: {
      statuteOfLimitations: 3
    }
  },

  'MO': { // Missouri
    name: 'Missouri',
    negligenceSystem: NEGLIGENCE_TYPES.PURE_COMPARATIVE,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 1198,
      minWeeklyBenefit: 40,
      maxWeeksTTD: null,
      maxWeeksPPD: 400,
      waitingPeriod: 3,
      retroactivePeriod: 14,
      statuteOfLimitations: 2,
      impairmentGuide: 'AMA_6',
      choiceOfDoctor: false,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: 300000,
      burialAllowance: 5000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: 400000, // Non-catastrophic injuries
      punitiveDamageCap: 'lesserOf5xNetDamagesOr500k',
      statuteOfLimitations: 2
    },
    motorVehicle: {
      statuteOfLimitations: 5,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 5
    },
    productLiability: {
      statuteOfLimitations: 5
    },
    wrongfulDeath: {
      statuteOfLimitations: 3
    },
    dogBite: {
      statuteOfLimitations: 5,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 5
    },
    wageTheft: {
      statuteOfLimitations: 5
    },
    classAction: {
      statuteOfLimitations: 5
    },
    insuranceBadFaith: {
      statuteOfLimitations: 5
    },
    disability: {
      statuteOfLimitations: 5
    },
    professionalMalpractice: {
      statuteOfLimitations: 2,
      nonEconomicDamageCap: 400000
    },
    civilRights: {
      statuteOfLimitations: 5
    },
    intellectualProperty: {
      statuteOfLimitations: 5
    }
  },

  'MT': { // Montana
    name: 'Montana',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_51,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 911,
      minWeeklyBenefit: 228,
      maxWeeksTTD: null,
      maxWeeksPPD: 500,
      waitingPeriod: 4,
      retroactivePeriod: 21,
      statuteOfLimitations: 1,
      impairmentGuide: 'AMA_6',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: null,
      burialAllowance: 4000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: 250000,
      punitiveDamageCap: 'lesserOf3xCompensatoryOr10Million',
      statuteOfLimitations: 3
    },
    motorVehicle: {
      statuteOfLimitations: 3,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 3
    },
    productLiability: {
      statuteOfLimitations: 3
    },
    wrongfulDeath: {
      statuteOfLimitations: 3
    },
    dogBite: {
      statuteOfLimitations: 3,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 3
    },
    wageTheft: {
      statuteOfLimitations: 3
    },
    classAction: {
      statuteOfLimitations: 3
    },
    insuranceBadFaith: {
      statuteOfLimitations: 3
    },
    disability: {
      statuteOfLimitations: 3
    },
    professionalMalpractice: {
      statuteOfLimitations: 3,
      nonEconomicDamageCap: 250000
    },
    civilRights: {
      statuteOfLimitations: 3
    },
    intellectualProperty: {
      statuteOfLimitations: 3
    }
  },

  'NE': { // Nebraska
    name: 'Nebraska',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_51,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 1106,
      minWeeklyBenefit: 49,
      maxWeeksTTD: 300,
      maxWeeksPPD: 300,
      waitingPeriod: 7,
      retroactivePeriod: 42,
      statuteOfLimitations: 2,
      impairmentGuide: 'AMA_4',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: false,
      deathBenefitMax: 331800,
      burialAllowance: 10000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: 2250000,
      punitiveDamageCap: null,
      statuteOfLimitations: 2
    },
    motorVehicle: {
      statuteOfLimitations: 4,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 4
    },
    productLiability: {
      statuteOfLimitations: 4
    },
    wrongfulDeath: {
      statuteOfLimitations: 2
    },
    dogBite: {
      statuteOfLimitations: 4,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 4
    },
    wageTheft: {
      statuteOfLimitations: 4
    },
    classAction: {
      statuteOfLimitations: 4
    },
    insuranceBadFaith: {
      statuteOfLimitations: 4
    },
    disability: {
      statuteOfLimitations: 4
    },
    professionalMalpractice: {
      statuteOfLimitations: 2,
      nonEconomicDamageCap: 2250000
    },
    civilRights: {
      statuteOfLimitations: 4
    },
    intellectualProperty: {
      statuteOfLimitations: 4
    }
  },

  'NV': { // Nevada
    name: 'Nevada',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_51,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 1152,
      minWeeklyBenefit: 288,
      maxWeeksTTD: null,
      maxWeeksPPD: null,
      waitingPeriod: 5,
      retroactivePeriod: 20,
      statuteOfLimitations: 2,
      impairmentGuide: 'AMA_5',
      choiceOfDoctor: false,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: 300000,
      burialAllowance: 10000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: 350000,
      punitiveDamageCap: 'lesserOf3xCompensatoryOr300k',
      statuteOfLimitations: 3
    },
    motorVehicle: {
      statuteOfLimitations: 2,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 2
    },
    productLiability: {
      statuteOfLimitations: 2
    },
    wrongfulDeath: {
      statuteOfLimitations: 2
    },
    dogBite: {
      statuteOfLimitations: 2,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 2
    },
    wageTheft: {
      statuteOfLimitations: 2
    },
    classAction: {
      statuteOfLimitations: 4
    },
    insuranceBadFaith: {
      statuteOfLimitations: 4
    },
    disability: {
      statuteOfLimitations: 2
    },
    professionalMalpractice: {
      statuteOfLimitations: 3,
      nonEconomicDamageCap: 350000
    },
    civilRights: {
      statuteOfLimitations: 2
    },
    intellectualProperty: {
      statuteOfLimitations: 3
    }
  },

  'NH': { // New Hampshire
    name: 'New Hampshire',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_51,
    workersCompensation: {
      ttdRate: 0.60,
      tpdRate: 0.60,
      ppdRate: 0.60,
      ptdRate: 0.60,
      maxWeeklyBenefit: 1932,
      minWeeklyBenefit: 217,
      maxWeeksTTD: null,
      maxWeeksPPD: null,
      waitingPeriod: 3,
      retroactivePeriod: 14,
      statuteOfLimitations: 2,
      impairmentGuide: 'AMA_5',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: null,
      burialAllowance: 12000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: null,
      punitiveDamageCap: null,
      statuteOfLimitations: 3
    },
    motorVehicle: {
      statuteOfLimitations: 3,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 3
    },
    productLiability: {
      statuteOfLimitations: 3
    },
    wrongfulDeath: {
      statuteOfLimitations: 3
    },
    dogBite: {
      statuteOfLimitations: 3,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 3
    },
    wageTheft: {
      statuteOfLimitations: 3
    },
    classAction: {
      statuteOfLimitations: 3
    },
    insuranceBadFaith: {
      statuteOfLimitations: 3
    },
    disability: {
      statuteOfLimitations: 3
    },
    professionalMalpractice: {
      statuteOfLimitations: 3
    },
    civilRights: {
      statuteOfLimitations: 3
    },
    intellectualProperty: {
      statuteOfLimitations: 3
    }
  },

  'NJ': { // New Jersey
    name: 'New Jersey',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_51,
    workersCompensation: {
      ttdRate: 0.70,
      tpdRate: 0.70,
      ppdRate: 0.70,
      ptdRate: 0.70,
      maxWeeklyBenefit: 1099,
      minWeeklyBenefit: 275,
      maxWeeksTTD: 400,
      maxWeeksPPD: 600,
      waitingPeriod: 7,
      retroactivePeriod: 7,
      statuteOfLimitations: 2,
      impairmentGuide: 'NJ_SCHEDULE',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: null,
      burialAllowance: 3500
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: null,
      punitiveDamageCap: 'greaterOf5xCompensatoryOr350k',
      statuteOfLimitations: 2
    },
    motorVehicle: {
      statuteOfLimitations: 2,
      noFaultState: true // Choice no-fault
    },
    premises: {
      statuteOfLimitations: 2
    },
    productLiability: {
      statuteOfLimitations: 2
    },
    wrongfulDeath: {
      statuteOfLimitations: 2
    },
    dogBite: {
      statuteOfLimitations: 2,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 2
    },
    wageTheft: {
      statuteOfLimitations: 6
    },
    classAction: {
      statuteOfLimitations: 6
    },
    insuranceBadFaith: {
      statuteOfLimitations: 6
    },
    disability: {
      statuteOfLimitations: 2
    },
    professionalMalpractice: {
      statuteOfLimitations: 2
    },
    civilRights: {
      statuteOfLimitations: 2
    },
    intellectualProperty: {
      statuteOfLimitations: 6
    }
  },

  'NM': { // New Mexico
    name: 'New Mexico',
    negligenceSystem: NEGLIGENCE_TYPES.PURE_COMPARATIVE,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 901,
      minWeeklyBenefit: 45,
      maxWeeksTTD: 700,
      maxWeeksPPD: 500,
      waitingPeriod: 7,
      retroactivePeriod: 28,
      statuteOfLimitations: 1,
      impairmentGuide: 'AMA_5',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: 150000,
      burialAllowance: 7500
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: 600000,
      punitiveDamageCap: null,
      statuteOfLimitations: 3
    },
    motorVehicle: {
      statuteOfLimitations: 3,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 3
    },
    productLiability: {
      statuteOfLimitations: 3
    },
    wrongfulDeath: {
      statuteOfLimitations: 3
    },
    dogBite: {
      statuteOfLimitations: 3,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 3
    },
    wageTheft: {
      statuteOfLimitations: 4
    },
    classAction: {
      statuteOfLimitations: 4
    },
    insuranceBadFaith: {
      statuteOfLimitations: 4
    },
    disability: {
      statuteOfLimitations: 3
    },
    professionalMalpractice: {
      statuteOfLimitations: 3,
      nonEconomicDamageCap: 600000
    },
    civilRights: {
      statuteOfLimitations: 3
    },
    intellectualProperty: {
      statuteOfLimitations: 4
    }
  },

  'NY': { // New York
    name: 'New York',
    negligenceSystem: NEGLIGENCE_TYPES.PURE_COMPARATIVE,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 1145,
      minWeeklyBenefit: 275,
      maxWeeksTTD: null,
      maxWeeksPPD: null,
      waitingPeriod: 7,
      retroactivePeriod: 14,
      statuteOfLimitations: 2,
      impairmentGuide: 'NY_SCHEDULE',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: null,
      burialAllowance: 12500
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: null,
      punitiveDamageCap: null,
      statuteOfLimitations: 2.5 // 2 years 6 months
    },
    motorVehicle: {
      statuteOfLimitations: 3,
      noFaultState: true // PIP state
    },
    premises: {
      statuteOfLimitations: 3
    },
    productLiability: {
      statuteOfLimitations: 3
    },
    wrongfulDeath: {
      statuteOfLimitations: 2
    },
    dogBite: {
      statuteOfLimitations: 3,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 3
    },
    wageTheft: {
      statuteOfLimitations: 6
    },
    classAction: {
      statuteOfLimitations: 3
    },
    insuranceBadFaith: {
      statuteOfLimitations: 6
    },
    disability: {
      statuteOfLimitations: 3
    },
    professionalMalpractice: {
      statuteOfLimitations: 2.5
    },
    civilRights: {
      statuteOfLimitations: 3
    },
    intellectualProperty: {
      statuteOfLimitations: 3
    }
  },

  'NC': { // North Carolina
    name: 'North Carolina',
    negligenceSystem: NEGLIGENCE_TYPES.CONTRIBUTORY,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 1254,
      minWeeklyBenefit: 30,
      maxWeeksTTD: 500,
      maxWeeksPPD: 500,
      waitingPeriod: 7,
      retroactivePeriod: 21,
      statuteOfLimitations: 2,
      impairmentGuide: 'NC_SCHEDULE',
      choiceOfDoctor: false,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: 500000,
      burialAllowance: 10000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: 500000,
      punitiveDamageCap: 'greaterOf3xCompensatoryOr250k',
      statuteOfLimitations: 3
    },
    motorVehicle: {
      statuteOfLimitations: 3,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 3
    },
    productLiability: {
      statuteOfLimitations: 3
    },
    wrongfulDeath: {
      statuteOfLimitations: 2
    },
    dogBite: {
      statuteOfLimitations: 3,
      strictLiability: false
    },
    wrongfulTermination: {
      statuteOfLimitations: 3
    },
    wageTheft: {
      statuteOfLimitations: 2
    },
    classAction: {
      statuteOfLimitations: 3
    },
    insuranceBadFaith: {
      statuteOfLimitations: 3
    },
    disability: {
      statuteOfLimitations: 3
    },
    professionalMalpractice: {
      statuteOfLimitations: 3,
      nonEconomicDamageCap: 500000
    },
    civilRights: {
      statuteOfLimitations: 3
    },
    intellectualProperty: {
      statuteOfLimitations: 3
    }
  },

  'ND': { // North Dakota
    name: 'North Dakota',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_50,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 1223,
      minWeeklyBenefit: 245,
      maxWeeksTTD: null,
      maxWeeksPPD: 312,
      waitingPeriod: 5,
      retroactivePeriod: 5,
      statuteOfLimitations: 2,
      impairmentGuide: 'AMA_5',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: false,
      deathBenefitMax: null,
      burialAllowance: 10000,
      monopolisticStateFund: true
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: 500000,
      punitiveDamageCap: 'greaterOf2xCompensatoryOr250k',
      statuteOfLimitations: 2
    },
    motorVehicle: {
      statuteOfLimitations: 6,
      noFaultState: true // PIP state
    },
    premises: {
      statuteOfLimitations: 6
    },
    productLiability: {
      statuteOfLimitations: 6
    },
    wrongfulDeath: {
      statuteOfLimitations: 2
    },
    dogBite: {
      statuteOfLimitations: 6,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 6
    },
    wageTheft: {
      statuteOfLimitations: 6
    },
    classAction: {
      statuteOfLimitations: 6
    },
    insuranceBadFaith: {
      statuteOfLimitations: 6
    },
    disability: {
      statuteOfLimitations: 6
    },
    professionalMalpractice: {
      statuteOfLimitations: 2,
      nonEconomicDamageCap: 500000
    },
    civilRights: {
      statuteOfLimitations: 6
    },
    intellectualProperty: {
      statuteOfLimitations: 6
    }
  },

  'OH': { // Ohio
    name: 'Ohio',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_51,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 1127,
      minWeeklyBenefit: 282,
      maxWeeksTTD: 200,
      maxWeeksPPD: null,
      waitingPeriod: 7,
      retroactivePeriod: 14,
      statuteOfLimitations: 2,
      impairmentGuide: 'AMA_5',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: false,
      deathBenefitMax: null,
      burialAllowance: 9500,
      monopolisticStateFund: true
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: 'lesserOf250kOr3xEconomic', // Max $350k-$500k
      punitiveDamageCap: '2xCompensatory',
      statuteOfLimitations: 1
    },
    motorVehicle: {
      statuteOfLimitations: 2,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 2
    },
    productLiability: {
      statuteOfLimitations: 2
    },
    wrongfulDeath: {
      statuteOfLimitations: 2
    },
    dogBite: {
      statuteOfLimitations: 2,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 2
    },
    wageTheft: {
      statuteOfLimitations: 6
    },
    classAction: {
      statuteOfLimitations: 4
    },
    insuranceBadFaith: {
      statuteOfLimitations: 6
    },
    disability: {
      statuteOfLimitations: 2
    },
    professionalMalpractice: {
      statuteOfLimitations: 1,
      nonEconomicDamageCap: 'lesserOf250kOr3xEconomic'
    },
    civilRights: {
      statuteOfLimitations: 2
    },
    intellectualProperty: {
      statuteOfLimitations: 4
    }
  },

  'OK': { // Oklahoma
    name: 'Oklahoma',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_51,
    workersCompensation: {
      ttdRate: 0.70,
      tpdRate: 0.70,
      ppdRate: 0.70,
      ptdRate: 0.70,
      maxWeeklyBenefit: 1098,
      minWeeklyBenefit: 220,
      maxWeeksTTD: 156,
      maxWeeksPPD: 350,
      waitingPeriod: 3,
      retroactivePeriod: 7,
      statuteOfLimitations: 2,
      impairmentGuide: 'AMA_5',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: 200000,
      burialAllowance: 10000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: 350000,
      punitiveDamageCap: 'greaterOf100kOr2xActualDamages',
      statuteOfLimitations: 2
    },
    motorVehicle: {
      statuteOfLimitations: 2,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 2
    },
    productLiability: {
      statuteOfLimitations: 2
    },
    wrongfulDeath: {
      statuteOfLimitations: 2
    },
    dogBite: {
      statuteOfLimitations: 2,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 2
    },
    wageTheft: {
      statuteOfLimitations: 2
    },
    classAction: {
      statuteOfLimitations: 2
    },
    insuranceBadFaith: {
      statuteOfLimitations: 5
    },
    disability: {
      statuteOfLimitations: 2
    },
    professionalMalpractice: {
      statuteOfLimitations: 2,
      nonEconomicDamageCap: 350000
    },
    civilRights: {
      statuteOfLimitations: 2
    },
    intellectualProperty: {
      statuteOfLimitations: 3
    }
  },

  'OR': { // Oregon
    name: 'Oregon',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_51,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 1904,
      minWeeklyBenefit: 254,
      maxWeeksTTD: null,
      maxWeeksPPD: 320,
      waitingPeriod: 3,
      retroactivePeriod: 14,
      statuteOfLimitations: 1,
      impairmentGuide: 'AMA_5',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: null,
      burialAllowance: 10000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: 500000,
      punitiveDamageCap: null,
      statuteOfLimitations: 2
    },
    motorVehicle: {
      statuteOfLimitations: 2,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 2
    },
    productLiability: {
      statuteOfLimitations: 2
    },
    wrongfulDeath: {
      statuteOfLimitations: 3,
      nonEconomicDamageCap: 500000
    },
    dogBite: {
      statuteOfLimitations: 2,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 1
    },
    wageTheft: {
      statuteOfLimitations: 2
    },
    classAction: {
      statuteOfLimitations: 2
    },
    insuranceBadFaith: {
      statuteOfLimitations: 6
    },
    disability: {
      statuteOfLimitations: 2
    },
    professionalMalpractice: {
      statuteOfLimitations: 2,
      nonEconomicDamageCap: 500000
    },
    civilRights: {
      statuteOfLimitations: 2
    },
    intellectualProperty: {
      statuteOfLimitations: 6
    }
  },

  'PA': { // Pennsylvania
    name: 'Pennsylvania',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_51,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 1325,
      minWeeklyBenefit: 331,
      maxWeeksTTD: 104,
      maxWeeksPPD: 500,
      waitingPeriod: 7,
      retroactivePeriod: 14,
      statuteOfLimitations: 3,
      impairmentGuide: 'AMA_6',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: null,
      burialAllowance: 7000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: null, // Caps ruled unconstitutional
      punitiveDamageCap: null,
      statuteOfLimitations: 2
    },
    motorVehicle: {
      statuteOfLimitations: 2,
      noFaultState: true // Choice no-fault
    },
    premises: {
      statuteOfLimitations: 2
    },
    productLiability: {
      statuteOfLimitations: 2
    },
    wrongfulDeath: {
      statuteOfLimitations: 2
    },
    dogBite: {
      statuteOfLimitations: 2,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 4
    },
    wageTheft: {
      statuteOfLimitations: 3
    },
    classAction: {
      statuteOfLimitations: 4
    },
    insuranceBadFaith: {
      statuteOfLimitations: 4
    },
    disability: {
      statuteOfLimitations: 2
    },
    professionalMalpractice: {
      statuteOfLimitations: 2
    },
    civilRights: {
      statuteOfLimitations: 2
    },
    intellectualProperty: {
      statuteOfLimitations: 4
    }
  },

  'RI': { // Rhode Island
    name: 'Rhode Island',
    negligenceSystem: NEGLIGENCE_TYPES.PURE_COMPARATIVE,
    workersCompensation: {
      ttdRate: 0.75,
      tpdRate: 0.75,
      ppdRate: 0.75,
      ptdRate: 0.75,
      maxWeeklyBenefit: 1346,
      minWeeklyBenefit: 134,
      maxWeeksTTD: 312,
      maxWeeksPPD: 500,
      waitingPeriod: 3,
      retroactivePeriod: 10,
      statuteOfLimitations: 2,
      impairmentGuide: 'AMA_5',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: null,
      burialAllowance: 15000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: null,
      punitiveDamageCap: null,
      statuteOfLimitations: 3
    },
    motorVehicle: {
      statuteOfLimitations: 3,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 3
    },
    productLiability: {
      statuteOfLimitations: 3
    },
    wrongfulDeath: {
      statuteOfLimitations: 3
    },
    dogBite: {
      statuteOfLimitations: 3,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 3
    },
    wageTheft: {
      statuteOfLimitations: 3
    },
    classAction: {
      statuteOfLimitations: 3
    },
    insuranceBadFaith: {
      statuteOfLimitations: 3
    },
    disability: {
      statuteOfLimitations: 3
    },
    professionalMalpractice: {
      statuteOfLimitations: 3
    },
    civilRights: {
      statuteOfLimitations: 3
    },
    intellectualProperty: {
      statuteOfLimitations: 3
    }
  },

  'SC': { // South Carolina
    name: 'South Carolina',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_51,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 1022,
      minWeeklyBenefit: 75,
      maxWeeksTTD: 500,
      maxWeeksPPD: 500,
      waitingPeriod: 7,
      retroactivePeriod: 14,
      statuteOfLimitations: 2,
      impairmentGuide: 'AMA_6',
      choiceOfDoctor: false,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: 500000,
      burialAllowance: 2500
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: 350000, // Per defendant
      punitiveDamageCap: 'lesserOf3xCompensatoryOr500k',
      statuteOfLimitations: 3
    },
    motorVehicle: {
      statuteOfLimitations: 3,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 3
    },
    productLiability: {
      statuteOfLimitations: 3
    },
    wrongfulDeath: {
      statuteOfLimitations: 3
    },
    dogBite: {
      statuteOfLimitations: 3,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 3
    },
    wageTheft: {
      statuteOfLimitations: 3
    },
    classAction: {
      statuteOfLimitations: 3
    },
    insuranceBadFaith: {
      statuteOfLimitations: 3
    },
    disability: {
      statuteOfLimitations: 3
    },
    professionalMalpractice: {
      statuteOfLimitations: 3,
      nonEconomicDamageCap: 350000
    },
    civilRights: {
      statuteOfLimitations: 3
    },
    intellectualProperty: {
      statuteOfLimitations: 3
    }
  },

  'SD': { // South Dakota
    name: 'South Dakota',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_51,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 902,
      minWeeklyBenefit: 451,
      maxWeeksTTD: null,
      maxWeeksPPD: 312,
      waitingPeriod: 7,
      retroactivePeriod: 7,
      statuteOfLimitations: 2,
      impairmentGuide: 'AMA_5',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: false,
      deathBenefitMax: 140400,
      burialAllowance: 10000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: 500000,
      punitiveDamageCap: 'lesserOf3xCompensatoryOr500k',
      statuteOfLimitations: 2
    },
    motorVehicle: {
      statuteOfLimitations: 3,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 3
    },
    productLiability: {
      statuteOfLimitations: 3
    },
    wrongfulDeath: {
      statuteOfLimitations: 3
    },
    dogBite: {
      statuteOfLimitations: 3,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 6
    },
    wageTheft: {
      statuteOfLimitations: 6
    },
    classAction: {
      statuteOfLimitations: 6
    },
    insuranceBadFaith: {
      statuteOfLimitations: 6
    },
    disability: {
      statuteOfLimitations: 3
    },
    professionalMalpractice: {
      statuteOfLimitations: 2,
      nonEconomicDamageCap: 500000
    },
    civilRights: {
      statuteOfLimitations: 3
    },
    intellectualProperty: {
      statuteOfLimitations: 6
    }
  },

  'TN': { // Tennessee
    name: 'Tennessee',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_50,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 1227,
      minWeeklyBenefit: 123,
      maxWeeksTTD: 450,
      maxWeeksPPD: 450,
      waitingPeriod: 7,
      retroactivePeriod: 14,
      statuteOfLimitations: 1,
      impairmentGuide: 'AMA_6',
      choiceOfDoctor: false,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: 200000,
      burialAllowance: 10000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: 750000, // $1M for catastrophic
      punitiveDamageCap: 'lesserOf2xCompensatoryOr500k',
      statuteOfLimitations: 1
    },
    motorVehicle: {
      statuteOfLimitations: 1,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 1
    },
    productLiability: {
      statuteOfLimitations: 1
    },
    wrongfulDeath: {
      statuteOfLimitations: 1
    },
    dogBite: {
      statuteOfLimitations: 1,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 1
    },
    wageTheft: {
      statuteOfLimitations: 1
    },
    classAction: {
      statuteOfLimitations: 1
    },
    insuranceBadFaith: {
      statuteOfLimitations: 1
    },
    disability: {
      statuteOfLimitations: 1
    },
    professionalMalpractice: {
      statuteOfLimitations: 1,
      nonEconomicDamageCap: 750000
    },
    civilRights: {
      statuteOfLimitations: 1
    },
    intellectualProperty: {
      statuteOfLimitations: 3
    }
  },

  'TX': { // Texas
    name: 'Texas',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_51,
    workersCompensation: {
      ttdRate: 0.70,
      tpdRate: 0.70,
      ppdRate: 0.70,
      ptdRate: 0.70,
      maxWeeklyBenefit: 1147,
      minWeeklyBenefit: 172,
      maxWeeksTTD: 104,
      maxWeeksPPD: 401,
      waitingPeriod: 7,
      retroactivePeriod: 14,
      statuteOfLimitations: 1,
      impairmentGuide: 'AMA_5',
      choiceOfDoctor: false,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: 200000,
      burialAllowance: 10000,
      nonSubscriberState: true
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: 250000, // Per physician, $500k per facility
      punitiveDamageCap: 'lesserOf2xEconomicPlus750kNonEconomicOr750k',
      statuteOfLimitations: 2
    },
    motorVehicle: {
      statuteOfLimitations: 2,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 2
    },
    productLiability: {
      statuteOfLimitations: 2
    },
    wrongfulDeath: {
      statuteOfLimitations: 2
    },
    dogBite: {
      statuteOfLimitations: 2,
      strictLiability: false // One-bite rule
    },
    wrongfulTermination: {
      statuteOfLimitations: 4
    },
    wageTheft: {
      statuteOfLimitations: 2
    },
    classAction: {
      statuteOfLimitations: 4
    },
    insuranceBadFaith: {
      statuteOfLimitations: 4
    },
    disability: {
      statuteOfLimitations: 2
    },
    professionalMalpractice: {
      statuteOfLimitations: 2,
      nonEconomicDamageCap: 250000
    },
    civilRights: {
      statuteOfLimitations: 2
    },
    intellectualProperty: {
      statuteOfLimitations: 4
    }
  },

  'UT': { // Utah
    name: 'Utah',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_50,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 1130,
      minWeeklyBenefit: 45,
      maxWeeksTTD: 312,
      maxWeeksPPD: 312,
      waitingPeriod: 3,
      retroactivePeriod: 14,
      statuteOfLimitations: 1,
      impairmentGuide: 'AMA_5',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: 200000,
      burialAllowance: 8500
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: 450000,
      punitiveDamageCap: null,
      statuteOfLimitations: 2
    },
    motorVehicle: {
      statuteOfLimitations: 4,
      noFaultState: true // PIP state
    },
    premises: {
      statuteOfLimitations: 4
    },
    productLiability: {
      statuteOfLimitations: 4
    },
    wrongfulDeath: {
      statuteOfLimitations: 2
    },
    dogBite: {
      statuteOfLimitations: 4,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 4
    },
    wageTheft: {
      statuteOfLimitations: 4
    },
    classAction: {
      statuteOfLimitations: 4
    },
    insuranceBadFaith: {
      statuteOfLimitations: 6
    },
    disability: {
      statuteOfLimitations: 4
    },
    professionalMalpractice: {
      statuteOfLimitations: 2,
      nonEconomicDamageCap: 450000
    },
    civilRights: {
      statuteOfLimitations: 4
    },
    intellectualProperty: {
      statuteOfLimitations: 3
    }
  },

  'VT': { // Vermont
    name: 'Vermont',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_51,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 1498,
      minWeeklyBenefit: 375,
      maxWeeksTTD: null,
      maxWeeksPPD: 330,
      waitingPeriod: 3,
      retroactivePeriod: 7,
      statuteOfLimitations: 6,
      impairmentGuide: 'AMA_5',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: null,
      burialAllowance: 10000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: null,
      punitiveDamageCap: null,
      statuteOfLimitations: 3
    },
    motorVehicle: {
      statuteOfLimitations: 3,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 3
    },
    productLiability: {
      statuteOfLimitations: 3
    },
    wrongfulDeath: {
      statuteOfLimitations: 2
    },
    dogBite: {
      statuteOfLimitations: 3,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 3
    },
    wageTheft: {
      statuteOfLimitations: 6
    },
    classAction: {
      statuteOfLimitations: 6
    },
    insuranceBadFaith: {
      statuteOfLimitations: 6
    },
    disability: {
      statuteOfLimitations: 3
    },
    professionalMalpractice: {
      statuteOfLimitations: 3
    },
    civilRights: {
      statuteOfLimitations: 3
    },
    intellectualProperty: {
      statuteOfLimitations: 3
    }
  },

  'VA': { // Virginia
    name: 'Virginia',
    negligenceSystem: NEGLIGENCE_TYPES.CONTRIBUTORY,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 1426,
      minWeeklyBenefit: 285,
      maxWeeksTTD: 500,
      maxWeeksPPD: 500,
      waitingPeriod: 7,
      retroactivePeriod: 21,
      statuteOfLimitations: 2,
      impairmentGuide: 'AMA_5',
      choiceOfDoctor: false,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: 500000,
      burialAllowance: 10000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: 2500000, // Adjusted annually
      punitiveDamageCap: 350000,
      statuteOfLimitations: 2
    },
    motorVehicle: {
      statuteOfLimitations: 2,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 2
    },
    productLiability: {
      statuteOfLimitations: 2
    },
    wrongfulDeath: {
      statuteOfLimitations: 2,
      nonEconomicDamageCap: 2500000
    },
    dogBite: {
      statuteOfLimitations: 2,
      strictLiability: false
    },
    wrongfulTermination: {
      statuteOfLimitations: 2
    },
    wageTheft: {
      statuteOfLimitations: 3
    },
    classAction: {
      statuteOfLimitations: 2
    },
    insuranceBadFaith: {
      statuteOfLimitations: 2
    },
    disability: {
      statuteOfLimitations: 2
    },
    professionalMalpractice: {
      statuteOfLimitations: 2,
      nonEconomicDamageCap: 2500000
    },
    civilRights: {
      statuteOfLimitations: 2
    },
    intellectualProperty: {
      statuteOfLimitations: 5
    }
  },

  'WA': { // Washington
    name: 'Washington',
    negligenceSystem: NEGLIGENCE_TYPES.PURE_COMPARATIVE,
    workersCompensation: {
      ttdRate: 0.60,
      tpdRate: 0.60,
      ppdRate: 0.60,
      ptdRate: 0.60,
      maxWeeklyBenefit: 1739,
      minWeeklyBenefit: 326,
      maxWeeksTTD: null,
      maxWeeksPPD: null,
      waitingPeriod: 3,
      retroactivePeriod: 14,
      statuteOfLimitations: 1,
      impairmentGuide: 'WA_SCHEDULE',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: false,
      deathBenefitMax: null,
      burialAllowance: 11600,
      monopolisticStateFund: true
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: null,
      punitiveDamageCap: null,
      statuteOfLimitations: 3
    },
    motorVehicle: {
      statuteOfLimitations: 3,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 3
    },
    productLiability: {
      statuteOfLimitations: 3
    },
    wrongfulDeath: {
      statuteOfLimitations: 3
    },
    dogBite: {
      statuteOfLimitations: 3,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 3
    },
    wageTheft: {
      statuteOfLimitations: 3
    },
    classAction: {
      statuteOfLimitations: 3
    },
    insuranceBadFaith: {
      statuteOfLimitations: 3
    },
    disability: {
      statuteOfLimitations: 3
    },
    professionalMalpractice: {
      statuteOfLimitations: 3
    },
    civilRights: {
      statuteOfLimitations: 3
    },
    intellectualProperty: {
      statuteOfLimitations: 3
    }
  },

  'WV': { // West Virginia
    name: 'West Virginia',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_51,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 1008,
      minWeeklyBenefit: 336,
      maxWeeksTTD: 104,
      maxWeeksPPD: 288,
      waitingPeriod: 3,
      retroactivePeriod: 7,
      statuteOfLimitations: 2,
      impairmentGuide: 'AMA_4',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: null,
      burialAllowance: 5400
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: 250000, // $500k for wrongful death/permanent injury
      punitiveDamageCap: null,
      statuteOfLimitations: 2
    },
    motorVehicle: {
      statuteOfLimitations: 2,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 2
    },
    productLiability: {
      statuteOfLimitations: 2
    },
    wrongfulDeath: {
      statuteOfLimitations: 2,
      nonEconomicDamageCap: 500000
    },
    dogBite: {
      statuteOfLimitations: 2,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 2
    },
    wageTheft: {
      statuteOfLimitations: 5
    },
    classAction: {
      statuteOfLimitations: 5
    },
    insuranceBadFaith: {
      statuteOfLimitations: 2
    },
    disability: {
      statuteOfLimitations: 2
    },
    professionalMalpractice: {
      statuteOfLimitations: 2,
      nonEconomicDamageCap: 250000
    },
    civilRights: {
      statuteOfLimitations: 2
    },
    intellectualProperty: {
      statuteOfLimitations: 5
    }
  },

  'WI': { // Wisconsin
    name: 'Wisconsin',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_51,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 1424,
      minWeeklyBenefit: 30,
      maxWeeksTTD: null,
      maxWeeksPPD: 1000,
      waitingPeriod: 3,
      retroactivePeriod: 7,
      statuteOfLimitations: 2,
      impairmentGuide: 'WI_SCHEDULE',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: null,
      burialAllowance: 10000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: 750000,
      punitiveDamageCap: '2xCompensatoryOr200k',
      statuteOfLimitations: 3
    },
    motorVehicle: {
      statuteOfLimitations: 3,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 3
    },
    productLiability: {
      statuteOfLimitations: 3
    },
    wrongfulDeath: {
      statuteOfLimitations: 3
    },
    dogBite: {
      statuteOfLimitations: 3,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 6
    },
    wageTheft: {
      statuteOfLimitations: 6
    },
    classAction: {
      statuteOfLimitations: 6
    },
    insuranceBadFaith: {
      statuteOfLimitations: 6
    },
    disability: {
      statuteOfLimitations: 3
    },
    professionalMalpractice: {
      statuteOfLimitations: 3,
      nonEconomicDamageCap: 750000
    },
    civilRights: {
      statuteOfLimitations: 6
    },
    intellectualProperty: {
      statuteOfLimitations: 6
    }
  },

  'WY': { // Wyoming
    name: 'Wyoming',
    negligenceSystem: NEGLIGENCE_TYPES.MODIFIED_COMPARATIVE_51,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 1060,
      minWeeklyBenefit: 265,
      maxWeeksTTD: null,
      maxWeeksPPD: null,
      waitingPeriod: 3,
      retroactivePeriod: 8,
      statuteOfLimitations: 1,
      impairmentGuide: 'AMA_5',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: false,
      deathBenefitMax: null,
      burialAllowance: 5000,
      monopolisticStateFund: true
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: null,
      punitiveDamageCap: null,
      statuteOfLimitations: 2
    },
    motorVehicle: {
      statuteOfLimitations: 4,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 4
    },
    productLiability: {
      statuteOfLimitations: 4
    },
    wrongfulDeath: {
      statuteOfLimitations: 2
    },
    dogBite: {
      statuteOfLimitations: 4,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 4
    },
    wageTheft: {
      statuteOfLimitations: 4
    },
    classAction: {
      statuteOfLimitations: 4
    },
    insuranceBadFaith: {
      statuteOfLimitations: 4
    },
    disability: {
      statuteOfLimitations: 4
    },
    professionalMalpractice: {
      statuteOfLimitations: 2
    },
    civilRights: {
      statuteOfLimitations: 4
    },
    intellectualProperty: {
      statuteOfLimitations: 4
    }
  },

  // Washington D.C.
  'DC': {
    name: 'Washington D.C.',
    negligenceSystem: NEGLIGENCE_TYPES.PURE_COMPARATIVE,
    workersCompensation: {
      ttdRate: 0.6667,
      tpdRate: 0.6667,
      ppdRate: 0.6667,
      ptdRate: 0.6667,
      maxWeeklyBenefit: 1881,
      minWeeklyBenefit: 470,
      maxWeeksTTD: null,
      maxWeeksPPD: 500,
      waitingPeriod: 3,
      retroactivePeriod: 14,
      statuteOfLimitations: 1,
      impairmentGuide: 'AMA_5',
      choiceOfDoctor: true,
      exclusiveRemedy: true,
      secondInjuryFund: true,
      deathBenefitMax: null,
      burialAllowance: 5000
    },
    medicalMalpractice: {
      economicDamageCap: null,
      nonEconomicDamageCap: null,
      punitiveDamageCap: null,
      statuteOfLimitations: 3
    },
    motorVehicle: {
      statuteOfLimitations: 3,
      noFaultState: false
    },
    premises: {
      statuteOfLimitations: 3
    },
    productLiability: {
      statuteOfLimitations: 3
    },
    wrongfulDeath: {
      statuteOfLimitations: 2
    },
    dogBite: {
      statuteOfLimitations: 3,
      strictLiability: true
    },
    wrongfulTermination: {
      statuteOfLimitations: 1
    },
    wageTheft: {
      statuteOfLimitations: 3
    },
    classAction: {
      statuteOfLimitations: 3
    },
    insuranceBadFaith: {
      statuteOfLimitations: 3
    },
    disability: {
      statuteOfLimitations: 1
    },
    professionalMalpractice: {
      statuteOfLimitations: 3
    },
    civilRights: {
      statuteOfLimitations: 1
    },
    intellectualProperty: {
      statuteOfLimitations: 3
    }
  }
};

/**
 * State name to code mapping
 */
const STATE_NAME_TO_CODE = {
  'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
  'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
  'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
  'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
  'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
  'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
  'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
  'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
  'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
  'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
  'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
  'Wisconsin': 'WI', 'Wyoming': 'WY', 'Washington D.C.': 'DC'
};

/**
 * Helper function to get state rules for a specific case type
 * @param {string} state - State name or two-letter code (e.g., 'Texas' or 'TX')
 * @param {string} caseType - Case type identifier (e.g., 'medical', 'motor')
 * @returns {Object|null} - State-specific rules for the case type
 */
export const getStateRules = (state, caseType) => {
  if (!state || !caseType) return null;

  // Convert state name to code if needed
  let stateCode = state;
  if (state.length > 2) {
    stateCode = STATE_NAME_TO_CODE[state];
    if (!stateCode) return null;
  }

  const stateData = STATE_LEGAL_DATABASE[stateCode.toUpperCase()];
  if (!stateData) return null;

  // Map case type to database keys
  const caseTypeMap = {
    'motor': 'motorVehicle',
    'medical': 'medicalMalpractice',
    'premises': 'premises',
    'product': 'productLiability',
    'wrongful_death': 'wrongfulDeath',
    'dog_bite': 'dogBite',
    'wrongful_term': 'wrongfulTermination',
    'wage': 'wageTheft',
    'class_action': 'classAction',
    'insurance': 'insuranceBadFaith',
    'disability': 'disability',
    'professional': 'professionalMalpractice',
    'civil_rights': 'civilRights',
    'ip': 'intellectualProperty',
    'workers_comp': 'workersCompensation'
  };

  const dbKey = caseTypeMap[caseType];
  if (!dbKey) return null;

  return {
    ...stateData[dbKey],
    stateName: stateData.name,
    negligenceSystem: stateData.negligenceSystem
  };
};
