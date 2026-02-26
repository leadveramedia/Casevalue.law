import { Helmet } from 'react-helmet-async';

const DEFAULT_IMAGE = 'https://casevalue.law/casevalue-preview.webp';

/**
 * Shared social meta tags (OG + Twitter Card + hreflang) for SEO landing pages.
 * Drop this into any page's Helmet to get complete social sharing support.
 *
 * @param {string} title - Page title
 * @param {string} description - Page description
 * @param {string} url - Canonical URL for this page
 * @param {string} [image] - Social preview image URL (defaults to site preview)
 * @param {string} [type] - OG type (defaults to "website")
 */
export default function SocialMeta({ title, description, url, image = DEFAULT_IMAGE, type = 'website' }) {
  return (
    <Helmet>
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content={type} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Hreflang — all point to same URL since language is client-side */}
      <link rel="alternate" hreflang="en" href={url} />
      <link rel="alternate" hreflang="es" href={url} />
      <link rel="alternate" hreflang="zh" href={url} />
      <link rel="alternate" hreflang="x-default" href={url} />
    </Helmet>
  );
}
