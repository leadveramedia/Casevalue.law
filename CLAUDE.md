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
│   ├── useAppNavigation.js    # App flow state machine
│   ├── useHistoryManagement.js # Browser history + back-button logic
│   ├── useTranslations.js     # Language switching + lazy-load help text
│   ├── useMetadata.js         # SEO/Helmet meta tags per route
│   ├── useModals.js           # Help/privacy/terms modal state
│   ├── useFormValidation.js   # Answer validation before submission
│   ├── useLocalStorage.js     # Persisted state across sessions
│   ├── useFloatingCTA.js      # Floating call-to-action button visibility
│   └── useScrollToTop.js      # Scroll-to-top on route change
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
| `src/utils/calculateValuation.js` | Valuation formulas for all case types | ~900 |
| `src/constants/caseTypes.js` | Case type IDs, option arrays | ~180 |
| `src/constants/stateLegalDatabase.js` | State rules (SOL, caps, negligence) | ~1200 |
| `src/constants/caseTypeSlugs.js` | SEO slugs, headings, intros, FAQs per case type | ~350 |
| `src/constants/stateSlugMap.js` | State slug ↔ code ↔ name mappings, negligence labels | ~100 |
| `src/translations/ui-en.js` | English UI translations | ~400 |
| `src/hooks/useAppNavigation.js` | Navigation state machine | ~200 |
| `src/components/pages/ResultsPage.jsx` | Results display with breakdown | ~350 |
| `src/Router.jsx` | All routes including SEO landing pages | ~150 |
| `netlify/functions/sitemap.js` | **Production sitemap** (authoritative — not the static file) | ~100 |

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
   - Use the pre-declared function-scope vars (`medicalBills`, `annualIncome`, `weeksUnableToWork`, `lostWages`) — no need to re-parse these per-case
4. **stateLegalDatabase.js**: Add state rules if case type has state-specific logic
5. **Translations** (6 files):
   - `ui-en.js`, `ui-es.js`, `ui-zh.js`: Add question labels, option labels
   - `en.js`, `es.js`, `zh.js`: Add help text for questions
   - **Note:** The `?` help button only appears if a matching key exists in `en.js`/`es.js`/`zh.js`. Missing keys = no button shown for that question.

---

## Translation Key Patterns
- Question labels: `questions.{question_id}`
- Options: `options.{option_value}`
- Case types: `caseTypes.{case_type_id}`
- Help text: Export object with `{question_id}: { title, getContent(state) }`

**Help text coverage** — all 10 Workers' Comp question IDs have entries in all 3 help text files (`en.js`, `es.js`, `zh.js`) as of Feb 2026.

**Questionnaire sub-components** — `Questionnaire.jsx` contains a `DontKnowButton` inline component. Use it for any new "I don't know" toggles rather than duplicating the button JSX.

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

## SEO Pages & Routes

Three tiers of SEO landing pages sit on top of the calculator app:

| Route pattern | Component | Purpose |
|---|---|---|
| `/calculator/:caseSlug` | `CalculatorLandingPage` | Practice area landing (FAQ schema, Browse by State grid) |
| `/states/:stateSlug` | `StateHubPage` | State hub — pick practice area for that state |
| `/:stateSlug/:caseSlug-calculator` | `StateCalculatorPage` | State × case type landing (765 pages) |

**Key constants for these pages:**
- `caseTypeSlugs.js` — `caseIdToSlug`, `caseSlugToId`, `caseTypeContent` (heading/intro/FAQs), `caseTypeSEO` (title/description)
- `stateSlugMap.js` — `stateSlugToInfo`, `stateCodeToSlug`, `allStateSlugs`, `negligenceLabels`
- `categoryToCaseType.js` — maps blog post categories → case type IDs for CTA deep links

**Internal linking touchpoints** (ensures pages are crawlable):
- `CalculatorLandingPage` — Browse by State grid (links to `/:stateSlug/:caseSlug-calculator`)
- `BlogLayout` footer — state directory (links to `/states/:stateSlug`)
- `BlogPostPage` MidArticleCTA — 6 state chips (links to `/:stateSlug/:caseSlug-calculator`)
- `ResultsPage` — link to state landing for user's selected state + case type

**Flag backgrounds:** State flag PNGs live in `public/flags/{state-slug}-large.png` (51 files: 50 states + DC). Used as CSS `background-image` at `opacity-20` with a `bg-primary/50` dark overlay for readability. A `<link rel="preload">` in `<Helmet>` ensures early browser discovery for LCP.

**Sitemaps:** `netlify/functions/sitemap.js` is the production sitemap. `scripts/generate-sitemap.js` generates the static fallback. Both include all three page tiers. When adding new routes, update both.

---

## Recent Features
- **Worker's Compensation** (Jan 2025): 10-question flow, state-specific benefit calculations, Texas non-subscriber detection
- **WCAG Accessibility**: Focus management, ARIA labels, keyboard navigation
- **Conditional Questions**: showIf system for dynamic question visibility
- **Code Cleanup** (Feb 2026): Removed dead hooks (`useFormSubmission`, `useQuestionnaireState`), extracted `DontKnowButton` component, consolidated duplicate `parseFloat` calls in `calculateValuation.js` into function-scope variables, removed `@vue/preload-webpack-plugin` devDependency
- **Workers' Comp Help Text** (Feb 2026): All 10 Workers' Comp questions now have full help text in EN, ES, and ZH
- **SEO Landing Pages** (Feb 2026): 3-tier landing page system (calculator, state hub, state × case type), state flag backgrounds, internal linking across 4 touchpoints, both sitemaps updated
