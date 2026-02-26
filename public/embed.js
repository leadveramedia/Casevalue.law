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
  var src = baseUrl + (params.length ? '?' + params.join('&') : '');

  // Create iframe
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

  // Insert iframe after the script tag
  currentScript.parentNode.insertBefore(iframe, currentScript.nextSibling);

  // Listen for resize messages from the embed
  window.addEventListener('message', function(event) {
    if (event.origin !== 'https://casevalue.law') return;
    if (!event.data || event.data.type !== 'casevalue-resize') return;

    var newHeight = event.data.height;
    if (typeof newHeight === 'number' && newHeight > 0) {
      iframe.style.height = Math.max(newHeight, minHeight) + 'px';
    }
  });
})();
