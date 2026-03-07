import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import BlogLayout from '../BlogLayout';
import SocialMeta from '../SocialMeta';
import PrivacyPolicy from '../PrivacyPolicy';

const CANONICAL_URL = 'https://casevalue.law/privacy';

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://casevalue.law" },
    { "@type": "ListItem", "position": 2, "name": "Privacy Policy", "item": CANONICAL_URL },
  ]
};

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();

  return (
    <BlogLayout>
      <Helmet>
        <title>Privacy Policy | CaseValue.law</title>
        <meta name="description" content="CaseValue.law privacy policy. Learn how we collect, use, and protect your information." />
        <link rel="canonical" href={CANONICAL_URL} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>
      <SocialMeta
        title="Privacy Policy | CaseValue.law"
        description="CaseValue.law privacy policy. Learn how we collect, use, and protect your information."
        url={CANONICAL_URL}
        hreflang={false}
      />
      <PrivacyPolicy lang="en" onClose={() => navigate('/')} />
    </BlogLayout>
  );
}
