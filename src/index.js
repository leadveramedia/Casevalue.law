import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import Router from './Router.jsx';
import ErrorBoundary from './components/ErrorBoundary';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const rootElement = document.getElementById('root');

// Detect prerendered content BEFORE removing the placeholder.
// The placeholder is a static H1 for non-JS crawlers and should not trigger hydration.
// Prerendered content (from Netlify Prerender Extension) will have real React markup
// alongside or instead of the placeholder.
const placeholder = rootElement.querySelector('[data-placeholder]');
const hasPrerenderedContent = rootElement.childElementCount > 1 ||
  (rootElement.childElementCount === 1 && !placeholder);

if (placeholder) placeholder.remove();

const app = (
  <React.StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <Router />
      </ErrorBoundary>
    </HelmetProvider>
  </React.StrictMode>
);

// If the page was prerendered (by Netlify or other service), use hydrate
// to attach event listeners to existing markup. Otherwise, render fresh.
if (hasPrerenderedContent) {
  ReactDOM.hydrateRoot(rootElement, app);
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(app);
}

// Unregister service worker — the SW was caching the empty SPA shell,
// interfering with Netlify prerendering and Google indexing.
// The self-destructing service-worker.js in /public clears existing caches.
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
