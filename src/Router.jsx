// ============================================================================
// APP ROUTER
// ============================================================================
// This component handles routing between the calculator and blog
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.jsx';
import BlogPage from './components/pages/BlogPage';
import BlogPostPage from './components/pages/BlogPostPage';

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main calculator app */}
        <Route path="/" element={<App />} />

        {/* Blog routes */}
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
      </Routes>
    </BrowserRouter>
  );
}
