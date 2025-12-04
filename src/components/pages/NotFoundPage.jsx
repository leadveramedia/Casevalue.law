// ============================================================================
// 404 NOT FOUND PAGE
// ============================================================================
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, ArrowLeft, Calculator } from 'lucide-react';
import BlogLayout from '../BlogLayout';

export default function NotFoundPage() {
  return (
    <BlogLayout>
      <Helmet>
        <title>404 - Page Not Found | CaseValue.law</title>
        <meta name="description" content="The page you're looking for doesn't exist. Return to our legal case value calculator or browse our blog." />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://casevalue.law/404" />
      </Helmet>

      <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <div className="bg-card backdrop-blur-3xl rounded-3xl overflow-hidden border-2 border-cardBorder shadow-card p-8 md:p-12 text-center">
            {/* 404 Number */}
            <div className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-gold mb-6">
              404
            </div>

            {/* Error Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-text mb-4">
              Page Not Found
            </h1>
            <p className="text-lg text-textMuted mb-8">
              Sorry, we couldn't find the page you're looking for. It may have been moved or deleted.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-gold text-textDark rounded-xl transition-all font-bold hover:opacity-90 shadow-glow-gold-soft"
              >
                <Calculator className="w-5 h-5" />
                Calculate Your Case Value
              </Link>
              <Link
                to="/blog"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-card/50 text-text rounded-xl transition-all font-bold hover:bg-card border-2 border-cardBorder hover:border-accent/50"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Blog
              </Link>
            </div>

            {/* Home Link */}
            <div className="mt-8 pt-8 border-t border-cardBorder">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-accent hover:text-accentHover transition-colors font-semibold"
              >
                <Home className="w-4 h-4" />
                Go to Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    </BlogLayout>
  );
}
