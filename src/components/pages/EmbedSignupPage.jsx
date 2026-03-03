/**
 * EmbedSignupPage - Self-serve partner registration for the embeddable calculator.
 * Captures firm info, generates a personalized embed code, and stores via Netlify Forms.
 */
import { useState, useCallback, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { CheckCircle, Copy, Scale, ArrowRight, ChevronDown } from 'lucide-react';
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
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming', 'Washington D.C.',
];

function generatePartnerSlug(firmName) {
  return firmName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40);
}

function generateEmbedCode({ partnerSlug, selectedCaseTypes, state, intakeEmail, accentColor, logoUrl, hideBranding }) {
  const attrs = [`  src="https://casevalue.law/embed.js"`];
  if (selectedCaseTypes.length > 0 && selectedCaseTypes.length < CASE_TYPE_OPTIONS.length) {
    attrs.push(`  data-case-types="${selectedCaseTypes.join(',')}"`);
  }
  if (state) {
    attrs.push(`  data-state="${state}"`);
  }
  attrs.push(`  data-partner="${partnerSlug}"`);
  if (intakeEmail) {
    attrs.push(`  data-intake-email="${intakeEmail}"`);
  }
  if (accentColor) {
    attrs.push(`  data-accent-color="${accentColor}"`);
  }
  if (logoUrl) {
    attrs.push(`  data-logo-url="${logoUrl}"`);
  }
  if (hideBranding) {
    attrs.push(`  data-hide-branding="true"`);
  }
  return `<script\n${attrs.join('\n')}\n></script>`;
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold transition-all bg-accent/20 hover:bg-accent/30 text-accent border border-accent/30"
    >
      {copied ? <><CheckCircle className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Code</>}
    </button>
  );
}

