=== CaseValue Calculator ===
Contributors: casevaluelaw
Tags: calculator, legal, personal injury, settlement, case value
Requires at least: 5.8
Tested up to: 6.7
Stable tag: 1.0.0
Requires PHP: 7.4
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Free legal case value calculator widget for law firm websites. 16 practice areas, 50 states, 3 languages. Leads emailed directly to your intake email.

== Description ==

**CaseValue Calculator** adds a free settlement value calculator to your WordPress site. Visitors answer a short questionnaire about their legal case and receive an estimated case value — directly on your website.

= Features =

* **16 Practice Areas** — Motor vehicle accidents, medical malpractice, wrongful death, employment law, and more
* **50 States + DC** — State-specific legal rules including statute of limitations, damage caps, and negligence systems
* **3 Languages** — English, Spanish, and Chinese
* **Lead Capture** — Contact form submissions are emailed directly to your firm's intake email in real-time
* **Mobile Responsive** — Works on phones, tablets, and desktops
* **Zero Performance Impact** — Loads lazily inside an iframe with no impact on your page speed
* **Easy Setup** — Configure once in Settings, then use the `[casevalue]` shortcode anywhere

= How It Works =

1. Add the `[casevalue]` shortcode to any page or post
2. Visitors select their case type, state, and answer questions about their case
3. They enter their contact information and receive an estimated settlement value
4. You receive their lead details via email at your configured intake address

= Shortcode Examples =

Basic (uses your saved settings):
`[casevalue]`

Override for a specific page:
`[casevalue case_types="motor,medical" state="California" lang="es"]`

Single practice area:
`[casevalue case_type="wrongful_death"]`

= Shortcode Attributes =

* `intake_email` — Override the intake email for this instance
* `case_type` — Lock to a single practice area (e.g., "motor")
* `case_types` — Comma-separated list of allowed practice areas
* `state` — Pre-select a state (e.g., "California")
* `lang` — Language: en, es, or zh
* `partner` — Your partner ID for lead attribution
* `width` — CSS width (default: 100%)
* `min_height` — Minimum height in pixels (default: 600)

= External Service =

This plugin loads the calculator widget from **casevalue.law**. When visitors use the calculator, their responses and contact information are transmitted to CaseValue.law servers for processing and lead delivery.

* Service URL: [https://casevalue.law](https://casevalue.law)
* Privacy Policy: [https://casevalue.law](https://casevalue.law)
* Terms of Service: [https://casevalue.law](https://casevalue.law)

No data is stored on your WordPress server. All calculator data processing occurs on CaseValue.law infrastructure.

== Installation ==

1. Upload the `casevalue-calculator` folder to `/wp-content/plugins/`
2. Activate the plugin through the **Plugins** menu
3. Go to **Settings > CaseValue Calculator**
4. Enter your **Lead Intake Email** (required — this is where leads are sent)
5. Configure your Partner ID, default state, language, and practice areas
6. Add `[casevalue]` to any page or post

== Frequently Asked Questions ==

= Does this slow down my website? =

No. The calculator loads lazily inside an iframe. It adds no CSS or JavaScript to your page outside the iframe.

= Will it conflict with my theme's styles? =

No. The calculator runs inside an iframe, so its styles are completely isolated from your website.

= Where do the leads go? =

Leads are emailed directly to the intake email address you configure in Settings. Each submission includes the visitor's name, email, phone, case type, state, and estimated case value.

= Can I use it on multiple pages? =

Yes. Use the `[casevalue]` shortcode on as many pages as you want. You can override settings per shortcode instance.

= Does it work with page builders? =

Yes. Elementor, Beaver Builder, Divi, and other page builders all support shortcodes. Use the shortcode widget or module.

= Is it really free? =

Yes. The calculator is free with a "Powered by CaseValue.law" footer link. No credit card or paid plan required.

== Screenshots ==

1. Calculator embedded on a law firm's practice area page
2. Settings page in WordPress admin
3. Lead notification email received at your intake address

== Changelog ==

= 1.0.0 =
* Initial release
* Settings page with intake email, partner ID, state, language, and practice area configuration
* `[casevalue]` shortcode with per-instance attribute overrides
* Automatic lead email delivery to configured intake address
