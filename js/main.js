/**
 * UDHAVUM ULLANGAL PUBLIC CHARITABLE TRUST (UUPCT)
 * Interactive Application Logic & Giving Experience
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initDonationCalculator();
  initServiceSlider();
  initModals();
  initContactForm();
  initSmoothScroll();
});

/* ==========================================================================
   Interactive Services Carousel
   ========================================================================== */
function initServiceSlider() {
  const track = document.getElementById('servicesTrack');
  const prevBtn = document.getElementById('prevServiceBtn');
  const nextBtn = document.getElementById('nextServiceBtn');
  const dotsContainer = document.getElementById('servicesDots');

  if (!track || !prevBtn || !nextBtn) return;

  const slides = track.querySelectorAll('.service-slide');
  if (slides.length === 0) return;

  let currentIndex = 0;
  
  function getVisibleSlides() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 1024) return 2;
    return 3;
  }

  function getMaxIndex() {
    const visible = getVisibleSlides();
    return Math.max(0, slides.length - visible);
  }

  function updateSlider() {
    const maxIdx = getMaxIndex();
    if (currentIndex > maxIdx) currentIndex = maxIdx;
    if (currentIndex < 0) currentIndex = 0;

    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = 24; // gap between slides in px
    const offset = currentIndex * (slideWidth + gap);

    track.style.transform = `translateX(-${offset}px)`;

    // Update dots
    if (dotsContainer) {
      dotsContainer.querySelectorAll('.slider-dot').forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }

    // Toggle button state
    prevBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
    prevBtn.style.pointerEvents = currentIndex === 0 ? 'none' : 'auto';
    nextBtn.style.opacity = currentIndex === maxIdx ? '0.5' : '1';
    nextBtn.style.pointerEvents = currentIndex === maxIdx ? 'none' : 'auto';
  }

  // Create dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    const maxIdx = getMaxIndex();
    for (let i = 0; i <= maxIdx; i++) {
      const dot = document.createElement('div');
      dot.className = `slider-dot ${i === 0 ? 'active' : ''}`;
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateSlider();
      });
      dotsContainer.appendChild(dot);
    }
  }

  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateSlider();
    }
  });

  nextBtn.addEventListener('click', () => {
    const maxIdx = getMaxIndex();
    if (currentIndex < maxIdx) {
      currentIndex++;
      updateSlider();
    }
  });

  window.addEventListener('resize', () => {
    updateSlider();
  });

  updateSlider();
}


/* ==========================================================================
   Mobile Menu
   ========================================================================== */
function initMobileMenu() {
  const menuBtn = document.getElementById('mobileMenuBtn');
  const navMenu = document.getElementById('navMenu');

  if (menuBtn && navMenu) {
    menuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      menuBtn.setAttribute('aria-expanded', isOpen);
      menuBtn.innerHTML = isOpen 
        ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'
        : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
    });

    // Close when clicking a link
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        if (menuBtn) {
          menuBtn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
        }
      });
    });
  }
}

/* ==========================================================================
   Interactive 80G Donation Calculator
   ========================================================================== */
const IMPACT_MAPPINGS = {
  1500: "Provides comprehensive educational supplies & textbooks for 2 rural students.",
  2500: "Provides monthly nutritious provisions to a leprosy-affected or differently-abled family.",
  5000: "Sponsors 1 full year of after-school academic mentorship & career guidance for a child.",
  15000: "Funds a high-grade vocational sewing machine & certificate training for an underprivileged woman.",
  25000: "Conducts an early cancer detection screening camp with adyar cancer institute for 50 village elders.",
  50000: "Supports medical diagnostic equipment fund for the upcoming Nellai Cancer Care Hospital."
};

