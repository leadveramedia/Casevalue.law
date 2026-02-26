// ============================================================================
// STATE CALCULATOR LANDING PAGE
// State × case type landing pages for /[stateSlug]/[caseSlug]-calculator.
// Each page provides state-specific legal facts, FAQ, and links to the
// pre-selected calculator — targeting keywords like
// "California car accident settlement calculator".
// ============================================================================
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, ChevronUp, ArrowRight, Calculator, Clock, Scale, AlertCircle } from 'lucide-react';
import BlogLayout from '../BlogLayout';
import SocialMeta from '../SocialMeta';
import { caseTypeContent, caseIdToSlug } from '../../constants/caseTypeSlugs';
import { STATE_LEGAL_DATABASE } from '../../constants/stateLegalDatabase';
import { caseTypeToDbKey, negligenceLabels, stateCodeToSlug } from '../../constants/stateSlugMap';

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className="bg-card/50 backdrop-blur-xl border border-cardBorder rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-card/70 transition-colors"
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-text text-base leading-snug">{faq.q}</span>
        {isOpen
          ? <ChevronUp className="w-5 h-5 text-accent shrink-0" />
          : <ChevronDown className="w-5 h-5 text-textMuted shrink-0" />
        }
      </button>
      {isOpen && (
        <div className="px-6 pb-5 text-textMuted leading-relaxed border-t border-cardBorder pt-4">
          {faq.a}
        </div>
      )}
    </div>
  );
}

/**
 * Build state-specific FAQ entries, replacing the generic deadline answer
 * with the actual SOL for this state + case type.
 */
function buildStateFAQs(baseFAQs, stateRules, stateName, caseTypeId) {
  const sol = stateRules?.statuteOfLimitations;
  if (!sol) return baseFAQs;

  const isWC = caseTypeId === 'workers_comp';
  const dateRef = isWC ? 'injury date' : 'date of the incident';

  return baseFAQs.map(faq => {
    if (!faq.q.toLowerCase().includes('how long')) return faq;
    const noFaultNote = stateRules.noFaultState
      ? ` ${stateName} is a no-fault insurance state, which affects how claims are first processed before a lawsuit can be filed.`
      : '';
    return {
      ...faq,
      a: `In ${stateName}, you have ${sol} year${sol !== 1 ? 's' : ''} from the ${dateRef} to file a lawsuit.${noFaultNote} Missing this deadline permanently bars your right to recover — act promptly and consult an attorney before the deadline approaches.`
    };
  });
}

/**
 * Generate key state-specific facts to display in a facts card.
 */
function getStateFacts(stateData, stateRules, caseTypeId) {
  const facts = [];
  const sol = stateRules?.statuteOfLimitations;
  if (sol) {
    facts.push({
      icon: Clock,
      label: 'Filing Deadline',
      value: `${sol} year${sol !== 1 ? 's' : ''}`,
    });
  }

  const negligence = stateData.negligenceSystem;
  if (negligence && negligenceLabels[negligence]) {
    facts.push({
      icon: Scale,
      label: 'Negligence System',
      value: negligenceLabels[negligence],
    });
  }

  // Damage cap (for applicable case types)
  const nonEconCap = stateRules?.nonEconomicDamageCap;
  if (nonEconCap !== undefined && nonEconCap !== null) {
    facts.push({
      icon: AlertCircle,
      label: 'Non-Economic Damage Cap',
      value: `$${(nonEconCap / 1000).toFixed(0)}K`,
    });
  } else if (nonEconCap === null && ['medical', 'premises', 'professional'].includes(caseTypeId)) {
    facts.push({
      icon: AlertCircle,
      label: 'Non-Economic Damage Cap',
      value: 'None',
    });
  }

  // Dog bite: strict liability vs one-bite
  if (caseTypeId === 'dog_bite' && stateRules?.strictLiability !== undefined) {
    facts.push({
      icon: AlertCircle,
      label: 'Liability Rule',
      value: stateRules.strictLiability ? 'Strict Liability' : 'One-Bite Rule',
    });
  }

  // Motor vehicle: no-fault
  if (caseTypeId === 'motor' && stateRules?.noFaultState !== undefined) {
    facts.push({
      icon: AlertCircle,
      label: 'No-Fault State',
      value: stateRules.noFaultState ? 'Yes' : 'No',
    });
  }

  // Workers comp: max weekly benefit
  if (caseTypeId === 'workers_comp' && stateRules?.maxWeeklyBenefit) {
    facts.push({
      icon: AlertCircle,
      label: 'Max Weekly Benefit',
      value: `$${stateRules.maxWeeklyBenefit.toLocaleString()}`,
    });
  }

  return facts;
}

