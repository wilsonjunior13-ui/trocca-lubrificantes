const cookieConsentKey = "trocca_cookie_consent_v1";

function updateConsent(granted) {
  if (typeof window.gtag === "function") {
    window.gtag("consent", "update", {
      ad_storage: granted ? "granted" : "denied",
      ad_user_data: granted ? "granted" : "denied",
      ad_personalization: granted ? "granted" : "denied",
      analytics_storage: granted ? "granted" : "denied",
      functionality_storage: "granted",
      security_storage: "granted",
    });
  }
}

function loadGoogleTagManager() {
  const gtmId = window.TROCCA_GTM_ID;
  if (!gtmId || document.querySelector(`script[data-gtm-id="${gtmId}"]`)) return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": new Date().getTime(), event: "gtm.js" });

  const firstScript = document.getElementsByTagName("script")[0];
  const gtmScript = document.createElement("script");
  gtmScript.async = true;
  gtmScript.dataset.gtmId = gtmId;
  gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
  firstScript.parentNode.insertBefore(gtmScript, firstScript);
}

function loadConsentEmbeds() {
  document.querySelectorAll("iframe[data-consent-src]").forEach((iframe) => {
    iframe.src = iframe.dataset.consentSrc;
    iframe.removeAttribute("data-consent-src");
    iframe.closest(".map-card")?.querySelector(".map-consent")?.remove();
  });
}

function saveCookieConsent(value) {
  localStorage.setItem(cookieConsentKey, value);
  const granted = value === "accepted";
  updateConsent(granted);
  if (granted) {
    loadGoogleTagManager();
    loadConsentEmbeds();
  }
  document.querySelector(".cookie-banner")?.remove();
}

function showCookieBanner() {
  document.querySelector(".cookie-banner")?.remove();

  const banner = document.createElement("section");
  banner.className = "cookie-banner";
  banner.setAttribute("aria-label", "Preferências de cookies");
  banner.innerHTML = `
    <div class="cookie-banner__copy">
      <strong>Privacidade e cookies</strong>
      <p>Nosso site usa cookies necessários para funcionar. Com sua autorização, também usamos cookies de medição e anúncios para Google Ads, Meta Ads e TikTok Ads.</p>
      <a href="/politica-de-privacidade/#cookies">Ver Política de Privacidade</a>
    </div>
    <div class="cookie-banner__preferences" hidden>
      <label>
        <input type="checkbox" data-cookie-marketing />
        Permitir cookies de medição e anúncios
      </label>
    </div>
    <div class="cookie-banner__actions">
      <button type="button" class="cookie-secondary" data-cookie-manage>Gerenciar cookies</button>
      <button type="button" class="cookie-secondary" data-cookie-reject>Recusar</button>
      <button type="button" class="cookie-primary" data-cookie-accept>Aceitar</button>
      <button type="button" class="cookie-primary" data-cookie-save hidden>Salvar escolhas</button>
    </div>
  `;

  document.body.appendChild(banner);

  const preferences = banner.querySelector(".cookie-banner__preferences");
  const saveButton = banner.querySelector("[data-cookie-save]");
  const manageButton = banner.querySelector("[data-cookie-manage]");

  banner.querySelector("[data-cookie-accept]").addEventListener("click", () => saveCookieConsent("accepted"));
  banner.querySelector("[data-cookie-reject]").addEventListener("click", () => saveCookieConsent("declined"));
  manageButton.addEventListener("click", () => {
    preferences.hidden = false;
    saveButton.hidden = false;
    manageButton.hidden = true;
  });
  saveButton.addEventListener("click", () => {
    const allowed = banner.querySelector("[data-cookie-marketing]").checked;
    saveCookieConsent(allowed ? "accepted" : "declined");
  });
}

const existingCookieConsent = localStorage.getItem(cookieConsentKey);
if (existingCookieConsent === "accepted") {
  updateConsent(true);
  loadGoogleTagManager();
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", loadConsentEmbeds);
  } else {
    loadConsentEmbeds();
  }
} else if (existingCookieConsent === "declined") {
  updateConsent(false);
} else {
  window.addEventListener("DOMContentLoaded", showCookieBanner);
}

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-cookie-preferences]");
  if (!trigger) return;
  event.preventDefault();
  showCookieBanner();
});

