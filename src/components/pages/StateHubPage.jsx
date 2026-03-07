// ============================================================================
// STATE HUB PAGE
// Landing page for /states/:stateSlug -- shows all 15 practice area calculators
// for the selected state, with state-specific legal landscape summary,
// differentiator cards, SOL comparison table, and neighboring states.
// ============================================================================
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Calculator, Scale,
  Car, Stethoscope, Home, Package, HeartPulse, PawPrint, Briefcase,
  DollarSign, Users, Shield, Accessibility, GraduationCap, Lightbulb,
  HardHat, ArrowRight, AlertTriangle, Info, BookOpen,
} from 'lucide-react';
import BlogLayout from '../BlogLayout';
import SocialMeta from '../SocialMeta';
import { pushFunnelEvent } from '../../utils/trackingUtils';
import { caseTypeContent, caseIdToSlug } from '../../constants/caseTypeSlugs';
import { STATE_LEGAL_DATABASE } from '../../constants/stateLegalDatabase';
import { negligenceLabels, stateCodeToSlug } from '../../constants/stateSlugMap';
import {
  getStateLandscapeSummary,
  getStateDifferentiators,
  getStateSOLTable,
  STATE_NEIGHBORS,
} from '../../constants/stateContentEngine';

const CASE_ICONS = {
  motor: Car,
  medical: Stethoscope,
  premises: Home,
  product: Package,
  wrongful_death: HeartPulse,
  dog_bite: PawPrint,
  wrongful_term: Briefcase,
  wage: DollarSign,
  class_action: Users,
  insurance: Shield,
  disability: Accessibility,
  professional: GraduationCap,
  civil_rights: Scale,
  ip: Lightbulb,
  workers_comp: HardHat,
  lemon_law: Car,
};

const CASE_TYPE_ORDER = [
  'motor', 'medical', 'premises', 'product', 'wrongful_death',
  'dog_bite', 'wrongful_term', 'wage', 'class_action', 'insurance',
  'disability', 'professional', 'civil_rights', 'ip', 'workers_comp',
  'lemon_law',
];

const CASE_DESCRIPTIONS = {
  motor:         'Injuries from car, truck, or motorcycle collisions.',
  medical:       'Harm caused by a doctor, nurse, or hospital error.',
  premises:      'Slip and fall or unsafe property injuries.',
  product:       'Injuries from a defective or dangerous product.',
  wrongful_death:'Compensation for a family member killed by negligence.',
  dog_bite:      'Bites or attacks by a dog or other animal.',
  wrongful_term: 'Fired illegally or discriminated against at work.',
  wage:          'Unpaid wages, overtime, or wage theft by an employer.',
  class_action:  'Group lawsuit against a company for widespread harm.',
  insurance:     'Insurer acting in bad faith to deny or delay a claim.',
  disability:    'Denied disability insurance or Social Security benefits.',
  professional:  'Malpractice by a lawyer, accountant, or other professional.',
  civil_rights:  'Rights violated by a government actor or employer.',
  ip:            'Patent, trademark, copyright, or trade secret infringement.',
  workers_comp:  'On-the-job injury or occupational illness benefits.',
  lemon_law:     'Defective vehicle that can\'t be repaired after multiple attempts.',
};

const SEVERITY_STYLES = {
  warning: 'border-yellow-500/30 bg-yellow-500/5',
  info: 'border-accent/30 bg-accent/5',
};
const SEVERITY_ICONS = {
  warning: AlertTriangle,
  info: Info,
};

