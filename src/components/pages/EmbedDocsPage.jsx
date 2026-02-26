/**
 * EmbedDocsPage - Public documentation page for the embeddable calculator widget.
 * Non-technical, copy-paste friendly guide for law firm webmasters.
 */
import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Copy, CheckCircle } from 'lucide-react';
import Navigation from '../Navigation';
import Footer from '../Footer';

const CASE_TYPES = [
  { id: 'motor', name: 'Motor Vehicle Accidents' },
  { id: 'medical', name: 'Medical Malpractice' },
  { id: 'premises', name: 'Premises Liability' },
  { id: 'product', name: 'Product Liability' },
  { id: 'wrongful_death', name: 'Wrongful Death' },
  { id: 'dog_bite', name: 'Dog Bites & Animal Attacks' },
  { id: 'wrongful_term', name: 'Wrongful Termination' },
  { id: 'wage', name: 'Wage & Hour Disputes' },
  { id: 'class_action', name: 'Class Action Lawsuits' },
  { id: 'insurance', name: 'Insurance Bad Faith' },
  { id: 'disability', name: 'Social Security Disability' },
  { id: 'professional', name: 'Professional Malpractice' },
  { id: 'civil_rights', name: 'Civil Rights Violations' },
  { id: 'ip', name: 'Intellectual Property' },
  { id: 'workers_comp', name: "Worker's Compensation" },
];

const CONFIG_OPTIONS = [
  { attr: 'data-case-types', desc: 'Limit which practice areas are shown. Comma-separated list of IDs (see table below). If you only list one, it skips the selection screen.', example: '"motor,medical"' },
  { attr: 'data-case-type', desc: 'Lock to a single practice area. Skips the case type selection screen entirely.', example: '"motor"' },
  { attr: 'data-state', desc: 'Pre-select the state. Use the full state name. Skips the state selection screen.', example: '"California"' },
  { attr: 'data-lang', desc: 'Set the language. Options: en (English), es (Spanish), zh (Chinese). Defaults to English.', example: '"es"' },
  { attr: 'data-partner', desc: 'Your firm identifier. Used to track which leads came from your site.', example: '"smith-law"' },
  { attr: 'data-width', desc: 'Widget width. Any CSS width value. Defaults to 100%.', example: '"800px"' },
  { attr: 'data-min-height', desc: 'Minimum height in pixels. The widget auto-resizes, but this sets the floor. Defaults to 600.', example: '"700"' },
];

const EXAMPLES = [
  {
    title: 'Personal Injury Firm',
    desc: 'Motor vehicle, premises liability, and dog bites in California',
    code: `<script\n  src="https://casevalue.law/embed.js"\n  data-case-types="motor,premises,dog_bite"\n  data-state="California"\n  data-partner="your-firm-name"\n></script>`,
  },
  {
    title: 'Employment Law Firm',
    desc: 'Wrongful termination and wage disputes in New York',
    code: `<script\n  src="https://casevalue.law/embed.js"\n  data-case-types="wrongful_term,wage"\n  data-state="New York"\n  data-partner="your-firm-name"\n></script>`,
  },
  {
    title: 'Medical Malpractice Only (Spanish)',
    desc: 'Single practice area, any state, Spanish language',
    code: `<script\n  src="https://casevalue.law/embed.js"\n  data-case-type="medical"\n  data-lang="es"\n  data-partner="your-firm-name"\n></script>`,
  },
  {
    title: 'All Practice Areas',
    desc: 'No filtering — visitors pick from all 15 case types',
    code: `<script\n  src="https://casevalue.law/embed.js"\n  data-partner="your-firm-name"\n></script>`,
  },
];

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all bg-accent/20 hover:bg-accent/30 text-accent border border-accent/30"
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied ? (
        <><CheckCircle className="w-4 h-4" /> Copied</>
      ) : (
        <><Copy className="w-4 h-4" /> Copy</>
      )}
    </button>
  );
}

