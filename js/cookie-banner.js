// Cookie consent management
class CookieBanner {
  constructor() {
    this.CONSENT_KEY = "analytics-consent";
    this.BANNER_ID = "cookie-banner";
    this.GA_MEASUREMENT_ID = "G-XG4NEZHBJM";
  }

  hasConsent() {
    return localStorage.getItem(this.CONSENT_KEY) === "true";
  }

  setConsent(value) {
    localStorage.setItem(this.CONSENT_KEY, value);
  }

  loadGoogleAnalytics() {
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.GA_MEASUREMENT_ID}`;

    if (!document.head) {
      console.error("Document head not found");
      return;
    }

    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    const gtag = (...args) => window.dataLayer.push(args);
    gtag("js", new Date());
    gtag("config", this.GA_MEASUREMENT_ID);
  }

  removeBanner() {
    const banner = document.getElementById(this.BANNER_ID);
    if (banner) {
      banner.style.opacity = "0";
      setTimeout(() => banner.remove(), 300);
    }
  }

  createBanner() {
    if (!document.body) {
      console.error("Document body not found");
      return;
    }

    const banner = document.createElement("div");
    banner.id = this.BANNER_ID;
    banner.innerHTML = `
      <div class="cookie-banner-content">
        <p>This site uses cookies for analytics.</p>
        <div class="cookie-banner-buttons">
          <button id="cookie-accept">Accept</button>
          <button id="cookie-decline">Decline</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);

    const acceptBtn = document.getElementById("cookie-accept");
    const declineBtn = document.getElementById("cookie-decline");

    if (acceptBtn) {
      acceptBtn.addEventListener("click", () => {
        this.setConsent("true");
        this.loadGoogleAnalytics();
        this.removeBanner();
      });
    }

    if (declineBtn) {
      declineBtn.addEventListener("click", () => {
        this.setConsent("false");
        this.removeBanner();
      });
    }
  }

  init() {
    const consent = localStorage.getItem(this.CONSENT_KEY);

    if (consent === null) {
      // No consent yet, show banner
      this.createBanner();
    } else if (consent === "true") {
      // User has consented, load GA
      this.loadGoogleAnalytics();
    }
    // If consent is 'false', do nothing
  }
}

// Initialize on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    new CookieBanner().init();
  });
} else {
  new CookieBanner().init();
}

export { CookieBanner };
