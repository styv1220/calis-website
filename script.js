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
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ─── SCROLL REVEAL ───────────────────────────────────────────
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.12 });
reveals.forEach(el => revealObserver.observe(el));


// ============================================================
//  EMAILJS SETUP
// ============================================================
(function(){
  function waitForEmailJS(cb) {
    if (typeof emailjs !== 'undefined') {
      emailjs.init({ publicKey: '6RSlzWe-yRghDkILu' });
      cb();
    } else {
      setTimeout(() => waitForEmailJS(cb), 200);
    }
  }
  waitForEmailJS(function() {
    console.log('EmailJS ready');
  });
})();


// ─── BOOKING FORM SUBMIT ─────────────────────────────────────
function submitBooking() {
  const form    = document.getElementById('bookingForm');
  const success = document.getElementById('formSuccess');
  const btn     = form.querySelector('.btn-submit');

  // Validate required text/email fields
  let valid = true;
  form.querySelectorAll('input[type="text"], input[type="email"]').forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = 'rgba(201,168,76,0.6)';
      valid = false;
    } else {
      input.style.borderColor = '';
    }
  });

  if (!valid) {
    btn.style.transform = 'translateX(-6px)';
    setTimeout(() => { btn.style.transform = 'translateX(6px)'; setTimeout(() => { btn.style.transform = ''; }, 150); }, 150);
    return;
  }

  // Collect values
  var firstName  = document.getElementById('bFirstName').value.trim();
  var lastName   = document.getElementById('bLastName').value.trim();
  var email      = document.getElementById('bEmail').value.trim();
  var phone      = document.getElementById('bPhone').value.trim();
  var serviceEl  = document.getElementById('bService');
  var service    = serviceEl.options[serviceEl.selectedIndex] ? serviceEl.options[serviceEl.selectedIndex].text : '';
  var date       = document.getElementById('bDate').value;
  var groupEl    = document.getElementById('bGroup');
  var group      = groupEl.options[groupEl.selectedIndex] ? groupEl.options[groupEl.selectedIndex].text : '';
  var message    = document.getElementById('bMessage').value.trim();

  var params = {
    client_name:  firstName + ' ' + lastName,
    client_email: email,
    client_phone: phone || 'Not provided',
    service:      service || 'Not selected',
    travel_date:  date || 'Not specified',
    group_size:   group || 'Not specified',
    message:      message || 'No message'
  };

  btn.disabled    = true;
  btn.textContent = 'Sending…';

  emailjs.send('service_tvpzmoh', 'template_knuj3ez', params)
    .then(function() {
      form.style.display = 'none';
      success.classList.add('show');
      btn.disabled    = false;
      btn.textContent = 'Send Inquiry';
    })
    .catch(function(error) {
      console.error('Booking error:', JSON.stringify(error));
      btn.disabled    = false;
      btn.textContent = 'Send Inquiry';
      alert('Something went wrong. Please call us on +254 732 633 470 or reach us on WhatsApp.');
    });
}


// ─── CONTACT FORM SUBMIT ─────────────────────────────────────
function submitContact() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('contactSuccess');
  const btn     = form.querySelector('.btn-submit');

  let valid = true;
  form.querySelectorAll('input[type="text"], input[type="email"]').forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = 'rgba(201,168,76,0.6)';
      valid = false;
    } else {
      input.style.borderColor = '';
    }
  });

  if (!valid) {
    btn.style.transform = 'translateX(-6px)';
    setTimeout(() => { btn.style.transform = 'translateX(6px)'; setTimeout(() => { btn.style.transform = ''; }, 150); }, 150);
    return;
  }

  var params = {
    from_name: document.getElementById('cName').value.trim(),
    reply_to:  document.getElementById('cEmail').value.trim(),
    subject:   document.getElementById('cSubject').value.trim() || 'General Enquiry',
    message:   document.getElementById('cMessage').value.trim() || 'No message'
  };

  btn.disabled    = true;
  btn.textContent = 'Sending…';

  emailjs.send('service_tvpzmoh', 'template_fuiwukt', params)
    .then(function() {
      form.style.display = 'none';
      success.classList.add('show');
      btn.disabled    = false;
      btn.textContent = 'Send Message';
    })
    .catch(function(error) {
      console.error('Contact error:', JSON.stringify(error));
      btn.disabled    = false;
      btn.textContent = 'Send Message';
      alert('Something went wrong. Please email us at Calisadventures545@gmail.com');
    });
}