function CodeBlock({ code }) {
  return (
    <div className="relative group">
      <div className="absolute top-3 right-3 z-10">
        <CopyButton text={code} />
      </div>
      <pre className="bg-primary/60 border-2 border-cardBorder rounded-xl p-5 pr-24 overflow-x-auto text-sm text-text/90 font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function EmbedDocsPage() {
  return (
    <div className="min-h-screen text-text flex flex-col">
      <Helmet>
        <title>Embed Calculator - CaseValue.law</title>
        <meta name="description" content="Add a free case value calculator to your law firm website. Step-by-step guide with copy-paste code snippets." />
      </Helmet>

      {/* Background pattern */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30 pointer-events-none"></div>

      <Navigation lang="en" onLanguageChange={() => {}} onLogoClick={() => window.location.href = '/'} />

      <main className="relative z-10 flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-16">

        {/* Hero */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-bold text-text mb-4">
            Embed the Calculator on Your Website
          </h1>
          <p className="text-lg md:text-xl text-textMuted max-w-2xl mx-auto">
            Add a free case value calculator to your law firm's website. Visitors answer a short questionnaire and get an estimated settlement value — directly on your site.
          </p>
        </div>

        {/* Quick Start */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-text mb-4">Quick Start</h2>
          <p className="text-textMuted mb-6">
            Paste this code anywhere in your website's HTML where you want the calculator to appear. Replace the attribute values with your own.
          </p>
          <CodeBlock code={`<script\n  src="https://casevalue.law/embed.js"\n  data-case-types="motor,medical,premises"\n  data-state="California"\n  data-partner="your-firm-name"\n></script>`} />
        </section>

        {/* Configuration Options */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-text mb-4">Configuration Options</h2>
          <p className="text-textMuted mb-6">
            Customize the calculator by adding these attributes to the script tag. All attributes are optional.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-cardBorder">
                  <th className="py-3 pr-4 text-sm font-bold text-accent uppercase tracking-wider">Attribute</th>
                  <th className="py-3 pr-4 text-sm font-bold text-accent uppercase tracking-wider">What it does</th>
                  <th className="py-3 text-sm font-bold text-accent uppercase tracking-wider">Example</th>
                </tr>
              </thead>
              <tbody>
                {CONFIG_OPTIONS.map((opt) => (
                  <tr key={opt.attr} className="border-b border-cardBorder/50">
                    <td className="py-3 pr-4 font-mono text-sm text-accent/80 whitespace-nowrap">{opt.attr}</td>
                    <td className="py-3 pr-4 text-sm text-textMuted">{opt.desc}</td>
                    <td className="py-3 font-mono text-sm text-text/70 whitespace-nowrap">{opt.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Practice Area IDs */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-text mb-4">Practice Area IDs</h2>
          <p className="text-textMuted mb-6">
            Use these IDs in <code className="bg-primary/60 px-1.5 py-0.5 rounded text-accent text-sm">data-case-types</code> or <code className="bg-primary/60 px-1.5 py-0.5 rounded text-accent text-sm">data-case-type</code>.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1">
            {CASE_TYPES.map((ct) => (
              <div key={ct.id} className="flex items-center gap-3 py-2 border-b border-cardBorder/30">
                <code className="bg-primary/60 px-2 py-0.5 rounded text-accent text-sm font-mono min-w-[140px]">{ct.id}</code>
                <span className="text-sm text-textMuted">{ct.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Examples */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-text mb-6">Examples</h2>
          <div className="space-y-8">
            {EXAMPLES.map((ex) => (
              <div key={ex.title}>
                <h3 className="text-lg font-bold text-text mb-1">{ex.title}</h3>
                <p className="text-sm text-textMuted mb-3">{ex.desc}</p>
                <CodeBlock code={ex.code} />
              </div>
            ))}
          </div>
        </section>

        {/* Alternative: iframe */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-text mb-4">Alternative: Raw iframe</h2>
          <p className="text-textMuted mb-6">
            If your website platform doesn't allow external scripts (some CMS platforms restrict this), you can use an iframe instead. The trade-off is that the calculator won't auto-resize — you'll need to set a fixed height.
          </p>
          <CodeBlock code={`<iframe\n  src="https://casevalue.law/embed?caseTypes=motor,medical&state=California&partner=your-firm-name"\n  width="100%"\n  height="800"\n  style="border: none; border-radius: 12px;"\n  title="Case Value Calculator"\n  loading="lazy"\n></iframe>`} />
        </section>

        {/* Placement Tips */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-text mb-4">Placement Tips</h2>
          <ul className="space-y-3 text-textMuted">
            <li className="flex gap-3">
              <span className="text-accent font-bold shrink-0">1.</span>
              <span><strong className="text-text">Place it on a dedicated page</strong> like "Free Case Evaluation" or "What's My Case Worth?" for best results.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold shrink-0">2.</span>
              <span><strong className="text-text">Below the fold is fine.</strong> The calculator loads lazily and won't slow down your page.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold shrink-0">3.</span>
              <span><strong className="text-text">Full-width containers work best.</strong> The calculator is responsive, but looks best at 600px or wider.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-accent font-bold shrink-0">4.</span>
              <span><strong className="text-text">Works with any background.</strong> The calculator has a dark theme that provides strong contrast on light or dark sites.</span>
            </li>
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-text mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {[
              { q: 'Does this slow down my website?', a: 'No. The script loads the calculator lazily inside an iframe. It does not add any CSS or JavaScript to your page outside of the iframe.' },
              { q: "Will it conflict with my website's styles?", a: 'No. The calculator runs inside an iframe, so its styles are completely isolated from your website.' },
              { q: 'Where do the leads go?', a: 'Contact form submissions are sent to CaseValue.law. Your partner value is included with each submission so leads from your site can be identified and routed to you.' },
              { q: 'Can I customize the colors or branding?', a: 'The calculator currently uses the CaseValue.law brand with a "Powered by CaseValue.law" footer. Custom styling is not available at this time.' },
              { q: 'Does it work on mobile?', a: 'Yes. The calculator is fully responsive and works on phones, tablets, and desktops.' },
              { q: 'Does it work with WordPress / Squarespace / Wix?', a: "Yes. Any platform that lets you add custom HTML can use the script embed. For platforms that block external scripts, use the iframe method instead." },
            ].map((faq) => (
              <div key={faq.q} className="bg-card/50 border-2 border-cardBorder rounded-2xl p-5 md:p-6">
                <h3 className="font-bold text-text mb-2">{faq.q}</h3>
                <p className="text-sm text-textMuted leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Support */}
        <section className="text-center py-8 border-t border-cardBorder">
          <p className="text-textMuted">
            Questions or issues? Contact us at{' '}
            <a href="mailto:info@leadveramedia.com" className="text-accent hover:underline">
              info@leadveramedia.com
            </a>
          </p>
        </section>

      </main>

      <Footer
        t={{
          privacyPolicy: 'Privacy Policy',
          termsOfService: 'Terms of Service',
          copyright: 'All rights reserved.',
        }}
        onPrivacyClick={() => window.location.href = '/'}
        onTermsClick={() => window.location.href = '/'}
      />
    </div>
  );
}
