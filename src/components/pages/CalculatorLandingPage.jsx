// ============================================================================
// CALCULATOR LANDING PAGE
// Practice area landing page for /calculator/:caseSlug routes.
// Provides crawlable SEO content, FAQ accordion with FAQPage JSON-LD,
// and a CTA that launches the calculator for the pre-selected case type.
// ============================================================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronDown, ChevronUp, ArrowRight, Calculator, MapPin, BookOpen } from 'lucide-react';
import BlogLayout from '../BlogLayout';
import { caseTypeSEO, caseTypeContent, caseIdToSlug } from '../../constants/caseTypeSlugs';
import { caseTypes } from '../../constants/caseTypes';
import { STATE_LEGAL_DATABASE } from '../../constants/stateLegalDatabase';
import { stateCodeToSlug } from '../../constants/stateSlugMap';
import { caseTypeToCategorySlug } from '../../utils/categoryToCaseType';
import { getPostsByCategory, urlFor } from '../../utils/sanityClient';
import SocialMeta from '../SocialMeta';

const CONTENT_LAST_REVIEWED = '2026-03-07';

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
      <div id={`faq-panel-${index}`} hidden={!isOpen} className="px-6 pb-5 text-textMuted leading-relaxed border-t border-cardBorder/15 pt-4">
        {faq.a}
      </div>
    </div>
  );
}

export default function CalculatorLandingPage({ caseTypeId }) {
  const [openFAQ, setOpenFAQ] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  const seo = caseTypeSEO[caseTypeId];
  const content = caseTypeContent[caseTypeId];
  const slug = caseIdToSlug[caseTypeId];
  const calculatorLink = `/#case/${caseTypeId}/0`;
  const canonicalUrl = `https://casevalue.law/calculator/${slug}`;

  const caseType = caseTypes.find(c => c.id === caseTypeId);
  const heroImg = caseType?.img?.replace('w=400', 'w=1200') ?? caseType?.img;

  // Fetch related blog posts for this case type
  useEffect(() => {
    const categorySlug = caseTypeToCategorySlug[caseTypeId];
    if (!categorySlug) return;
    getPostsByCategory(categorySlug)
      .then(posts => setRelatedPosts(posts.slice(0, 3)))
      .catch(() => {});
  }, [caseTypeId]);

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

  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": content.heading,
    "url": canonicalUrl,
    "applicationCategory": "LegalApplication",
    "operatingSystem": "Any",
    "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" },
    "dateModified": CONTENT_LAST_REVIEWED,
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
        <script type="application/ld+json">{JSON.stringify(webAppSchema)}</script>
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
          <div className="grid grid-cols-3 gap-4 p-6 bg-card/30 backdrop-blur-xl border border-cardBorder/15 rounded-2xl">
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
                index={i}
                isOpen={openFAQ === i}
                onToggle={() => setOpenFAQ(openFAQ === i ? null : i)}
              />
            ))}
          </div>
        </section>

        {/* Recommended Reading — blog posts for this case type */}
        {relatedPosts.length > 0 && (
          <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <h2 className="text-2xl font-bold text-text mb-6 text-center">Recommended Reading</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              {relatedPosts.map(post => (
                <Link
                  key={post._id}
                  to={`/blog/${post.slug?.current}`}
                  className="group bg-card/50 border border-cardBorder/15 rounded-xl overflow-hidden hover:border-accent/50 transition-all"
                >
                  {post.mainImage && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={urlFor(post.mainImage).width(400).format('webp').url()}
                        alt={post.mainImage?.alt || post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="text-sm font-semibold text-text leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-xs text-textMuted mt-2 line-clamp-2">{post.excerpt}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-4">
              <Link to="/blog" className="text-sm text-accent hover:underline">
                View all articles &rarr;
              </Link>
            </div>
          </section>
        )}

        {/* Legal Disclaimer + Freshness Signal */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <div className="p-4 bg-card/30 border border-cardBorder rounded-xl">
            <div className="flex items-start gap-3">
              <BookOpen className="w-5 h-5 text-textMuted shrink-0 mt-0.5" />
              <div className="text-xs text-textMuted leading-relaxed">
                <p className="font-semibold text-text mb-1">Legal Disclaimer</p>
                <p>
                  Information on this page reflects current state laws as of {CONTENT_LAST_REVIEWED}. This tool provides estimates for informational purposes only and does not constitute legal advice. Verify current rules with a licensed attorney before making decisions about your case. <Link to="/methodology" className="text-accent hover:underline">Learn about our methodology</Link>.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Browse by State */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <h2 className="text-2xl font-bold text-text mb-2 text-center flex items-center justify-center gap-2">
            <MapPin className="w-6 h-6 text-accent" />
            Browse by State
          </h2>
          <p className="text-sm text-textMuted text-center mb-6">
            Select your state for a calculator using your state's specific laws.
          </p>
          <div className="grid grid-flow-col grid-rows-[repeat(26,auto)] sm:grid-rows-[repeat(17,auto)] md:grid-rows-[repeat(13,auto)] lg:grid-rows-[repeat(11,auto)] gap-2">
            {Object.entries(STATE_LEGAL_DATABASE)
              .sort(([, a], [, b]) => a.name.localeCompare(b.name))
              .map(([code, data]) => {
                const stateSlugVal = stateCodeToSlug[code];
                return (
                  <Link
                    key={code}
                    to={`/${stateSlugVal}/${slug}-calculator`}
                    className="px-3 py-2 bg-card/40 border border-cardBorder rounded-lg text-sm text-text hover:border-accent/50 hover:bg-card/60 transition-all text-center truncate"
                  >
                    {data.name}
                  </Link>
                );
              })
            }
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="p-8 bg-accent/10 border-2 border-accent/30 rounded-2xl backdrop-blur-xl text-center">
            <h3 className="text-2xl font-bold text-text mb-3">Ready to Find Out What Your Case Is Worth?</h3>
            <p className="text-textMuted mb-6">
              Answer a few questions about your situation. Our calculator uses state-specific laws and real case data to estimate your settlement value &mdash; free, private, and instant.
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
