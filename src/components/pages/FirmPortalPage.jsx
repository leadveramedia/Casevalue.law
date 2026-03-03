/**
 * FirmPortalPage — Law firm portal for embedding the CaseValue.law calculator.
 * Free tier: basic embed delivered by email.
 * Paid ($49/month via Stripe): white-label branding + real-time lead routing.
 */
import { useState, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Scale, Zap, Star } from 'lucide-react';
import Navigation from '../Navigation';
import SocialMeta from '../SocialMeta';
import Footer from '../Footer';

const CASE_TYPE_OPTIONS = [
  { id: 'motor', name: 'Motor Vehicle Accidents' },
  { id: 'medical', name: 'Medical Malpractice' },
  { id: 'premises', name: 'Premises Liability' },
  { id: 'product', name: 'Product Liability' },
  { id: 'wrongful_death', name: 'Wrongful Death' },
  { id: 'dog_bite', name: 'Dog Bites & Animal Attacks' },
  { id: 'wrongful_term', name: 'Wrongful Termination' },
  { id: 'wage', name: 'Wage & Hour Disputes' },
  { id: 'class_action', name: 'Class Action Lawsuits' },
  { id: 'insurance', name: 'Insurance Bad Faith' },
  { id: 'disability', name: 'Social Security Disability' },
  { id: 'professional', name: 'Professional Malpractice' },
  { id: 'civil_rights', name: 'Civil Rights Violations' },
  { id: 'ip', name: 'Intellectual Property' },
  { id: 'workers_comp', name: "Worker's Compensation" },
  { id: 'lemon_law', name: 'Lemon Law' },
];

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'Washington D.C.',
  'West Virginia', 'Wisconsin', 'Wyoming',
];

const FREE_FEATURES = [
  'Embed calculator on your website',
  'All 16 practice areas included',
  'Embed code delivered by email',
];

const PAID_FEATURES = [
  'Everything in Free',
  'Leads emailed to your intake address in real-time',
  'Custom accent color — full palette theming',
  'Your logo in the calculator footer',
  'Hide "Powered by CaseValue.law" branding',
  'Personal configurator with live preview',
];

function FeatureRow({ text, included }) {
  return (
    <li className="flex items-start gap-3 py-1.5">
      {included
        ? <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
        : <XCircle className="w-5 h-5 text-textMuted/30 flex-shrink-0 mt-0.5" />
      }
      <span className={included ? 'text-text text-sm' : 'text-textMuted/40 line-through text-sm'}>{text}</span>
    </li>
  );
}

const NAV_PROPS = {
  lang: 'en',
  onLanguageChange: () => {},
  onLogoClick: () => { window.location.href = '/'; },
};

const FOOTER_PROPS = {
  t: { privacyPolicy: 'Privacy Policy', termsOfService: 'Terms of Service', copyright: 'All rights reserved.' },
  onPrivacyClick: () => {},
  onTermsClick: () => {},
};

function SimpleLayout({ children }) {
  return (
    <div className="min-h-screen text-text flex flex-col">
      <Navigation {...NAV_PROPS} />
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-16">
        {children}
      </main>
      <Footer {...FOOTER_PROPS} />
    </div>
  );
}