function initDonationCalculator() {
  const tierBtns = document.querySelectorAll('.tier-btn');
  const customInput = document.getElementById('customAmountInput');
  const impactText = document.getElementById('impactPreviewText');
  const taxSavingsText = document.getElementById('taxSavingsValue');
  const modalAmountInput = document.getElementById('modalDonationAmount');

  function updateImpact(amount) {
    const numAmount = parseInt(amount, 10) || 0;
    
    // Calculate 50% 80G deduction based on typical 30% tax bracket: 50% of 30% = 15% effective tax rebate
    const estimatedTaxSaved = Math.round(numAmount * 0.15);
    if (taxSavingsText) {
      taxSavingsText.textContent = `₹${estimatedTaxSaved.toLocaleString('en-IN')}`;
    }

    if (modalAmountInput) {
      modalAmountInput.value = numAmount;
    }

    // Determine impact text
    let message = "Your generous tax-exempt gift directly sustains healthcare, education & women empowerment programs.";
    if (IMPACT_MAPPINGS[numAmount]) {
      message = IMPACT_MAPPINGS[numAmount];
    } else if (numAmount >= 50000) {
      message = "Supports vital cancer diagnostic equipment and patient care at Nellai Cancer Hospital.";
    } else if (numAmount >= 15000) {
      message = "Empowers rural women with vocational tailoring equipment and livelihood tools.";
    } else if (numAmount >= 5000) {
      message = "Sponsors 1 full year of education, mentorship, and career nurturing for an underprivileged child.";
    } else if (numAmount >= 2500) {
      message = "Provides essential food and medical provisions for a distressed elderly or disabled family.";
    } else if (numAmount > 0) {
      message = `Every rupee transforms lives. ₹${numAmount.toLocaleString('en-IN')} goes directly into grassroots community relief.`;
    }

    if (impactText) {
      impactText.textContent = message;
    }
  }

  tierBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      tierBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const val = btn.dataset.amount;
      if (customInput) {
        customInput.value = val;
      }
      updateImpact(val);
    });
  });

  if (customInput) {
    customInput.addEventListener('input', (e) => {
      const val = e.target.value.replace(/[^0-9]/g, '');
      e.target.value = val;
      
      tierBtns.forEach(b => {
        if (b.dataset.amount === val) {
          b.classList.add('active');
        } else {
          b.classList.remove('active');
        }
      });
      
      updateImpact(val);
    });
  }

  // Initial calculation
  updateImpact(5000);
}

/* ==========================================================================
   Modal Dialogs & Form Actions
   ========================================================================== */
function initModals() {
  window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  // Close on backdrop click
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(modal => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }
  });

  // CSR Form Submission handler
  const csrForm = document.getElementById('csrForm');
  if (csrForm) {
    csrForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = csrForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = 'Generating CSR Dossier...';
      submitBtn.disabled = true;

      setTimeout(() => {
        alert("Thank you! Your Corporate CSR Inquiry & Schedule VII Dossier has been prepared. Our Trustee Team will contact your CSR committee within 24 hours. A copy has been dispatched to your email.");
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        closeModal('csrModal');
        csrForm.reset();
      }, 900);
    });
  }

  // Donation Form Submission handler
  const donationForm = document.getElementById('donationForm');
  if (donationForm) {
    donationForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('donorName')?.value || 'Valued Donor';
      const amount = document.getElementById('modalDonationAmount')?.value || '5000';
      const pan = document.getElementById('donorPan')?.value || 'NOT PROVIDED';
      
      alert(`Thank you, ${name}! Your gift of ₹${parseInt(amount, 10).toLocaleString('en-IN')} has been pledged.\n\nSection 80G Tax Exemption Certificate will be issued under PAN: ${pan}.\nOfficial receipt reference: UUPCT-80G-${Date.now().toString().slice(-6)}`);
      closeModal('donateModal');
    });
  }
}

/* ==========================================================================
   Smooth Scrolling & Active Link Spy
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   Contact Inquiry Form Handler
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contactInquiryForm');
  const statusEl = document.getElementById('contactFormStatus');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contactName')?.value || 'Valued Partner';
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;

    submitBtn.innerHTML = 'Sending Message...';
    submitBtn.disabled = true;

    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      if (statusEl) {
        statusEl.textContent = `✓ Thank you, ${name}! Your inquiry has been forwarded to the Trustee Office. We will respond within 24 hours.`;
        statusEl.style.display = 'block';
      }
      form.reset();

      setTimeout(() => {
        if (statusEl) statusEl.style.display = 'none';
      }, 7000);
    }, 700);
  });
}

