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
