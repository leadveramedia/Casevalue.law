import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import Router from './Router.jsx';
import { AppProvider } from './context/AppContext';
import ErrorBoundary from './components/ErrorBoundary';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const rootElement = document.getElementById('root');
const app = (
  <React.StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <AppProvider>
          <Router />
        </AppProvider>
      </ErrorBoundary>
    </HelmetProvider>
  </React.StrictMode>
);

// Check if page was prerendered (by Netlify or other service)
// If root has children, use hydrate; otherwise use render
if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, app);
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(app);
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({
  onSuccess: () => {
    console.log('Service Worker registered successfully. App is ready for offline use.');
  },
  onUpdate: (registration) => {
    console.log('New version available! Refresh to update.');
    // Optionally show a notification to the user
    if (window.confirm('New version available! Click OK to refresh.')) {
      registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  }
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
