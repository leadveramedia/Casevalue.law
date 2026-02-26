// ============================================================================
// CALCULATOR LANDING PAGE
// Practice area landing page for /calculator/:caseSlug routes.
// Provides crawlable SEO content, FAQ accordion with FAQPage JSON-LD,
// and a CTA that launches the calculator for the pre-selected case type.
// ============================================================================
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, ChevronUp, ArrowRight, Calculator } from 'lucide-react';
import BlogLayout from '../BlogLayout';
import { caseTypeSEO, caseTypeContent, caseIdToSlug } from '../../constants/caseTypeSlugs';
import { caseTypes } from '../../constants/caseTypes';
import SocialMeta from '../SocialMeta';

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

export default function CalculatorLandingPage({ caseTypeId }) {
  const [openFAQ, setOpenFAQ] = useState(null);

  const seo = caseTypeSEO[caseTypeId];
  const content = caseTypeContent[caseTypeId];
  const slug = caseIdToSlug[caseTypeId];
  const calculatorLink = `/#case/${caseTypeId}/0`;
  const canonicalUrl = `https://casevalue.law/calculator/${slug}`;

  const caseType = caseTypes.find(c => c.id === caseTypeId);
  const heroImg = caseType?.img?.replace('w=400', 'w=1200') ?? caseType?.img;

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": content.faqs.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a
      }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://casevalue.law" },
      { "@type": "ListItem", "position": 2, "name": content.heading, "item": canonicalUrl }
    ]
  };

  return (
    <BlogLayout ctaLink={calculatorLink}>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <link rel="canonical" href={canonicalUrl} />
        {heroImg && <link rel="preload" as="image" href={heroImg} fetchPriority="high" />}
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
      <SocialMeta title={seo.title} description={seo.description} url={canonicalUrl} />

      <div className="relative min-h-screen bg-gradient-hero overflow-hidden">
        {heroImg && (
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-75 pointer-events-none"
            style={{ backgroundImage: `url('${heroImg}')` }}
            aria-hidden="true"
          />
        )}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(26,31,58,0.78) 35%, rgba(26,31,58,0.78) 65%, transparent 100%)' }}
          aria-hidden="true"
        />

        <div className="relative">
        {/* Hero Section */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/15 border border-accent/30 rounded-full text-accent text-sm font-semibold mb-6">
            <Calculator className="w-4 h-4" />
            Free Case Value Calculator
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text mb-6 leading-tight">
            {content.heading}
          </h1>
          <p className="text-xl text-textMuted mb-10 max-w-2xl mx-auto leading-relaxed">
            {content.intro}
          </p>
          <Link
            to={calculatorLink}
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-gold text-textDark rounded-2xl font-bold text-lg hover:opacity-90 transition-all shadow-card hover:shadow-glow-gold-soft transform hover:scale-[1.02] active:scale-[0.99]"
          >
            Start Free Calculator
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-4 text-sm text-textMuted">Quick & easy · Takes 2 minutes · 100% free</p>
        </section>

        {/* Trust Stats */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-3 gap-4 p-6 bg-card/30 backdrop-blur-xl border border-cardBorder rounded-2xl">
            {[
              { stat: "25,000+", label: "Cases Valued" },
              { stat: "50 States", label: "State-Specific Laws" },
              { stat: "100% Free", label: "No Hidden Costs" },
            ].map(({ stat, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-accent">{stat}</div>
                <div className="text-sm text-textMuted mt-1">{label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <h2 className="text-3xl font-bold text-text mb-8 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {content.faqs.map((faq, i) => (
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
            <h3 className="text-2xl font-bold text-text mb-3">Ready to Find Out What Your Case Is Worth?</h3>
            <p className="text-textMuted mb-6">
              Answer a few questions about your situation. Our calculator uses state-specific laws and real case data to estimate your settlement value — free, private, and instant.
            </p>
            <Link
              to={calculatorLink}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-gold text-textDark rounded-xl font-bold hover:opacity-90 transition-all"
            >
              Calculate My Case Value
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>

        </div>{/* end relative content wrapper */}
      </div>
    </BlogLayout>
  );
}
