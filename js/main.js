/* =========================================================================
   main.js — shared behaviour for every page
   Sticky navbar / hamburger / smooth scroll / counters / scroll reveal /
   gallery filter + lightbox / FAQ accordion / form validation / back-to-top
   ========================================================================= */

window.addEventListener("load", () => {
  const loader = document.getElementById("page-loader");
  if (loader) setTimeout(() => loader.classList.add("loaded"), 250);
});

document.addEventListener("chrome:ready", () => {
  initNavbar();
  initBackToTop();
  initLightbox();
});

document.addEventListener("DOMContentLoaded", () => {
  initSmoothScroll();
  initReveal();
  initCounters();
  initGalleryFilter();
  initFaq();
  initForms();
});

/* --------------------------------- NAVBAR ---------------------------------- */
function initNavbar() {
  const navbar = document.getElementById("navbar");
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");
  const overlay = document.getElementById("navOverlay");
  if (!navbar) return;

  const items = navLinks ? Array.from(navLinks.querySelectorAll("[data-dropdown]")) : [];
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

  /* ---- dropdown helpers ---- */
  function closeItem(item) {
    item.classList.remove("open");
    item.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", "false");
  }
  function openItem(item) {
    items.forEach((i) => { if (i !== item) closeItem(i); });
    item.classList.add("open");
    item.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", "true");
  }
  function closeAll() { items.forEach(closeItem); }
  function anyOpen() { return items.some((i) => i.classList.contains("open")); }

  items.forEach((item) => {
    const toggle = item.querySelector(".nav-dropdown-toggle");
    const links = () => Array.from(item.querySelectorAll(".dropdown-link, .dropdown-all"));

    toggle?.addEventListener("click", (e) => {
      e.stopPropagation();
      item.classList.contains("open") ? closeItem(item) : openItem(item);
    });

    /* Hover to open, but only on real pointers (not touch devices). */
    item.addEventListener("mouseenter", () => { if (finePointer.matches) openItem(item); });
    item.addEventListener("mouseleave", () => { if (finePointer.matches) closeItem(item); });

    /* Keyboard: ArrowDown/ArrowUp open and jump into the panel. */
    toggle?.addEventListener("keydown", (e) => {
      const list = links();
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        openItem(item);
        (e.key === "ArrowDown" ? list[0] : list[list.length - 1])?.focus();
      } else if (e.key === "Escape") {
        closeItem(item);
      }
    });

    /* Arrow / Home / End navigation between panel items.
       The caret button has its own handler, so ignore keys that bubbled from it. */
    item.addEventListener("keydown", (e) => {
      if (e.target === toggle) return;
      const list = links();
      const i = list.indexOf(document.activeElement);
      if (e.key === "Escape") { closeItem(item); toggle?.focus(); }
      else if (e.key === "ArrowDown") { e.preventDefault(); list[(i + 1) % list.length]?.focus(); }
      else if (e.key === "ArrowUp") { e.preventDefault(); list[(i - 1 + list.length) % list.length]?.focus(); }
      else if (e.key === "Home") { e.preventDefault(); list[0]?.focus(); }
      else if (e.key === "End") { e.preventDefault(); list[list.length - 1]?.focus(); }
      else if (e.key === "Tab" && !e.shiftKey && i === list.length - 1) { closeItem(item); }
    });

    /* Close when focus moves somewhere else. */
    item.addEventListener("focusout", (e) => {
      if (!item.contains(e.relatedTarget)) closeItem(item);
    });
  });

  /* Click outside closes everything. */
  document.addEventListener("click", (e) => {
    if (!e.target.closest("[data-dropdown]")) closeAll();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && anyOpen()) closeAll();
  });

  const onScroll = () => {
    if (window.scrollY > 40) navbar.classList.add("scrolled");
    else navbar.classList.remove("scrolled");
    closeAll();
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  function closeMenu() {
    if (!hamburger || !navLinks || !overlay) return;
    hamburger.classList.remove("open");
    navLinks.classList.remove("open");
    overlay.classList.remove("show");
    hamburger.setAttribute("aria-expanded", "false");
    closeAll();
  }

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");
      hamburger.classList.toggle("open", isOpen);
      overlay.classList.toggle("show", isOpen);
      hamburger.setAttribute("aria-expanded", String(isOpen));
      if (!isOpen) closeAll();
    });
  }
  if (overlay) overlay.addEventListener("click", closeMenu);
  navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
}

/* ------------------------------ SMOOTH SCROLL ------------------------------ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const id = link.getAttribute("href");
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById("navbar")?.offsetHeight || 82;
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH + 1, behavior: "smooth" });
    });
  });
}

/* -------------------------------- BACK TO TOP ------------------------------ */
function initBackToTop() {
  const btn = document.getElementById("backToTop");
  if (!btn) return;
  window.addEventListener("scroll", () => btn.classList.toggle("show", window.scrollY > 500), { passive: true });
  btn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* -------------------------------- SCROLL REVEAL ----------------------------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );
  items.forEach((el) => io.observe(el));
}

