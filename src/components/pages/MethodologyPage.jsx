// ============================================================================
// METHODOLOGY PAGE
// Explains calculator approach, data sources, and update frequency.
// Linked from every state page as an E-E-A-T signal.
// ============================================================================
import { Helmet } from 'react-helmet-async';
import { BookOpen, Database, RefreshCw, Scale, ShieldCheck } from 'lucide-react';
import BlogLayout from '../BlogLayout';
import SocialMeta from '../SocialMeta';

const SECTIONS = [
  {
    icon: Database,
    title: 'Data Sources',
    content: `Our calculator draws from multiple authoritative sources to produce state-specific estimates:

\u2022 State statutes and civil procedure codes for statutes of limitations, damage caps, and negligence rules
\u2022 Published tort reform legislation and amendments
\u2022 Workers' compensation administrative rules and benefit schedules for all 51 jurisdictions
\u2022 AMA Guides to the Evaluation of Permanent Impairment (editions 3\u20136) and state-specific rating schedules
\u2022 Published jury verdict and settlement data from legal research databases
\u2022 Federal statutes including FLSA, Title VII, ADA, ADEA, and Section 1983 for employment and civil rights calculations`,
  },
  {
    icon: Scale,
    title: 'How We Calculate',
    content: `Each estimate follows a structured methodology:

1. Your economic damages (medical bills, lost wages, future costs) are totaled based on your inputs.
2. Non-economic damages (pain and suffering) are estimated using multipliers derived from published settlement data for your injury severity and case type.
3. State-specific adjustments are applied: your state's negligence system (comparative or contributory fault), any statutory damage caps, and case-type-specific rules.
4. For workers' compensation, we apply your state's benefit rate, maximum weekly benefit, waiting period, and impairment rating system to calculate TTD, PPD, and PTD benefits.
5. The final estimate is presented as a range to reflect the inherent variability in legal outcomes.

Our calculator does not account for variables that require professional legal judgment, such as the strength of your evidence, the specific judge or jurisdiction, insurance policy limits, or the quality of legal representation.`,
  },
  {
    icon: RefreshCw,
    title: 'Update Frequency',
    content: `We review and update state legal data on a rolling basis:

\u2022 Statutes of limitations, negligence systems, and damage caps are verified against current state codes quarterly.
\u2022 Workers' compensation benefit rates and maximums are updated annually when states publish new schedules.
\u2022 Each state page displays a "Laws current as of" date so you can assess recency.
\u2022 When significant tort reform legislation is enacted, affected states are updated within 30 days.

Despite our best efforts, laws change frequently. Always verify current rules with a licensed attorney in your jurisdiction before making decisions about your case.`,
  },
  {
    icon: ShieldCheck,
    title: 'Limitations & Disclaimer',
    content: `This calculator provides estimates for informational purposes only. It does not constitute legal advice and should not be relied upon as a substitute for consultation with a qualified attorney.

Key limitations:
\u2022 Settlement outcomes depend on case-specific facts that a calculator cannot evaluate (evidence quality, witness credibility, insurance limits, venue).
\u2022 Jury verdicts can deviate significantly from calculated estimates in either direction.
\u2022 The calculator uses generalized data and cannot account for local court tendencies, individual judge practices, or recent unpublished decisions.
\u2022 Workers' compensation calculations are based on published state benefit schedules and may not reflect administrative interpretations or recent rate changes.

For case-specific guidance, consult a licensed attorney in the state where the incident occurred.`,
  },
];

export default function MethodologyPage() {
  const canonicalUrl = 'https://casevalue.law/methodology';
  const pageTitle = 'How We Calculate Case Values | Methodology | CaseValue.law';
  const pageDescription = 'Learn how CaseValue.law estimates settlement values. Our methodology, data sources, update frequency, and limitations explained.';

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://casevalue.law" },
      { "@type": "ListItem", "position": 2, "name": "Methodology", "item": canonicalUrl },
    ]
  };

  return (
    <BlogLayout>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
      <SocialMeta title={pageTitle} description={pageDescription} url={canonicalUrl} />

      <div className="min-h-screen bg-gradient-hero">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/15 border border-accent/30 rounded-full text-accent text-sm font-semibold mb-6">
              <BookOpen className="w-4 h-4" />
              Transparency
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">How We Calculate Case Values</h1>
            <p className="text-lg text-textMuted max-w-2xl mx-auto">
              Our methodology, data sources, and the limitations of automated case valuation.
            </p>
          </div>

          <div className="space-y-8">
            {SECTIONS.map(({ icon: Icon, title, content }) => (
              <section key={title} className="bg-card/40 backdrop-blur-xl border border-cardBorder rounded-2xl p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-accent/15 rounded-lg">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <h2 className="text-xl font-bold text-text">{title}</h2>
                </div>
                <div className="text-textMuted leading-relaxed whitespace-pre-line text-sm">
                  {content}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </BlogLayout>
  );
}
