// Cookie consent management
(function () {
  const CONSENT_KEY = "analytics-consent";
  const BANNER_ID = "cookie-banner";

  function hasConsent() {
    return localStorage.getItem(CONSENT_KEY) === "true";
  }

  function setConsent(value) {
    localStorage.setItem(CONSENT_KEY, value);
  }

  function loadGoogleAnalytics() {
    const GA_MEASUREMENT_ID = "G-XG4NEZHBJM";

    const script1 = document.createElement("script");
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    window.dataLayer = window.dataLayer || [];
    function gtag() {
      dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", GA_MEASUREMENT_ID);
  }

  function removeBanner() {
    const banner = document.getElementById(BANNER_ID);
    if (banner) {
      banner.style.opacity = "0";
      setTimeout(() => banner.remove(), 300);
    }
  }

  function createBanner() {
    const banner = document.createElement("div");
    banner.id = BANNER_ID;
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

    document.getElementById("cookie-accept").addEventListener("click", () => {
      setConsent("true");
      loadGoogleAnalytics();
      removeBanner();
    });

    document.getElementById("cookie-decline").addEventListener("click", () => {
      setConsent("false");
      removeBanner();
    });
  }

  // Initialize on page load
  document.addEventListener("DOMContentLoaded", () => {
    const consent = localStorage.getItem(CONSENT_KEY);

    if (consent === null) {
      // No consent yet, show banner
      createBanner();
    } else if (consent === "true") {
      // User has consented, load GA
      loadGoogleAnalytics();
    }
    // If consent is 'false', do nothing
  });
})();
