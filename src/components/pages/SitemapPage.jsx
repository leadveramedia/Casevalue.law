// ============================================================================
// SITEMAP PAGE
// ============================================================================
// User-facing HTML sitemap with grouped sections for easy navigation.
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, Scale, MapPin, BookOpen } from 'lucide-react';
import BlogLayout from '../BlogLayout';
import SocialMeta from '../SocialMeta';
import { caseSlugToId } from '../../constants/caseTypeSlugs';
import { allStateSlugs, stateSlugToInfo } from '../../constants/stateSlugMap';

const CANONICAL_URL = 'https://casevalue.law/sitemap';
const PAGE_TITLE = 'Sitemap | CaseValue.law';
const PAGE_DESCRIPTION = 'Browse all pages on CaseValue.law — practice area calculators, state-specific legal resources, and blog articles.';

// Human-readable case type names (English only — this is an SEO page)
const CASE_TYPE_NAMES = {
  motor: 'Motor Vehicle Accidents',
  medical: 'Medical Malpractice',
  premises: 'Premises Liability',
  product: 'Product Liability',
  wrongful_death: 'Wrongful Death',
  dog_bite: 'Dog Bites & Animal Attacks',
  wrongful_term: 'Wrongful Termination',
  wage: 'Wage & Hour Disputes',
  class_action: 'Class Action Lawsuits',
  insurance: 'Insurance Bad Faith',
  disability: 'Social Security Disability',
  professional: 'Professional Malpractice',
  civil_rights: 'Civil Rights Violations',
  ip: 'Intellectual Property',
  workers_comp: "Worker's Compensation",
};

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://casevalue.law' },
    { '@type': 'ListItem', position: 2, name: 'Sitemap', item: CANONICAL_URL },
  ],
};

function SectionHeading({ icon: Icon, children }) {
  return (
    <h2 className="text-2xl md:text-3xl font-bold text-text flex items-center gap-3 mb-6">
      <Icon className="w-7 h-7 text-accent" />
      {children}
    </h2>
  );
}

function SitemapLink({ to, children }) {
  return (
    <li>
      <Link
        to={to}
        className="text-accent hover:text-accentHover underline transition-colors font-medium"
      >
        {children}
      </Link>
    </li>
  );
}

export default function SitemapPage() {
  const caseTypeSlugs = Object.keys(caseSlugToId);

  return (
    <BlogLayout>
      <Helmet>
        <title>{PAGE_TITLE}</title>
        <meta name="description" content={PAGE_DESCRIPTION} />
        <link rel="canonical" href={CANONICAL_URL} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
      <SocialMeta title={PAGE_TITLE} description={PAGE_DESCRIPTION} url={CANONICAL_URL} />

      <div className="min-h-screen bg-gradient-hero">
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-text text-center mb-4">
            Sitemap
          </h1>
          <p className="text-lg text-textMuted text-center mb-16 max-w-2xl mx-auto">
            Browse all pages on CaseValue.law
          </p>

          <div className="space-y-12">
            {/* Home */}
            <div className="bg-card/50 backdrop-blur-xl border border-cardBorder rounded-2xl p-6 md:p-8">
              <SectionHeading icon={Home}>Home</SectionHeading>
              <ul className="space-y-2">
                <SitemapLink to="/">CaseValue.law — Free Legal Case Value Calculator</SitemapLink>
              </ul>
            </div>

            {/* Practice Area Calculators */}
            <div className="bg-card/50 backdrop-blur-xl border border-cardBorder rounded-2xl p-6 md:p-8">
              <SectionHeading icon={Scale}>Practice Area Calculators</SectionHeading>
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-2">
                {caseTypeSlugs.map((slug) => {
                  const caseId = caseSlugToId[slug];
                  return (
                    <SitemapLink key={slug} to={`/calculator/${slug}`}>
                      {CASE_TYPE_NAMES[caseId] || slug}
                    </SitemapLink>
                  );
                })}
              </ul>
            </div>

            {/* States */}
            <div className="bg-card/50 backdrop-blur-xl border border-cardBorder rounded-2xl p-6 md:p-8">
              <SectionHeading icon={MapPin}>States</SectionHeading>
              <ul className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-2">
                {allStateSlugs.map((slug) => (
                  <SitemapLink key={slug} to={`/states/${slug}`}>
                    {stateSlugToInfo[slug]?.name || slug}
                  </SitemapLink>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="bg-card/50 backdrop-blur-xl border border-cardBorder rounded-2xl p-6 md:p-8">
              <SectionHeading icon={BookOpen}>Resources</SectionHeading>
              <ul className="space-y-2">
                <SitemapLink to="/blog">Blog</SitemapLink>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </BlogLayout>
  );
}
