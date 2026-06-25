/* =====================================================================
   Green Nails Spa — script.js
   --------------------------------------------------------------------
   Lightweight vanilla JavaScript. No build, no framework, no tracking.
   Each subsystem is wrapped in a self-invoking function and started
   only when its anchor element exists, so the file is safe even if a
   section is removed.
   ===================================================================== */

(function () {
  "use strict";

  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ============================== Sticky header shadow ============================== */
  (function header() {
    const header = document.getElementById("site-header");
    if (!header) return;
    const onScroll = () => {
      if (window.scrollY > 8) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  })();

  /* ============================== Mobile navigation ============================== */
  (function mobileNav() {
    const toggle = document.getElementById("nav-toggle");
    const nav = document.getElementById("primary-nav");
    if (!toggle || !nav) return;

    const closeNav = () => {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      nav.classList.remove("is-open");
    };
    const openNav = () => {
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      nav.classList.add("is-open");
    };

    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      if (expanded) closeNav();
      else openNav();
    });

    // Close when a nav link is tapped.
    nav.addEventListener("click", (e) => {
      const link = e.target.closest("a");
      if (!link) return;
      if (window.innerWidth <= 880) closeNav();
    });

    // Close on escape.
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        closeNav();
        toggle.focus();
      }
    });

    // Close on resize past breakpoint.
    let lastWidth = window.innerWidth;
    window.addEventListener("resize", () => {
      if (window.innerWidth > 880 && lastWidth <= 880) closeNav();
      lastWidth = window.innerWidth;
    });
  })();

  /* ============================== Hours: today's row + hero today ============================== */
  (function hoursToday() {
    // Map JS getDay() (0=Sun..6=Sat) to display strings used in hero.
    const HOURS = {
      0: "12:00 PM – 5:00 PM",   // Sunday
      1: "Closed",               // Monday
      2: "10:00 AM – 7:00 PM",   // Tuesday
      3: "10:00 AM – 7:00 PM",   // Wednesday
      4: "10:00 AM – 7:00 PM",   // Thursday
      5: "10:00 AM – 7:00 PM",   // Friday
      6: "9:30 AM – 7:00 PM"     // Saturday
    };

    const today = new Date().getDay();

    // Mark today's row in the hours list.
    document
      .querySelectorAll(".hours__row")
      .forEach((row) => {
        if (Number(row.dataset.day) === today) row.classList.add("is-today");
      });

    // Populate hero "open today" line.
    const heroToday = document.getElementById("hero-today-hours");
    if (heroToday) heroToday.textContent = HOURS[today];
  })();

  /* ============================== Services: filter tabs ============================== */
  (function servicesFilter() {
    const tabs = document.querySelectorAll(".services__tab");
    const groups = document.querySelectorAll(".service-group");
    if (!tabs.length || !groups.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const filter = tab.dataset.filter;

        tabs.forEach((t) => {
          t.classList.toggle("is-active", t === tab);
          t.setAttribute("aria-selected", t === tab ? "true" : "false");
        });

        groups.forEach((g) => {
          const matches = filter === "all" || g.dataset.category === filter;
          g.classList.toggle("is-filtered-out", !matches);
          // Auto-open the group when isolated; collapse all when showing 'all'.
          if (filter !== "all" && matches) g.open = true;
          if (filter === "all") {
            g.open = g.dataset.category === "nail-enhancement";
          }
        });
      });
    });
  })();

  /* ============================== Gallery lightbox ============================== */
  (function gallery() {
    const grid = document.getElementById("gallery-grid");
    const lightbox = document.getElementById("lightbox");
    const lbImg = document.getElementById("lightbox-img");
    const lbCap = document.getElementById("lightbox-caption");
    const lbClose = document.getElementById("lightbox-close");
    const lbPrev = document.getElementById("lightbox-prev");
    const lbNext = document.getElementById("lightbox-next");
    if (!grid || !lightbox) return;

    const items = Array.from(grid.querySelectorAll(".gallery__btn"));
    let current = 0;
    let previouslyFocused = null;

    const open = (idx) => {
      current = idx;
      const btn = items[idx];
      if (!btn) return;
      const img = btn.querySelector("img");
      if (!img) return;
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = img.alt;
      previouslyFocused = document.activeElement;
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
      // Move focus into the lightbox.
      lbClose.focus();
    };

    const close = () => {
      lightbox.hidden = true;
      lbImg.src = "";
      document.body.style.overflow = "";
      if (previouslyFocused && typeof previouslyFocused.focus === "function") {
        previouslyFocused.focus();
      }
    };

    const next = () => open((current + 1) % items.length);
    const prev = () => open((current - 1 + items.length) % items.length);

    items.forEach((btn, i) => btn.addEventListener("click", () => open(i)));
    lbClose.addEventListener("click", close);
    lbPrev.addEventListener("click", prev);
    lbNext.addEventListener("click", next);
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) close();
    });

    document.addEventListener("keydown", (e) => {
      if (lightbox.hidden) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    });
  })();

  /* ============================== Instagram embed bootstrap ============================== */
  (function instagram() {
    const container = document.getElementById("instagram-embed");
    const fallback = document.getElementById("instagram-fallback");
    if (!container) return;

    // If the embed container has no blockquote child (the placeholder was
    // never replaced), surface the fallback link immediately.
    const hasBlockquote = container.querySelector("blockquote.instagram-media");
    if (!hasBlockquote) {
      if (fallback) fallback.hidden = false;
      return;
    }

    const SRC = "https://www.instagram.com/embed.js";

    // Append the script just once.
    const alreadyLoaded = document.querySelector('script[data-igembed="true"]');
    if (!alreadyLoaded) {
      const s = document.createElement("script");
      s.async = true;
      s.src = SRC;
      s.setAttribute("data-igembed", "true");
      s.onload = () => {
        if (window.instgrm && window.instgrm.Embeds) {
          window.instgrm.Embeds.process();
        }
      };
      s.onerror = () => {
        if (fallback) fallback.hidden = false;
      };
      document.body.appendChild(s);
    } else if (window.instgrm && window.instgrm.Embeds) {
      window.instgrm.Embeds.process();
    }

    // Safety net: if after 6 seconds the embed hasn't visually rendered
    // (Instagram replaces the blockquote with an iframe), show the fallback.
    setTimeout(() => {
      const rendered = container.querySelector("iframe");
      if (!rendered && fallback) fallback.hidden = false;
    }, 6000);
  })();

  /* ============================== Contact form (FormSubmit fetch) ============================== */
  (function contactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;
    const success = document.getElementById("contact-success");
    const error = document.getElementById("contact-error");
    const submit = form.querySelector('button[type="submit"]');

    form.addEventListener("submit", async (e) => {
      // Require phone or email in addition to required HTML5 validation.
      const phone = form.elements.phone.value.trim();
      const email = form.elements.email.value.trim();

      if (!phone && !email) {
        e.preventDefault();
        if (error) {
          error.hidden = false;
          error.textContent = "Please enter a phone number or email so we can reach you.";
        }
        form.elements.phone.focus();
        return;
      }

      // Honeypot — if filled, abort silently.
      if (form.elements._honey && form.elements._honey.value.trim() !== "") {
        e.preventDefault();
        return;
      }

      // If the form action still has the literal placeholder, fall back to a mailto draft.
      if (form.action.indexOf("CONTACT_EMAIL_HERE") !== -1) {
        e.preventDefault();
        const body =
          "Name: "      + (form.elements.name.value || "") + "\n" +
          "Phone: "     + phone + "\n" +
          "Email: "     + email + "\n" +
          "Service: "   + (form.elements.service.value || "") + "\n" +
          "Preferred: " + (form.elements.preferred_time.value || "") + "\n\n" +
          (form.elements.message.value || "");
        window.location.href =
          "mailto:CONTACT_EMAIL_HERE?subject=" +
          encodeURIComponent("New inquiry from greennailsspa website") +
          "&body=" + encodeURIComponent(body);
        return;
      }

      // Submit via fetch so we can show inline confirmation without a redirect.
      e.preventDefault();
      if (submit) {
        submit.disabled = true;
        submit.textContent = "Sending...";
      }
      if (error) error.hidden = true;

      try {
        const data = new FormData(form);
        const res = await fetch(form.action, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" }
        });
        if (!res.ok) throw new Error("Bad response");
        form.reset();
        if (success) {
          success.hidden = false;
          success.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "center" });
        }
      } catch (err) {
        if (error) {
          error.hidden = false;
          error.textContent = "Something went wrong sending the form. Please call or use the email link below.";
        }
      } finally {
        if (submit) {
          submit.disabled = false;
          submit.textContent = "Send Note";
        }
      }
    });
  })();

  /* ============================== Footer year ============================== */
  (function copyrightYear() {
    const el = document.getElementById("copyright-year");
    if (el) el.textContent = String(new Date().getFullYear());
  })();
})();
