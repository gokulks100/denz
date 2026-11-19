/**
 * Dentz Dental Care (ദന്താശുപത്രി) - Ultra-Premium Healthcare Experience
 * Creative Director & Motion Design System
 * GSAP 3.12 + ScrollTrigger + Lenis Smooth Scroll Integration
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 768;

  // ==========================================================================
  // 1. Lenis Smooth Scroll Setup
  // ==========================================================================
  let lenis = null;
  if (!prefersReducedMotion && typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: isMobile ? 0.9 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.4,
    });

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    }
  } else if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Smooth Anchor Navigation helper
  function scrollToTarget(selector) {
    const targetEl = document.querySelector(selector);
    if (!targetEl) return;
    if (lenis) {
      lenis.scrollTo(targetEl, { offset: -76 });
    } else {
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId && targetId.length > 1) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          scrollToTarget(targetId);
        }
      }
    });
  });

  // ==========================================================================
  // 2. GSAP Entrance, Staggered Reveals & ScrollTrigger
  // ==========================================================================
  if (!prefersReducedMotion && typeof gsap !== 'undefined') {
    // Top Reading Progress Bar
    gsap.to('#scroll-progress', {
      scaleX: 1,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.15
      }
    });

    // Hero Staggered Master Entrance Timeline
    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    heroTl
      .from('.hero-badge-reveal', {
        y: 20,
        opacity: 0,
        duration: 0.65,
        delay: 0.1
      })
      .from('.hero-title-reveal', {
        y: 35,
        opacity: 0,
        duration: 0.85,
        stagger: 0.12
      }, '-=0.4')
      .from('.hero-malayalam-badge', {
        scale: 0.95,
        opacity: 0,
        duration: 0.5
      }, '-=0.5')
      .from('.hero-desc-reveal', {
        y: 20,
        opacity: 0,
        duration: 0.65
      }, '-=0.4')
      .from('.hero-cta-reveal', {
        y: 20,
        opacity: 0,
        duration: 0.65,
        stagger: 0.08
      }, '-=0.45')
      .from('.hero-stats-reveal', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08
      }, '-=0.4')
      .from('.hero-image-card', {
        scale: 0.94,
        opacity: 0,
        duration: 1.0,
        ease: 'power3.out'
      }, '-=0.9')
      .from('.hero-floating-badge', {
        y: 15,
        opacity: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: 'back.out(1.4)'
      }, '-=0.5');


    // Generic Section Header Reveals
    gsap.utils.toArray('.section-header').forEach((header) => {
      gsap.from(header, {
        y: 28,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: header,
          start: 'top 88%',
          once: true
        }
      });
    });

    // Bento Cards Stagger
    gsap.from('.bento-card', {
      y: 35,
      opacity: 0,
      duration: 0.75,
      stagger: 0.09,
      ease: 'power2.out',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: '.bento-grid',
        start: 'top 86%',
        once: true
      }
    });

    // Doctor Cards Stagger (Desktop Grid)
    if (!isMobile) {
      gsap.from('.doctor-card', {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power2.out',
        clearProps: 'transform,opacity',
        scrollTrigger: {
          trigger: '.doctors-grid',
          start: 'top 85%',
          once: true
        }
      });
    }

    // Technology / Safety Features Stagger
    gsap.from('.tech-card', {
      y: 28,
      opacity: 0,
      duration: 0.7,
      stagger: 0.1,
      ease: 'power2.out',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: '.tech-grid',
        start: 'top 85%',
        once: true
      }
    });

    // Magnetic Buttons (Desktop Fine Pointer Devices)
    if (window.matchMedia('(pointer: fine)').matches) {
      document.querySelectorAll('.magnetic-btn').forEach((btn) => {
        btn.addEventListener('mousemove', (e) => {
          const rect = btn.getBoundingClientRect();
          const x = (e.clientX - rect.left - rect.width / 2) * 0.18;
          const y = (e.clientY - rect.top - rect.height / 2) * 0.18;
          gsap.to(btn, { x, y, duration: 0.3, ease: 'power2.out' });
        });
        btn.addEventListener('mouseleave', () => {
          gsap.to(btn, { x: 0, y: 0, duration: 0.45, ease: 'elastic.out(1, 0.5)' });
        });
      });
    }
  }

  // ==========================================================================
  // 3. Interactive Before & After Smile Slider
  // ==========================================================================
  const comparisonSlider = document.getElementById('smile-comparison-slider');
  const comparisonRange = document.getElementById('smile-range-input');

  function updateSliderPosition(value) {
    if (!comparisonSlider) return;
    const clamped = Math.max(0, Math.min(100, value));
    comparisonSlider.style.setProperty('--slider-pos', `${clamped}%`);
  }

  if (comparisonRange && comparisonSlider) {
    comparisonRange.addEventListener('input', (e) => {
      updateSliderPosition(e.target.value);
    });

    // Support direct mouse move and touch drag over container
    let isDragging = false;

    function handlePointerMove(e) {
      if (!isDragging) return;
      const rect = comparisonSlider.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const x = clientX - rect.left;
      const percent = (x / rect.width) * 100;
      updateSliderPosition(percent);
      if (comparisonRange) comparisonRange.value = percent;
    }

    comparisonSlider.addEventListener('mousedown', (e) => {
      isDragging = true;
      handlePointerMove(e);
    });
    window.addEventListener('mouseup', () => { isDragging = false; });
    window.addEventListener('mousemove', handlePointerMove);

    comparisonSlider.addEventListener('touchstart', (e) => {
      isDragging = true;
      handlePointerMove(e);
    }, { passive: true });
    window.addEventListener('touchend', () => { isDragging = false; });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });
  }

  // ==========================================================================
  // 4. Interactive Treatment Finder / Smile Assessment Tool
  // ==========================================================================
  const concernPills = document.querySelectorAll('.concern-pill');
  const treatmentResultCard = document.getElementById('treatment-result-card');
  const resultDeptName = document.getElementById('result-dept-name');
  const resultDoctorName = document.getElementById('result-doctor-name');
  const resultDoctorSpecialty = document.getElementById('result-doctor-specialty');
  const resultDescription = document.getElementById('result-description');
  const resultSessions = document.getElementById('result-sessions');
  const resultPainLevel = document.getElementById('result-pain-level');
  const resultBookBtn = document.getElementById('result-book-btn');

  // Treatment Knowledge Base
  const treatmentData = {
    toothache: {
      dept: 'Conservative Dentistry & Endodontics',
      deptFormVal: 'Conservative Dentistry & Endodontics (RCT)',
      doctor: 'Dr. Sangeetha P',
      doctorFullVal: 'Dr. Sangeetha P (Endodontist)',
      specialty: 'MDS • Consultant Endodontist',
      desc: 'Rotary Single-Sitting Root Canal Therapy & Composite Restoration. Completely relieves nerve inflammation, stops infection, and saves your natural tooth.',
      sessions: '1 – 2 Sessions (60 mins)',
      pain: '0 Pain (Computerized Local Anesthesia)'
    },
    kids: {
      dept: 'Pediatric & Preventive Dentistry',
      deptFormVal: 'Pediatric Dentistry (Kids)',
      doctor: 'Dr. Ranju MB',
      doctorFullVal: 'Dr. Ranju MB (Chief Dental Surgeon - Pedodontist)',
      specialty: 'BDS, MDS • Chief Dental Surgeon',
      desc: 'Gentle, zero-tears dental care for toddlers, children, and teens. Preventive fluoride varnishes, cavity fillings, pit-fissure sealants, and early bite guidance in a fun atmosphere.',
      sessions: '1 Session (30 mins)',
      pain: 'Completely Gentle & Fear-Free'
    },
    missing: {
      dept: 'Oral & Maxillofacial Surgery & Implants',
      deptFormVal: 'Oral & Maxillofacial Surgery & Implants',
      doctor: 'Dr. Rakhil R',
      doctorFullVal: 'Dr. Rakhil R (Oral Surgeon & Implantologist)',
      specialty: 'MDS • Oral Surgeon & Implantologist',
      desc: 'Permanent biocompatible Titanium Dental Implants and Zirconia crown restorations. Restores 100% natural chewing power, prevents bone loss, and looks indistinguishable from real teeth.',
      sessions: 'Consultation + 3D Scan Plan',
      pain: 'Painless Surgical Protocol'
    },
    crooked: {
      dept: 'Orthodontics & Dentofacial Orthopedics',
      deptFormVal: 'Orthodontics & Clear Aligners',
      doctor: 'Dr. Bijo Jose',
      doctorFullVal: 'Dr. Bijo Jose (Orthodontist)',
      specialty: 'MDS • Consultant Orthodontist',
      desc: 'Custom Invisible Clear Aligners or Ceramic Aesthetic Braces. Gently straightens crowded or spaced teeth, fixes deep bites, and crafts a harmoniously balanced smile.',
      sessions: 'Monthly Progress Reviews',
      pain: 'Mild initial pressure only'
    },
    whitening: {
      dept: 'Cosmetic Dentistry & Smile Aesthetics',
      deptFormVal: 'General & Cosmetic Dentistry',
      doctor: 'Dr. Sneha Mathai & Dental Team',
      doctorFullVal: 'Dr. Sneha Mathai (Resident Dental Surgeon)',
      specialty: 'BDS • Aesthetic Dental Clinician',
      desc: 'In-office Laser Teeth Whitening, aesthetic composite edge bonding, and ultra-thin ceramic veneers for an instantly luminous, camera-ready smile makeover.',
      sessions: '1 In-Office Visit (45 mins)',
      pain: 'Zero Pain / Gentle Enamel Care'
    },
    gums: {
      dept: 'Periodontics & Gum Wellness',
      deptFormVal: 'Periodontics (Gum Care & Cleaning)',
      doctor: 'Dr. Sneha Mathai & Specialist Team',
      doctorFullVal: 'Dr. Sneha Mathai (Resident Dental Surgeon)',
      specialty: 'Periodontal Care Department',
      desc: 'Ultrasonic deep calculus scaling, laser gingival therapy, and root planing to stop bleeding gums, eliminate bad breath, and reinforce tooth bone foundation.',
      sessions: '1 Comprehensive Session',
      pain: 'Comfortable Ultrasonic Waves'
    }
  };

  concernPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const concernKey = pill.getAttribute('data-concern');
      const data = treatmentData[concernKey];
      if (!data) return;

      // Toggle active states
      concernPills.forEach((p) => p.classList.remove('is-active'));
      pill.classList.add('is-active');

      // Update Result Card with smooth fade
      if (treatmentResultCard) {
        treatmentResultCard.style.opacity = '0.5';
        setTimeout(() => {
          if (resultDeptName) resultDeptName.textContent = data.dept;
          if (resultDoctorName) resultDoctorName.textContent = data.doctor;
          if (resultDoctorSpecialty) resultDoctorSpecialty.textContent = data.specialty;
          if (resultDescription) resultDescription.textContent = data.desc;
          if (resultSessions) resultSessions.textContent = data.sessions;
          if (resultPainLevel) resultPainLevel.textContent = data.pain;

          if (resultBookBtn) {
            resultBookBtn.setAttribute('data-doctor', data.doctorFullVal);
            resultBookBtn.setAttribute('data-treatment', data.deptFormVal);
          }
          treatmentResultCard.style.opacity = '1';
        }, 120);
      }
    });
  });

  // Pre-fill from Treatment Finder Result Button
  if (resultBookBtn) {
    resultBookBtn.addEventListener('click', () => {
      const docVal = resultBookBtn.getAttribute('data-doctor');
      const treatVal = resultBookBtn.getAttribute('data-treatment');
      applyDoctorSelection(docVal, treatVal);
    });
  }

  // ==========================================================================
  // 5. 1-Tap Doctor Selection -> Auto-fills Booking Form & Scrolls to #book
  // ==========================================================================
  const doctorSelect = document.getElementById('doctor-select');
  const treatmentSelect = document.getElementById('treatment-select');

  function applyDoctorSelection(doctorName, treatmentName) {
    if (doctorSelect && doctorName) {
      doctorSelect.value = doctorName;
      doctorSelect.classList.add('ring-2', 'ring-teal-500', 'bg-teal-50');
      setTimeout(() => {
        doctorSelect.classList.remove('ring-2', 'ring-teal-500', 'bg-teal-50');
      }, 1800);
    }
    if (treatmentSelect && treatmentName) {
      treatmentSelect.value = treatmentName;
      treatmentSelect.classList.add('ring-2', 'ring-teal-500', 'bg-teal-50');
      setTimeout(() => {
        treatmentSelect.classList.remove('ring-2', 'ring-teal-500', 'bg-teal-50');
      }, 1800);
    }
    scrollToTarget('#book');
  }

  document.querySelectorAll('.select-doctor-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const doctorName = btn.getAttribute('data-doctor');
      const treatmentName = btn.getAttribute('data-treatment');
      applyDoctorSelection(doctorName, treatmentName);
    });
  });

  // ==========================================================================
  // 6. Interactive FAQ Accordion
  // ==========================================================================
  document.querySelectorAll('.faq-trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item');
      const content = item.querySelector('.faq-content');
      const icon = trigger.querySelector('.faq-icon');
      const isOpen = !content.classList.contains('hidden');

      // Close all others for clean UX
      document.querySelectorAll('.faq-content').forEach((c) => c.classList.add('hidden'));
      document.querySelectorAll('.faq-icon').forEach((i) => {
        i.textContent = '+';
        i.style.transform = 'rotate(0deg)';
      });

      if (!isOpen) {
        content.classList.remove('hidden');
        icon.textContent = '−';
        icon.style.transform = 'rotate(180deg)';
      }
    });
  });

  // ==========================================================================
  // 7. Dynamic Live Clinic Status Bar (Sultan Bathery Hours)
  // ==========================================================================
  function updateClinicStatus() {
    const dots = document.querySelectorAll('.live-status-dot');
    const textEls = document.querySelectorAll('.live-status-text');

    const now = new Date();
    const day = now.getDay(); // 0 = Sunday
    const mins = now.getHours() * 60 + now.getMinutes();

    // Timings: 9:30 AM (570) – 1:30 PM (810) | 2:30 PM (870) – 5:00 PM (1020)
    const isMorning = mins >= 570 && mins < 810;
    const isLunch = mins >= 810 && mins < 870;
    const isAfternoon = mins >= 870 && mins < 1020;

    let dotClass = '';
    let statusMsg = '';

    if (day === 0) {
      dotClass = 'w-2.5 h-2.5 rounded-full bg-rose-400 shrink-0';
      statusMsg = 'Closed Today (Sunday Holiday) • Opens Mon 9:30 AM';
    } else if (isMorning) {
      dotClass = 'w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0 pulse-ring-teal';
      statusMsg = 'Open Now • Morning Session (9:30 AM – 1:30 PM)';
    } else if (isLunch) {
      dotClass = 'w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0';
      statusMsg = 'Lunch Break (1:30 – 2:30 PM) • Afternoon Session opens at 2:30 PM';
    } else if (isAfternoon) {
      dotClass = 'w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0 pulse-ring-teal';
      statusMsg = 'Open Now • Afternoon Session (2:30 PM – 5:00 PM)';
    } else {
      dotClass = 'w-2.5 h-2.5 rounded-full bg-slate-400 shrink-0';
      statusMsg = 'Closed for the day • Mon–Sat: 9:30 AM–1:30 PM & 2:30–5:00 PM';
    }

    dots.forEach((dot) => { dot.className = dotClass; });
    textEls.forEach((txt) => { txt.textContent = statusMsg; });
  }

  updateClinicStatus();
  // Refresh clinic status every 60 seconds
  setInterval(updateClinicStatus, 60000);

  // ==========================================================================
  // 8. Sticky Navbar Shadow & Footer Year
  // ==========================================================================
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 15) {
      navbar.classList.add('shadow-md', 'bg-white/98');
      navbar.classList.remove('bg-white/90');
    } else {
      navbar.classList.remove('shadow-md', 'bg-white/98');
      navbar.classList.add('bg-white/90');
    }
  }, { passive: true });

  // ==========================================================================
  // 9. Mobile Slide-Over Navigation Drawer
  // ==========================================================================
  const drawer = document.getElementById('mobile-drawer');
  const openBtn = document.getElementById('mobile-menu-open');
  const closeBtn = document.getElementById('mobile-menu-close');
  const backdrop = document.getElementById('mobile-drawer-backdrop');

  function openDrawer() {
    if (!drawer) return;
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (lenis) lenis.stop();
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lenis) lenis.start();
  }

  if (openBtn) openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);

  document.querySelectorAll('.drawer-link').forEach((link) => {
    link.addEventListener('click', closeDrawer);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) {
      closeDrawer();
    }
  });

  // ==========================================================================
  // 10. Date Picker (Sundays Blocked) & WhatsApp Form Dispatcher
  // ==========================================================================
  const dateInput = document.getElementById('preferred-date');
  const sundayWarning = document.getElementById('sunday-warning');

  if (dateInput) {
    const today = new Date();
    // Default to next day if today is Sunday
    if (today.getDay() === 0) {
      today.setDate(today.getDate() + 1);
    }
    const isoDefault = today.toISOString().split('T')[0];
    dateInput.setAttribute('min', new Date().toISOString().split('T')[0]);
    dateInput.value = isoDefault;

    dateInput.addEventListener('change', () => {
      if (!dateInput.value) return;
      const selected = new Date(dateInput.value + 'T00:00:00');
      if (selected.getDay() === 0) {
        if (sundayWarning) sundayWarning.classList.remove('hidden');
        dateInput.value = '';
      } else {
        if (sundayWarning) sundayWarning.classList.add('hidden');
      }
    });
  }

  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('patient-name').value.trim();
      const phone = document.getElementById('patient-phone').value.trim();
      const doctor = document.getElementById('doctor-select').value;
      const treatment = document.getElementById('treatment-select').value;
      const date = document.getElementById('preferred-date').value;
      const timeSlot = document.getElementById('preferred-time').value;
      const notesEl = document.getElementById('patient-notes');
      const notes = notesEl ? notesEl.value.trim() : '';

      if (!date) {
        if (sundayWarning) sundayWarning.classList.remove('hidden');
        return;
      }

      const messageParts = [
        'Hello Dentz Dental Care (ദന്താശുപത്രി), I would like to schedule an appointment:',
        '',
        `*Patient Name:* ${name}`,
        `*Contact Phone:* ${phone}`,
        `*Preferred Doctor:* ${doctor}`,
        `*Department / Treatment:* ${treatment}`,
        `*Preferred Date:* ${date} (Mon-Sat)`,
        `*Preferred Session:* ${timeSlot}`
      ];

      if (notes) {
        messageParts.push(`*Notes / Symptoms:* ${notes}`);
      }

      messageParts.push('', 'Location: Gandhi Junction, Sultan Bathery');

      const message = messageParts.join('\n');
      const clinicWhatsApp = '919747765535';
      const whatsappUrl = `https://wa.me/${clinicWhatsApp}?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }
});
