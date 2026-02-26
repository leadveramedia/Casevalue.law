import { Helmet } from 'react-helmet-async';
import { caseTypeSEO, caseIdToSlug } from '../constants/caseTypeSlugs';

/**
 * Get SEO-optimized meta tags based on current step and case type
 * @param {string} step - Current application step
 * @param {string} selectedCase - Selected case type ID
 * @param {Object} t - UI translations object
 * @param {string|null} initialCaseType - Pre-selected case type from /calculator/:slug route
 * @returns {Object} Object with title and description
 */
export function getMetaTags(step, selectedCase, t, initialCaseType = null) {
  // If on a practice area page (via /calculator/:slug), use dedicated SEO content
  if (initialCaseType && caseTypeSEO[initialCaseType]) {
    const seo = caseTypeSEO[initialCaseType];
    const caseTypeName = t.caseTypes[initialCaseType] || initialCaseType;

    if (step === 'state') {
      return seo;
    } else if (step === 'questionnaire') {
      return {
        title: `${caseTypeName} Calculator Questions | CaseValue.law`,
        description: `Answer questions about your ${caseTypeName.toLowerCase()} case to calculate its value. Free instant estimate based on your specific case details.`,
      };
    } else if (step === 'contact') {
      return {
        title: `Get Your ${caseTypeName} Case Valuation Results`,
        description: `Enter your information to receive your personalized ${caseTypeName.toLowerCase()} case valuation based on your specific details and state laws.`,
      };
    } else if (step === 'results') {
      return {
        title: `Your ${caseTypeName} Case Valuation Results - What Your Case Is Worth`,
        description: `View your ${caseTypeName.toLowerCase()} case value estimate. See key factors affecting your case worth and settlement range.`,
      };
    }
    // Fallback for practice area pages
    return seo;
  }

  // Default homepage meta tags - optimized for broad keywords
  let title = "What's My Case Worth? Free Case Value Calculator";
  let description = "Free case value calculator for personal injury, employment law, and IP cases. Get an instant estimate of what your case is worth with our data-driven legal case value estimator.";

  const caseTypeName = selectedCase ? (t.caseTypes[selectedCase] || selectedCase) : '';

  if (step === 'select') {
    title = 'Legal Case Value Calculator - Personal Injury, Employment & IP Cases';
    description = 'Free legal case value calculator. Select your case type - personal injury, employment law, or intellectual property. Get instant case value estimates based on real case data.';
  } else if (step === 'contact') {
    title = 'Get Your Free Case Valuation Results - Case Value Estimator';
    description = 'Enter your information to receive your personalized case valuation. Free case value estimate based on your specific case details and local laws.';
  } else if (step === 'results' && selectedCase) {
    title = `Your ${caseTypeName} Case Valuation Results - What Your Case Is Worth`;
    description = `View your ${caseTypeName.toLowerCase()} case value estimate. See key factors affecting your case worth and settlement range based on similar cases.`;
  }

  return { title, description };
}

/**
 * Generate Schema.org structured data for SEO
 * @param {string} selectedCase - Selected case type
 * @param {Object} t - UI translations object
 * @returns {Object} Schema.org JSON-LD object
 */
