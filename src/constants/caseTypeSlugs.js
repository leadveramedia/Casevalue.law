/**
 * Case type slug mapping for clean /calculator/:slug URLs
 * Maps URL-friendly slugs to internal case type IDs and vice versa.
 */

export const caseSlugToId = {
  'motor-vehicle-accident': 'motor',
  'medical-malpractice': 'medical',
  'premises-liability': 'premises',
  'product-liability': 'product',
  'wrongful-death': 'wrongful_death',
  'dog-bite': 'dog_bite',
  'wrongful-termination': 'wrongful_term',
  'wage-and-hour': 'wage',
  'class-action': 'class_action',
  'insurance-bad-faith': 'insurance',
  'disability-denial': 'disability',
  'professional-malpractice': 'professional',
  'civil-rights': 'civil_rights',
  'intellectual-property': 'ip',
  'workers-compensation': 'workers_comp',
};

// Reverse mapping: case type ID → URL slug
export const caseIdToSlug = Object.fromEntries(
  Object.entries(caseSlugToId).map(([slug, id]) => [id, slug])
);

// SEO metadata for each practice area calculator page
export const caseTypeSEO = {
  motor: {
    title: "Motor Vehicle Accident Settlement Calculator | Free Case Value Estimate",
    description: "Calculate the value of your motor vehicle accident case. Get an instant, free estimate based on your injuries, medical bills, and state laws.",
  },
  medical: {
    title: "Medical Malpractice Case Value Calculator | Free Estimate",
    description: "Find out what your medical malpractice case is worth. Free calculator estimates your case value based on injuries, treatment costs, and state laws.",
  },
  premises: {
    title: "Premises Liability Settlement Calculator | Slip and Fall Case Value",
    description: "Calculate your premises liability or slip and fall case value. Free instant estimate based on your injuries, property conditions, and state laws.",
  },
  product: {
    title: "Product Liability Case Value Calculator | Defective Product Claims",
    description: "Estimate the value of your product liability case. Free calculator for defective product injury claims based on your damages and state laws.",
  },
  wrongful_death: {
    title: "Wrongful Death Settlement Calculator | Free Case Value Estimate",
    description: "Calculate the estimated value of a wrongful death case. Free tool considers lost income, dependents, and state-specific wrongful death laws.",
  },
  dog_bite: {
    title: "Dog Bite Settlement Calculator | Animal Attack Case Value",
    description: "Find out what your dog bite or animal attack case is worth. Free calculator estimates compensation based on injuries and state liability laws.",
  },
  wrongful_term: {
    title: "Wrongful Termination Case Value Calculator | Free Estimate",
    description: "Calculate the value of your wrongful termination case. Free estimate based on lost wages, employment history, and state employment laws.",
  },
  wage: {
    title: "Wage & Hour Claim Calculator | Unpaid Wages Case Value",
    description: "Estimate the value of your wage and hour claim. Free calculator for unpaid wages, overtime violations, and state labor law claims.",
  },
  class_action: {
    title: "Class Action Lawsuit Calculator | Estimate Your Claim Value",
    description: "Estimate the value of your class action lawsuit participation. Free calculator based on class size, damages, and case type.",
  },
  insurance: {
    title: "Insurance Bad Faith Claim Calculator | Free Case Value Estimate",
    description: "Calculate the value of your insurance bad faith claim. Free estimate based on denied claims, policy details, and state insurance laws.",
  },
  disability: {
    title: "Disability Denial Case Value Calculator | Free Estimate",
    description: "Estimate the value of your disability denial case. Free calculator for Social Security disability, long-term disability, and benefits claims.",
  },
  professional: {
    title: "Professional Malpractice Calculator | Legal & Accounting Claims",
    description: "Calculate the value of your professional malpractice case. Free estimate for attorney, accountant, and other professional negligence claims.",
  },
  civil_rights: {
    title: "Civil Rights Violation Case Calculator | Free Claim Estimate",
    description: "Estimate the value of your civil rights violation case. Free calculator for discrimination, excessive force, and constitutional rights claims.",
  },
  ip: {
    title: "Intellectual Property Case Value Calculator | Patent & Trademark Claims",
    description: "Calculate the value of your intellectual property case. Free estimate for patent, trademark, copyright, and trade secret infringement claims.",
  },
  workers_comp: {
    title: "Workers' Compensation Calculator | Free Benefits Estimate",
    description: "Calculate your workers' compensation benefits. Free estimate based on injury type, wages, disability rating, and state-specific benefit rates.",
  },
};