document.addEventListener("click", (event) => {
  const trigger = event.target.closest("[data-cookie-accept-all]");
  if (!trigger) return;
  event.preventDefault();
  saveCookieConsent("accepted");
});

const menuButton = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");

const serviceHashRoutes = {
  "#cambio-automatico": "/servicos/cambio-automatico/",
  "#oleo-motor": "/servicos/oleo-motor/",
  "#freios-pastilhas": "/servicos/freios-pastilhas/",
  "#fluido-radiador": "/servicos/fluido-radiador/",
  "#suspensao-amortecedores": "/servicos/suspensao-amortecedores/",
  "#revisao-preventiva": "/servicos/revisao-preventiva/",
  "#delay-acelerador": "/servicos/delay-acelerador/",
  "#diagnostico-automotivo": "/servicos/diagnostico-automotivo/",
};

if (location.pathname.endsWith("/servicos.html") && serviceHashRoutes[location.hash]) {
  location.replace(serviceHashRoutes[location.hash]);
}

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    }
  });
}

const googleReviews = Array.isArray(window.TROCCA_GOOGLE_REVIEWS)
  ? window.TROCCA_GOOGLE_REVIEWS
  : [];

const screenshotReviews = [
  {
    reviewer: "Moacir Olegário",
    comment: "Excelente atendimento e preço justo. Virei cliente fiel",
  },
  {
    reviewer: "Joel Simão",
    comment:
      "Desde o atendimento pelo WhatsApp, já foi uma maravilha. Tenho um carro automático que peguei faz 4 meses, e queria...",
  },
  {
    reviewer: "Naldo Bina",
    comment:
      "Estou muito satisfeito pelo atendimento, serviço e atenção, excelente profissional, parabéns Vitor. Gostei muito da limpeza e organização de sua oficina. Recomendo muito.",
  },
  {
    reviewer: "Ailton Magal",
    comment:
      "Eu recomendo o Vitor, muito profissional e educado. Preço justo. O carro ficou muito bom, acabou os trancos e os ruídos de câmbio.",
  },
  {
    reviewer: "André Rosa",
    comment:
      "Serviço de troca de óleo do câmbio automático realizado com excelência. Atendimento profissional, equipe transparente...",
  },
  {
    reviewer: "Fabio Campos",
    comment:
      "Moro em Santana de Parnaíba e encontrei essa empresa nas redes sociais com uma avaliação muito boa, resolvi ligar e...",
  },
  {
    reviewer: "Willian koga",
    comment:
      "Atendimento de qualidade, conhecimento técnico, produtos de qualidade, preço justo e mão de obra qualificada....",
  },
  {
    reviewer: "Will Rodrigues",
    comment: "Ótimo atendimento, eles explicam tudo. Recomendo.",
  },
  {
    reviewer: "Luiz",
    comment:
      "Fiz a troca preventiva do câmbio, as trocas mais suaves em rotação mais baixa melhoraram consumo. Mecânico tirou todas as dúvidas e preço muito bom!",
  },
];

function createTestimonialCard(review) {
  const card = document.createElement("article");
  const firstName = (review.reviewer || "Cliente").trim().split(/\s+/)[0];
  const initial = firstName.charAt(0).toUpperCase();

  card.innerHTML = `
    <div class="review-top">
      <span class="stars">★★★★★</span>
      <span class="verified">Cliente verificado</span>
    </div>
    <p></p>
    <div class="review-author">
      <span class="avatar"></span>
      <div>
        <strong></strong>
        <span>Avaliação no Google</span>
      </div>
    </div>
  `;

  card.querySelector("p").textContent = review.comment || "Avaliação positiva no Google.";
  card.querySelector(".avatar").textContent = initial;
  card.querySelector("strong").textContent = firstName;
  return card;
}

const testimonialTrack = document.querySelector(".testimonial-grid");
const reviewsToShow = googleReviews.length ? googleReviews : screenshotReviews;

