/**
 * Insta Smart Laundry - Interactive Frontend Logic
 * Mahalaxmi Nagar, Indore
 * Phone: +91 96696 68646
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initFaqAccordion();
  initEstimator();
  initBookingForms();
  initModal();
});

/* ==========================================================================
   NAVBAR & SCROLL
   ========================================================================== */
function initNavbar() {
  const header = document.querySelector('.site-header');
  const toggleBtn = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
      });
    });
  }
}

/* ==========================================================================
   FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    if (btn) {
      btn.addEventListener('click', () => {
        const isOpen = item.classList.contains('open');

        // Close others
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('open');
        });

        // Toggle current
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    }
  });
}

/* ==========================================================================
   INTERACTIVE PRICE ESTIMATOR
   ========================================================================== */
function initEstimator() {
  // Tabs
  const tabBtns = document.querySelectorAll('.calc-tab-btn');
  const weightTab = document.getElementById('calc-tab-weight');
  const itemsTab = document.getElementById('calc-tab-items');

  if (tabBtns.length && weightTab && itemsTab) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const target = btn.getAttribute('data-target');
        if (target === 'weight') {
          weightTab.style.display = 'block';
          itemsTab.style.display = 'none';
        } else {
          weightTab.style.display = 'none';
          itemsTab.style.display = 'block';
        }
        updateSummary();
      });
    });
  }

  // Weight Slider
  const weightSlider = document.getElementById('weight-range');
  const weightDisplay = document.getElementById('weight-display');
  const serviceTypeSelect = document.getElementById('weight-service-type');

  if (weightSlider && weightDisplay) {
    weightSlider.addEventListener('input', (e) => {
      weightDisplay.textContent = `${e.target.value} kg`;
      updateSummary();
    });
  }

  if (serviceTypeSelect) {
    serviceTypeSelect.addEventListener('change', updateSummary);
  }

  // Garment counters
  const counterBtns = document.querySelectorAll('.counter-btn');
  counterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      const targetId = btn.getAttribute('data-target');
      const displayElem = document.getElementById(targetId);

      if (displayElem) {
        let count = parseInt(displayElem.textContent || '0', 10);
        if (action === 'plus') {
          count = Math.min(count + 1, 30);
        } else if (action === 'minus') {
          count = Math.max(count - 1, 0);
        }
        displayElem.textContent = count;
        updateSummary();
      }
    });
  });

  // Calculate & Update Total
  function updateSummary() {
    const isWeightActive = document.querySelector('.calc-tab-btn.active')?.getAttribute('data-target') === 'weight';
    const subtotalDisplay = document.getElementById('calc-subtotal');
    const totalDisplay = document.getElementById('calc-total');
    const itemsCountDisplay = document.getElementById('calc-items-count');

    let total = 0;
    let description = '';

    if (isWeightActive) {
      const kg = parseInt(weightSlider?.value || '5', 10);
      const serviceType = serviceTypeSelect?.value || 'wash-iron'; // 'wash-fold' or 'wash-iron'
      const rate = (serviceType === 'wash-fold') ? 69 : 99; // per kg
      
      total = kg * rate;
      const serviceName = (serviceType === 'wash-fold') ? 'Wash & Fold' : 'Wash & Steam Iron';
      description = `${serviceName} (${kg} kg load)`;
      
      if (itemsCountDisplay) {
        itemsCountDisplay.textContent = `~${kg * 5}-${kg * 6} clothes`;
      }
    } else {
      // Itemized
      let itemCount = 0;
      const items = [
        { id: 'count-shirt', price: 25, name: 'Steam Press Shirts' },
        { id: 'count-trouser', price: 30, name: 'Steam Press Trousers' },
        { id: 'count-suit', price: 290, name: '2-Pc Suit Dry Clean' },
        { id: 'count-saree', price: 220, name: 'Saree Dry Clean' },
        { id: 'count-blanket', price: 260, name: 'Blanket / Quilt Wash' },
        { id: 'count-shoes', price: 299, name: 'Shoe Spa' },
      ];

      items.forEach(item => {
        const countElem = document.getElementById(item.id);
        const qty = parseInt(countElem?.textContent || '0', 10);
        if (qty > 0) {
          total += qty * item.price;
          itemCount += qty;
        }
      });

      if (itemsCountDisplay) {
        itemsCountDisplay.textContent = `${itemCount} pieces`;
      }
      description = `${itemCount} individual dry clean / press garments`;
    }

    if (subtotalDisplay) subtotalDisplay.textContent = `₹${total}`;
    if (totalDisplay) totalDisplay.textContent = `₹${total}`;

    // Update WhatsApp button in estimator
    const calcWhatsAppBtn = document.getElementById('calc-whatsapp-btn');
    if (calcWhatsAppBtn) {
      calcWhatsAppBtn.onclick = () => {
        const text = encodeURIComponent(
          `👋 Hello Insta Smart Laundry! I estimated my order online:\n` +
          `🧺 Estimate: ${description}\n` +
          `💰 Total Amount: ₹${total}\n` +
          `🚚 Pickup location: Indore\n` +
          `Please confirm when you can pick up!`
        );
        window.open(`https://wa.me/919669668646?text=${text}`, '_blank');
      };
    }
  }

  // Initial calculation
  updateSummary();
}

/* ==========================================================================
   QUICK BOOKING FORMS & WHATSAPP REDIRECT
   ========================================================================== */
function initBookingForms() {
  const quickForm = document.getElementById('quick-booking-form');
  if (quickForm) {
    quickForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleBookingSubmit(quickForm);
    });
  }

  const modalForm = document.getElementById('modal-booking-form');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      handleBookingSubmit(modalForm);
    });
  }
}

function handleBookingSubmit(form) {
  const name = form.querySelector('[name="customer_name"]')?.value || 'Customer';
  const phone = form.querySelector('[name="customer_phone"]')?.value || '';
  const service = form.querySelector('[name="service_type"]')?.value || 'Laundry Wash & Fold';
  const date = form.querySelector('[name="pickup_date"]')?.value || 'Today / Earliest';
  const slot = form.querySelector('[name="pickup_slot"]')?.value || 'Morning (9 AM - 1 PM)';
  const address = form.querySelector('[name="customer_address"]')?.value || 'Mahalaxmi Nagar, Indore';

  const message = 
`✨ *NEW LAUNDRY PICKUP REQUEST* ✨
-------------------------------------
👤 *Name:* ${name}
📞 *Phone:* ${phone}
📍 *Address:* ${address}
🧺 *Service:* ${service}
📅 *Preferred Date:* ${date}
⏰ *Time Slot:* ${slot}
-------------------------------------
_Requested via Insta Smart Laundry Website (instasmartlaundry.com)_`;

  const waUrl = `https://wa.me/919669668646?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');

  // If in modal, close modal
  const modal = document.querySelector('.modal-overlay');
  if (modal && modal.classList.contains('active')) {
    modal.classList.remove('active');
  }

  // Provide quick feedback
  alert('Redirecting to WhatsApp to confirm your free pickup with Insta Smart Laundry!');
}

/* ==========================================================================
   MODAL CONTROLLER
   ========================================================================== */
function initModal() {
  const modal = document.querySelector('.modal-overlay');
  const openBtns = document.querySelectorAll('.open-pickup-modal');
  const closeBtn = document.querySelector('.modal-close-btn');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}
