// ============================================================================
// STATE CALCULATOR LANDING PAGE
// State x case type landing pages for /[stateSlug]/[caseSlug]-calculator.
// Each page provides state-specific legal facts, FAQ, and links to the
// pre-selected calculator -- targeting keywords like
// "California car accident settlement calculator".
// ============================================================================
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, ChevronUp, ArrowRight, Calculator, Clock, Scale, AlertCircle, Info, BarChart3, BookOpen } from 'lucide-react';
import BlogLayout from '../BlogLayout';
import SocialMeta from '../SocialMeta';
import { caseTypeContent, caseIdToSlug } from '../../constants/caseTypeSlugs';
import { STATE_LEGAL_DATABASE } from '../../constants/stateLegalDatabase';
import { caseTypeToDbKey, negligenceLabels, stateCodeToSlug } from '../../constants/stateSlugMap';
import {
  getCaseTypeProse,
  getWhatToDoContent,
  getEnhancedStateFacts,
  getStateFAQs as getEngineFAQs,
  getRelatedCaseTypes,
  getNeighboringComparison,
  getNationalAverages,
} from '../../constants/stateContentEngine';


function FAQItem({ faq, isOpen, onToggle, index }) {
  return (
    <div className="bg-card/50 backdrop-blur-xl border border-cardBorder/15 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-card/70 transition-colors"
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${index}`}
      >
        <span className="font-semibold text-text text-base leading-snug">{faq.q}</span>
        {isOpen
          ? <ChevronUp className="w-5 h-5 text-accent shrink-0" aria-hidden="true" />
          : <ChevronDown className="w-5 h-5 text-textMuted shrink-0" aria-hidden="true" />
        }
      </button>
      <div id={`faq-panel-${index}`} hidden={!isOpen} className="px-6 pb-5 text-text/75 leading-relaxed border-t border-cardBorder pt-4">
        {faq.a}
      </div>
    </div>
  );
}

/**
 * Fallback: Build state-specific FAQ entries for non-launch case types.
 */
function buildFallbackFAQs(baseFAQs, stateRules, stateName, caseTypeId) {
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
      a: `In ${stateName}, you have ${sol} year${sol !== 1 ? 's' : ''} from the ${dateRef} to file a lawsuit.${noFaultNote} Missing this deadline permanently bars your right to recover \u2014 act promptly and consult an attorney before the deadline approaches.`
    };
  });
}

/**
 * Fallback: Generate key state-specific facts for non-launch case types.
 */
function getFallbackFacts(stateData, stateRules, caseTypeId) {
  const facts = [];
  const sol = stateRules?.statuteOfLimitations;
  if (sol) {
    facts.push({ icon: Clock, label: 'Filing Deadline', value: `${sol} year${sol !== 1 ? 's' : ''}` });
  }
  const negligence = stateData.negligenceSystem;
  if (negligence && negligenceLabels[negligence]) {
    facts.push({ icon: Scale, label: 'Negligence System', value: negligenceLabels[negligence] });
  }
  const nonEconCap = stateRules?.nonEconomicDamageCap;
  if (nonEconCap !== undefined && nonEconCap !== null) {
    facts.push({ icon: AlertCircle, label: 'Non-Economic Damage Cap', value: `$${(nonEconCap / 1000).toFixed(0)}K` });
  } else if (nonEconCap === null && ['medical', 'premises', 'professional'].includes(caseTypeId)) {
    facts.push({ icon: AlertCircle, label: 'Non-Economic Damage Cap', value: 'None' });
  }
  if (caseTypeId === 'dog_bite' && stateRules?.strictLiability !== undefined) {
    facts.push({ icon: AlertCircle, label: 'Liability Rule', value: stateRules.strictLiability ? 'Strict Liability' : 'One-Bite Rule' });
  }
  if (caseTypeId === 'motor' && stateRules?.noFaultState !== undefined) {
    facts.push({ icon: AlertCircle, label: 'No-Fault State', value: stateRules.noFaultState ? 'Yes' : 'No' });
  }
  if (caseTypeId === 'workers_comp' && stateRules?.maxWeeklyBenefit) {
    facts.push({ icon: AlertCircle, label: 'Max Weekly Benefit', value: `$${stateRules.maxWeeklyBenefit.toLocaleString()}` });
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
  const caseLabel = content.heading.replace(' Case Value Calculator', '').replace(' Settlement Calculator', '').replace(' Claim Calculator', '').replace(' Case Calculator', '').replace(' Calculator', '').toLowerCase();
  const baseDesc = `Free ${stateName} ${caseLabel} calculator. Estimate your case value based on ${sol ? `the ${sol}-year filing deadline` : 'state laws'}`;
  const pageDescription = (baseDesc + (negligenceDesc ? ` and ${negligenceDesc.toLowerCase()}` : '') + '.').length <= 160
    ? baseDesc + (negligenceDesc ? ` and ${negligenceDesc.toLowerCase()}` : '') + '.'
    : baseDesc + '.';

  // Content engine data (null for non-launch case types = graceful degradation)
  const prose = getCaseTypeProse(stateCode, caseTypeId);
  const engineFAQs = getEngineFAQs(stateCode, caseTypeId);
  const enhancedFacts = getEnhancedStateFacts(stateCode, caseTypeId);
  const relatedCaseTypes = getRelatedCaseTypes(stateCode, caseTypeId);
  const neighborComparisons = getNeighboringComparison(stateCode, caseTypeId);
  const nationalAvgs = getNationalAverages(caseTypeId);
  const whatToDo = getWhatToDoContent(stateCode, caseTypeId);

  // Use engine FAQs when available, fallback to old system
  const displayFAQs = engineFAQs || buildFallbackFAQs(content.faqs, stateRules, stateName, caseTypeId);

  // Use enhanced facts when available, fallback to old system
  const displayFacts = enhancedFacts || getFallbackFacts(stateData, stateRules, caseTypeId);

  const lastUpdated = stateData?.lastUpdated || '2026-03-06';
  const caseLabelDisplay = content.heading.replace(' Case Value Calculator', '').replace(' Settlement Calculator', '').replace(' Claim Calculator', '').replace(' Case Calculator', '').replace(' Calculator', '');

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": displayFAQs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": { "@type": "Answer", "text": faq.a }
    }))
  };

  const breadcrumbSchemaPA = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://casevalue.law" },
      { "@type": "ListItem", "position": 2, "name": content.heading, "item": `https://casevalue.law/calculator/${caseSlug}` },
      { "@type": "ListItem", "position": 3, "name": `${stateName} ${content.heading}`, "item": canonicalUrl }
    ]
  };

  const breadcrumbSchemaState = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://casevalue.law" },
      { "@type": "ListItem", "position": 2, "name": `${stateName} Calculators`, "item": `https://casevalue.law/states/${stateSlug}` },
      { "@type": "ListItem", "position": 3, "name": `${stateName} ${content.heading}`, "item": canonicalUrl }
    ]
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `${stateName} ${content.heading}`,
    "url": canonicalUrl,
    "applicationCategory": "LegalApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
  };

  // Hero intro: use first prose paragraph if available, else generic
  const heroIntro = prose && prose.length > 0
    ? prose[0]
    : `${content.intro.replace(/\.$/, '')} under ${stateName}'s specific laws.`;

  return (
    <BlogLayout ctaLink={calculatorLink} hideWhenHeroCTAVisible>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="preload" as="image" href={`/flags/${stateSlug}-large.png`} fetchPriority="high" />
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchemaPA)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchemaState)}</script>
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
      </Helmet>
      <SocialMeta title={pageTitle} description={pageDescription} url={canonicalUrl} />

      <div className="min-h-screen bg-gradient-hero">
        {/* Hero with flag background */}
        <div className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-75 pointer-events-none"
            style={{ backgroundImage: `url('/flags/${stateSlug}-large.png')` }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'rgba(26,31,58,0.7)' }}
            aria-hidden="true"
          />
          <section className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/15 border border-accent/30 rounded-full text-accent text-sm font-semibold mb-4">
              <Calculator className="w-4 h-4" />
              {stateName} &middot; Free Case Value Calculator
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-text mb-4 leading-tight">
              {stateName} {content.heading}
            </h1>
            <p className="text-xl text-text/75 mb-5 max-w-2xl mx-auto leading-relaxed" dangerouslySetInnerHTML={{ __html: heroIntro }} />
            <Link
              id="hero-cta"
              to={calculatorLink}
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-gold text-textDark rounded-2xl font-bold text-lg hover:opacity-90 transition-all shadow-card hover:shadow-glow-gold-soft transform hover:scale-[1.02] active:scale-[0.99]"
            >
              Get My Free {stateName} Estimate
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="mt-3 text-sm text-textMuted">Quick &amp; easy &middot; Takes 2 minutes &middot; 100% free</p>
          </section>
        </div>

        {/* How State Law Affects Your Case -- prose section (launch case types only) */}
        {prose && prose.length > 1 && (
          <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12">
            <h2 className="text-2xl font-bold text-text mb-6">
              How {stateName} Law Affects Your {caseLabelDisplay} Case
            </h2>
            <div className="space-y-4">
              {prose.slice(1).map((paragraph, i) => (
                <p key={i} className="text-text/80 leading-relaxed" dangerouslySetInnerHTML={{ __html: paragraph }} />
              ))}
            </div>
          </section>
        )}

        {/* What To Do Next — actionable steps section (motor + medmal only) */}
        {whatToDo && (
          <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <h2 className="text-2xl font-bold text-text mb-4">
              {caseTypeId === 'motor' ? `Steps After a Car Accident in ${stateName}` : `Steps If You Suspect Medical Malpractice in ${stateName}`}
            </h2>
            <p className="text-text/80 leading-relaxed" dangerouslySetInnerHTML={{ __html: whatToDo }} />
          </section>
        )}

        {/* Enhanced State Facts */}
        {displayFacts && displayFacts.length > 0 && (
          <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <h2 className="text-xl font-bold text-text mb-4 text-center">Key {stateName} Laws</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {displayFacts.map((fact) => {
                const Icon = fact.icon || Info;
                return (
                  <div key={fact.label} className="flex items-start gap-4 p-4 bg-card/40 backdrop-blur-xl border border-cardBorder rounded-xl">
                    <div className="p-2 bg-accent/15 rounded-lg shrink-0 mt-0.5">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <div className="text-xs text-textMuted uppercase tracking-wide font-semibold">{fact.label}</div>
                      <div className="text-text font-bold mt-0.5">{fact.value}</div>
                      {fact.context && (
                        <div className="text-xs text-textMuted mt-1">{fact.context}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* State Comparison Strip */}
        {nationalAvgs && sol != null && (
          <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <h2 className="text-lg font-bold text-text mb-4 text-center flex items-center justify-center gap-2">
              <BarChart3 className="w-5 h-5 text-accent" />
              How Does {stateName} Compare?
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-4 bg-card/40 backdrop-blur-xl border border-cardBorder rounded-xl text-center">
                <div className="text-2xl font-bold text-accent">{sol} yr{sol !== 1 ? 's' : ''}</div>
                <div className="text-xs text-textMuted mt-1">Filing Deadline</div>
                {nationalAvgs.avgSOL && (
                  <div className="text-xs text-textMuted mt-0.5">Avg: {nationalAvgs.avgSOL} yrs</div>
                )}
              </div>
              <div className="p-4 bg-card/40 backdrop-blur-xl border border-cardBorder rounded-xl text-center">
                <div className="text-2xl font-bold text-accent">{negligenceDesc ? negligenceDesc.split(' ')[0] : 'N/A'}</div>
                <div className="text-xs text-textMuted mt-1">Fault System</div>
                <div className="text-xs text-textMuted mt-0.5">{negligenceDesc || ''}</div>
              </div>
              {caseTypeId === 'workers_comp' && stateRules?.maxWeeklyBenefit && nationalAvgs.avgWeeklyBenefit && (
                <div className="p-4 bg-card/40 backdrop-blur-xl border border-cardBorder rounded-xl text-center">
                  <div className="text-2xl font-bold text-accent">${stateRules.maxWeeklyBenefit.toLocaleString()}</div>
                  <div className="text-xs text-textMuted mt-1">Max Weekly Benefit</div>
                  <div className="text-xs text-textMuted mt-0.5">Avg: ${nationalAvgs.avgWeeklyBenefit.toLocaleString()}</div>
                </div>
              )}
              {stateRules?.nonEconomicDamageCap != null && (
                <div className="p-4 bg-card/40 backdrop-blur-xl border border-cardBorder rounded-xl text-center">
                  <div className="text-2xl font-bold text-accent">${(stateRules.nonEconomicDamageCap / 1000).toFixed(0)}K</div>
                  <div className="text-xs text-textMuted mt-1">Non-Econ Cap</div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* State-Specific FAQs */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <h2 className="text-3xl font-bold text-text mb-8 text-center">
            {stateName} {caseLabelDisplay} FAQs
          </h2>
          <div className="space-y-3">
            {displayFAQs.map((faq, i) => (
              <FAQItem
                key={i}
                faq={faq}
                index={i}
                isOpen={openFAQ === i}
                onToggle={() => setOpenFAQ(openFAQ === i ? null : i)}
              />
            ))}
          </div>
        </section>

        {/* Related Calculators for State */}
        {relatedCaseTypes && relatedCaseTypes.length > 0 && (
          <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <h2 className="text-xl font-bold text-text mb-4">Related {stateName} Calculators</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {relatedCaseTypes.map((related) => (
                <Link
                  key={related.caseTypeId}
                  to={related.url}
                  className="group flex items-center justify-between p-4 bg-card/40 backdrop-blur-xl border border-cardBorder rounded-xl hover:border-accent/50 hover:bg-card/60 transition-all"
                >
                  <span className="text-text font-semibold text-sm">{stateName} {related.label}</span>
                  <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Neighboring States -- "Had your accident in a different state?" */}
        {neighborComparisons && neighborComparisons.length > 0 && (
          <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <h2 className="text-xl font-bold text-text mb-2">Had Your Accident in a Different State?</h2>
            <p className="text-sm text-textMuted mb-4">
              Which state's law applies depends on where the incident occurred, not where you live. Compare neighboring states:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {neighborComparisons.map((neighbor) => (
                <Link
                  key={neighbor.stateCode}
                  to={neighbor.url}
                  className="group flex items-center justify-between p-4 bg-card/40 backdrop-blur-xl border border-cardBorder rounded-xl hover:border-accent/50 hover:bg-card/60 transition-all"
                >
                  <div>
                    <div className="text-text font-semibold text-sm">{neighbor.stateName}</div>
                    <div className="text-xs text-textMuted mt-0.5">
                      {neighbor.sol && `${neighbor.sol}-yr SOL`}
                      {neighbor.sol && neighbor.negligenceLabel && ' · '}
                      {neighbor.negligenceLabel && neighbor.negligenceLabel.split(' ')[0]}
                      {neighbor.noFault && ' · No-Fault'}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Legal Disclaimer + Laws Current As Of */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="p-4 bg-card/30 border border-cardBorder rounded-xl">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-textMuted shrink-0 mt-0.5" />
              <div className="text-xs text-textMuted leading-relaxed">
                <p className="font-semibold text-text mb-1">Legal Disclaimer</p>
                <p>
                  This calculator uses {stateName}'s statutes as of {lastUpdated}. Laws change frequently. This tool provides estimates for informational purposes only and does not constitute legal advice. Verify current rules with a {stateName}-licensed attorney before making decisions about your case.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="p-8 bg-accent/10 border-2 border-accent/30 rounded-2xl backdrop-blur-xl text-center">
            <h3 className="text-2xl font-bold text-text mb-3">
              Get Your {stateName} Case Estimate &mdash; Free
            </h3>
            <p className="text-text/75 mb-6">
              Answer a few questions about your situation. Our calculator applies {stateName}'s specific laws and real case data to estimate your settlement value instantly.
            </p>
            <Link
              id="bottom-cta"
              to={calculatorLink}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-gold text-textDark rounded-xl font-bold hover:opacity-90 transition-all"
            >
              Get My {stateName} Case Estimate
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </div>
    </BlogLayout>
  );
}
