/* ---------- Configuration ---------- */
const whatsappNumber = "919997357742"; // WhatsApp number (country code +91, then number) - DO NOT add '+' sign
const galleryImageCount = 8; // change to how many placeholder images you add (image1.jpg..imageN.jpg) in /images

/* ---------- Booking popup logic (shared) ---------- */
function openBooking(serviceName = '') {
  const overlay = document.getElementById('popupBooking');
  if (!overlay) return;
  overlay.style.display = 'flex';
  overlay.setAttribute('aria-hidden', 'false');
  const serviceInput = document.getElementById('serviceType');
  if (serviceInput) serviceInput.value = serviceName;
}

function closeBooking() {
  const overlay = document.getElementById('popupBooking');
  if (!overlay) return;
  overlay.style.display = 'none';
  overlay.setAttribute('aria-hidden', 'true');
  const form = document.getElementById('bookingForm');
  if (form) form.reset();
}

/* Validate phone quickly */
function isValidPhone(phone) {
  return /^[0-9]{10}$/.test(phone);
}

/* submit form — opens WhatsApp web/app with prefilled message */
function submitBooking(e) {
  e.preventDefault();
  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const service = document.getElementById('serviceType').value.trim();
  const budget = document.getElementById('budget').value.trim();

  if (!name || !phone || !service) {
    alert('Please fill required fields.');
    return;
  }
  if (!isValidPhone(phone)) {
    alert('Enter a valid 10-digit phone number.');
    return;
  }

  // Prepare message (URL-encoded)
  let message = `Hello,%0AI have booked a slot for the service *${encodeURIComponent(service)}*.%0AName: ${encodeURIComponent(name)}%0APhone: ${encodeURIComponent(phone)}`;
  if (budget) message += `%0ABudget: ${encodeURIComponent(budget)}`;

  const url = `https://wa.me/${whatsappNumber}?text=${message}`;

  // Open WhatsApp (new tab). On mobile device it opens WhatsApp app.
  window.open(url, '_blank');

  closeBooking();
}

/* ---------- Gallery load logic ---------- */
/* This simple loader inserts image elements for image1.jpg..imageN.jpg in /images */
function loadGallery() {
  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  for (let i = 1; i <= galleryImageCount; i++) {
    const img = document.createElement('img');
    img.src = `images/image${i}.jpg`; // place your images as image1.jpg, image2.jpg ...
    img.alt = `Gallery image ${i}`;
    img.loading = 'lazy';
    img.onclick = () => openLightbox(img.src);
    img.onerror = () => {
      // fallback to placeholder if image missing
      img.src = 'images/placeholder.jpg';
    };
    grid.appendChild(img);
  }
}

/* ---------- Lightbox ---------- */
function openLightbox(src) {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  if (!lb || !lbImg) return;
  lbImg.src = src;
  lb.style.display = 'flex';
}
function closeLightbox() {
  const lb = document.getElementById('lightbox');
  const lbImg = document.getElementById('lightboxImg');
  if (!lb || !lbImg) return;
  lb.style.display = 'none';
  lbImg.src = '';
}

/* ---------- Auto-run on pages ---------- */
document.addEventListener('DOMContentLoaded', function () {
  // load gallery if that element exists
  loadGallery();

  // close lightbox on ESC
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') {
      closeLightbox();
      closeBooking();
    }
  });

  // clicking outside popup closes it
  const popup = document.getElementById('popupBooking');
  if (popup) {
    popup.addEventListener('click', (ev) => {
      if (ev.target === popup) closeBooking();
    });
  }

  // lightbox click handled inline (closeLightbox)
});