export default function StateCalculatorPage({ stateCode, caseTypeId }) {
  const [openFAQ, setOpenFAQ] = useState(null);

  const stateData = STATE_LEGAL_DATABASE[stateCode];
  const stateName = stateData?.name || stateCode;
  const dbKey = caseTypeToDbKey[caseTypeId];
  const stateRules = stateData?.[dbKey] || {};

  const content = caseTypeContent[caseTypeId];
  const caseSlug = caseIdToSlug[caseTypeId];
  const stateSlugForLink = stateCodeToSlug[stateCode];
  const calculatorLink = `/#case/${caseTypeId}/${stateSlugForLink}/0`;

  const stateSlug = stateName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z-]/g, '');
  const canonicalUrl = `https://casevalue.law/${stateSlug}/${caseSlug}-calculator`;

  const pageTitle = `${stateName} ${content.heading} | CaseValue.law`;
  const negligence = stateData?.negligenceSystem;
  const negligenceDesc = negligenceLabels[negligence] || '';
  const sol = stateRules?.statuteOfLimitations;
  const pageDescription = `Calculate what your ${content.heading.replace(' Calculator', '').toLowerCase()} case is worth in ${stateName}. Free calculator using ${stateName}'s ${sol ? `${sol}-year statute of limitations` : 'laws'}${negligenceDesc ? ` and ${negligenceDesc.toLowerCase()} rules` : ''}.`;

  const stateFAQs = buildStateFAQs(content.faqs, stateRules, stateName, caseTypeId);
  const stateFacts = getStateFacts(stateData, stateRules, caseTypeId);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": stateFAQs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": { "@type": "Answer", "text": faq.a }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://casevalue.law" },
      { "@type": "ListItem", "position": 2, "name": content.heading, "item": `https://casevalue.law/calculator/${caseSlug}` },
      { "@type": "ListItem", "position": 3, "name": `${stateName} ${content.heading}`, "item": canonicalUrl }
    ]
  };

  return (
    <BlogLayout ctaLink={calculatorLink}>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="preload" as="image" href={`/flags/${stateSlug}-large.png`} fetchPriority="high" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
      <SocialMeta title={pageTitle} description={pageDescription} url={canonicalUrl} />

      <div className="relative min-h-screen bg-gradient-hero overflow-hidden">
        {/* State flag background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-75 pointer-events-none"
          style={{ backgroundImage: `url('/flags/${stateSlug}-large.png')` }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(26,31,58,0.78) 35%, rgba(26,31,58,0.78) 65%, transparent 100%)' }}
          aria-hidden="true"
        />

        <div className="relative">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/15 border border-accent/30 rounded-full text-accent text-sm font-semibold mb-6">
            <Calculator className="w-4 h-4" />
            {stateName} · Free Case Value Calculator
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-6 leading-tight">
            {stateName} {content.heading}
          </h1>
          <p className="text-xl text-textMuted mb-10 max-w-2xl mx-auto leading-relaxed">
            {content.intro.replace(/\.$/, '')} under {stateName}'s specific laws.
          </p>
          <Link
            to={calculatorLink}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-gold text-textDark rounded-2xl font-bold text-lg hover:opacity-90 transition-all shadow-card hover:shadow-glow-gold-soft transform hover:scale-[1.02] active:scale-[0.99]"
          >
            Start Free {stateName} Calculator
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-4 text-sm text-textMuted">Quick & easy · Takes 2 minutes · 100% free</p>
        </section>

        {/* State-specific facts */}
        {stateFacts.length > 0 && (
          <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <h2 className="text-xl font-bold text-text mb-4 text-center">Key {stateName} Laws</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {stateFacts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-4 p-4 bg-card/40 backdrop-blur-xl border border-cardBorder rounded-xl">
                  <div className="p-2 bg-accent/15 rounded-lg shrink-0">
                    <Icon className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-xs text-textMuted uppercase tracking-wide font-semibold">{label}</div>
                    <div className="text-text font-bold mt-0.5">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <h2 className="text-3xl font-bold text-text mb-8 text-center">
            {stateName} {content.heading.replace(' Calculator', '')} FAQs
          </h2>
          <div className="space-y-3">
            {stateFAQs.map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                isOpen={openFAQ === i}
                onToggle={() => setOpenFAQ(openFAQ === i ? null : i)}
              />
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="mt-12 p-8 bg-accent/10 border-2 border-accent/30 rounded-2xl backdrop-blur-xl text-center">
            <h3 className="text-2xl font-bold text-text mb-3">
              Get Your {stateName} Case Estimate — Free
            </h3>
            <p className="text-textMuted mb-6">
              Answer a few questions about your situation. Our calculator applies {stateName}'s specific laws and real case data to estimate your settlement value instantly.
            </p>
            <Link
              to={calculatorLink}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-gold text-textDark rounded-xl font-bold hover:opacity-90 transition-all"
            >
              Calculate My {stateName} Case Value
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
        </div>{/* end relative content wrapper */}
      </div>
    </BlogLayout>
  );
}
