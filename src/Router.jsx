// ============================================================================
// APP ROUTER
// ============================================================================
// This component handles routing for the calculator app
// Note: Blog routes are now handled by Next.js on Vercel (proxied via Netlify)
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Lazy load all page components for optimal code splitting
const App = lazy(() => import('./App.jsx'));
const NotFoundPage = lazy(() => import('./components/pages/NotFoundPage'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
    <div className="text-textMuted text-lg">Loading...</div>
  </div>
);

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main calculator app - wrapped in Suspense for lazy loading */}
        <Route
          path="/"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <App />
            </Suspense>
          }
        />

        {/* 404 Catch-all route - must be last */}
        {/* Note: /blog/* routes are proxied to Vercel by Netlify, not handled here */}
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