/* -------------------------------- COUNTERS ---------------------------------- */
function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        io.unobserve(entry.target);
      });
    },
    { threshold: 0.4 }
  );
  counters.forEach((el) => io.observe(el));

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute("data-count"));
    const duration = 1600;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(tick);
  }
}

/* ------------------------------ GALLERY FILTER ------------------------------ */
function initGalleryFilter() {
  const filters = document.querySelectorAll(".filter-btn");
  const items = document.querySelectorAll(".g-item");
  if (!filters.length || !items.length) return;

  filters.forEach((btn) => {
    btn.addEventListener("click", () => {
      filters.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.getAttribute("data-filter");
      items.forEach((item) => {
        const match = cat === "all" || item.getAttribute("data-category") === cat;
        item.style.display = match ? "" : "none";
      });
    });
  });

  const loadMoreBtn = document.getElementById("loadMoreBtn");
  const hiddenItems = document.querySelectorAll(".g-item.g-hidden");
  if (loadMoreBtn && hiddenItems.length) {
    loadMoreBtn.addEventListener("click", () => {
      hiddenItems.forEach((item) => item.classList.remove("g-hidden"));
      loadMoreBtn.style.display = "none";
    });
  } else if (loadMoreBtn) {
    loadMoreBtn.style.display = "none";
  }
}

/* --------------------------------- LIGHTBOX ---------------------------------- */
function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const closeBtn = document.getElementById("lightboxClose");
  const prevBtn = document.getElementById("lightboxPrev");
  const nextBtn = document.getElementById("lightboxNext");
  const galleryImgs = Array.from(document.querySelectorAll(".g-item img"));
  if (!lightbox || !galleryImgs.length) return;

  let currentIndex = 0;

  function openAt(index) {
    currentIndex = index;
    lightboxImg.src = galleryImgs[currentIndex].src;
    lightboxImg.alt = galleryImgs[currentIndex].alt;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function close() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
  }
  function step(dir) {
    currentIndex = (currentIndex + dir + galleryImgs.length) % galleryImgs.length;
    lightboxImg.src = galleryImgs[currentIndex].src;
    lightboxImg.alt = galleryImgs[currentIndex].alt;
  }

  galleryImgs.forEach((img, i) => img.closest(".g-item").addEventListener("click", () => openAt(i)));
  closeBtn.addEventListener("click", close);
  prevBtn.addEventListener("click", () => step(-1));
  nextBtn.addEventListener("click", () => step(1));
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); });
  document.addEventListener("keydown", (e) => {
    if (!lightbox.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") step(-1);
    if (e.key === "ArrowRight") step(1);
  });
}

/* ----------------------------------- FAQ -------------------------------------- */
function initFaq() {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const q = item.querySelector(".faq-q");
    const a = item.querySelector(".faq-a");
    if (!q || !a) return;
    q.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");
      item.closest(".faq-list")?.querySelectorAll(".faq-item.open").forEach((openItem) => {
        openItem.classList.remove("open");
        openItem.querySelector(".faq-a").style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add("open");
        a.style.maxHeight = a.scrollHeight + "px";
      }
    });
  });

  /* Deep links such as services.html#s1 should land on an already-expanded panel. */
  const deepLink = document.getElementById(decodeURIComponent(location.hash.slice(1)));
  if (deepLink && deepLink.classList.contains("faq-item")) {
    const panel = deepLink.querySelector(".faq-a");
    if (panel) {
      deepLink.classList.add("open");
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  }
}

/* -------------------------------- FORM VALIDATION ------------------------------ */
function initForms() {
  document.querySelectorAll("form[data-validate]").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;
      form.querySelectorAll("[required]").forEach((input) => {
        const field = input.closest(".field") || input.closest(".field-check");
        let ok;
        if (input.type === "checkbox") {
          ok = input.checked;
        } else {
          ok = input.value.trim().length > 0;
          if (input.type === "email" && ok) ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
        }
        if (field) field.classList.toggle("invalid", !ok);
        if (!ok) valid = false;
      });

      const successEl = form.querySelector(".form-success");
      if (valid) {
        if (successEl) {
          successEl.classList.add("show");
          successEl.textContent = "Thank you — your request has been received. Our advisory team will contact you within one business day.";
        }
        form.reset();
        form.querySelectorAll(".invalid").forEach((f) => f.classList.remove("invalid"));
      } else if (successEl) {
        successEl.classList.remove("show");
      }
    });
  });
}
