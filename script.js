(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const loader = $('#siteLoader');
  window.addEventListener('load', () => {
    window.setTimeout(() => loader?.classList.add('hide'), 350);
  });

  const header = $('#header');
  const updateHeader = () => header?.classList.toggle('scrolled', window.scrollY > 32);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  const menuButton = $('#menuButton');
  const mobileNav = $('#mobileNav');
  const closeMobileNav = () => {
    mobileNav?.classList.remove('open');
    menuButton?.classList.remove('active');
    menuButton?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };
  menuButton?.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    menuButton.classList.toggle('active', isOpen);
    menuButton.setAttribute('aria-expanded', String(isOpen));
    document.body.classList.toggle('menu-open', isOpen);
  });
  $$('.mobile-nav a').forEach(link => link.addEventListener('click', closeMobileNav));

  const revealItems = $$('.reveal');
  if ('IntersectionObserver' in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(item => revealObserver.observe(item));
  } else {
    revealItems.forEach(item => item.classList.add('in-view'));
  }

  const navigationLinks = $$('.desktop-nav a:not(.nav-book)');
  const observedSections = $$('main section[id]');
  if ('IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(entries => {
      const active = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!active) return;
      navigationLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${active.target.id}`));
    }, { rootMargin: '-42% 0px -50% 0px', threshold: [0.05, 0.2, 0.4] });
    observedSections.forEach(section => navObserver.observe(section));
  }

  const filterButtons = $$('.filter-button');
  const portfolioCards = $$('.portfolio-card');
  const portfolioGrid = $('#portfolioGrid');

  const applyPortfolioFilter = filter => {
    portfolioCards.forEach(card => {
      const matches = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('hide', !matches);
    });
  };

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      filterButtons.forEach(item => {
        const selected = item === button;
        item.classList.toggle('active', selected);
        item.setAttribute('aria-selected', String(selected));
      });
      applyPortfolioFilter(button.dataset.filter);
    });
  });

  const lightbox = $('#lightbox');
  const lightboxImage = $('#lightboxImage');
  const lightboxCaption = $('#lightboxCaption');
  const lightboxClose = $('#lightboxClose');
  const previousButton = $('#lightboxPrevious');
  const nextButton = $('#lightboxNext');
  let activeIndex = 0;
  let lastFocus = null;

  const getVisibleCards = () => portfolioCards.filter(card => !card.classList.contains('hide'));
  const setLightboxImage = index => {
    const cards = getVisibleCards();
    if (!cards.length) return;
    activeIndex = (index + cards.length) % cards.length;
    const card = cards[activeIndex];
    const image = $('img', card);
    lightboxImage.src = card.dataset.full;
    lightboxImage.alt = image?.alt || 'ChitroRong portfolio image';
    lightboxCaption.textContent = `${$('b', card)?.textContent || 'Portfolio image'} — ChitroRong`;
  };
  const openLightbox = card => {
    const cards = getVisibleCards();
    activeIndex = Math.max(0, cards.indexOf(card));
    lastFocus = document.activeElement;
    setLightboxImage(activeIndex);
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lightbox-open');
    window.setTimeout(() => lightboxClose?.focus(), 30);
  };
  const closeLightbox = () => {
    if (!lightbox?.classList.contains('open')) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lightbox-open');
    window.setTimeout(() => { lightboxImage.src = ''; }, 220);
    lastFocus?.focus?.();
  };

  portfolioCards.forEach(card => card.addEventListener('click', () => openLightbox(card)));
  lightboxClose?.addEventListener('click', closeLightbox);
  previousButton?.addEventListener('click', () => setLightboxImage(activeIndex - 1));
  nextButton?.addEventListener('click', () => setLightboxImage(activeIndex + 1));
  lightbox?.addEventListener('click', event => { if (event.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeLightbox();
      closeMobileNav();
    }
    if (!lightbox?.classList.contains('open')) return;
    if (event.key === 'ArrowLeft') setLightboxImage(activeIndex - 1);
    if (event.key === 'ArrowRight') setLightboxImage(activeIndex + 1);
  });

  const packageSelect = $('#packageSelect');
  const bookingSection = $('#booking');
  $$('.package-book').forEach(button => {
    button.addEventListener('click', () => {
      const selectedPackage = button.dataset.package;
      if (!packageSelect || !selectedPackage) return;
      let option = [...packageSelect.options].find(item => item.value === selectedPackage || item.textContent.trim() === selectedPackage);
      if (!option) {
        option = new Option(selectedPackage, selectedPackage);
        packageSelect.add(option);
      }
      packageSelect.value = option.value;
      bookingSection?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
      window.setTimeout(() => packageSelect.focus({ preventScroll: true }), prefersReducedMotion ? 0 : 700);
    });
  });

  const dateInput = $('#eventDate');
  if (dateInput) {
    const today = new Date();
    const localISODate = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    dateInput.min = localISODate;
  }

  const bookingForm = $('#bookingForm');
  const formNote = $('#formNote');
  bookingForm?.addEventListener('submit', event => {
    event.preventDefault();
    if (!bookingForm.reportValidity()) return;

    const formData = new FormData(bookingForm);
    const details = {
      name: String(formData.get('name') || '').trim(),
      phone: String(formData.get('phone') || '').trim(),
      eventType: String(formData.get('eventType') || '').trim(),
      eventDate: String(formData.get('eventDate') || '').trim(),
      location: String(formData.get('location') || '').trim(),
      package: String(formData.get('package') || '').trim(),
      message: String(formData.get('message') || '').trim() || 'No additional requirements.'
    };

    const whatsappMessage = `Hello ChitroRong,\n\nI want to book / know about your wedding photography package.\n\nName: ${details.name}\nPhone: ${details.phone}\nEvent Type: ${details.eventType}\nEvent Date: ${details.eventDate}\nLocation: ${details.location}\nPreferred Package: ${details.package}\nMessage: ${details.message}`;
    const phone = bookingForm.dataset.whatsapp || '8801602155907';
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`;

    formNote.textContent = 'Opening WhatsApp with your booking message…';
    window.open(url, '_blank', 'noopener,noreferrer');
    window.setTimeout(() => {
      formNote.textContent = 'Your details stay in your browser until you choose to send the WhatsApp message.';
    }, 3500);
  });

  $('#year').textContent = String(new Date().getFullYear());
})();
