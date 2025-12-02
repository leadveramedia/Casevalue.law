// ============================================================================
// APP ROUTER
// ============================================================================
// This component handles routing between the calculator and blog
import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Lazy load all page components for optimal code splitting
// This ensures /blog visitors don't download calculator code and vice versa
const App = lazy(() => import('./App.jsx'));
const BlogPage = lazy(() => import('./components/pages/BlogPage'));
const BlogPostPage = lazy(() => import('./components/pages/BlogPostPage'));

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

        {/* Blog routes - wrapped in Suspense for lazy loading */}
        <Route
          path="/blog"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <BlogPage />
            </Suspense>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <BlogPostPage />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
