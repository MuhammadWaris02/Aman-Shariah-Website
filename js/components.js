/* =========================================================================
   components.js — renders the shared navbar and footer on every page.
   Each page only needs:
     <div id="site-header" data-active="home"></div>
     <div id="site-footer"></div>
   ========================================================================= */

(function () {
  /* Top-level information architecture.
     `children` turns an item into a dropdown.
     `matchId` is the page id that highlights that child (and its parent),
     so e.g. certification.html keeps the "Services" menu lit up. */
  const NAV_ITEMS = [
    { id: "home", label: "Home", href: "index.html" },
    { id: "about", label: "About Us", href: "about.html" },
    {
      id: "services",
      label: "Services",
      href: "services.html",
      children: [
        { label: "Shariah Advisory", href: "services.html#s1", desc: "Advice on business models, contracts and financing.", },
        { label: "Shariah Certification", href: "certification.html", matchId: "certification", desc: "Independent review and formal certification." },
        { label: "Shariah Audit & Review", href: "services.html#s3", desc: "Independent assessment against approved principles." },
        { label: "Product Development", href: "services.html#s5", desc: "Designing compliant products and structures." },
        { label: "Governance Advisory", href: "services.html#s6", desc: "Shariah governance frameworks and reporting." },
        { label: "Islamic Finance Consultancy", href: "services.html#s7", desc: "Banking, sukuk, takaful, funds and fintech." },
      ],
      foot: { label: "View All Services", href: "services.html" },
    },
    {
      id: "resources",
      label: "Resources",
      href: "training.html",
      children: [
        { label: "Training & Events", href: "training.html", matchId: "training", desc: "Workshops, seminars and executive briefings." },
        { label: "Gallery", href: "gallery.html", matchId: "gallery", desc: "Photos from our programmes and events." },
        { label: "Our Clients", href: "clients.html", matchId: "clients", desc: "Industries and organisations we serve." },
        { label: "FAQs", href: "faq.html", matchId: "faq", desc: "Answers to common Shariah questions." },
      ],
    },
    { id: "contact", label: "Contact Us", href: "contact.html" },
  ];

  function star(size) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="currentColor"><rect x="4" y="4" width="16" height="16"/><rect x="4" y="4" width="16" height="16" transform="rotate(45 12 12)"/></svg>`;
  }

  function caret() {
    return '<svg class="nav-caret" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" aria-hidden="true" focusable="false"><path d="m6 9 6 6 6-6"/></svg>';
  }

  function arrow() {
    return '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  }

  function buildNavItem(item, active) {
    /* Plain top-level link */
    if (!item.children) {
      const on = item.id === active;
      return `<a href="${item.href}" class="nav-link${on ? " active" : ""}"${on ? ' aria-current="page"' : ""}>${item.label}</a>`;
    }

    /* Parent is a real link (goes to the hub page); a sibling button toggles the panel. */
    const groupActive = item.id === active || item.children.some((c) => c.matchId === active);
    const panelId = `nav-panel-${item.id}`;

    const rows = item.children
      .map((c) => {
        const on = c.matchId === active;
        return `<a class="dropdown-link${on ? " active" : ""}" href="${c.href}"${on ? ' aria-current="page"' : ""}><span class="dropdown-text"><strong>${c.label}</strong><small>${c.desc}</small></span></a>`;
      })
      .join("");

    return `
        <div class="nav-item${groupActive ? " active" : ""}" data-dropdown>
          <a href="${item.href}" class="nav-link nav-link-parent${groupActive ? " active" : ""}"${groupActive ? ' aria-current="page"' : ""}>${item.label}</a>
          <button type="button" class="nav-dropdown-toggle" aria-label="${item.label} submenu" aria-expanded="false" aria-controls="${panelId}">${caret()}</button>
          <div class="dropdown" id="${panelId}">
            <div class="dropdown-panel">
              ${rows}
              ${item.foot ? `<a class="dropdown-all" href="${item.foot.href}">${item.foot.label}${arrow()}</a>` : ""}
            </div>
          </div>
        </div>`;
  }

  function buildHeader(active) {
    const links = NAV_ITEMS.map((item) => buildNavItem(item, active)).join("");

    return `
    <nav class="navbar" id="navbar">
      <div class="container nav-inner">
        <a href="index.html" class="brand"><span class="mark">${star(18)}</span>Aman Shariah Advisory</a>
        <div class="nav-links" id="navLinks">
          ${links}
          <a href="contact.html" class="btn btn-gold btn-sm nav-cta">Request Consultation</a>
        </div>
        <button class="hamburger" id="hamburger" aria-label="Toggle menu" aria-controls="navLinks" aria-expanded="false">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
    <div class="nav-overlay" id="navOverlay"></div>`;
  }

  function buildFooter() {
    return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <a href="index.html" class="brand"><span class="mark">${star(18)}</span>Aman Shariah Advisory</a>
            <p>Trusted Shariah guidance for ethical and sustainable business. Advisory, certification, audit, product development, and training services.</p>
            <div class="footer-social">
              <a href="#" aria-label="LinkedIn">${icon("linkedin")}</a>
              <a href="#" aria-label="Facebook">${icon("facebook")}</a>
              <a href="#" aria-label="Instagram">${icon("instagram")}</a>
              <a href="#" aria-label="YouTube">${icon("youtube")}</a>
            </div>
          </div>
          <div class="footer-col">
            <h5>Quick Links</h5>
            <ul>
              <li><a href="about.html">About Us</a></li>
              <li><a href="services.html">Services</a></li>
              <li><a href="certification.html">Certification</a></li>
              <li><a href="training.html">Training & Events</a></li>
              <li><a href="gallery.html">Gallery</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h5>Core Services</h5>
            <ul>
              <li><a href="services.html">Shariah Advisory</a></li>
              <li><a href="certification.html">Shariah Certification</a></li>
              <li><a href="services.html">Shariah Audit</a></li>
              <li><a href="services.html">Product Development</a></li>
              <li><a href="training.html">Training Programmes</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h5>Contact</h5>
            <ul class="footer-contact">
              <li>${icon("pin")}<span>Suite 501, Business Centre, Shahrah-e-Faisal, Karachi, Pakistan</span></li>
              <li>${icon("phone")}<span>+92 300 1234567</span></li>
              <li>${icon("mail")}<span>info@amanshariahadvisory.com</span></li>
            </ul>
          </div>
        </div>
        <div class="footer-disclaimer">
          <strong>Disclaimer:</strong> The information on this website is for general awareness only and does not constitute a formal Shariah opinion, legal, tax, accounting, or investment advice, or regulatory approval. A formal Shariah opinion or certification can only be issued after reviewing the relevant facts, contracts, and documents.
        </div>
        <div class="footer-bottom">
          <span>&copy; <span id="year"></span> Aman Shariah Advisory. All rights reserved.</span>
          <span><a href="#">Privacy Policy</a> &middot; <a href="#">Terms of Use</a> &middot; <a href="#">Complaints</a> &middot; <a href="certification.html#verify">Certificate Verification</a></span>
        </div>
      </div>
    </footer>
    <a class="whatsapp-fab" href="https://wa.me/923001234567" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${icon("whatsapp")}</a>
    <button class="back-to-top" id="backToTop" aria-label="Back to top">${icon("up")}</button>
    <div class="lightbox" id="lightbox">
      <button class="lightbox-close" id="lightboxClose">${icon("close")}</button>
      <button class="lightbox-prev" id="lightboxPrev">${icon("chevronLeft")}</button>
      <img src="" alt="" id="lightboxImg">
      <button class="lightbox-next" id="lightboxNext">${icon("chevronRight")}</button>
    </div>`;
  }

  function icon(name) {
    const icons = {
      facebook: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z"/></svg>',
      linkedin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M6.9 8.4H3.3V21H6.9V8.4zM5.1 3a2.1 2.1 0 1 0 0 4.2 2.1 2.1 0 0 0 0-4.2zM21 21v-7c0-3.4-1.8-5-4.2-5-1.9 0-2.8 1-3.2 1.8V8.4H10v12.6h3.6v-7c0-.8.1-1.6 1.5-1.6s1.4 1 1.4 1.6V21H21z"/></svg>',
      instagram: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2 0 2 .2 2.4.4a4.9 4.9 0 0 1 2.8 2.8c.2.4.4 1.2.4 2.4.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c0 1.2-.2 2-.4 2.4a4.9 4.9 0 0 1-2.8 2.8c-.4.2-1.2.4-2.4.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2 0-2-.2-2.4-.4a4.9 4.9 0 0 1-2.8-2.8c-.2-.4-.4-1.2-.4-2.4C2 15.6 2 15.2 2 12s0-3.6.1-4.9c0-1.2.2-2 .4-2.4A4.9 4.9 0 0 1 5.3 2c.4-.2 1.2-.4 2.4-.4C8.9 2.2 9.3 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1 0-1.6.2-1.9.3a3 3 0 0 0-1.7 1.7c-.2.3-.3.9-.4 1.9-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c0 1 .2 1.6.4 1.9a3 3 0 0 0 1.7 1.7c.3.2.9.3 1.9.4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1 0 1.6-.2 1.9-.4a3 3 0 0 0 1.7-1.7c.2-.3.3-.9.4-1.9.1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c0-1-.2-1.6-.4-1.9a3 3 0 0 0-1.7-1.7c-.3-.1-.9-.3-1.9-.3-1.2-.1-1.6-.1-4.7-.1zm0 3.6a5.4 5.4 0 1 1 0 10.8 5.4 5.4 0 0 1 0-10.8zm0 1.8a3.6 3.6 0 1 0 0 7.2 3.6 3.6 0 0 0 0-7.2zm5.6-2a1.3 1.3 0 1 1 0 2.6 1.3 1.3 0 0 1 0-2.6z"/></svg>',
      youtube: '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12s0-3.2-.4-4.7a2.8 2.8 0 0 0-2-2C17.9 5 12 5 12 5s-5.9 0-7.6.3a2.8 2.8 0 0 0-2 2C2 8.8 2 12 2 12s0 3.2.4 4.7a2.8 2.8 0 0 0 2 2C6.1 19 12 19 12 19s5.9 0 7.6-.3a2.8 2.8 0 0 0 2-2C22 15.2 22 12 22 12zM10 15.5v-7l6 3.5-6 3.5z"/></svg>',
      whatsapp: '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.9-2-1-.3-.1-.5-.1-.6.1-.2.3-.7 1-.9 1.2-.2.2-.3.2-.6.1-.3-.2-1.2-.5-2.3-1.5-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.2-.5.1-.2 0-.4 0-.5s-.6-1.5-.8-2c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.9 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3z"/><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2a8.1 8.1 0 0 1-4.2-1.1l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2z"/></svg>',
      pin: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
      phone: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8 9.9a16 16 0 0 0 6 6l1.4-1.4a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.8 2z"/></svg>',
      mail: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m2 7 10 6 10-6"/></svg>',
      up: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
      close: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>',
      chevronLeft: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>',
      chevronRight: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m9 18 6-6-6-6"/></svg>',
    };
    return icons[name] || "";
  }

  function mount() {
    const headerEl = document.getElementById("site-header");
    const footerEl = document.getElementById("site-footer");
    if (headerEl) headerEl.outerHTML = buildHeader(headerEl.getAttribute("data-active"));
    if (footerEl) footerEl.outerHTML = buildFooter();
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    document.dispatchEvent(new Event("chrome:ready"));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
