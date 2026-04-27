// ============================================================
//  CALIS ADVENTURES — script.js
// ============================================================

// ─── NAV SCROLL EFFECT ───────────────────────────────────────
const navbar = document.getElementById('navbar');

window.addEventListener('load', () => {
  if (typeof emailjs !== 'undefined') {
    emailjs.init({
      publicKey: EMAILJS_PUBLIC_KEY,
    });
  }
});

// ─── MOBILE HAMBURGER MENU ───────────────────────────────────
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
});

// ─── SCROLL REVEAL ───────────────────────────────────────────
const reveals = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });

reveals.forEach(el => revealObserver.observe(el));

const EMAILJS_PUBLIC_KEY  = '6RSlzWe-yRghDkLu';
const EMAILJS_SERVICE_ID  = 'service_tvpzmoh';
const EMAILJS_BOOKING_TID = 'template_knuj3ez';
const EMAILJS_CONTACT_TID = 'template_fuiwukt';

window.addEventListener('load', () => {
  if (typeof emailjs !== 'undefined') emailjs.init(EMAILJS_PUBLIC_KEY);
});

function submitBooking() {
  const form    = document.getElementById('bookingForm');
  const success = document.getElementById('formSuccess');
  const btn     = form.querySelector('.btn-submit');

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
    btn.style.transform = 'translateX(-6px)';
    setTimeout(() => {
      btn.style.transform = 'translateX(6px)';
      setTimeout(() => { btn.style.transform = ''; }, 150);
    }, 150);
    return;
  }

const bGroup = document.getElementById('bGroup');
  const bService = document.getElementById('bService');
  const params = {
    client_name:  document.getElementById('bFirstName').value.trim() + ' ' + document.getElementById('bLastName').value.trim(),
    client_email: document.getElementById('bEmail').value.trim(),
    client_phone: document.getElementById('bPhone').value.trim() || 'Not provided',
    service:      bService.options[bService.selectedIndex] ? bService.options[bService.selectedIndex].text : 'Not selected',
    travel_date:  document.getElementById('bDate').value ? document.getElementById('bDate').value : 'Not specified',
    group_size:   bGroup.options[bGroup.selectedIndex] ? bGroup.options[bGroup.selectedIndex].text : 'Not specified',
    message:      document.getElementById('bMessage').value.trim() || 'No message',
  };

  btn.disabled    = true;
  btn.textContent = 'Sending…';

  if (typeof emailjs === 'undefined') {
    _showSuccess(form, success, btn, 'Send Inquiry');
    return;
  }

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_BOOKING_TID, params)
    .then(() => _showSuccess(form, success, btn, 'Send Inquiry'))
    .catch(err => {
      btn.disabled    = false;
      btn.textContent = 'Send Inquiry';
      alert('Something went wrong. Please call us on +254 732 633 470 or reach us on WhatsApp.');
    });
}

function submitContact() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('contactSuccess');
  const btn     = form.querySelector('.btn-submit');

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
    btn.style.transform = 'translateX(-6px)';
    setTimeout(() => {
      btn.style.transform = 'translateX(6px)';
      setTimeout(() => { btn.style.transform = ''; }, 150);
    }, 150);
    return;
  }

  const params = {
    from_name: document.getElementById('cName').value.trim(),
    reply_to:  document.getElementById('cEmail').value.trim(),
    subject:   document.getElementById('cSubject').value.trim() || 'General Enquiry',
    message:   document.getElementById('cMessage').value.trim() || 'No message',
  };

  btn.disabled    = true;
  btn.textContent = 'Sending…';

  if (typeof emailjs === 'undefined') {
    _showSuccess(form, success, btn, 'Send Message');
    return;
  }

  emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_CONTACT_TID, params)
    .then(() => _showSuccess(form, success, btn, 'Send Message'))
    .catch(err => {
      btn.disabled    = false;
      btn.textContent = 'Send Message';
      alert('Something went wrong. Please email us at Calisadventures545@gmail.com');
    });
}

function _showSuccess(form, success, btn, label) {
  form.style.display = 'none';
  success.classList.add('show');
  btn.disabled    = false;
  btn.textContent = label;
}
