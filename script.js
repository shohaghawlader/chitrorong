(() => {
  'use strict';

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const loader = $('#pageLoader');
  window.addEventListener('load', () => {
    window.setTimeout(() => loader?.classList.add('is-hidden'), reduceMotion ? 0 : 280);
  });

  const header = $('#siteHeader');
  const toggleHeader = () => header?.classList.toggle('scrolled', window.scrollY > 26);
  window.addEventListener('scroll', toggleHeader, { passive: true });
  toggleHeader();

  const menuToggle = $('#menuToggle');
  const mobileNav = $('#mobileNav');
  const closeMenu = () => {
    mobileNav?.classList.remove('open');
    document.body.classList.remove('menu-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  };
  menuToggle?.addEventListener('click', () => {
    const isOpen = mobileNav?.classList.toggle('open');
    document.body.classList.toggle('menu-open', Boolean(isOpen));
    menuToggle.setAttribute('aria-expanded', String(Boolean(isOpen)));
  });
  $$('#mobileNav a').forEach(link => link.addEventListener('click', closeMenu));

  const observer = !reduceMotion && 'IntersectionObserver' in window
    ? new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: .12 })
    : null;
  $$('.reveal').forEach(el => observer ? observer.observe(el) : el.classList.add('visible'));


  const packageSelect = $('#packageSelect');
  const booking = $('#booking');
  $$('.choose-package').forEach(button => {
    button.addEventListener('click', () => {
      const value = button.dataset.package;
      if (!value || !packageSelect) return;
      let choice = [...packageSelect.options].find(option => option.value === value || option.textContent.trim() === value);
      if (!choice) {
        choice = new Option(value, value);
        packageSelect.add(choice);
      }
      packageSelect.value = choice.value;
      booking?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      window.setTimeout(() => packageSelect.focus({ preventScroll: true }), reduceMotion ? 0 : 650);
    });
  });

  const galleryItems = [
    { file: 'white-wedding-veil.webp', title: 'Soft White Vows', category: 'white', alt: 'White wedding couple in a flowing veil', layout: 'wide' },
    { file: 'white-wedding-dance.webp', title: 'A Gentle Spin', category: 'white', alt: 'White wedding couple dancing', layout: 'tall' },
    { file: 'white-wedding-forehead.webp', title: 'Close to Forever', category: 'white', alt: 'White wedding couple forehead kiss', layout: 'wide' },
    { file: 'white-wedding-couple-walk.webp', title: 'Together', category: 'white', alt: 'White wedding couple walking', layout: 'tall' },
    { file: 'sindoor-ritual.webp', title: 'Sacred Moment', category: 'traditional', alt: 'Traditional sindoor wedding ritual', layout: 'tall' },
    { file: 'red-outdoor-road-walk.webp', title: 'A Quiet Road', category: 'outdoor', alt: 'Wedding couple walking outdoors', layout: 'tall' },
    { file: 'red-outdoor-canopy.webp', title: 'Under the Canopy', category: 'outdoor', alt: 'Wedding couple framed by trees', layout: 'tall' },
    { file: 'red-outdoor-kiss.webp', title: 'A Tender Promise', category: 'outdoor', alt: 'Wedding couple outdoors', layout: 'tall' },
    { file: 'maroon-couple-portrait.webp', title: 'Maroon Romance', category: 'outdoor', alt: 'Wedding couple in maroon attire', layout: 'tall' },
    { file: 'maroon-couple-embrace.webp', title: 'Just Us', category: 'outdoor', alt: 'Wedding couple embrace', layout: 'tall' },
    { file: 'maroon-couple-romance.webp', title: 'In the Moment', category: 'outdoor', alt: 'Wedding couple romantic portrait', layout: 'tall' },
    { file: 'maroon-couple-walk.webp', title: 'A Stroll Together', category: 'outdoor', alt: 'Wedding couple walking together', layout: 'wide' },
    { file: 'maroon-couple-forehead.webp', title: 'Quiet Affection', category: 'outdoor', alt: 'Wedding couple under the trees', layout: 'tall' },
    { file: 'outdoor-red-couple-walk.webp', title: 'A Green Escape', category: 'outdoor', alt: 'Traditional couple in a green outdoor setting', layout: 'wide' },
    { file: 'outdoor-red-bridal-close.webp', title: 'Her Look', category: 'outdoor', alt: 'Traditional bride outdoors', layout: 'tall' },
    { file: 'motorcycle-wedding-couple.webp', title: 'On Our Way', category: 'outdoor', alt: 'Wedding couple on motorcycle', layout: 'tall' },
    { file: 'car-wedding-couple.webp', title: 'Drive Into Forever', category: 'outdoor', alt: 'Bride in a car with groom', layout: 'wide' },
    { file: 'outdoor-tree-couple.webp', title: 'Taking the Lead', category: 'outdoor', alt: 'Wedding couple under a large tree', layout: 'tall' },
    { file: 'mirror-couple-detail.webp', title: 'In the Mirror', category: 'outdoor', alt: 'Wedding couple reflected in car mirror', layout: 'wide' },
    { file: 'red-sari-bridal-clutch.webp', title: 'Red Bridal Story', category: 'traditional', alt: 'Red bridal portrait holding clutch', layout: 'tall' },
    { file: 'red-sari-bridal-close.webp', title: 'Golden Details', category: 'traditional', alt: 'Close red bridal portrait', layout: 'tall' },
    { file: 'red-sari-bridal-veil.webp', title: 'Veiled in Red', category: 'traditional', alt: 'Red bridal portrait with veil', layout: 'tall' },
    { file: 'red-sari-bridal-pose.webp', title: 'A Bridal Glow', category: 'traditional', alt: 'Red bridal pose', layout: 'tall' },
    { file: 'red-wedding-couple-seated.webp', title: 'The First Seat', category: 'traditional', alt: 'Red wedding couple seated together', layout: 'tall' },
    { file: 'red-wedding-couple-standing.webp', title: 'Side by Side', category: 'traditional', alt: 'Red wedding couple standing together', layout: 'tall' },
    { file: 'mehendi-hand-detail.webp', title: 'Written in Mehendi', category: 'traditional', alt: 'Wedding mehendi hands detail', layout: 'wide' },
    { file: 'red-bridal-stage-seated.webp', title: 'On the Stage', category: 'traditional', alt: 'Red bride seated on stage', layout: 'tall' },
    { file: 'red-bridal-aisle.webp', title: 'The Aisle', category: 'traditional', alt: 'Red bride standing at decorated aisle', layout: 'tall' },
    { file: 'red-bridal-back.webp', title: 'A New Chapter', category: 'traditional', alt: 'Red bridal back portrait', layout: 'tall' },
    { file: 'red-bridal-lights.webp', title: 'Golden Glow', category: 'traditional', alt: 'Red bride portrait with warm lights', layout: 'tall' },
    { file: 'holud-couple-close.webp', title: 'Holud Feeling', category: 'holud', alt: 'Holud couple close portrait', layout: 'tall' },
    { file: 'holud-bride-detail.webp', title: 'Marigold Bride', category: 'holud', alt: 'Holud bride in marigold flowers', layout: 'tall' },
    { file: 'holud-couple-hand-kiss.webp', title: 'A Playful Promise', category: 'holud', alt: 'Holud couple romantic portrait', layout: 'wide' },
    { file: 'holud-couple-standing.webp', title: 'Bright Together', category: 'holud', alt: 'Holud couple standing together', layout: 'tall' },
    { file: 'holud-stage-couple.webp', title: 'Stage Lights', category: 'holud', alt: 'Holud couple on stage', layout: 'tall' },
    { file: 'holud-groom-seated.webp', title: 'Holud Portrait', category: 'holud', alt: 'Holud groom seated', layout: 'tall' },
    { file: 'holud-groom-arms.webp', title: 'Night Portrait', category: 'holud', alt: 'Holud groom portrait with lights', layout: 'tall' },
    { file: 'holud-groom-sunglasses.webp', title: 'A Little Swagger', category: 'holud', alt: 'Holud groom with sunglasses', layout: 'tall' },
    { file: 'holud-groom-stage.webp', title: 'Celebrate Him', category: 'holud', alt: 'Holud groom stage portrait', layout: 'tall' },
    { file: 'holud-bride-standing.webp', title: 'Marigold Moment', category: 'holud', alt: 'Holud bride standing portrait', layout: 'tall' }
  ];

  const galleryGrid = $('#galleryGrid');
  let activeFilter = 'all';
  let activeGalleryIndex = 0;
  let activeMediaMode = 'image';
  let focusBeforeModal = null;

  const getVisibleGallery = () => galleryItems.filter(item => activeFilter === 'all' || item.category === activeFilter);
  const renderGallery = () => {
    if (!galleryGrid) return;
    const visibleItems = getVisibleGallery();
    if (!visibleItems.length) {
      galleryGrid.innerHTML = '<p class="gallery-empty">No frames found in this collection.</p>';
      return;
    }
    galleryGrid.innerHTML = visibleItems.map((item, index) => `
      <button class="gallery-item ${item.layout}" type="button" data-gallery-index="${index}" aria-label="Open ${item.title}">
        <img src="assets/new-media/photos/${item.file}" alt="${item.alt}" loading="lazy" />
        <span class="gallery-caption"><span>${item.category}</span><b>${String(index + 1).padStart(2, '0')}</b></span>
      </button>`).join('');
    $$('.gallery-item', galleryGrid).forEach(button => {
      button.addEventListener('click', () => {
        activeGalleryIndex = Number(button.dataset.galleryIndex || 0);
        openGalleryMedia(activeGalleryIndex);
      });
    });
  };

  $$('.gallery-filter').forEach(button => {
    button.addEventListener('click', () => {
      activeFilter = button.dataset.filter || 'all';
      $$('.gallery-filter').forEach(control => {
        const active = control === button;
        control.classList.toggle('active', active);
        control.setAttribute('aria-selected', String(active));
      });
      renderGallery();
    });
  });
  renderGallery();

  const modal = $('#mediaModal');
  const modalStage = $('#modalStage');
  const modalClose = $('#modalClose');
  const modalPrevious = $('#modalPrev');
  const modalNext = $('#modalNext');

  const setModal = (content, mode = 'image') => {
    if (!modal || !modalStage) return;
    if (!modal.classList.contains('open')) focusBeforeModal = document.activeElement;
    activeMediaMode = mode;
    modalStage.innerHTML = content;
    modal.classList.toggle('video-mode', mode === 'video');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    window.setTimeout(() => modalClose?.focus(), 30);
  };

  const openGalleryMedia = index => {
    const visibleItems = getVisibleGallery();
    if (!visibleItems.length) return;
    activeGalleryIndex = (index + visibleItems.length) % visibleItems.length;
    const item = visibleItems[activeGalleryIndex];
    setModal(`<figure><img src="assets/new-media/photos/${item.file}" alt="${item.alt}" /><figcaption>${item.title} — ChitroRong</figcaption></figure>`, 'image');
  };

  const openFilmMedia = card => {
    const title = card.dataset.title || 'ChitroRong film';
    const src = card.dataset.video;
    const poster = card.dataset.poster || '';
    if (!src) return;
    setModal(`<figure><video controls autoplay playsinline preload="metadata" poster="${poster}"><source src="${src}" type="video/mp4" />Your browser does not support video playback.</video><figcaption>${title} — ChitroRong Film</figcaption></figure>`, 'video');
  };

  const closeModal = () => {
    if (!modal?.classList.contains('open')) return;
    const video = $('video', modalStage);
    if (video) video.pause();
    modal.classList.remove('open', 'video-mode');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    window.setTimeout(() => { if (modalStage) modalStage.innerHTML = ''; }, 250);
    focusBeforeModal?.focus?.();
  };

  $$('.film-card').forEach(card => card.addEventListener('click', () => openFilmMedia(card)));
  modalClose?.addEventListener('click', closeModal);
  modalPrevious?.addEventListener('click', () => { if (activeMediaMode === 'image') openGalleryMedia(activeGalleryIndex - 1); });
  modalNext?.addEventListener('click', () => { if (activeMediaMode === 'image') openGalleryMedia(activeGalleryIndex + 1); });
  modal?.addEventListener('click', event => { if (event.target === modal) closeModal(); });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeModal();
      closeMenu();
    }
    if (!modal?.classList.contains('open') || activeMediaMode !== 'image') return;
    if (event.key === 'ArrowLeft') openGalleryMedia(activeGalleryIndex - 1);
    if (event.key === 'ArrowRight') openGalleryMedia(activeGalleryIndex + 1);
  });

  const dateInput = $('#eventDate');
  if (dateInput) {
    const now = new Date();
    dateInput.min = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  }

  const bookingForm = $('#bookingForm');
  const formNote = $('#formNote');
  bookingForm?.addEventListener('submit', event => {
    event.preventDefault();
    if (!bookingForm.reportValidity()) return;
    const fields = new FormData(bookingForm);
    const info = {
      name: String(fields.get('name') || '').trim(),
      phone: String(fields.get('phone') || '').trim(),
      type: String(fields.get('eventType') || '').trim(),
      date: String(fields.get('eventDate') || '').trim(),
      location: String(fields.get('location') || '').trim(),
      package: String(fields.get('package') || '').trim(),
      payment: String(fields.get('paymentMethod') || '').trim(),
      message: String(fields.get('message') || '').trim() || 'No additional requirements.'
    };
    const message = `Hello ChitroRong,\n\nI would like to enquire about wedding coverage.\n\nName: ${info.name}\nPhone: ${info.phone}\nEvent type: ${info.type}\nEvent date: ${info.date}\nLocation: ${info.location}\nPreferred package: ${info.package}\nPayment with: ${info.payment}\nMessage: ${info.message}`;
    const phone = bookingForm.dataset.whatsapp || '8801966336841';
    formNote.textContent = 'Opening WhatsApp with your booking message…';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    window.setTimeout(() => { formNote.textContent = 'Your details stay in your browser until you choose to send the WhatsApp message.'; }, 3500);
  });

  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
