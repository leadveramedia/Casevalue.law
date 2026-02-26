# CaseValue.law Calculator Embed Guide

Add a free case value calculator to your law firm's website. Visitors answer a short questionnaire and get an estimated settlement value — directly on your site.

---

## Quick Start

Paste this code anywhere in your website's HTML where you want the calculator to appear:

```html
<script
  src="https://casevalue.law/embed.js"
  data-case-types="motor,medical,premises"
  data-state="California"
  data-partner="your-firm-name"
></script>
```

That's it. The calculator will appear on your page inside the script tag's location.

---

## Configuration Options

Customize the calculator by adding `data-` attributes to the script tag. All attributes are optional.

| Attribute | What it does | Example |
|-----------|-------------|---------|
| `data-case-types` | **Limit which practice areas are shown.** Comma-separated list of IDs (see table below). If you only list one, it skips the selection screen. | `"motor,medical"` |
| `data-case-type` | **Lock to a single practice area.** Skips the case type selection screen entirely. | `"motor"` |
| `data-state` | **Pre-select the state.** Use the full state name. Skips the state selection screen. | `"California"` |
| `data-lang` | **Set the language.** Options: `en` (English), `es` (Spanish), `zh` (Chinese). Defaults to English. | `"es"` |
| `data-partner` | **Your firm identifier.** Used to track which leads came from your site. | `"smith-johnson-law"` |
| `data-width` | **Widget width.** Any CSS width value. Defaults to `100%`. | `"800px"` |
| `data-min-height` | **Minimum height in pixels.** The widget auto-resizes, but this sets the floor. Defaults to `600`. | `"700"` |

---

## Practice Area IDs

Use these IDs in `data-case-types` or `data-case-type`:

| ID | Practice Area |
|----|--------------|
| `motor` | Motor Vehicle Accidents |
| `medical` | Medical Malpractice |
| `premises` | Premises Liability |
| `product` | Product Liability |
| `wrongful_death` | Wrongful Death |
| `dog_bite` | Dog Bites & Animal Attacks |
| `wrongful_term` | Wrongful Termination |
| `wage` | Wage & Hour Disputes |
| `class_action` | Class Action Lawsuits |
| `insurance` | Insurance Bad Faith |
| `disability` | Social Security Disability |
| `professional` | Professional Malpractice |
| `civil_rights` | Civil Rights Violations |
| `ip` | Intellectual Property |
| `workers_comp` | Worker's Compensation |

---

## Examples

### Personal injury firm (motor vehicle + premises + dog bites, California)

```html
<script
  src="https://casevalue.law/embed.js"
  data-case-types="motor,premises,dog_bite"
  data-state="California"
  data-partner="your-firm-name"
></script>
```

### Employment law firm (wrongful termination + wage disputes, New York)

```html
<script
  src="https://casevalue.law/embed.js"
  data-case-types="wrongful_term,wage"
  data-state="New York"
  data-partner="your-firm-name"
></script>
```

### Medical malpractice only, any state, Spanish language

```html
<script
  src="https://casevalue.law/embed.js"
  data-case-type="medical"
  data-lang="es"
  data-partner="your-firm-name"
></script>
```

### All practice areas, no pre-selection

```html
<script
  src="https://casevalue.law/embed.js"
  data-partner="your-firm-name"
></script>
```

---

## Alternative: Raw iframe

If your website doesn't allow external scripts (some CMS platforms restrict this), you can use an iframe instead. The trade-off is that the calculator won't auto-resize — you'll need to set a fixed height.

```html
<iframe
  src="https://casevalue.law/embed?caseTypes=motor,medical&state=California&partner=your-firm-name"
  width="100%"
  height="800"
  style="border: none; border-radius: 12px;"
  title="Case Value Calculator"
  loading="lazy"
></iframe>
```

**iframe query parameters** (same as the data attributes above):

| Parameter | Example |
|-----------|---------|
| `caseType` | `?caseType=motor` |
| `caseTypes` | `?caseTypes=motor,medical,premises` |
| `state` | `&state=California` |
| `lang` | `&lang=es` |
| `partner` | `&partner=your-firm-name` |

---

## Placement Tips

- **Place it on a dedicated page** like "Free Case Evaluation" or "What's My Case Worth?" for best results.
- **Below the fold is fine** — the calculator loads lazily and won't slow down your page.
- **Full-width containers work best.** The calculator is responsive and adapts to any width, but looks best at 600px or wider.
- **Dark background:** The calculator has a dark theme. It looks great on white or light backgrounds since the dark container provides strong contrast.

---

## Frequently Asked Questions

**Does this slow down my website?**
No. The script loads the calculator lazily inside an iframe. It does not add any CSS or JavaScript to your page outside of the iframe.

**Will it conflict with my website's styles?**
No. The calculator runs inside an iframe, so its styles are completely isolated from your website.

**Where do the leads go?**
Contact form submissions are sent to CaseValue.law. Your `data-partner` value is included with each submission so leads from your site can be identified and routed to you.

**Can I customize the colors or branding?**
The calculator currently uses the CaseValue.law brand. Custom styling is not available at this time.

**Does it work on mobile?**
Yes. The calculator is fully responsive and works on phones, tablets, and desktops.

**Does it work with WordPress / Squarespace / Wix?**
Yes. Any platform that lets you add custom HTML can use the script embed. For platforms that block external scripts, use the iframe method instead.

---

## Support

Questions or issues? Contact us at info@leadveramedia.com.
