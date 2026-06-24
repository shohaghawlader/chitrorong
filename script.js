const loader = document.getElementById('siteLoader');
window.addEventListener('load', () => {
  setTimeout(() => loader?.classList.add('hide'), 450);
});

const header = document.getElementById('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
window.addEventListener('scroll', onScroll);
onScroll();

const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
menuToggle?.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  menuToggle.classList.toggle('active', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    menuToggle.classList.remove('active');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');
filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    portfolioItems.forEach(item => {
      const shouldShow = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('hide', !shouldShow);
    });
  });
});

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');

portfolioItems.forEach(item => {
  item.addEventListener('click', () => {
    lightboxImage.src = item.dataset.full;
    lightboxImage.alt = item.querySelector('img')?.alt || 'ChitroRong portfolio image';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  });
});

function closeLightbox(){
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  setTimeout(() => { lightboxImage.src = ''; }, 220);
}

lightboxClose?.addEventListener('click', closeLightbox);
lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
});


const packageSelect = document.getElementById('packageSelect');
document.querySelectorAll('.package-book').forEach(button => {
  button.addEventListener('click', () => {
    const packageName = button.dataset.package;
    let existingOption = [...packageSelect.options].find(opt => opt.value === packageName || opt.textContent === packageName);
    if (!existingOption) {
      existingOption = new Option(packageName, packageName);
      packageSelect.add(existingOption);
    }
    packageSelect.value = existingOption.value || existingOption.textContent;
    document.getElementById('booking').scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const bookingForm = document.getElementById('bookingForm');
bookingForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const form = new FormData(bookingForm);
  const details = {
    name: form.get('name')?.trim(),
    phone: form.get('phone')?.trim(),
    eventType: form.get('eventType'),
    eventDate: form.get('eventDate'),
    location: form.get('location')?.trim(),
    package: form.get('package'),
    message: form.get('message')?.trim() || 'No extra message'
  };

  const text = `Hello ChitroRong,
I want to book / know about your wedding photography package.

Name: ${details.name}
Phone: ${details.phone}
Event Type: ${details.eventType}
Event Date: ${details.eventDate}
Location: ${details.location}
Preferred Package: ${details.package}
Message: ${details.message}`;

  const whatsappNumber = '8801602155907';
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
});

document.getElementById('year').textContent = new Date().getFullYear();
