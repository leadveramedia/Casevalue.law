// ============================================================================
// APP ROUTER
// ============================================================================
// Handles routing for the calculator app and blog
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Lazy load all page components for optimal code splitting
const App = lazy(() => import('./App.jsx'));
const BlogPage = lazy(() => import('./components/pages/BlogPage'));
const BlogPostPage = lazy(() => import('./components/pages/BlogPostPage'));
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
        {/* Main calculator app */}
        <Route
          path="/"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <App />
            </Suspense>
          }
        />

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
