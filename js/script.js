/* ──────────────────────────────────────────────
   Mobile menu toggle
────────────────────────────────────────────── */
const menuBtn    = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

// Close mobile menu when any link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

/* ──────────────────────────────────────────────
   Smooth scroll for anchor links
────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ──────────────────────────────────────────────
   Scroll-reveal animation
────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ──────────────────────────────────────────────
   Form Validation
────────────────────────────────────────────── */
const form          = document.getElementById('booking-form');
const successBanner = document.getElementById('success-banner');
const submitBtn     = document.getElementById('submit-btn');

// ── Helpers ──
function setError(fieldId, show) {
  const input = document.getElementById(fieldId);
  if (!input) return;
  const wrapper = input.closest('.form-field');
  if (show) {
    wrapper.classList.add('has-error');
  } else {
    wrapper.classList.remove('has-error');
  }
}

function isValidUSPhone(val) {
  // Strip all non-digit characters, then check for exactly 10 digits
  const digits = val.replace(/\D/g, '');
  return digits.length === 10;
}

function isValidEmail(val) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
}

// ── Live phone formatting (auto-formats as user types) ──
const phoneInput = document.getElementById('phone');
phoneInput.addEventListener('input', () => {
  let digits = phoneInput.value.replace(/\D/g, '').slice(0, 10);
  let formatted = '';
  if (digits.length > 0) formatted = '(' + digits.slice(0, 3);
  if (digits.length >= 4) formatted += ') ' + digits.slice(3, 6);
  if (digits.length >= 7) formatted += '-' + digits.slice(6, 10);
  phoneInput.value = formatted;
});

// ── Submit handler ──
form.addEventListener('submit', (e) => {
  e.preventDefault();
  let valid = true;

  const name        = document.getElementById('fullname').value.trim();
  const phone       = document.getElementById('phone').value.trim();
  const email       = document.getElementById('email').value.trim();
  const service     = document.getElementById('service').value;
  const description = document.getElementById('description').value.trim();

  // Name — required, at least 2 chars
  if (name.length < 2) {
    setError('fullname', true);
    valid = false;
  } else {
    setError('fullname', false);
  }

  // Phone — required, must be valid 10-digit US number
  if (!isValidUSPhone(phone)) {
    setError('phone', true);
    valid = false;
  } else {
    setError('phone', false);
  }

  // Email — optional, but validate format if provided
  if (email && !isValidEmail(email)) {
    setError('email', true);
    valid = false;
  } else {
    setError('email', false);
  }

  // Service — required
  if (!service) {
    setError('service', true);
    valid = false;
  } else {
    setError('service', false);
  }

  // Description — required, at least 15 characters
  if (description.length < 15) {
    setError('description', true);
    valid = false;
  } else {
    setError('description', false);
  }

  if (!valid) return;

  // ── Simulate form submission ──
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting…';

  setTimeout(() => {
    successBanner.style.display = 'flex';
    successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    form.reset();
    submitBtn.disabled = false;
    submitBtn.textContent = 'Request My Appointment →';
  }, 1000);
});

// ── Clear error state when user starts typing / changing ──
['fullname', 'phone', 'email', 'service', 'description'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('input',  () => setError(id, false));
  el.addEventListener('change', () => setError(id, false));
});

// ── Set minimum date for appointment picker to today ──
const dateInput = document.getElementById('preferred-date');
if (dateInput) {
  const today = new Date().toISOString().split('T')[0];
  dateInput.setAttribute('min', today);
}

/* ──────────────────────────────────────────────
   English date display
────────────────────────────────────────────── */
const dateDisplay = document.getElementById('date-display-text');

if (dateInput && dateDisplay) {
  dateInput.addEventListener('change', () => {
    const val = dateInput.value; // "YYYY-MM-DD"
    if (!val) {
      dateDisplay.textContent = 'MM / DD / YYYY';
      dateDisplay.classList.add('placeholder');
      return;
    }
    const [year, month, day] = val.split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    const formatted = date.toLocaleDateString('en-US', {
      weekday: 'short',   // Mon
      month:   'long',    // January
      day:     'numeric', // 6
      year:    'numeric'  // 2025
    });
    dateDisplay.textContent = formatted;
    dateDisplay.classList.remove('placeholder');
  });
}