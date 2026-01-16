# CaseValue.law - Project Context

## Overview
Legal case valuation calculator for personal injury cases. Users select a case type, answer questions, and receive an estimated settlement value with detailed breakdown.

**Live site:** https://casevalue.law
**Languages:** English, Spanish, Chinese

---

## Tech Stack
- React 18 (CRA + CRACO)
- Tailwind CSS
- Custom i18n (no library)
- Static site (no backend)

---

## Directory Structure
```
src/
├── components/
│   ├── pages/           # Main pages (Questionnaire, ResultsPage, Blog, etc.)
│   ├── ui/              # Reusable components (buttons, inputs, modals)
│   └── layout/          # Header, Footer, Layout wrappers
├── constants/
│   ├── caseTypes.js     # Case type definitions + option arrays
│   ├── stateLegalDatabase.js  # State-specific legal rules (all 50 states)
│   └── questionConfig.js      # Question placeholders/hints
├── hooks/
│   └── useAppNavigation.js    # App flow state machine
├── translations/
│   ├── ui-en.js, ui-es.js, ui-zh.js   # UI strings (questions, options, labels)
│   └── en.js, es.js, zh.js            # Help text (long-form explanations)
├── utils/
│   ├── getQuestions.js       # Question sets per case type
│   ├── calculateValuation.js # All valuation logic
│   └── helpers.js            # Formatting, validation utilities
└── App.jsx                   # Root component, routing
```

---

## Critical Files

| File | Purpose | Lines |
|------|---------|-------|
| `src/utils/getQuestions.js` | Question arrays for each case type | ~200 |
| `src/utils/calculateValuation.js` | Valuation formulas for all case types | ~960 |
| `src/constants/caseTypes.js` | Case type IDs, option arrays | ~180 |
| `src/constants/stateLegalDatabase.js` | State rules (SOL, caps, negligence) | ~1200 |
| `src/translations/ui-en.js` | English UI translations | ~400 |
| `src/hooks/useAppNavigation.js` | Navigation state machine | ~200 |
| `src/components/pages/ResultsPage.jsx` | Results display with breakdown | ~350 |

---

## Data Flow
```
1. User selects state + case type
2. getQuestions(caseType) returns question array
3. Questionnaire renders questions (supports showIf conditionals)
4. User answers stored in `answers` object
5. calculateValuation(caseType, answers, state) computes value
6. ResultsPage displays: value, range, factors, warnings, breakdown
```

---

## Case Types (15 total)
| ID | Name |
|----|------|
| `motor` | Motor Vehicle Accident |
| `medical` | Medical Malpractice |
| `premises` | Premises Liability |
| `product` | Product Liability |
| `wrongful_death` | Wrongful Death |
| `dog_bite` | Dog Bite |
| `wrongful_term` | Wrongful Termination |
| `wage` | Wage & Hour |
| `class_action` | Class Action |
| `insurance` | Insurance Bad Faith |
| `disability` | Disability Denial |
| `professional` | Professional Malpractice |
| `civil_rights` | Civil Rights |
| `ip` | Intellectual Property |
| `workers_comp` | Worker's Compensation |

---

## Question Types
- `boolean` - Yes/No toggle
- `number` - Numeric input (currency formatted unless in NON_CURRENCY_NUMBER_FIELDS)
- `select` - Dropdown with options array
- `date` - Date picker
- `slider` - Range slider with min/max
- `text` - Free text input

**Conditional questions:** Add `showIf` property:
```javascript
{
  id: 'follow_up_question',
  type: 'boolean',
  showIf: { questionId: 'previous_question', operator: 'equals', value: true }
}
```
Operators: `equals`, `notEquals`, `greaterThan`, `lessThan`, `includes`

---

## Adding a New Case Type

1. **caseTypes.js**: Add to `caseTypes` array + any new option arrays
2. **getQuestions.js**: Add question array for new case type
3. **calculateValuation.js**: Add `case 'new_type':` in switch statement
4. **stateLegalDatabase.js**: Add state rules if case type has state-specific logic
5. **Translations** (6 files):
   - `ui-en.js`, `ui-es.js`, `ui-zh.js`: Add question labels, option labels
   - `en.js`, `es.js`, `zh.js`: Add help text for questions

---

## Translation Key Patterns
- Question labels: `questions.{question_id}`
- Options: `options.{option_value}`
- Case types: `caseTypes.{case_type_id}`
- Help text: Export object with `{question_id}: { title, getContent(state) }`

---

## State-Specific Features
- **Statute of limitations**: Checked against incident_date
- **Damage caps**: Applied in calculateValuation
- **Negligence systems**: pure_comparative, modified_50, modified_51, contributory
- **No-fault states**: Special handling for motor vehicle
- **Workers' comp**: State-specific benefit rates, waiting periods

---

## Commands
```bash
npm start        # Dev server at localhost:3000
npm run build    # Production build
npm test         # Run tests
```

---

## Recent Features
- **Worker's Compensation** (Jan 2025): 10-question flow, state-specific benefit calculations, Texas non-subscriber detection
- **WCAG Accessibility**: Focus management, ARIA labels, keyboard navigation
- **Conditional Questions**: showIf system for dynamic question visibility
