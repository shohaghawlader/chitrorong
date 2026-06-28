(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  // Loader: do not let a slow video delay the page indefinitely.
  const loader = $('#siteLoader');
  let loaderDismissed = false;
  const hideLoader = () => {
    if (loaderDismissed || !loader) return;
    loaderDismissed = true;
    loader.classList.add('is-hidden');
    window.setTimeout(() => loader.remove(), 700);
  };
  window.addEventListener('load', () => window.setTimeout(hideLoader, 350), { once: true });
  window.setTimeout(hideLoader, 2400);

  // Header appearance.
  const header = $('#siteHeader');
  const updateHeader = () => header?.classList.toggle('is-solid', window.scrollY > 35);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // Mobile navigation.
  const menuToggle = $('#menuToggle');
  const menuClose = $('#menuClose');
  const mobileMenu = $('#mobileMenu');
  const menuBackdrop = $('#menuBackdrop');
  let lastMenuFocus = null;

  const closeMenu = () => {
    if (!mobileMenu?.classList.contains('is-open')) return;
    mobileMenu.classList.remove('is-open');
    menuBackdrop?.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    menuToggle?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
    lastMenuFocus?.focus?.();
  };

  const openMenu = () => {
    if (!mobileMenu) return;
    lastMenuFocus = document.activeElement;
    mobileMenu.classList.add('is-open');
    menuBackdrop?.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuToggle?.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
    window.setTimeout(() => $('a', mobileMenu)?.focus(), 120);
  };

  menuToggle?.addEventListener('click', () => {
    mobileMenu?.classList.contains('is-open') ? closeMenu() : openMenu();
  });
  menuClose?.addEventListener('click', closeMenu);
  menuBackdrop?.addEventListener('click', closeMenu);
  $$('a', mobileMenu).forEach(link => link.addEventListener('click', closeMenu));

  // Reveal elements as they reach the viewport.
  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -25px' });
    revealItems.forEach(item => observer.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('is-visible'));
  }

  // Work filter.
  const filters = $$('.work-filter');
  const workItems = $$('.work-card');
  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      const value = filter.dataset.filter;
      filters.forEach(item => {
        const active = item === filter;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
      });
      workItems.forEach(item => {
        const visible = value === 'all' || item.dataset.category === value;
        item.classList.toggle('is-filtered', !visible);
      });
    });
  });

  // Gallery lightbox.
  const lightbox = $('#lightbox');
  const lightboxImage = $('#lightboxImage');
  const lightboxTitle = $('#lightboxTitle');
  const lightboxMeta = $('#lightboxMeta');
  const lightboxClose = $('#lightboxClose');
  let lastGalleryFocus = null;

  const closeLightbox = () => {
    if (!lightbox?.classList.contains('is-open')) return;
    lightbox.classList.remove('is-open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('menu-open');
    window.setTimeout(() => {
      if (lightboxImage) lightboxImage.src = '';
    }, 250);
    lastGalleryFocus?.focus?.();
  };

  workItems.forEach(item => {
    item.addEventListener('click', () => {
      if (!lightbox || !lightboxImage) return;
      lastGalleryFocus = document.activeElement;
      lightboxImage.src = item.dataset.full || '';
      lightboxImage.alt = item.querySelector('img')?.alt || 'ChitroRong portfolio photograph';
      if (lightboxTitle) lightboxTitle.textContent = item.dataset.title || '';
      if (lightboxMeta) lightboxMeta.textContent = item.dataset.meta || '';
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('menu-open');
      window.setTimeout(() => lightboxClose?.focus(), 80);
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', event => {
    if (event.target === lightbox) closeLightbox();
  });

  // All package groups are expanded by default so clients can compare every option without an extra tap.

  // Booking form steps and package shortcut.
  const form = $('#bookingForm');
  const packageSelect = $('#packageSelect');
  const formStatus = $('#formStatus');
  const formSteps = $$('.form-step', form);
  const progressDots = $$('[data-progress]', form);

  const showStep = (stepNumber, shouldFocus = false) => {
    formSteps.forEach(step => {
      const active = Number(step.dataset.step) === stepNumber;
      step.hidden = !active;
      step.classList.toggle('is-current', active);
    });
    progressDots.forEach(dot => dot.classList.toggle('is-current', Number(dot.dataset.progress) === stepNumber));
    if (shouldFocus) {
      window.setTimeout(() => $('input, select, textarea, button', $(`.form-step[data-step="${stepNumber}"]`, form))?.focus(), 80);
    }
  };

  const ensurePackageOption = (packageName) => {
    if (!packageSelect || !packageName) return;
    const exists = [...packageSelect.options].some(option => option.value === packageName || option.textContent === packageName);
    if (!exists) packageSelect.add(new Option(packageName, packageName));
    packageSelect.value = packageName;
  };

  $$('.package-book').forEach(button => {
    button.addEventListener('click', () => {
      const selected = button.dataset.package;
      ensurePackageOption(selected);
      showStep(1);
      if (formStatus) formStatus.textContent = `Selected: ${selected}. Add your event details to continue.`;
      $('#booking')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(() => $('input[name="name"]', form)?.focus(), 650);
    });
  });

  $('.form-next', form)?.addEventListener('click', () => {
    const stepOne = $('.form-step[data-step="1"]', form);
    const inputs = $$('input, select, textarea', stepOne);
    const invalid = inputs.find(field => !field.checkValidity());
    if (invalid) {
      invalid.reportValidity();
      if (formStatus) formStatus.textContent = 'Please complete the required details first.';
      return;
    }
    if (formStatus) formStatus.textContent = '';
    showStep(2, true);
  });

  $('.form-back', form)?.addEventListener('click', () => {
    if (formStatus) formStatus.textContent = '';
    showStep(1, true);
  });

  // Set booking date to today or later.
  const dateInput = $('input[name="eventDate"]', form);
  if (dateInput) {
    const now = new Date();
    const localDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    dateInput.min = localDate;
  }

  form?.addEventListener('submit', event => {
    event.preventDefault();
    const allFields = $$('input[required], select[required], textarea[required]', form);
    const invalid = allFields.find(field => !field.checkValidity());
    if (invalid) {
      const step = invalid.closest('.form-step');
      showStep(Number(step?.dataset.step || 1));
      invalid.reportValidity();
      if (formStatus) formStatus.textContent = 'A few required details are still missing.';
      return;
    }

    const data = new FormData(form);
    const details = {
      name: data.get('name')?.trim(),
      phone: data.get('phone')?.trim(),
      eventType: data.get('eventType'),
      eventDate: data.get('eventDate'),
      location: data.get('location')?.trim(),
      package: data.get('package'),
      message: data.get('message')?.trim() || 'No additional requirements'
    };

    const message = `Hello ChitroRong,\n\nI would like to check availability for my wedding coverage.\n\nName: ${details.name}\nPhone: ${details.phone}\nEvent Type: ${details.eventType}\nEvent Date: ${details.eventDate}\nLocation: ${details.location}\nPreferred Package: ${details.package}\nRequirements: ${details.message}`;
    const whatsappNumber = '8801602155907';
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    if (formStatus) formStatus.textContent = 'Opening WhatsApp…';
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    if (lightbox?.classList.contains('is-open')) closeLightbox();
    else closeMenu();
  });

  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
