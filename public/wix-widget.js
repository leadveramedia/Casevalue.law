/**
 * CaseValue Calculator — Wix Custom Element
 *
 * A Web Component that embeds the CaseValue.law calculator inside an iframe.
 * Used as a Wix Custom Element via the Wix App Market.
 *
 * Tag name: <casevalue-calculator>
 * Attributes: case-type, case-types, state, lang, partner, intake-email, accent-color, logo-url, hide-branding
 */
class CaseValueCalculator extends HTMLElement {
  static get observedAttributes() {
    return ['case-type', 'case-types', 'state', 'lang', 'partner', 'intake-email', 'accent-color', 'logo-url', 'hide-branding'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._iframe = null;
    this._minHeight = 600;
  }

  connectedCallback() {
    this._render();
    this._setupResizeListener();
  }

  disconnectedCallback() {
    if (this._resizeHandler) {
      window.removeEventListener('message', this._resizeHandler);
    }
  }

  attributeChangedCallback() {
    if (this._iframe) {
      this._render();
    }
  }

  _buildSrc() {
    var baseUrl = 'https://casevalue.law/embed';
    var params = [];
    var caseType = this.getAttribute('case-type') || '';
    var caseTypes = this.getAttribute('case-types') || '';
    var state = this.getAttribute('state') || '';
    var lang = this.getAttribute('lang') || '';
    var partner = this.getAttribute('partner') || '';
    var intakeEmail = this.getAttribute('intake-email') || '';

    if (caseType) params.push('caseType=' + encodeURIComponent(caseType));
    if (caseTypes) params.push('caseTypes=' + encodeURIComponent(caseTypes));
    if (state) params.push('state=' + encodeURIComponent(state));
    if (lang) params.push('lang=' + encodeURIComponent(lang));
    if (partner) params.push('partner=' + encodeURIComponent(partner));
    if (intakeEmail) params.push('intakeEmail=' + encodeURIComponent(intakeEmail));

    var accentColor = this.getAttribute('accent-color') || '';
    var logoUrl = this.getAttribute('logo-url') || '';
    var hideBranding = this.getAttribute('hide-branding') || '';
    if (accentColor) params.push('accentColor=' + encodeURIComponent(accentColor));
    if (logoUrl) params.push('logoUrl=' + encodeURIComponent(logoUrl));
    if (hideBranding) params.push('hideBranding=1');

    return baseUrl + (params.length ? '?' + params.join('&') : '');
  }

  _render() {
    var src = this._buildSrc();

    this.shadowRoot.innerHTML = '';

    var style = document.createElement('style');
    style.textContent = ':host{display:block;width:100%}iframe{width:100%;border:none;border-radius:12px;overflow:hidden;color-scheme:dark;min-height:' + this._minHeight + 'px}';
    this.shadowRoot.appendChild(style);

    this._iframe = document.createElement('iframe');
    this._iframe.src = src;
    this._iframe.style.height = this._minHeight + 'px';
    this._iframe.setAttribute('title', 'Case Value Calculator');
    this._iframe.setAttribute('loading', 'lazy');
    this._iframe.setAttribute('allow', 'clipboard-write');
    this.shadowRoot.appendChild(this._iframe);
  }

  _setupResizeListener() {
    var self = this;
    this._resizeHandler = function (event) {
      if (event.origin !== 'https://casevalue.law') return;
      if (!event.data || event.data.type !== 'casevalue-resize') return;

      var newHeight = event.data.height;
      if (typeof newHeight === 'number' && newHeight > 0 && self._iframe) {
        self._iframe.style.height = Math.max(newHeight, self._minHeight) + 'px';
      }
    };
    window.addEventListener('message', this._resizeHandler);
  }
}

customElements.define('casevalue-calculator', CaseValueCalculator);
