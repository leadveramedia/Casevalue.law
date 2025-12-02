/**
 * Question Configuration Constants
 * Placeholder values and help text for questionnaire fields
 */

export const QUESTION_PLACEHOLDERS = {
  medical_bills: '50000',
  lost_wages: '10000',
  insurance_coverage: '100000',
  months_unemployed: '6',
  months_unpaid: '12',
  months_delayed: '3',
  months_denied: '12',
  years_employed: '5',
  years_relationship: '3',
  years_life_expectancy: '20',
  years_infringement: '2',
  num_dependents: '2',
  num_employees_affected: '10',
  num_class_members: '100',
  duration_of_harm: '12',
  duration_of_violation: '6',
  victim_age: '35',
  product_name: 'e.g., iPhone 12 Pro, Toyota Camry, etc.',
};

export const QUESTION_HELP_TEXT = {
  medical_bills: 'Include hospital bills, doctor visits, medication, physical therapy, etc.',
  lost_wages: 'Include wages lost from missing work or reduced hours',
  insurance_coverage: 'If you know their insurance policy limits, enter it here',
  months_unemployed: 'Enter the number of months you were unemployed after termination',
  months_unpaid: 'Enter the number of months wages were unpaid',
  months_delayed: 'Enter the number of months the insurance payment was delayed',
  months_denied: 'Enter the number of months benefits were denied',
  years_employed: 'How many years were you employed at this company?',
  years_relationship: 'How long was your professional relationship (in years)?',
  years_life_expectancy: "Estimate the victim's remaining life expectancy in years",
  years_infringement: 'For how many years did the infringement occur?',
  num_dependents: 'How many people financially depended on the victim?',
  num_employees_affected: 'How many employees were affected by this issue?',
  num_class_members: 'Estimated number of people in the class action',
  duration_of_harm: 'For how many months did the harmful conduct continue?',
  duration_of_violation: 'For how many months did the violation continue?',
  victim_age: 'How old was the victim at the time of death?',
  incident_date: 'Select the date when the incident occurred. This helps determine if your case is within the statute of limitations.',
  product_name: 'Enter the specific name or model of the product that caused the injury',
};