export function generateStructuredData(selectedCase, t) {
  const baseSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://casevalue.law/#website",
        "url": "https://casevalue.law",
        "name": "CaseValue.Law",
        "description": "Free legal case value calculator for personal injury, employment law, and intellectual property cases",
        "publisher": {
          "@id": "https://casevalue.law/#organization"
        },
        "inLanguage": ["en-US", "es", "zh"]
      },
      {
        "@type": ["Organization", "LegalService", "LocalBusiness"],
        "@id": "https://casevalue.law/#organization",
        "name": "CaseValue.Law",
        "url": "https://casevalue.law",
        "logo": {
          "@type": "ImageObject",
          "url": "https://casevalue.law/logo-512x512.png",
          "width": 512,
          "height": 512
        },
        "description": "Free legal case value calculator and legal information resource",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "1401 21st ST STE R",
          "addressLocality": "Sacramento",
          "addressRegion": "CA",
          "postalCode": "95811",
          "addressCountry": "US"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": "38.5816",
          "longitude": "-121.4944"
        },
        "areaServed": [
          { "@type": "State", "name": "California" },
          { "@type": "State", "name": "Texas" },
          { "@type": "State", "name": "New York" },
          { "@type": "State", "name": "Florida" },
          { "@type": "State", "name": "Illinois" },
          { "@type": "State", "name": "Pennsylvania" },
          { "@type": "Country", "name": "United States" }
        ],
        "priceRange": "Free",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "email": "info@casevalue.law",
          "availableLanguage": ["English", "Spanish", "Chinese"]
        },
        "sameAs": [
          "https://twitter.com/casevalue"
        ],
        "knowsAbout": [
          "Personal Injury Law",
          "Medical Malpractice",
          "Car Accident Claims",
          "Wrongful Death",
          "Employment Discrimination",
          "Wrongful Termination",
          "Patent Infringement",
          "Copyright Infringement",
          "Trademark Infringement"
        ]
      },
      {
        "@type": "WebApplication",
        "name": "CaseValue.law - Legal Case Value Calculator",
        "applicationCategory": "LegalApplication",
        "description": "Free legal case value calculator for personal injury, employment law, and intellectual property cases. Get instant estimates of what your case is worth.",
        "url": "https://casevalue.law",
        "image": "https://casevalue.law/casevalue-preview.webp",
        "screenshot": "https://casevalue.law/casevalue-preview.webp",
        "operatingSystem": "Any",
        "browserRequirements": "Requires JavaScript. Requires HTML5.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
          "description": "Free case valuation tool"
        },
        "featureList": [
          "Personal injury calculator",
          "Employment law case estimator",
          "Intellectual property case valuation",
          "State-specific calculations",
          "Instant case value estimates"
        ],
        "provider": {
          "@id": "https://casevalue.law/#organization"
        },
        "inLanguage": ["en-US", "es", "zh"]
      },
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://casevalue.law"
          },
          ...(selectedCase && caseIdToSlug[selectedCase] ? [{
            "@type": "ListItem",
            "position": 2,
            "name": t.caseTypes[selectedCase] || selectedCase,
            "item": `https://casevalue.law/calculator/${caseIdToSlug[selectedCase]}`
          }] : [])
        ]
      }
    ]
  };

  // Add specific case type if selected
  if (selectedCase) {
    const caseTypeName = t.caseTypes[selectedCase] || selectedCase;
    // We modify the WebApplication part of the graph
    const webApp = baseSchema["@graph"].find(item => item["@type"] === "WebApplication");
    if (webApp) {
      webApp.name = `${caseTypeName} Case Value Calculator - CaseValue.law`;
      webApp.description = `Free ${caseTypeName.toLowerCase()} case calculator. Get instant estimates of what your ${caseTypeName.toLowerCase()} case is worth.`;
    }
  }

  return baseSchema;
}

/**
 * Custom hook to manage document metadata and SEO using react-helmet-async
 * @param {string} step - Current application step
 * @param {string} selectedCase - Selected case type
 * @param {Object} t - UI translations object
 * @returns {Object} Helmet component with meta tags and structured data
 */
export function useMetadata(step, selectedCase, t, initialCaseType = null) {
  const { title, description } = getMetaTags(step, selectedCase, t, initialCaseType);
  const structuredData = generateStructuredData(selectedCase, t);

  // Return the Helmet component configuration
  return {
    title,
    description,
    structuredData,
    // Render method to be used in components
    MetaTags: () => (
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://casevalue.law${window.location.pathname || '/'}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://casevalue.law/casevalue-preview.webp" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={`https://casevalue.law${window.location.pathname || '/'}`} />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content="https://casevalue.law/casevalue-preview.webp" />

        {/* Canonical URL - Always point to clean URL without query params */}
        <link rel="canonical" href={`https://casevalue.law${window.location.pathname || '/'}`} />

        {/* Hreflang tags for multi-language support
            Note: All point to the same URL since language is handled client-side.
            The hreflang attribute indicates which language each page serves. */}
        <link rel="alternate" hreflang="en" href={`https://casevalue.law${window.location.pathname || '/'}`} />
        <link rel="alternate" hreflang="es" href={`https://casevalue.law${window.location.pathname || '/'}`} />
        <link rel="alternate" hreflang="zh" href={`https://casevalue.law${window.location.pathname || '/'}`} />
        <link rel="alternate" hreflang="x-default" href={`https://casevalue.law${window.location.pathname || '/'}`} />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
    )
  };
}
