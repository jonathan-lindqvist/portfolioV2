// Cookie consent management
class CookieBanner {
  constructor() {
    this.CONSENT_KEY = "analytics-consent";
    this.BANNER_ID = "cookie-banner";
    this.GA_MEASUREMENT_ID = "G-XG4NEZHBJM";
    this.gaInitialized = false;
    this.gaConfigured = false;
  }

  hasConsent() {
    return localStorage.getItem(this.CONSENT_KEY) === "true";
  }

  setConsent(value) {
    localStorage.setItem(this.CONSENT_KEY, value);
  }

  initGoogleAnalytics() {
    if (this.gaInitialized) return;

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.GA_MEASUREMENT_ID}`;

    if (!document.head) {
      console.error("Document head not found");
      return;
    }

    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gtag(...args) {
        window.dataLayer.push(args);
      };

    window.gtag("js", new Date());
    this.gaInitialized = true;
  }

  applyGoogleConsent(hasAccepted, mode = "default") {
    if (typeof window.gtag !== "function") {
      console.error("gtag is not initialized");
      return;
    }

    // Denied mode allows basic cookieless measurement while blocking richer analytics features.
    window.gtag("consent", mode, {
      analytics_storage: hasAccepted ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  }

  configureGoogleAnalytics() {
    if (typeof window.gtag !== "function") {
      console.error("gtag is not initialized");
      return;
    }
    if (this.gaConfigured) return;

    window.gtag("config", this.GA_MEASUREMENT_ID, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      send_page_view: true,
    });

    this.gaConfigured = true;
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
        this.applyGoogleConsent(true, "update");
        this.removeBanner();
      });
    }

    if (declineBtn) {
      declineBtn.addEventListener("click", () => {
        this.setConsent("false");
        this.applyGoogleConsent(false, "update");
        this.removeBanner();
      });
    }
  }

  init() {
    const consent = localStorage.getItem(this.CONSENT_KEY);

    this.initGoogleAnalytics();

    if (consent === "true") {
      this.applyGoogleConsent(true, "default");
    } else {
      this.applyGoogleConsent(false, "default");
    }
    this.configureGoogleAnalytics();

    if (consent === null) {
      // No consent yet, show banner
      this.createBanner();
    }
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