export default function StateHubPage({ stateCode }) {
  const stateData = STATE_LEGAL_DATABASE[stateCode];
  const stateName = stateData?.name || stateCode;
  const stateSlug = stateCodeToSlug[stateCode];
  const negligence = stateData?.negligenceSystem;
  const negligenceLabel = negligenceLabels[negligence] || '';

  const canonicalUrl = `https://casevalue.law/states/${stateSlug}`;
  const pageTitle = `${stateName} Legal Case Calculators | CaseValue.law`;
  const pageDescription = `Find the right legal case calculator for your situation in ${stateName}. 15 practice areas including car accidents, medical malpractice, workers compensation, and more \u2014 all using ${stateName}'s specific laws.`;

  // Content engine data
  const landscapeSummary = getStateLandscapeSummary(stateCode);
  const differentiators = getStateDifferentiators(stateCode);
  const solTable = getStateSOLTable(stateCode);
  const neighbors = STATE_NEIGHBORS[stateCode] || [];
  const lastUpdated = stateData?.lastUpdated || '2026-03-06';

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://casevalue.law" },
      { "@type": "ListItem", "position": 2, "name": `${stateName} Calculators`, "item": canonicalUrl },
    ]
  };

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": `${stateName} Case Value Calculators`,
    "url": canonicalUrl,
    "applicationCategory": "LegalApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "dateModified": lastUpdated,
  };

  return (
    <BlogLayout>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="preload" as="image" type="image/webp" href={`/flags/${stateSlug}-large.webp`} fetchPriority="high" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
      </Helmet>
      <SocialMeta title={pageTitle} description={pageDescription} url={canonicalUrl} hreflang={false} />

      <div className="relative min-h-screen bg-gradient-hero overflow-hidden">
        {/* State flag background */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-75 pointer-events-none"
          style={{ backgroundImage: `url('/flags/${stateSlug}-large.webp')` }}
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
            {stateName} &middot; Choose Your Case Type
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 leading-tight">
            {stateName} Legal Case Value Calculators
          </h1>
          <p className="text-xl text-textMuted mb-8 max-w-2xl mx-auto leading-relaxed">
            Select your practice area to get a free estimate using {stateName}'s specific laws, statutes of limitations, and damage caps.
          </p>

          {/* State facts chip */}
          {negligenceLabel && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/40 border border-cardBorder/15 rounded-xl text-sm text-textMuted mb-2">
              <Scale className="w-4 h-4 text-accent shrink-0" />
              <span><span className="text-text font-semibold">{stateName}</span> uses <span className="text-text font-semibold">{negligenceLabel}</span> &mdash; statutes of limitations vary by case type below.</span>
            </div>
          )}
        </section>

        {/* State Legal Landscape Summary */}
        {landscapeSummary && landscapeSummary.length > 0 && (
          <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <h2 className="text-2xl font-bold text-text mb-6">{stateName}'s Legal Landscape</h2>
            <div className="space-y-4">
              {landscapeSummary.map((paragraph, i) => (
                <p key={i} className="text-textMuted leading-relaxed">{paragraph}</p>
              ))}
            </div>
          </section>
        )}

        {/* What Makes State Different -- Callout Cards */}
        {differentiators && differentiators.length > 0 && (
          <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <h2 className="text-xl font-bold text-text mb-4">What Makes {stateName} Different</h2>
            <div className="grid gap-3">
              {differentiators.map((card, i) => {
                const SeverityIcon = SEVERITY_ICONS[card.severity] || Info;
                return (
                  <div
                    key={i}
                    className={`flex items-start gap-4 p-5 border rounded-xl ${SEVERITY_STYLES[card.severity] || SEVERITY_STYLES.info}`}
                  >
                    <SeverityIcon className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-text font-bold text-sm mb-1">{card.title}</h3>
                      <p className="text-textMuted text-sm leading-relaxed">{card.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* SOL Comparison Table */}
        {solTable && solTable.length > 0 && (
          <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <h2 className="text-xl font-bold text-text mb-4">Statutes of Limitations in {stateName}</h2>
            <div className="bg-card/80 border border-cardBorder rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-cardBorder">
                      <th className="text-left px-4 py-3 text-textMuted font-semibold uppercase text-xs tracking-wide">Case Type</th>
                      <th className="text-center px-4 py-3 text-textMuted font-semibold uppercase text-xs tracking-wide">{stateName}</th>
                      <th className="text-center px-4 py-3 text-textMuted font-semibold uppercase text-xs tracking-wide">Nat'l Avg</th>
                    </tr>
                  </thead>
                  <tbody>
                    {solTable.map((row) => {
                      const colorClass = row.comparison === 'below'
                        ? 'text-yellow-400'
                        : row.comparison === 'above'
                          ? 'text-green-400'
                          : 'text-text';
                      return (
                        <tr key={row.caseTypeId} className="border-b border-cardBorder/50 last:border-0">
                          <td className="px-4 py-2.5">
                            <Link
                              to={`/${stateSlug}/${row.slug}-calculator`}
                              className="text-text hover:text-accent transition-colors"
                            >
                              {row.label}
                            </Link>
                          </td>
                          <td className={`text-center px-4 py-2.5 font-bold ${colorClass}`}>
                            {row.sol} yr{row.sol !== 1 ? 's' : ''}
                          </td>
                          <td className="text-center px-4 py-2.5 text-textMuted">
                            {row.avgSOL != null ? `${row.avgSOL} yrs` : '\u2014'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="px-4 py-2 border-t border-cardBorder/50 text-xs text-textMuted">
                <span className="text-yellow-400 font-bold">&bull;</span> Below average &nbsp;
                <span className="text-green-400 font-bold">&bull;</span> Above average &nbsp;
                <span className="text-text font-bold">&bull;</span> Average
              </div>
            </div>
          </section>
        )}

        {/* Practice area grid (enhanced with SOL) */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <h2 className="text-2xl font-bold text-text mb-6">Practice Areas</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CASE_TYPE_ORDER.map(caseTypeId => {
              const content = caseTypeContent[caseTypeId];
              const caseSlugVal = caseIdToSlug[caseTypeId];
              const Icon = CASE_ICONS[caseTypeId] || Calculator;
              if (!content || !caseSlugVal) return null;

              // Find SOL for this case type in this state
              const solRow = solTable?.find(r => r.caseTypeId === caseTypeId);

              return (
                <Link
                  key={caseTypeId}
                  to={`/${stateSlug}/${caseSlugVal}-calculator`}
                  className="group flex flex-col p-5 bg-card/80 border border-cardBorder rounded-2xl hover:border-accent/50 hover:bg-card/60 transition-all"
                  onClick={() => pushFunnelEvent('landing_cta_click', { page_type: 'state_hub', state: stateCode, case_type: caseTypeId, cta_position: 'practice_area_card' })}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-accent/15 rounded-lg shrink-0 group-hover:bg-accent/25 transition-colors">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <h3 className="text-base font-bold text-text leading-snug">
                      {content.heading.replace(' Case Value Calculator', '').replace(' Settlement Calculator', '').replace(' Claim Calculator', '').replace(' Case Calculator', '').replace(' Calculator', '')}
                    </h3>
                  </div>
                  <p className="text-sm text-textMuted leading-relaxed flex-1">
                    {CASE_DESCRIPTIONS[caseTypeId]}
                  </p>
                  {solRow && (
                    <div className="mt-2 text-xs text-textMuted">
                      Statute of Limitations: <span className="text-text font-semibold">{solRow.sol} yr{solRow.sol !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  <div className="mt-3 flex items-center gap-1 text-accent text-sm font-semibold">
                    Calculate in {stateName}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Neighboring States -- "Had Your Accident in a Different State?" */}
        {neighbors.length > 0 && (
          <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
            <h2 className="text-xl font-bold text-text mb-2">Had Your Accident in a Different State?</h2>
            <p className="text-sm text-textMuted mb-4">
              Which state's law applies depends on where the incident occurred, not where you live. Check neighboring states:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {neighbors.slice(0, 4).map((neighborCode) => {
                const neighborData = STATE_LEGAL_DATABASE[neighborCode];
                if (!neighborData) return null;
                const neighborSlug = stateCodeToSlug[neighborCode];
                const neighborNeg = negligenceLabels[neighborData.negligenceSystem];
                return (
                  <Link
                    key={neighborCode}
                    to={`/states/${neighborSlug}`}
                    className="group flex items-center justify-between p-4 bg-card/80 border border-cardBorder rounded-xl hover:border-accent/50 hover:bg-card/60 transition-all"
                  >
                    <div>
                      <div className="text-text font-semibold text-sm">{neighborData.name}</div>
                      {neighborNeg && (
                        <div className="text-xs text-textMuted mt-0.5">{neighborNeg}</div>
                      )}
                    </div>
                    <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform shrink-0" />
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* Legal Disclaimer */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="p-4 bg-card/30 border border-cardBorder rounded-xl">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-textMuted shrink-0 mt-0.5" />
              <div className="text-xs text-textMuted leading-relaxed">
                <p className="font-semibold text-text mb-1">Legal Disclaimer</p>
                <p>
                  This page reflects {stateName}'s statutes as of {lastUpdated}. Laws change frequently. This tool provides estimates for informational purposes only and does not constitute legal advice. Verify current rules with a {stateName}-licensed attorney. <Link to="/methodology" className="text-accent hover:underline">Learn how we calculate case values</Link>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="p-8 bg-accent/10 border-2 border-accent/30 rounded-2xl text-center">
            <h2 className="text-2xl font-bold text-text mb-3">
              Get Your {stateName} Case Estimate &mdash; Free
            </h2>
            <p className="text-textMuted mb-6">
              Select a practice area above, answer a few simple questions about your situation, and get a free case value estimate based on {stateName}'s specific laws.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-gold text-textDark rounded-xl font-bold hover:opacity-90 transition-all"
              onClick={() => pushFunnelEvent('landing_cta_click', { page_type: 'state_hub', state: stateCode, cta_position: 'bottom' })}
            >
              Start Free {stateName} Estimate
              <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="mt-3 text-sm text-textMuted">Quick &amp; easy &middot; Takes 2 minutes &middot; 100% free</p>
          </div>
        </section>
        </div>{/* end relative content wrapper */}
      </div>
    </BlogLayout>
  );
}