export default function FirmPortalPage() {
  const [searchParams] = useSearchParams();
  const stripeStatus = searchParams.get('status');

  const [plan, setPlan] = useState('free');
  const [formData, setFormData] = useState({
    firmName: '', contactName: '', email: '', phone: '', state: '', caseTypes: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const toggleCaseType = useCallback((id) => {
    setFormData(prev => ({
      ...prev,
      caseTypes: prev.caseTypes.includes(id)
        ? prev.caseTypes.filter(ct => ct !== id)
        : [...prev.caseTypes, id],
    }));
  }, []);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { firmName, contactName, email, phone } = formData;
    if (!firmName.trim()) { setError('Firm name is required.'); return; }
    if (!contactName.trim()) { setError('Contact name is required.'); return; }
    if (!email.trim()) { setError('Email is required.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Please enter a valid email address.'); return; }
    if (!phone.trim()) { setError('Phone number is required.'); return; }
    if (!/^[\d\s\-()+.]{7,20}$/.test(phone.trim())) { setError('Please enter a valid phone number.'); return; }

    setSubmitting(true);
    try {
      const endpoint = plan === 'paid'
        ? '/.netlify/functions/create-checkout'
        : '/.netlify/functions/firm-signup';

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      if (plan === 'paid' && data.url) {
        window.location.href = data.url;
      } else {
        setSubmitted(true);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Stripe returned successfully after checkout
  if (stripeStatus === 'success') {
    return (
      <SimpleLayout>
        <div className="max-w-lg w-full text-center bg-card/50 backdrop-blur-xl border-2 border-accent/40 rounded-2xl p-10">
          <CheckCircle className="w-16 h-16 text-accent mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-text mb-3">Welcome to CaseValue Pro!</h1>
          <p className="text-textMuted">
            Your subscription is active. Check your email — we've sent you a personal configurator link to customize your calculator and get your embed code.
          </p>
        </div>
      </SimpleLayout>
    );
  }

  // Stripe checkout was cancelled
  if (stripeStatus === 'cancelled') {
    return (
      <SimpleLayout>
        <div className="max-w-lg w-full text-center bg-card/50 backdrop-blur-xl border border-cardBorder/15 rounded-2xl p-10">
          <h1 className="text-2xl font-bold text-text mb-3">Payment Cancelled</h1>
          <p className="text-textMuted mb-6">No charge was made. You can try again below or start with the free plan.</p>
          <button
            onClick={() => window.history.replaceState({}, '', '/for-law-firms')}
            className="px-6 py-3 bg-gradient-gold text-textDark font-bold rounded-xl hover:opacity-90 transition"
          >
            Go Back
          </button>
        </div>
      </SimpleLayout>
    );
  }

  // Free signup success
  if (submitted) {
    return (
      <SimpleLayout>
        <div className="max-w-lg w-full text-center bg-card/50 backdrop-blur-xl border-2 border-accent/40 rounded-2xl p-10">
          <CheckCircle className="w-16 h-16 text-accent mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-text mb-3">Check Your Email</h1>
          <p className="text-textMuted">
            We've sent your embed code to{' '}
            <strong className="text-text">{formData.email}</strong>. Paste it into your website where you'd like the calculator to appear.
          </p>
        </div>
      </SimpleLayout>
    );
  }

  return (
    <div className="min-h-screen text-text flex flex-col">
      <Helmet>
        <title>For Law Firms — Embed the Free Calculator | CaseValue.law</title>
        <meta name="description" content="Add a free legal case value calculator to your law firm website. Free basic embed or Pro ($49/month) for white-label branding and lead routing." />
        <link rel="canonical" href="https://casevalue.law/for-law-firms" />
      </Helmet>
      <SocialMeta
        title="For Law Firms — Embed the Free Calculator | CaseValue.law"
        description="Add a free legal case value calculator to your law firm website. Free basic embed or Pro ($49/month) for white-label branding and lead routing."
        url="https://casevalue.law/for-law-firms"
      />

      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30 pointer-events-none" />

      <Navigation {...NAV_PROPS} />

      <main className="relative z-10 flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-16">
        {/* Hero */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm font-semibold mb-6">
            <Scale className="w-4 h-4" />
            For Law Firms
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-text mb-4">
            Add a Free Legal Case Value Calculator to Your Website
          </h1>
          <p className="text-lg md:text-xl text-textMuted max-w-2xl mx-auto">
            Give visitors an instant settlement estimate and capture more leads — free forever, or upgrade to Pro for white-label branding and direct lead routing.
          </p>
        </div>

        {/* Tier Comparison */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {/* Free Card */}
          <div className="bg-card/50 backdrop-blur-xl border border-cardBorder/15 rounded-2xl p-6 md:p-8">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-5 h-5 text-textMuted" />
              <h2 className="text-xl font-bold text-text">Free</h2>
            </div>
            <div className="text-3xl font-bold text-text mb-1">$0</div>
            <p className="text-textMuted text-sm mb-6">Basic embed, forever free</p>
            <ul className="space-y-0.5">
              {FREE_FEATURES.map(f => <FeatureRow key={f} text={f} included={true} />)}
              <FeatureRow text="Lead routing to your intake email" included={false} />
              <FeatureRow text="Custom accent color & logo" included={false} />
              <FeatureRow text='Remove "Powered by" branding' included={false} />
            </ul>
          </div>

          {/* Pro Card */}
          <div className="bg-card/50 backdrop-blur-xl border-2 border-accent/40 rounded-2xl p-6 md:p-8 relative">
            <div className="absolute top-4 right-4 px-3 py-1 bg-accent/20 border border-accent/40 rounded-full text-accent text-xs font-bold">
              MOST POPULAR
            </div>
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-5 h-5 text-accent" />
              <h2 className="text-xl font-bold text-text">Pro</h2>
            </div>
            <div className="text-3xl font-bold text-text mb-1">
              $49<span className="text-lg font-normal text-textMuted">/month</span>
            </div>
            <p className="text-textMuted text-sm mb-6">White-label + lead routing</p>
            <ul className="space-y-0.5">
              {PAID_FEATURES.map(f => <FeatureRow key={f} text={f} included={true} />)}
            </ul>
          </div>
        </div>

        {/* Signup Form */}
        <div className="bg-card/50 backdrop-blur-xl border border-cardBorder/15 rounded-2xl p-6 md:p-8">
          {/* Plan Toggle */}
          <div className="flex gap-3 mb-8">
            <button
              type="button"
              onClick={() => setPlan('free')}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border ${
                plan === 'free'
                  ? 'bg-accent/20 border-accent/40 text-accent'
                  : 'bg-primary/30 border-cardBorder/50 text-textMuted hover:text-text'
              }`}
            >
              Free Plan
            </button>
            <button
              type="button"
              onClick={() => setPlan('paid')}
              className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all border ${
                plan === 'paid'
                  ? 'bg-accent/20 border-accent/40 text-accent'
                  : 'bg-primary/30 border-cardBorder/50 text-textMuted hover:text-text'
              }`}
            >
              Pro — $49/month
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="firmName" className="block text-sm font-semibold text-text mb-2">
                  Firm Name <span className="text-accent">*</span>
                </label>
                <input
                  id="firmName"
                  type="text"
                  required
                  value={formData.firmName}
                  onChange={handleChange('firmName')}
                  placeholder="Smith & Associates"
                  className="w-full px-4 py-3 rounded-xl bg-primary/60 border-2 border-cardBorder/15 text-text placeholder-textMuted/50 focus:border-accent focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label htmlFor="contactName" className="block text-sm font-semibold text-text mb-2">
                  Contact Name <span className="text-accent">*</span>
                </label>
                <input
                  id="contactName"
                  type="text"
                  required
                  value={formData.contactName}
                  onChange={handleChange('contactName')}
                  placeholder="Jane Smith"
                  className="w-full px-4 py-3 rounded-xl bg-primary/60 border-2 border-cardBorder/15 text-text placeholder-textMuted/50 focus:border-accent focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label htmlFor="portalEmail" className="block text-sm font-semibold text-text mb-2">
                  Email <span className="text-accent">*</span>
                </label>
                <input
                  id="portalEmail"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange('email')}
                  placeholder="contact@yourfirm.com"
                  className="w-full px-4 py-3 rounded-xl bg-primary/60 border-2 border-cardBorder/15 text-text placeholder-textMuted/50 focus:border-accent focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-text mb-2">
                  Phone <span className="text-accent">*</span>
                </label>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleChange('phone')}
                  placeholder="(555) 555-5555"
                  className="w-full px-4 py-3 rounded-xl bg-primary/60 border-2 border-cardBorder/15 text-text placeholder-textMuted/50 focus:border-accent focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* State */}
            <div>
              <label htmlFor="portalState" className="block text-sm font-semibold text-text mb-2">
                State <span className="text-textMuted font-normal">(Optional)</span>
              </label>
              <select
                id="portalState"
                value={formData.state}
                onChange={handleChange('state')}
                className="w-full px-4 py-3 rounded-xl bg-primary/60 border-2 border-cardBorder/15 text-text focus:border-accent focus:outline-none transition-colors"
              >
                <option value="">Select your primary state</option>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            {/* Practice Areas */}
            <div>
              <label className="block text-sm font-semibold text-text mb-2">
                Practice Areas{' '}
                <span className="text-textMuted font-normal">
                  {formData.caseTypes.length === 0
                    ? '(All included by default)'
                    : `(${formData.caseTypes.length} selected)`}
                </span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {CASE_TYPE_OPTIONS.map(ct => (
                  <button
                    key={ct.id}
                    type="button"
                    onClick={() => toggleCaseType(ct.id)}
                    className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition-all border ${
                      formData.caseTypes.includes(ct.id)
                        ? 'bg-accent/20 border-accent/40 text-accent'
                        : 'bg-primary/30 border-cardBorder/50 text-textMuted hover:border-cardBorder/15 hover:text-text'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                        formData.caseTypes.includes(ct.id) ? 'border-accent bg-accent' : 'border-cardBorder/15'
                      }`}>
                        {formData.caseTypes.includes(ct.id) && (
                          <CheckCircle className="w-3 h-3 text-textDark" />
                        )}
                      </span>
                      {ct.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-4 text-red-400 text-sm font-medium">
                {error}
              </div>
            )}

            {/* Submit */}
            <div className="text-center pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="px-10 py-4 bg-gradient-gold hover:opacity-90 rounded-xl shadow-2xl transition-all font-bold text-lg text-textDark transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
              >
                {submitting
                  ? (plan === 'paid' ? 'Creating Checkout…' : 'Signing Up…')
                  : (plan === 'paid' ? 'Subscribe — $49/month →' : 'Get Free Embed Code →')
                }
              </button>
              <p className="text-xs text-textMuted mt-3">
                {plan === 'paid'
                  ? "You'll be redirected to Stripe Checkout. Cancel anytime."
                  : 'No credit card required. Your embed code will be emailed to you.'
                }
              </p>
            </div>
          </form>
        </div>
      </main>

      <Footer {...FOOTER_PROPS} />
    </div>
  );
}
