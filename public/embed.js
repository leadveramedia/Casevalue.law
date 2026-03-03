/**
 * CaseValue.law Embed Loader
 *
 * Usage:
 *   <script
 *     src="https://casevalue.law/embed.js"
 *     data-case-type="motor"
 *     data-case-types="motor,medical,premises"
 *     data-state="California"
 *     data-lang="en"
 *     data-partner="acme-law"
 *     data-intake-email="intake@acmelaw.com"
 *     data-accent-color="#3B82F6"
 *     data-logo-url="https://yourfirm.com/logo.png"
 *     data-hide-branding="true"
 *     data-width="100%"
 *     data-min-height="600"
 *   ></script>
 */
(function() {
  'use strict';

  var scripts = document.getElementsByTagName('script');
  var currentScript = scripts[scripts.length - 1];

  // Read configuration from data attributes
  var caseType = currentScript.getAttribute('data-case-type') || '';
  var caseTypes = currentScript.getAttribute('data-case-types') || '';
  var state = currentScript.getAttribute('data-state') || '';
  var lang = currentScript.getAttribute('data-lang') || '';
  var partner = currentScript.getAttribute('data-partner') || '';
  var intakeEmail = currentScript.getAttribute('data-intake-email') || '';
  var accentColor = currentScript.getAttribute('data-accent-color') || '';
  var logoUrl = currentScript.getAttribute('data-logo-url') || '';
  var hideBranding = currentScript.getAttribute('data-hide-branding') || '';
  var width = currentScript.getAttribute('data-width') || '100%';
  var minHeight = parseInt(currentScript.getAttribute('data-min-height'), 10) || 600;

  // Build the embed URL
  var baseUrl = 'https://casevalue.law/embed';
  var params = [];
  if (caseType) params.push('caseType=' + encodeURIComponent(caseType));
  if (caseTypes) params.push('caseTypes=' + encodeURIComponent(caseTypes));
  if (state) params.push('state=' + encodeURIComponent(state));
  if (lang) params.push('lang=' + encodeURIComponent(lang));
  if (partner) params.push('partner=' + encodeURIComponent(partner));
  if (intakeEmail) params.push('intakeEmail=' + encodeURIComponent(intakeEmail));
  if (accentColor) params.push('accentColor=' + encodeURIComponent(accentColor));
  if (logoUrl) params.push('logoUrl=' + encodeURIComponent(logoUrl));
  if (hideBranding) params.push('hideBranding=1');
  var src = baseUrl + (params.length ? '?' + params.join('&') : '');

  var insertedEl = null;

  function createIframe() {
    var iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.style.width = width;
    iframe.style.minHeight = minHeight + 'px';
    iframe.style.height = minHeight + 'px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '12px';
    iframe.style.overflow = 'hidden';
    iframe.style.colorScheme = 'dark';
    iframe.setAttribute('title', 'Case Value Calculator');
    iframe.setAttribute('loading', 'lazy');
    iframe.setAttribute('allow', 'clipboard-write');
    currentScript.parentNode.insertBefore(iframe, currentScript.nextSibling);
    insertedEl = iframe;
  }

  function showUnavailable() {
    var div = document.createElement('div');
    div.style.cssText = 'display:flex;align-items:center;justify-content:center;min-height:' + minHeight + 'px;border-radius:12px;background:#1e293b;color:#94a3b8;font-family:system-ui,sans-serif;font-size:14px;';
    div.textContent = 'Legal case value calculator temporarily unavailable.';
    currentScript.parentNode.insertBefore(div, currentScript.nextSibling);
    insertedEl = div;
  }

  // Anonymous embeds (no partner) always render immediately
  if (!partner) {
    createIframe();
  } else {
    // Validate partner subscription status before rendering
    // Fail-open: if the request errors, render anyway to avoid breaking client sites
    fetch('https://casevalue.law/.netlify/functions/validate-partner?partner=' + encodeURIComponent(partner))
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data.active === false) {
          showUnavailable();
        } else {
          createIframe();
        }
      })
      .catch(function() { createIframe(); });
  }

  // Listen for resize messages from the embed
  window.addEventListener('message', function(event) {
    if (event.origin !== 'https://casevalue.law') return;
    if (!event.data || event.data.type !== 'casevalue-resize') return;
    if (!insertedEl || insertedEl.tagName !== 'IFRAME') return;

    var newHeight = event.data.height;
    if (typeof newHeight === 'number' && newHeight > 0) {
      insertedEl.style.height = Math.max(newHeight, minHeight) + 'px';
    }
  });
})();