export default function EmbedSignupPage() {
  const [formData, setFormData] = useState({
    firmName: '',
    website: '',
    email: '',
    intakeEmail: '',
    state: '',
    caseTypes: [],
    accentColor: '',
    logoUrl: '',
    hideBranding: false,
  });
  const [showBranding, setShowBranding] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const partnerSlug = generatePartnerSlug(formData.firmName);
  const embedCode = generateEmbedCode({
    partnerSlug: partnerSlug || 'your-firm-name',
    selectedCaseTypes: formData.caseTypes,
    state: formData.state,
    intakeEmail: formData.intakeEmail,
    accentColor: formData.accentColor,
    logoUrl: formData.logoUrl,
    hideBranding: formData.hideBranding,
  });

  const previewUrl = useMemo(() => {
    const params = [];
    if (formData.caseTypes.length > 0 && formData.caseTypes.length < CASE_TYPE_OPTIONS.length) {
      params.push('caseTypes=' + encodeURIComponent(formData.caseTypes.join(',')));
    }
    if (formData.state) params.push('state=' + encodeURIComponent(formData.state));
    if (partnerSlug) params.push('partner=' + encodeURIComponent(partnerSlug));
    if (formData.accentColor) params.push('accentColor=' + encodeURIComponent(formData.accentColor));
    if (formData.logoUrl) params.push('logoUrl=' + encodeURIComponent(formData.logoUrl));
    if (formData.hideBranding) params.push('hideBranding=1');
    return '/embed' + (params.length ? '?' + params.join('&') : '');
  }, [formData.caseTypes, formData.state, formData.accentColor, formData.logoUrl, formData.hideBranding, partnerSlug]);

  const toggleCaseType = useCallback((id) => {
    setFormData(prev => ({
      ...prev,
      caseTypes: prev.caseTypes.includes(id)
        ? prev.caseTypes.filter(ct => ct !== id)
        : [...prev.caseTypes, id],
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.firmName.trim() || !formData.email.trim() || !formData.intakeEmail.trim()) {
      setError('Please fill in your firm name, email, and intake email.');
      return;
    }

    setSubmitting(true);
    try {
      const body = new URLSearchParams();
      body.append('form-name', 'embed-partner-signup');
      body.append('firm_name', formData.firmName);
      body.append('website', formData.website);
      body.append('email', formData.email);
      body.append('intake_email', formData.intakeEmail);
      body.append('state', formData.state);
      body.append('case_types', formData.caseTypes.join(','));
      body.append('partner_slug', partnerSlug);

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      });

      if (!response.ok) throw new Error('Submission failed');
      setSubmitted(true);
    } catch {
      setError('Something went wrong. Please try again or email info@leadveramedia.com.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-text flex flex-col">
      <Helmet>
        <title>Get the Free Calculator Widget | CaseValue.law</title>
        <meta name="description" content="Sign up to embed the free CaseValue.law settlement calculator on your law firm website. Takes 60 seconds — no coding required." />
        <link rel="canonical" href="https://casevalue.law/embed/signup" />
      </Helmet>
      <SocialMeta
        title="Get the Free Calculator Widget | CaseValue.law"
        description="Sign up to embed the free CaseValue.law settlement calculator on your law firm website. Takes 60 seconds — no coding required."
        url="https://casevalue.law/embed/signup"
      />

      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30 pointer-events-none" />

      <Navigation lang="en" onLanguageChange={() => {}} onLogoClick={() => window.location.href = '/'} />

      <main className="relative z-10 flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-16">
        {/* Hero */}
        <div className="text-center mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 text-accent text-sm font-semibold mb-6">
            <Scale className="w-4 h-4" />
            100% Free — No Credit Card Required
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-text mb-4">
            Add a Case Value Calculator to Your Website
          </h1>
          <p className="text-lg md:text-xl text-textMuted max-w-2xl mx-auto">
            Give visitors an instant settlement estimate. Capture leads directly on your site. Takes 60 seconds to set up.
          </p>
        </div>

        {submitted ? (
          /* Success State */
          <div className="bg-card/50 backdrop-blur-xl border-2 border-accent/40 rounded-2xl p-8 md:p-12 text-center">
            <CheckCircle className="w-16 h-16 text-accent mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-bold text-text mb-4">You're All Set!</h2>
            <p className="text-textMuted mb-8 max-w-lg mx-auto">
              Copy the embed code below and paste it into your website where you want the calculator to appear. Your partner ID is <code className="bg-primary/60 px-2 py-0.5 rounded text-accent font-mono">{partnerSlug}</code>.
            </p>

            <div className="text-left mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-text">Your Embed Code</h3>
                <CopyButton text={embedCode} />
              </div>
              <pre className="bg-primary/60 border-2 border-cardBorder/15 rounded-xl p-5 overflow-x-auto text-sm text-text/90 font-mono leading-relaxed">
                <code>{embedCode}</code>
              </pre>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link
                to="/embed/docs"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent/20 text-accent border-2 border-accent/40 font-semibold hover:bg-accent/30 transition-colors"
              >
                View Full Documentation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Firm Info */}
            <div className="bg-card/50 backdrop-blur-xl border border-cardBorder/15 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-text mb-6">About Your Firm</h2>
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
                    onChange={(e) => setFormData(prev => ({ ...prev, firmName: e.target.value }))}
                    placeholder="Smith & Associates"
                    className="w-full px-4 py-3 rounded-xl bg-primary/60 border-2 border-cardBorder/15 text-text placeholder-textMuted/50 focus:border-accent focus:outline-none transition-colors"
                  />
                  {partnerSlug && (
                    <p className="text-xs text-textMuted mt-1">
                      Partner ID: <code className="text-accent">{partnerSlug}</code>
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="website" className="block text-sm font-semibold text-text mb-2">Website</label>
                  <input
                    id="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    placeholder="https://www.yourfirm.com"
                    className="w-full px-4 py-3 rounded-xl bg-primary/60 border-2 border-cardBorder/15 text-text placeholder-textMuted/50 focus:border-accent focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-text mb-2">
                    Contact Email <span className="text-accent">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="contact@yourfirm.com"
                    className="w-full px-4 py-3 rounded-xl bg-primary/60 border-2 border-cardBorder/15 text-text placeholder-textMuted/50 focus:border-accent focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="intakeEmail" className="block text-sm font-semibold text-text mb-2">
                    Lead Intake Email <span className="text-accent">*</span>
                  </label>
                  <input
                    id="intakeEmail"
                    type="email"
                    required
                    value={formData.intakeEmail}
                    onChange={(e) => setFormData(prev => ({ ...prev, intakeEmail: e.target.value }))}
                    placeholder="intake@yourfirm.com"
                    className="w-full px-4 py-3 rounded-xl bg-primary/60 border-2 border-cardBorder/15 text-text placeholder-textMuted/50 focus:border-accent focus:outline-none transition-colors"
                  />
                  <p className="text-xs text-textMuted mt-1">
                    Leads from the calculator will be emailed here in real-time.
                  </p>
                </div>
              </div>
            </div>

            {/* Configuration */}
            <div className="bg-card/50 backdrop-blur-xl border border-cardBorder/15 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-text mb-2">Configure Your Calculator</h2>
              <p className="text-sm text-textMuted mb-6">Optional — customize what your visitors see. You can change these later.</p>

              {/* State */}
              <div className="mb-6">
                <label htmlFor="state" className="block text-sm font-semibold text-text mb-2">Pre-select State</label>
                <select
                  id="state"
                  value={formData.state}
                  onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-primary/60 border-2 border-cardBorder/15 text-text focus:border-accent focus:outline-none transition-colors"
                >
                  <option value="">Let visitors choose (recommended)</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Case Types */}
              <div>
                <label className="block text-sm font-semibold text-text mb-2">
                  Practice Areas
                  <span className="text-textMuted font-normal ml-2">
                    {formData.caseTypes.length === 0 ? '(All selected by default)' : `(${formData.caseTypes.length} selected)`}
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
            </div>

            {/* Branding (Collapsible) */}
            <div className="bg-card/50 backdrop-blur-xl border border-cardBorder/15 rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => setShowBranding(prev => !prev)}
                className="w-full flex items-center justify-between p-6 md:p-8 text-left"
              >
                <div>
                  <h2 className="text-xl font-bold text-text">Customize Branding</h2>
                  <p className="text-sm text-textMuted mt-1">Optional — match the calculator to your firm's brand colors and logo.</p>
                </div>
                <ChevronDown className={`w-5 h-5 text-textMuted transition-transform ${showBranding ? 'rotate-180' : ''}`} />
              </button>
              {showBranding && (
                <div className="px-6 md:px-8 pb-6 md:pb-8 space-y-5 border-t border-cardBorder/50 pt-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="accentColor" className="block text-sm font-semibold text-text mb-2">Accent Color</label>
                      <div className="flex gap-3 items-center">
                        <input
                          type="color"
                          value={formData.accentColor || '#FFC447'}
                          onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                          className="w-10 h-10 rounded-lg border-2 border-cardBorder/15 cursor-pointer bg-transparent"
                        />
                        <input
                          id="accentColor"
                          type="text"
                          value={formData.accentColor}
                          onChange={(e) => setFormData(prev => ({ ...prev, accentColor: e.target.value }))}
                          placeholder="#FFC447 (default)"
                          className="flex-1 px-4 py-3 rounded-xl bg-primary/60 border-2 border-cardBorder/15 text-text placeholder-textMuted/50 focus:border-accent focus:outline-none transition-colors font-mono"
                        />
                      </div>
                      <p className="text-xs text-textMuted mt-1">Used for buttons, links, and highlights.</p>
                    </div>
                    <div>
                      <label htmlFor="logoUrl" className="block text-sm font-semibold text-text mb-2">Logo URL</label>
                      <input
                        id="logoUrl"
                        type="url"
                        value={formData.logoUrl}
                        onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                        placeholder="https://yourfirm.com/logo.png"
                        className="w-full px-4 py-3 rounded-xl bg-primary/60 border-2 border-cardBorder/15 text-text placeholder-textMuted/50 focus:border-accent focus:outline-none transition-colors"
                      />
                      <p className="text-xs text-textMuted mt-1">Replaces the CaseValue logo on the loading screen.</p>
                    </div>
                  </div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.hideBranding}
                      onChange={(e) => setFormData(prev => ({ ...prev, hideBranding: e.target.checked }))}
                      className="w-4 h-4 rounded border-2 border-cardBorder/15 text-accent focus:ring-accent"
                    />
                    <span className="text-sm text-text">Hide "Powered by CaseValue.law" footer</span>
                  </label>
                </div>
              )}
            </div>

            {/* Live Preview */}
            <div className="bg-card/50 backdrop-blur-xl border border-cardBorder/15 rounded-2xl p-6 md:p-8">
              <h2 className="text-xl font-bold text-text mb-2">Live Preview</h2>
              <p className="text-sm text-textMuted mb-4">This is how the calculator will look on your website. Changes update in real-time.</p>
              <div className="rounded-xl overflow-hidden border-2 border-cardBorder/15">
                <iframe
                  src={previewUrl}
                  title="Calculator preview"
                  className="w-full border-none"
                  style={{ height: '700px', colorScheme: 'dark' }}
                  loading="lazy"
                />
              </div>
            </div>

            {/* Embed Code */}
            <div className="bg-card/50 backdrop-blur-xl border border-cardBorder/15 rounded-2xl p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-text">Your Embed Code</h2>
                <CopyButton text={embedCode} />
              </div>
              <pre className="bg-primary/60 border-2 border-cardBorder/15 rounded-xl p-5 overflow-x-auto text-sm text-text/90 font-mono leading-relaxed">
                <code>{embedCode}</code>
              </pre>
              <p className="text-xs text-textMuted mt-3">
                This code updates live as you fill out the form above.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-500/10 border-2 border-red-500/30 rounded-xl p-4 text-red-400 text-sm font-medium text-center">
                {error}
              </div>
            )}

            {/* Submit */}
            <div className="text-center">
              <button
                type="submit"
                disabled={submitting}
                className="px-10 py-4 bg-gradient-gold hover:opacity-90 rounded-xl shadow-2xl transition-all font-bold text-lg text-textDark transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
              >
                {submitting ? 'Registering...' : 'Get My Embed Code'}
              </button>
              <p className="text-xs text-textMuted mt-3">
                Free forever. No credit card needed. Already have your code?{' '}
                <Link to="/embed/docs" className="text-accent hover:underline">View the docs</Link>.
              </p>
            </div>
          </form>
        )}
      </main>

      <Footer
        t={{
          privacyPolicy: 'Privacy Policy',
          termsOfService: 'Terms of Service',
          copyright: 'All rights reserved.',
        }}
        onPrivacyClick={() => window.location.href = '/'}
        onTermsClick={() => window.location.href = '/'}
      />
    </div>
  );
}
