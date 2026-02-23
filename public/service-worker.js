/* eslint-disable no-restricted-globals */

// Self-destructing service worker for CaseValue.law
// Replaces the old caching SW to clean up existing installations.
// On install: immediately takes over. On activate: clears all caches,
// unregisters itself, and refreshes all open tabs.

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((names) => Promise.all(names.map((name) => caches.delete(name))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll())
      .then((clients) => clients.forEach((client) => client.navigate(client.url)))
  );
});
