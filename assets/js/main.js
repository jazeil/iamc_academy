const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#site-nav');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
    navigation.classList.toggle('open', !isOpen);
  });

  navigation.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Open navigation');
      navigation.classList.remove('open');
    }
  });
}

document.querySelector('#year').textContent = new Date().getFullYear();

const channelPopup = document.querySelector('#whatsapp-channel-popup');
if (channelPopup) {
  const closeChannelPopup = channelPopup.querySelector('.channel-popover-close');
  const popupTimer = window.setTimeout(() => {
    channelPopup.hidden = false;
    channelPopup.setAttribute('aria-hidden', 'false');
    window.requestAnimationFrame(() => channelPopup.classList.add('is-visible'));
  }, 1000);

  closeChannelPopup?.addEventListener('click', () => {
    window.clearTimeout(popupTimer);
    channelPopup.hidden = true;
    channelPopup.classList.remove('is-visible');
    channelPopup.setAttribute('aria-hidden', 'true');
  });
}

const enquiryForm = document.querySelector('#enquiry-form');
if (enquiryForm) {
  enquiryForm.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!enquiryForm.reportValidity()) return;

    const formData = new FormData(enquiryForm);
    const message = [
      'IAMC Course Enquiry',
      `Name: ${formData.get('name')}`,
      `Phone: ${formData.get('phone')}`,
      `Program: ${formData.get('course')}`,
      `Enquiry: ${formData.get('message')}`,
    ].join('\n');
    const whatsappUrl = new URL('https://wa.me/918968603029');
    whatsappUrl.searchParams.set('text', message);
    window.open(whatsappUrl.toString(), '_blank', 'noopener,noreferrer');

    const status = document.querySelector('#enquiry-status');
    if (status) status.textContent = 'WhatsApp opened with your enquiry. Review the message there and press Send.';
  });
}

const carousel = document.querySelector('.hero-slides');
if (carousel) {
  const slides = [...carousel.querySelectorAll('.hero-slide')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const heroKicker = document.querySelector('[data-hero-kicker]');
  const heroTitle = document.querySelector('[data-hero-title]');
  const heroAccent = document.querySelector('[data-hero-accent]');
  const heroCopy = document.querySelector('[data-hero-copy]');
  const primaryLink = document.querySelector('[data-hero-primary]');
  const primaryLabel = document.querySelector('[data-hero-primary-label]');
  const secondaryLink = document.querySelector('[data-hero-secondary]');
  const secondaryLabel = document.querySelector('[data-hero-secondary-label]');
  let activeIndex = 0;
  let rotationTimeout;
  let manuallyPaused = reducedMotion.matches;

  const showSlide = (index) => {
    activeIndex = (index + slides.length) % slides.length;
    const activeSlide = slides[activeIndex];
    slides.forEach((slide, i) => {
      const active = i === activeIndex;
      slide.classList.toggle('is-active', active);
      slide.setAttribute('aria-hidden', String(!active));
    });
    if (heroKicker) heroKicker.textContent = activeSlide.dataset.kicker;
    if (heroTitle) heroTitle.textContent = activeSlide.dataset.title;
    if (heroAccent) heroAccent.textContent = activeSlide.dataset.accent;
    if (heroCopy) heroCopy.textContent = activeSlide.dataset.copy;
    if (primaryLink) primaryLink.href = activeSlide.dataset.primaryHref;
    if (primaryLabel) primaryLabel.textContent = activeSlide.dataset.primary;
    if (secondaryLink) secondaryLink.href = activeSlide.dataset.secondaryHref;
    if (secondaryLabel) secondaryLabel.textContent = activeSlide.dataset.secondary;
  };

  showSlide(activeIndex);

  const stopRotation = () => {
    window.clearTimeout(rotationTimeout);
    rotationTimeout = undefined;
  };

  const startRotation = (delay = 3000) => {
    stopRotation();
    if (!manuallyPaused && !document.hidden) {
      rotationTimeout = window.setTimeout(() => {
        showSlide(activeIndex + 1);
        startRotation();
      }, delay);
    }
  };

  document.querySelector('[data-carousel-prev]')?.addEventListener('click', () => {
    showSlide(activeIndex - 1);
    startRotation(8000);
  });
  document.querySelector('[data-carousel-next]')?.addEventListener('click', () => {
    showSlide(activeIndex + 1);
    startRotation(8000);
  });
  document.addEventListener('visibilitychange', () => startRotation());
  reducedMotion.addEventListener('change', (event) => {
    manuallyPaused = event.matches;
    startRotation();
  });
  startRotation();
}
