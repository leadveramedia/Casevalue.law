# Centralized Design System

This directory contains the centralized design system for CaseValue.law. All shared styles, components, and design patterns should be defined here.

## Why Use the Centralized Design System?

✅ **Consistency** - All components use the same styling patterns
✅ **Maintainability** - Update styles in one place, changes apply everywhere
✅ **Efficiency** - No need to hunt for "rogue elements" when updating the theme
✅ **Documentation** - Clear examples and usage patterns

## Files

### `sharedStyles.js`

Contains all shared style patterns as exportable constants. These include:

- **Button Styles** - Back to Home, Primary Actions, Navigation, Gold CTA
- **Card Styles** - 3D Question Cards, Simple Cards
- **Input Styles** - Text, Select, Date, Number inputs with validation states
- **Boolean Button Styles** - Active/Inactive states for Yes/No buttons

## Usage Examples

### 1. Back to Home Button

**Before (inconsistent across pages):**
```jsx
// ContactForm.jsx
<button className="mb-6 px-6 py-3 bg-card hover:bg-card/80 rounded-xl...">

// StateSelection.jsx
<button className="mb-6 px-6 py-3 bg-buttonActive hover:bg-opacity-90 rounded-xl...">
```

**After (consistent everywhere):**
```jsx
import { SHARED_STYLES } from '../shared/sharedStyles';

<button className={SHARED_STYLES.backToHomeButton}>
  Back to Home
</button>
```

### 2. Question/Form Cards with 3D Effect

**Before:**
```jsx
<div className="bg-card backdrop-blur-xl rounded-3xl p-8 md:p-10 border-2 border-cardBorder space-y-5 shadow-card">
```

**After:**
```jsx
import { SHARED_STYLES } from '../shared/sharedStyles';

<div
  className={SHARED_STYLES.questionCard}
  style={SHARED_STYLES.questionCardBg}
>
  {/* Card content */}
</div>
```

### 3. Form Inputs

**Before:**
```jsx
<input
  type="text"
  style={{
    background: 'linear-gradient(145deg, rgba(220, 220, 225, 0.95) 0%, rgba(200, 200, 205, 0.98) 100%)'
  }}
  className="w-full p-4 md:p-5 border-2 border-accent rounded-xl text-textDark placeholder:text-textDark/60..."
/>
```

**After:**
```jsx
import { SHARED_STYLES } from '../shared/sharedStyles';

<input
  type="text"
  className={SHARED_STYLES.textInput}
  style={SHARED_STYLES.formInputBg}
/>
```

### 4. Form Inputs with Validation

```jsx
import { SHARED_STYLES } from '../shared/sharedStyles';

<input
  type="email"
  className={SHARED_STYLES.getTextInputWithValidation(validationState.email)}
  style={SHARED_STYLES.formInputBg}
/>
```

### 5. Number Input with Currency Symbol

```jsx
import { SHARED_STYLES } from '../shared/sharedStyles';

<div className="relative">
  <span className={SHARED_STYLES.currencySymbol}>$</span>
  <input
    type="number"
    className={SHARED_STYLES.numberInput(true)} // true = has currency symbol
    style={SHARED_STYLES.formInputBg}
  />
</div>
```

## Migration Plan

To fully adopt the centralized design system, follow this order:

1. ✅ **ContactForm.jsx** - Already updated with button and card styles
2. 📋 **Questionnaire.jsx** - Replace hardcoded styles with SHARED_STYLES
3. 📋 **StateSelection.jsx** - Replace hardcoded styles with SHARED_STYLES
4. 📋 **CaseSelection.jsx** - Update buttons if needed
5. 📋 **ResultsPage.jsx** - Update buttons if needed
6. 📋 **LandingPage.jsx** - Update buttons and cards

## How to Update the Theme

When you want to change the design across the entire site:

1. Open `src/components/shared/sharedStyles.js`
2. Update the relevant constant (e.g., `QUESTION_CARD`, `BACK_TO_HOME_BUTTON`)
3. Save the file
4. All components using that style will automatically update! 🎉

### Example: Change Question Card Border Color

**Before:**
```jsx
// Had to update in 3 files: ContactForm.jsx, StateSelection.jsx, Questionnaire.jsx
export const QUESTION_CARD = "... border-4 border-slate-500 ...";
```

**After:**
```jsx
// Update once in sharedStyles.js
export const QUESTION_CARD = "... border-4 border-accent ..."; // Changed to gold!
```

All question cards across the site now have gold borders!

## Color Palette Reference

These colors are defined in `tailwind.config.js`:

- `accent` - #FFC447 (Gold)
- `text` - #F6F7FB (Light text for dark backgrounds)
- `textDark` - #0B1F4B (Dark text for light backgrounds)
- `textMuted` - #B8C5E0 (Muted text)
- `buttonActive` - rgba(70, 120, 200, 0.85)
- `buttonInactive` - rgba(40, 70, 120, 0.4)
- `questionCard` - rgba(40, 75, 140, 0.75)

## Best Practices

1. **Always import from sharedStyles.js** when styling common elements
2. **Don't hardcode repeated styles** - if you're using the same className in multiple places, add it to sharedStyles.js
3. **Document any new patterns** - add examples to this README
4. **Test after updates** - changing sharedStyles.js affects multiple pages

## Future Improvements

- [ ] Create reusable React components (e.g., `<QuestionCard>`, `<BackButton>`)
- [ ] Add theme variants (dark mode, high contrast)
- [ ] Create Storybook documentation
- [ ] Add TypeScript types for style functions

## Questions?

If you need to add a new shared style pattern or aren't sure how to use the design system, refer to the examples in `sharedStyles.js` or this README.
