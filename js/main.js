/* Edinburgh Accommodation Ltd — main.js */

(function () {
  'use strict';

  /* ---- Sticky header ---- */
  const header = document.getElementById('header');
  function updateHeader() {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  /* ---- Mobile nav toggle ---- */
  const navToggle = document.getElementById('navToggle');
  const nav = document.getElementById('nav');

  navToggle.addEventListener('click', function () {
    const open = nav.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  /* ---- Active nav link on scroll ---- */
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          const href = link.getAttribute('href');
          link.classList.toggle(
            'active',
            href === '#' + entry.target.id
          );
        });
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );
  sections.forEach(function (s) { sectionObserver.observe(s); });

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );
  revealEls.forEach(function (el) { revealObserver.observe(el); });

  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.faq-item').forEach(function (item) {
    const btn = item.querySelector('.faq-q');
    const answer = item.querySelector('.faq-a');

    btn.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      // Close all other items
      document.querySelectorAll('.faq-item.open').forEach(function (other) {
        if (other !== item) {
          other.classList.remove('open');
          other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('open', !isOpen);
      btn.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  /* ---- Map property tabs ---- */
  const mapFrame = document.getElementById('mapFrame');
  const mapGoogleLink = document.getElementById('mapGoogleLink');
  document.querySelectorAll('.map-tab').forEach(function (tab) {
    tab.addEventListener('click', function () {
      document.querySelectorAll('.map-tab').forEach(function (t) { t.classList.remove('active'); });
      this.classList.add('active');
      if (mapFrame) mapFrame.src = this.dataset.src;
      if (mapGoogleLink) mapGoogleLink.href = this.dataset.gmaps;
    });
  });

  /* ---- Contact form ---- */
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.querySelectorAll(':invalid').forEach(function (field) {
          field.style.borderColor = '#e53e3e';
          field.addEventListener('input', function () {
            field.style.borderColor = '';
          }, { once: true });
        });
        return;
      }

      // Build mailto link as a lightweight fallback
      const firstName = form.firstName.value.trim();
      const lastName  = form.lastName.value.trim();
      const email     = form.email.value.trim();
      const type      = form.tenantType.value;
      const message   = form.message.value.trim();

      const subject = encodeURIComponent('Room Enquiry – ' + firstName + ' ' + lastName);
      const body = encodeURIComponent(
        'Name: ' + firstName + ' ' + lastName + '\n' +
        'Email: ' + email + '\n' +
        'Type: ' + (type || 'Not specified') + '\n\n' +
        message
      );

      window.location.href =
        'mailto:info@edinburghaccommodationltd.com?subject=' + subject + '&body=' + body;

      form.reset();
      successMsg.hidden = false;
      successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      setTimeout(function () { successMsg.hidden = true; }, 8000);
    });
  }

  /* ---- Lightbox ---- */
  const lightbox     = document.getElementById('lightbox');
  const lightboxImg  = document.getElementById('lightboxImg');
  const lightboxCtr  = document.getElementById('lightboxCounter');
  const lbCloseBtn   = document.getElementById('lightboxClose');
  const lbPrev       = document.getElementById('lightboxPrev');
  const lbNext       = document.getElementById('lightboxNext');
  const galleryImgs  = Array.from(document.querySelectorAll('.gallery-item img'));
  let lbIndex = 0;

  function lbOpen(index) {
    lbIndex = (index + galleryImgs.length) % galleryImgs.length;
    lightboxImg.src = galleryImgs[lbIndex].src;
    lightboxImg.alt = galleryImgs[lbIndex].alt;
    lightboxCtr.textContent = (lbIndex + 1) + ' / ' + galleryImgs.length;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }
  function lbDismiss() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  galleryImgs.forEach(function (img, i) {
    img.parentElement.addEventListener('click', function () { lbOpen(i); });
  });

  lbCloseBtn.addEventListener('click', lbDismiss);
  lbPrev.addEventListener('click', function () { lbOpen(lbIndex - 1); });
  lbNext.addEventListener('click', function () { lbOpen(lbIndex + 1); });
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox || e.target === lightbox.querySelector('.lightbox-inner')) lbDismiss(); });

  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      lbDismiss();
    if (e.key === 'ArrowLeft')   lbOpen(lbIndex - 1);
    if (e.key === 'ArrowRight')  lbOpen(lbIndex + 1);
  });

  // Touch swipe support
  var lbTouchX = 0;
  lightbox.addEventListener('touchstart', function (e) { lbTouchX = e.changedTouches[0].clientX; }, { passive: true });
  lightbox.addEventListener('touchend', function (e) {
    var diff = lbTouchX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? lbOpen(lbIndex + 1) : lbOpen(lbIndex - 1);
  }, { passive: true });

  /* ---- Smooth scroll polyfill for older Safari ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

})();
