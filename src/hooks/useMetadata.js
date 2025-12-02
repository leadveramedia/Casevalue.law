import { Helmet } from 'react-helmet-async';

/**
 * Get SEO-optimized meta tags based on current step and case type
 * @param {string} step - Current application step
 * @param {string} selectedCase - Selected case type
 * @param {Object} t - UI translations object
 * @returns {Object} Object with title and description
 */
export function getMetaTags(step, selectedCase, t) {
  // Default homepage meta tags - optimized for broad keywords
  let title = "What's My Case Worth? Free Legal Case Value Calculator | CaseValue.law";
  let description = "Free case value calculator for personal injury, employment law, and IP cases. Get an instant estimate of what your case is worth with our data-driven legal case value estimator.";

  // Case type specific keywords mapping
  const caseKeywords = {
    'personal-injury': {
      short: 'Personal Injury',
      calculator: 'personal injury calculator',
      estimator: 'injury case value estimator'
    },
    'medical-malpractice': {
      short: 'Medical Malpractice',
      calculator: 'medical malpractice calculator',
      estimator: 'malpractice case estimator'
    },
    'car-accident': {
      short: 'Car Accident',
      calculator: 'car accident settlement calculator',
      estimator: 'auto accident case value'
    },
    'slip-and-fall': {
      short: 'Slip and Fall',
      calculator: 'slip and fall calculator',
      estimator: 'premises liability case value'
    },
    'wrongful-death': {
      short: 'Wrongful Death',
      calculator: 'wrongful death calculator',
      estimator: 'wrongful death case value'
    },
    'product-liability': {
      short: 'Product Liability',
      calculator: 'product liability calculator',
      estimator: 'defective product case value'
    },
    'workplace-injury': {
      short: 'Workplace Injury',
      calculator: 'workplace injury calculator',
      estimator: 'work injury claim value'
    },
    'employment-discrimination': {
      short: 'Employment Discrimination',
      calculator: 'discrimination case calculator',
      estimator: 'employment discrimination claim value'
    },
    'wrongful-termination': {
      short: 'Wrongful Termination',
      calculator: 'wrongful termination calculator',
      estimator: 'wrongful termination case value'
    },
    'wage-dispute': {
      short: 'Wage Dispute',
      calculator: 'wage dispute calculator',
      estimator: 'unpaid wages claim value'
    },
    'sexual-harassment': {
      short: 'Sexual Harassment',
      calculator: 'harassment case calculator',
      estimator: 'sexual harassment claim value'
    },
    'retaliation': {
      short: 'Workplace Retaliation',
      calculator: 'retaliation case calculator',
      estimator: 'retaliation claim value'
    },
    'hostile-work-environment': {
      short: 'Hostile Work Environment',
      calculator: 'hostile work environment calculator',
      estimator: 'hostile workplace claim value'
    },
    'patent-infringement': {
      short: 'Patent Infringement',
      calculator: 'patent infringement calculator',
      estimator: 'patent case value estimator'
    },
    'copyright-infringement': {
      short: 'Copyright Infringement',
      calculator: 'copyright infringement calculator',
      estimator: 'copyright case value'
    },
    'trademark-infringement': {
      short: 'Trademark Infringement',
      calculator: 'trademark infringement calculator',
      estimator: 'trademark case value'
    }
  };

  const caseInfo = caseKeywords[selectedCase];
  const caseTypeName = selectedCase ? (t.caseTypes[selectedCase] || caseInfo?.short || selectedCase) : '';

  if (step === 'select') {
    title = 'Legal Case Value Calculator - Personal Injury, Employment & IP Cases';
    description = 'Free legal case value calculator. Select your case type - personal injury, employment law, or intellectual property. Get instant case value estimates based on real case data.';
  } else if (step === 'state' && selectedCase && caseInfo) {
    title = `${caseInfo.short} Case Value Calculator - What's My ${caseInfo.short} Case Worth?`;
    description = `Free ${caseInfo.calculator}. Select your state to get an accurate ${caseInfo.estimator}. Calculate your case worth with our data-driven ${caseInfo.short.toLowerCase()} case estimator.`;
  } else if (step === 'questionnaire' && selectedCase && caseInfo) {
    title = `${caseInfo.short} ${step === 'questionnaire' ? 'Calculator Questions' : 'Case Estimator'} | CaseValue.law`;
    description = `Answer questions about your ${caseInfo.short.toLowerCase()} case to calculate its value. Our ${caseInfo.calculator} provides instant estimates. Find out what your case is worth now.`;
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
        "@type": "Organization",
        "name": "CaseValue.law",
        "url": "https://casevalue.law",
        "logo": {
          "@type": "ImageObject",
          "url": "https://casevalue.law/casevalue-preview.webp",
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
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "customer service",
          "email": "info@casevalue.law",
          "availableLanguage": ["English", "Spanish", "Chinese"]
        },
        "sameAs": [
          "https://twitter.com/casevalue"
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
          "@type": "LegalService",
          "name": "CaseValue.law",
          "url": "https://casevalue.law",
          "logo": "https://casevalue.law/casevalue-preview.webp",
          "image": "https://casevalue.law/casevalue-preview.webp",
          "description": "Free legal case value calculator and legal information resource.",
          "address": {
            "@type": "PostalAddress",
            "streetAddress": "1401 21st ST STE R",
            "addressLocality": "Sacramento",
            "addressRegion": "CA",
            "postalCode": "95811",
            "addressCountry": "USA"
          },
          "areaServed": {
            "@type": "Country",
            "name": "United States"
          },
          "sameAs": [
            "https://twitter.com/casevalue"
          ]
        },
        "availableLanguage": [
          {
            "@type": "Language",
            "name": "English",
            "alternateName": "en"
          },
          {
            "@type": "Language",
            "name": "Spanish",
            "alternateName": "es"
          },
          {
            "@type": "Language",
            "name": "Chinese",
            "alternateName": "zh"
          }
        ]
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
          ...(selectedCase ? [{
            "@type": "ListItem",
            "position": 2,
            "name": t.caseTypes[selectedCase] || selectedCase,
            "item": `https://casevalue.law/${selectedCase}`
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
export function useMetadata(step, selectedCase, t) {
  const { title, description } = getMetaTags(step, selectedCase, t);
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
        <meta property="og:url" content="https://casevalue.law" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content="https://casevalue.law/casevalue-preview.webp" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://casevalue.law" />
        <meta property="twitter:title" content={title} />
        <meta property="twitter:description" content={description} />
        <meta property="twitter:image" content="https://casevalue.law/casevalue-preview.webp" />

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
