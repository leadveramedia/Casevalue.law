import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import BlogLayout from '../BlogLayout';
import SocialMeta from '../SocialMeta';
import TermsOfService from '../TermsOfService';

const CANONICAL_URL = 'https://casevalue.law/terms';

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://casevalue.law" },
    { "@type": "ListItem", "position": 2, "name": "Terms of Service", "item": CANONICAL_URL },
  ]
};

export default function TermsOfServicePage() {
  const navigate = useNavigate();

  return (
    <BlogLayout>
      <Helmet>
        <title>Terms of Service | CaseValue.law</title>
        <meta name="description" content="CaseValue.law terms of service. Review the terms governing use of our legal case value calculator." />
        <link rel="canonical" href={CANONICAL_URL} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
      <SocialMeta
        title="Terms of Service | CaseValue.law"
        description="CaseValue.law terms of service. Review the terms governing use of our legal case value calculator."
        url={CANONICAL_URL}
        hreflang={false}
      />
      <TermsOfService lang="en" onClose={() => navigate('/')} />
    </BlogLayout>
  );
}
