// ============================================================================
// STATE HUB PAGE
// Landing page for /states/:stateSlug — shows all 15 practice area calculators
// for the selected state, letting the user pick their case type.
// ============================================================================
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Calculator, Scale,
  Car, Stethoscope, Home, Package, HeartPulse, PawPrint, Briefcase,
  DollarSign, Users, Shield, Accessibility, GraduationCap, Lightbulb,
  HardHat, ArrowRight,
} from 'lucide-react';
import BlogLayout from '../BlogLayout';
import { caseTypeContent, caseIdToSlug } from '../../constants/caseTypeSlugs';
import { STATE_LEGAL_DATABASE } from '../../constants/stateLegalDatabase';
import { negligenceLabels, stateCodeToSlug } from '../../constants/stateSlugMap';

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
};

const CASE_TYPE_ORDER = [
  'motor', 'medical', 'premises', 'product', 'wrongful_death',
  'dog_bite', 'wrongful_term', 'wage', 'class_action', 'insurance',
  'disability', 'professional', 'civil_rights', 'ip', 'workers_comp',
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
};

export default function StateHubPage({ stateCode }) {
  const stateData = STATE_LEGAL_DATABASE[stateCode];
  const stateName = stateData?.name || stateCode;
  const stateSlug = stateCodeToSlug[stateCode];
  const negligence = stateData?.negligenceSystem;
  const negligenceLabel = negligenceLabels[negligence] || '';

  const canonicalUrl = `https://casevalue.law/states/${stateSlug}`;
  const pageTitle = `${stateName} Legal Case Calculators | CaseValue.law`;
  const pageDescription = `Find the right legal case calculator for your situation in ${stateName}. 15 practice areas including car accidents, medical malpractice, workers compensation, and more — all using ${stateName}'s specific laws.`;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://casevalue.law" },
      { "@type": "ListItem", "position": 2, "name": `${stateName} Calculators`, "item": canonicalUrl },
    ]
  };

  return (
    <BlogLayout>
      <Helmet>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://casevalue.law/casevalue-preview.webp" />
        <link rel="preload" as="image" href={`/flags/${stateSlug}-large.png`} fetchPriority="high" />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

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
            {stateName} · Choose Your Case Type
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4 leading-tight">
            {stateName} Legal Case Value Calculators
          </h1>
          <p className="text-xl text-textMuted mb-8 max-w-2xl mx-auto leading-relaxed">
            Select your practice area to get a free estimate using {stateName}'s specific laws, statutes of limitations, and damage caps.
          </p>

          {/* State facts chip */}
          {negligenceLabel && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/40 border border-cardBorder rounded-xl text-sm text-textMuted mb-2">
              <Scale className="w-4 h-4 text-accent shrink-0" />
              <span><span className="text-text font-semibold">{stateName}</span> uses <span className="text-text font-semibold">{negligenceLabel}</span> — statutes of limitations vary by case type below.</span>
            </div>
          )}
        </section>

        {/* Practice area grid */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CASE_TYPE_ORDER.map(caseTypeId => {
              const content = caseTypeContent[caseTypeId];
              const caseSlug = caseIdToSlug[caseTypeId];
              const Icon = CASE_ICONS[caseTypeId] || Calculator;
              if (!content || !caseSlug) return null;
              return (
                <Link
                  key={caseTypeId}
                  to={`/${stateSlug}/${caseSlug}-calculator`}
                  className="group flex flex-col p-5 bg-card/40 backdrop-blur-xl border border-cardBorder rounded-2xl hover:border-accent/50 hover:bg-card/60 transition-all"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="p-2 bg-accent/15 rounded-lg shrink-0 group-hover:bg-accent/25 transition-colors">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <h2 className="text-base font-bold text-text leading-snug">
                      {content.heading.replace(' Calculator', '').replace(' Settlement Calculator', '').replace(' Case Value Calculator', '')}
                    </h2>
                  </div>
                  <p className="text-sm text-textMuted leading-relaxed flex-1">
                    {CASE_DESCRIPTIONS[caseTypeId]}
                  </p>
                  <div className="mt-4 flex items-center gap-1 text-accent text-sm font-semibold">
                    Calculate in {stateName}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
        </div>{/* end relative content wrapper */}
      </div>
    </BlogLayout>
  );
}
