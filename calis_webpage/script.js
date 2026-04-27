// ============================================================
//  CALIS ADVENTURES — script.js
// ============================================================

// ─── NAV SCROLL EFFECT ───────────────────────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
});

// ─── MOBILE HAMBURGER MENU ───────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Close mobile menu when any nav link is clicked
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
});

// ─── SCROLL REVEAL (Intersection Observer) ───────────────────
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => revealObserver.observe(el));

// ─── BOOKING FORM SUBMIT ─────────────────────────────────────
function submitBooking() {
  const form    = document.getElementById('bookingForm');
  const success = document.getElementById('formSuccess');

  // Basic validation — check at least name and email fields
  const inputs = form.querySelectorAll('input[type="text"], input[type="email"]');
  let valid = true;

  inputs.forEach(input => {
    if (input.value.trim() === '') {
      input.style.borderColor = 'rgba(201,168,76,0.6)';
      valid = false;
    } else {
      input.style.borderColor = '';
    }
  });

  if (!valid) {
    // Shake the button slightly on failed validation
    const btn = form.querySelector('.btn-submit');
    btn.style.transform = 'translateX(-6px)';
    setTimeout(() => {
      btn.style.transform = 'translateX(6px)';
      setTimeout(() => { btn.style.transform = ''; }, 150);
    }, 150);
    return;
  }

  form.style.display    = 'none';
  success.classList.add('show');
}

// ─── CONTACT FORM SUBMIT ─────────────────────────────────────
function submitContact() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('contactSuccess');

  const inputs = form.querySelectorAll('input[type="text"], input[type="email"]');
  let valid = true;

  inputs.forEach(input => {
    if (input.value.trim() === '') {
      input.style.borderColor = 'rgba(201,168,76,0.6)';
      valid = false;
    } else {
      input.style.borderColor = '';
    }
  });

  if (!valid) {
    const btn = form.querySelector('.btn-submit');
    btn.style.transform = 'translateX(-6px)';
    setTimeout(() => {
      btn.style.transform = 'translateX(6px)';
      setTimeout(() => { btn.style.transform = ''; }, 150);
    }, 150);
    return;
  }

  form.style.display    = 'none';
  success.classList.add('show');
}
