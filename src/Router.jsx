// ============================================================================
// APP ROUTER
// ============================================================================
// Handles routing for the calculator app and blog
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { caseSlugToId } from './constants/caseTypeSlugs';
import { stateSlugToInfo } from './constants/stateSlugMap';

// Lazy load all page components for optimal code splitting
const App = lazy(() => import('./App.jsx'));
const BlogPage = lazy(() => import('./components/pages/BlogPage'));
const BlogPostPage = lazy(() => import('./components/pages/BlogPostPage'));
const NotFoundPage = lazy(() => import('./components/pages/NotFoundPage'));
const CalculatorLandingPage = lazy(() => import('./components/pages/CalculatorLandingPage'));
const StateCalculatorPage = lazy(() => import('./components/pages/StateCalculatorPage'));
const StateHubPage = lazy(() => import('./components/pages/StateHubPage'));
const EmbedApp = lazy(() => import('./EmbedApp.jsx'));
const EmbedDocsPage = lazy(() => import('./components/pages/EmbedDocsPage'));
const SitemapPage = lazy(() => import('./components/pages/SitemapPage'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
    <div className="text-textMuted text-lg" role="status" aria-live="polite">Loading...</div>
  </div>
);

// Route wrapper: renders an SEO landing page for each practice area calculator.
// The landing page contains crawlable content and a CTA to launch the calculator.
function CalculatorRoute() {
  const { caseSlug } = useParams();
  const caseTypeId = caseSlugToId[caseSlug];

  if (!caseTypeId) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <NotFoundPage />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <CalculatorLandingPage caseTypeId={caseTypeId} />
    </Suspense>
  );
}

// Route wrapper for /states/:stateSlug hub pages.
function StateHubRoute() {
  const { stateSlug } = useParams();
  const stateInfo = stateSlugToInfo[stateSlug];
  if (!stateInfo) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <NotFoundPage />
      </Suspense>
    );
  }
  return (
    <Suspense fallback={<LoadingFallback />}>
      <StateHubPage stateCode={stateInfo.code} />
    </Suspense>
  );
}

// Route wrapper for /:stateSlug/:caseParam routes.
// caseParam format: "[case-slug]-calculator" (e.g. "motor-vehicle-accident-calculator")
function StateCalculatorRoute() {
  const { stateSlug, caseParam } = useParams();

  const stateInfo = stateSlugToInfo[stateSlug];
  const caseSlug = caseParam?.endsWith('-calculator')
    ? caseParam.slice(0, -'-calculator'.length)
    : null;
  const caseTypeId = caseSlug ? caseSlugToId[caseSlug] : null;

  if (!stateInfo || !caseTypeId) {
    return (
      <Suspense fallback={<LoadingFallback />}>
        <NotFoundPage />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={<LoadingFallback />}>
      <StateCalculatorPage stateCode={stateInfo.code} caseTypeId={caseTypeId} />
    </Suspense>
  );
}

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main calculator app */}
        <Route
          path="/"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <App />
            </Suspense>
          }
        />

        {/* Practice area calculator - pre-selects case type */}
        <Route path="/calculator/:caseSlug" element={<CalculatorRoute />} />

        {/* /calculator with no slug redirects to home */}
        <Route path="/calculator" element={<Navigate to="/" replace />} />

        {/* Blog listing */}
        <Route
          path="/blog"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <BlogPage />
            </Suspense>
          }
        />

        {/* Individual blog post */}
        <Route
          path="/blog/:slug"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <BlogPostPage />
            </Suspense>
          }
        />

        {/* Embeddable calculator widget (iframe) — no header/footer/tracking */}
        <Route
          path="/embed"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <EmbedApp />
            </Suspense>
          }
        />

        {/* Embed documentation page for law firm webmasters */}
        <Route
          path="/embed/docs"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <EmbedDocsPage />
            </Suspense>
          }
        />

        {/* HTML sitemap for users */}
        <Route
          path="/sitemap"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <SitemapPage />
            </Suspense>
          }
        />

        {/* State hub pages: /states/california — lets users pick case type */}
        <Route path="/states/:stateSlug" element={<StateHubRoute />} />

        {/* State × case type landing pages: /california/motor-vehicle-accident-calculator */}
        <Route path="/:stateSlug/:caseParam" element={<StateCalculatorRoute />} />

        {/* 404 Catch-all route - must be last */}
        <Route
          path="*"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <NotFoundPage />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