if (testimonialTrack && reviewsToShow.length) {
  testimonialTrack.innerHTML = "";
  [...reviewsToShow, ...reviewsToShow].forEach((review) => {
    testimonialTrack.appendChild(createTestimonialCard(review));
  });

  const testimonialTotal = reviewsToShow.length;
  let testimonialIndex = 0;
  let testimonialTimer;

  const moveTestimonials = () => {
    const firstCard = testimonialTrack.querySelector("article");
    if (!firstCard) return;

    const trackStyles = window.getComputedStyle(testimonialTrack);
    const gap = Number.parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;
    const step = firstCard.getBoundingClientRect().width + gap;
    testimonialTrack.style.transform = `translate3d(${-testimonialIndex * step}px, 0, 0)`;
  };

  const resetTestimonials = () => {
    testimonialTrack.style.transition = "none";
    testimonialIndex = 0;
    moveTestimonials();
    testimonialTrack.getBoundingClientRect();
    testimonialTrack.style.transition = "";
  };

  const advanceTestimonials = () => {
    testimonialIndex += 1;
    moveTestimonials();

    if (testimonialIndex >= testimonialTotal) {
      window.setTimeout(resetTestimonials, 650);
    }
  };

  const startTestimonials = () => {
    window.clearInterval(testimonialTimer);
    testimonialTimer = window.setInterval(advanceTestimonials, 5200);
  };

  testimonialTrack.addEventListener("mouseenter", () => window.clearInterval(testimonialTimer));
  testimonialTrack.addEventListener("mouseleave", startTestimonials);
  window.addEventListener("resize", resetTestimonials);
  moveTestimonials();
  startTestimonials();
}

const brandTrack = document.querySelector("#brandTrack");

const carBrands = [
  ["Toyota", "toyota"],
  ["Volkswagen", "volkswagen"],
  ["Ford", "ford"],
  ["Chevrolet", "chevrolet"],
  ["Hyundai", "hyundai"],
  ["Nissan", "nissan"],
  ["Honda", "honda"],
  ["Kia", "kia"],
  ["BMW", "bmw"],
  ["Mercedes-Benz", "mercedesbenz"],
  ["Audi", "audi"],
  ["Lexus", "lexus"],
  ["Volvo", "volvo"],
  ["BYD", "byd"],
  ["Fiat", "fiat"],
  ["Peugeot", "peugeot"],
  ["Renault", "renault"],
  ["Porsche", "porsche"],
  ["Jeep", "jeep"],
  ["Land Rover", "landrover"],
  ["Jaguar", "jaguar"],
  ["Mitsubishi Motors", "mitsubishi"],
  ["Subaru", "subaru"],
  ["Suzuki", "suzuki"],
  ["Chery", "chery"],
  ["GWM", "greatwall"],
  ["Ram", "ram"],
];

function createBrandCard([name, slug]) {
  const card = document.createElement("span");
  card.className = "brand-card";

  const logo = document.createElement("img");
  logo.src = `/assets/brand-logos/${slug}.svg`;
  logo.alt = "";
  logo.loading = "lazy";
  logo.addEventListener("error", () => {
    logo.remove();
  });

  const label = document.createElement("span");
  label.textContent = name;

  card.append(logo, label);
  return card;
}

if (brandTrack) {
  [...carBrands, ...carBrands].forEach((brand) => {
    brandTrack.appendChild(createBrandCard(brand));
  });
}

const legacyGoogleReviews = googleReviews;
const testimonialCards = document.querySelectorAll(".testimonial-grid article");

if (legacyGoogleReviews.length && testimonialCards.length) {
  testimonialCards.forEach((card, index) => {
    const review = legacyGoogleReviews[index % legacyGoogleReviews.length];
    const text = card.querySelector("p");
    const avatar = card.querySelector(".avatar");
    const name = card.querySelector(".review-author strong");
    const source = card.querySelector(".review-author span");
    const stars = card.querySelector(".stars");

    if (text) text.textContent = review.comment || "Avaliação positiva no Google.";
    if (avatar) avatar.textContent = (review.reviewer || "G").trim().charAt(0).toUpperCase();
    if (name) name.textContent = (review.reviewer || "Cliente Google").trim().split(/\s+/)[0];
    if (source) source.textContent = "Avaliação no Google";
    if (stars) stars.textContent = "★★★★★";
  });
}
