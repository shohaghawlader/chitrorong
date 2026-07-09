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


  const packageInputs = $$('input[name="package"][data-price]');
  const packagePicker = $('#packagePicker');
  const booking = $('#booking');
  const totalAmount = $('#totalAmount');
  const totalAmountInput = $('#totalAmountInput');
  const advanceAmount = $('#advanceAmount');
  const dueAmount = $('#dueAmount');
  const advancePreview = $('#advancePreview');
  const duePreview = $('#duePreview');
  const selectedPackageList = $('#selectedPackageList');
  let lastPaymentEdit = 'advance';

  const formatTaka = amount => `৳${Math.max(0, Math.round(Number(amount) || 0)).toLocaleString('en-IN')}`;
  const getSelectedPackageInputs = () => packageInputs.filter(input => input.checked);
  const getPackageTotal = () => getSelectedPackageInputs().reduce((sum, input) => sum + (Number(input.dataset.price) || 0), 0);
  const cleanAmount = value => Math.max(0, Number(value) || 0);
  const setInputValue = (input, amount) => {
    if (!input) return;
    input.value = amount > 0 ? String(Math.round(amount)) : '';
  };
  const updateBookingAmounts = (source = lastPaymentEdit) => {
    const total = getPackageTotal();
    const selectedPackages = getSelectedPackageInputs().map(input => input.value);
    let advance = cleanAmount(advanceAmount?.value);
    let due = cleanAmount(dueAmount?.value);

    if (source === 'due') {
      due = Math.min(due, total);
      advance = Math.max(total - due, 0);
      setInputValue(advanceAmount, advance);
    } else {
      advance = Math.min(advance, total);
      due = Math.max(total - advance, 0);
      setInputValue(dueAmount, due);
    }

    if (totalAmount) totalAmount.textContent = formatTaka(total);
    if (totalAmountInput) totalAmountInput.value = String(total);
    if (advancePreview) advancePreview.textContent = formatTaka(advance);
    if (duePreview) duePreview.textContent = formatTaka(due);
    if (selectedPackageList) selectedPackageList.textContent = selectedPackages.length ? selectedPackages.join(' + ') : 'No package selected yet.';
  };

  packageInputs.forEach(input => {
    input.addEventListener('change', () => updateBookingAmounts());
  });
  advanceAmount?.addEventListener('input', () => {
    lastPaymentEdit = 'advance';
    updateBookingAmounts('advance');
  });
  dueAmount?.addEventListener('input', () => {
    lastPaymentEdit = 'due';
    updateBookingAmounts('due');
  });

  $$('.choose-package').forEach(button => {
    button.addEventListener('click', () => {
      const value = button.dataset.package;
      if (!value) return;
      const packageInput = packageInputs.find(input => input.value === value);
      if (packageInput) {
        packageInput.checked = true;
        updateBookingAmounts();
      }
      booking?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      window.setTimeout(() => packageInput?.focus({ preventScroll: true }), reduceMotion ? 0 : 650);
    });
  });
  updateBookingAmounts();

  const galleryItems = [
    { file: '01_0_9.webp', title: 'Bridal Reflection', category: 'traditional', alt: 'Traditional bridal portrait with mirror reflection', layout: 'tall' },
    { file: '02_3N6A4810.webp', title: 'Night Fashion Portrait', category: 'outdoor', alt: 'Moody outdoor night portrait with red smoke', layout: 'tall' },
    { file: '03_3N6A4839.webp', title: 'Couple in Spotlight', category: 'outdoor', alt: 'Outdoor couple portrait under warm lights', layout: 'wide' },
    { file: '04_3N6A9133.webp', title: 'White Bridal Twirl', category: 'white', alt: 'White bridal gown portrait in a garden', layout: 'tall' },
    { file: '05_3N6A9163.webp', title: 'Garden Bride', category: 'white', alt: 'White bridal portrait in greenery', layout: 'tall' },
    { file: '06_3N6A9239.webp', title: 'Ceremony Smile', category: 'traditional', alt: 'Traditional wedding couple smiling together', layout: 'wide' },
    { file: '07_5.webp', title: 'Little Princess', category: 'white', alt: 'Child portrait in white dress and crown', layout: 'tall' },
    { file: '08_25.webp', title: 'Red Bridal Glow', category: 'traditional', alt: 'Red bridal portrait with warm backdrop', layout: 'tall' },
    { file: '09_54.webp', title: 'Stage Romance', category: 'traditional', alt: 'Wedding couple portrait on decorated stage', layout: 'tall' },
    { file: '10_byt.webp', title: 'Bridal Details', category: 'traditional', alt: 'Wedding shoes detail with soft background', layout: 'tall' },
    { file: '11_chitrorong_20.webp', title: 'Orange Bridal Portrait', category: 'traditional', alt: 'Orange bridal portrait with floral jewelry', layout: 'tall' },
    { file: '12_chitrorong-06188.webp', title: 'Red Veil Turn', category: 'traditional', alt: 'Bride looking back in red veil', layout: 'tall' },
    { file: '13_CTP05779.webp', title: 'Evening Glow', category: 'outdoor', alt: 'Outdoor bridal portrait with string lights', layout: 'tall' },
    { file: '14_DSC00609.webp', title: 'White Veil Moment', category: 'white', alt: 'White wedding couple with flowing veil', layout: 'wide' },
    { file: '15_DSC00658.webp', title: 'White Wedding Dance', category: 'white', alt: 'White wedding couple dancing outdoors', layout: 'wide' },
    { file: '16_DSC01532.webp', title: 'Holud Smile', category: 'holud', alt: 'Holud couple smiling together at night', layout: 'tall' },
    { file: '17_DSC02357.webp', title: 'Field Romance', category: 'outdoor', alt: 'Wedding couple in a green field at sunset', layout: 'wide' },
    { file: '18_DSC02429.webp', title: 'Smoke Celebration', category: 'outdoor', alt: 'Wedding couple with pink smoke outdoors', layout: 'wide' },
    { file: '19_DSC02527.webp', title: 'Windy Veil', category: 'outdoor', alt: 'Wedding couple with flowing veil at sunset', layout: 'wide' },
    { file: '20_DSC02759.webp', title: 'Silhouette Kiss', category: 'traditional', alt: 'Wedding couple silhouette framed by an arch', layout: 'tall' },
    { file: '21_DSC07366.webp', title: 'Paan Leaf Bride', category: 'traditional', alt: 'Bengali bride holding paan leaves', layout: 'tall' },
    { file: '22_DSC07372.webp', title: 'Topor Bridal Prayer', category: 'traditional', alt: 'Bengali bride in red with hands raised', layout: 'tall' },
    { file: '23_DSC02794.webp', title: 'Heritage Venue', category: 'traditional', alt: 'Wedding couple at a red and white architectural venue', layout: 'wide' },
    { file: '24_DSC02830.webp', title: 'Red Veil Closeup', category: 'traditional', alt: 'Intimate wedding couple closeup with red veil', layout: 'tall' },
    { file: '25_DSC02879.webp', title: 'Column Portrait', category: 'traditional', alt: 'Wedding couple beside heritage columns', layout: 'wide' },
    { file: '26_DSC03558.webp', title: 'Colorful Stage Twirl', category: 'holud', alt: 'Bride twirling on colorful decorated stage', layout: 'wide' },
    { file: '27_DSC06265.webp', title: 'Haldi Veil Smile', category: 'holud', alt: 'Holud bride smiling under a soft veil', layout: 'tall' },
    { file: '28_DSC06308.webp', title: 'Mehendi Detail', category: 'holud', alt: 'Holud bridal mehendi hand detail', layout: 'tall' },
    { file: '29_DSC05951.webp', title: 'Classic Red Couple', category: 'traditional', alt: 'Traditional red bridal couple portrait', layout: 'tall' },
    { file: '30_DSC03923.webp', title: 'Firework Moment', category: 'holud', alt: 'Holud couple with fireworks at night', layout: 'wide' },
    { file: '31_DSC03996.webp', title: 'Rooftop Twirl', category: 'outdoor', alt: 'Bride twirling on rooftop at night', layout: 'wide' },
    { file: '32_DSC04093.webp', title: 'Lakeside Laugh', category: 'outdoor', alt: 'Wedding couple laughing beside a lake', layout: 'wide' },
    { file: '33_DSC08499.webp', title: 'Red Bridal Closeup', category: 'traditional', alt: 'Close red bridal makeup and jewelry portrait', layout: 'tall' },
    { file: '34_DSC08828.webp', title: 'Soft Outdoor Vows', category: 'outdoor', alt: 'Soft outdoor wedding couple portrait under trees', layout: 'wide' },
    { file: '35_DSC08853.webp', title: 'Bridal Swing', category: 'white', alt: 'White and red bridal portrait on a swing', layout: 'tall' },
    { file: '36_DSC07452.webp', title: 'Red Bridal Look', category: 'traditional', alt: 'Red bridal portrait with gold jewelry', layout: 'tall' },
    { file: '37_DSC07758.webp', title: 'Warm Window Bride', category: 'traditional', alt: 'Warm indoor bridal portrait by window', layout: 'tall' },
    { file: '38_DSC07810.webp', title: 'First Look Field', category: 'outdoor', alt: 'Bride smiling during first look in a field', layout: 'tall' },
    { file: '39_DSC08363.webp', title: 'Yellow Bridal Closeup', category: 'holud', alt: 'Yellow bridal jewelry closeup portrait', layout: 'tall' },
    { file: '40_DSC08456.webp', title: 'Red Jewelry Portrait', category: 'traditional', alt: 'Close red bridal jewelry portrait', layout: 'tall' },
    { file: '41_DSC08865.webp', title: 'White Saree Elegance', category: 'white', alt: 'White and red bridal portrait by modern panels', layout: 'tall' },
    { file: '42_DSC08927.webp', title: 'Woodland Bride', category: 'white', alt: 'White and red bridal portrait seated outdoors', layout: 'tall' },
    { file: '43_DSC08979.webp', title: 'Golden Bridal Closeup', category: 'white', alt: 'White bridal closeup with gold jewelry', layout: 'tall' },
    { file: '44_DSC09007.webp', title: 'Garden Red Bride', category: 'outdoor', alt: 'Red bride seated in a garden with flowers', layout: 'tall' },
    { file: '45_DSC09035.webp', title: 'Veiled Red Bride', category: 'traditional', alt: 'Bride standing under a red veil outdoors', layout: 'wide' },
    { file: '46_DSC09042.webp', title: 'Soft Couple Story', category: 'outdoor', alt: 'Outdoor wedding couple portrait in greenery', layout: 'wide' },
    { file: '47_DSC09055.webp', title: 'Old Building Bride', category: 'white', alt: 'White and red bridal portrait near old building', layout: 'tall' },
    { file: '48_DSC09299.webp', title: 'Reception Embrace', category: 'traditional', alt: 'Indoor wedding couple embracing under lights', layout: 'wide' },
    { file: '49_FLP08927.webp', title: 'Teal Couple Portrait', category: 'outdoor', alt: 'Outdoor couple portrait beside a brick wall', layout: 'wide' },
    { file: '50_IMG_1774-Edited.webp', title: 'Red Lehenga Portrait', category: 'traditional', alt: 'Indoor red lehenga bridal portrait by green curtains', layout: 'tall' }
  ];

  const galleryGrid = $('#galleryGrid');
  let activeFilter = 'all';
  let activeGalleryIndex = 0;
  let activeFilmIndex = 0;
  let activeModalType = 'gallery';
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
  const filmCards = $$('.film-card[data-video]');
  const filmItems = filmCards.map(card => ({
    video: card.dataset.video || '',
    poster: card.dataset.poster || '',
    title: card.dataset.title || 'ChitroRong wedding film'
  }));

  const setModal = content => {
    if (!modal || !modalStage) return;
    if (!modal.classList.contains('open')) focusBeforeModal = document.activeElement;
    modalStage.innerHTML = content;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    window.setTimeout(() => modalClose?.focus(), 30);
  };

  const openGalleryMedia = index => {
    activeModalType = 'gallery';
    const visibleItems = getVisibleGallery();
    if (!visibleItems.length) return;
    activeGalleryIndex = (index + visibleItems.length) % visibleItems.length;
    const item = visibleItems[activeGalleryIndex];
    setModal(`<figure><img src="assets/new-media/photos/${item.file}" alt="${item.alt}" /><figcaption>${item.title} — ChitroRong</figcaption></figure>`);
  };

  const openFilmMedia = index => {
    if (!filmItems.length) return;
    activeModalType = 'film';
    activeFilmIndex = (index + filmItems.length) % filmItems.length;
    const item = filmItems[activeFilmIndex];
    setModal(`<figure class="video-figure"><video src="${item.video}" poster="${item.poster}" controls autoplay playsinline preload="metadata"></video><figcaption>${item.title} — ChitroRong</figcaption></figure>`);
  };

  filmCards.forEach((card, index) => {
    card.addEventListener('click', () => openFilmMedia(index));
  });

  const closeModal = () => {
    if (!modal?.classList.contains('open')) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    window.setTimeout(() => { if (modalStage) modalStage.innerHTML = ''; }, 250);
    focusBeforeModal?.focus?.();
  };

  modalClose?.addEventListener('click', closeModal);
  modalPrevious?.addEventListener('click', () => {
    if (activeModalType === 'film') openFilmMedia(activeFilmIndex - 1);
    else openGalleryMedia(activeGalleryIndex - 1);
  });
  modalNext?.addEventListener('click', () => {
    if (activeModalType === 'film') openFilmMedia(activeFilmIndex + 1);
    else openGalleryMedia(activeGalleryIndex + 1);
  });
  modal?.addEventListener('click', event => { if (event.target === modal) closeModal(); });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeModal();
      closeMenu();
    }
    if (!modal?.classList.contains('open')) return;
    if (event.key === 'ArrowLeft') {
      if (activeModalType === 'film') openFilmMedia(activeFilmIndex - 1);
      else openGalleryMedia(activeGalleryIndex - 1);
    }
    if (event.key === 'ArrowRight') {
      if (activeModalType === 'film') openFilmMedia(activeFilmIndex + 1);
      else openGalleryMedia(activeGalleryIndex + 1);
    }
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

    const selectedPackages = getSelectedPackageInputs().map(input => input.value);
    if (!selectedPackages.length) {
      if (formNote) formNote.textContent = 'Please choose at least one package before continuing.';
      packagePicker?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      packageInputs[0]?.focus({ preventScroll: true });
      return;
    }

    updateBookingAmounts(lastPaymentEdit);
    const fields = new FormData(bookingForm);
    const total = getPackageTotal();
    const advance = cleanAmount(advanceAmount?.value);
    const due = cleanAmount(dueAmount?.value);
    const info = {
      name: String(fields.get('name') || '').trim(),
      phone: String(fields.get('phone') || '').trim(),
      bride: String(fields.get('brideName') || '').trim(),
      groom: String(fields.get('groomName') || '').trim(),
      type: String(fields.get('eventType') || '').trim(),
      date: String(fields.get('eventDate') || '').trim(),
      location: String(fields.get('location') || '').trim(),
      packages: selectedPackages.join(' + '),
      total: formatTaka(total),
      advance: formatTaka(advance),
      due: formatTaka(due),
      payment: String(fields.get('paymentMethod') || '').trim(),
      message: String(fields.get('message') || '').trim() || 'No additional requirements.'
    };
    const message = `Hello ChitroRong,

I would like to enquire about wedding coverage.

Name: ${info.name}
Phone: ${info.phone}
Bride name: ${info.bride}
Groom name: ${info.groom}
Event type: ${info.type}
Event date: ${info.date}
Location: ${info.location}
Preferred package(s): ${info.packages}
Total amount: ${info.total}
Advance amount: ${info.advance}
Due amount: ${info.due}
Payment with: ${info.payment}
Message: ${info.message}`;
    const phone = bookingForm.dataset.whatsapp || '8801966336841';
    if (formNote) formNote.textContent = 'Opening WhatsApp with your booking message…';
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    window.setTimeout(() => { if (formNote) formNote.textContent = 'Your details stay in your browser until you choose to send the WhatsApp message.'; }, 3500);
  });

  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
