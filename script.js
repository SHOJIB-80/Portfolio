/* ════════════════════════════════════════════════
   script.js — Sirajul Islam Portfolio
   ════════════════════════════════════════════════ */

/* ─── Wait for DOM ready ─── */
document.addEventListener('DOMContentLoaded', () => {

  /* ════════════════════════════════════
     1. MOBILE SIDEBAR TOGGLE
     — Hamburger opens/closes sidebar
  ════════════════════════════════════ */
  const hamburger = document.getElementById('hamburger');
  const sidebar   = document.getElementById('sidebar');
  const overlay   = document.getElementById('overlay');

  function openSidebar() {
    sidebar.classList.add('open');
    overlay.classList.add('show');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden'; // prevent scroll behind
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });

  overlay.addEventListener('click', closeSidebar);

  /* Close sidebar when a nav link is clicked (mobile) */
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768) closeSidebar();
    });
  });


  /* ════════════════════════════════════
     2. SMOOTH SCROLLING
     — Intercept anchor clicks and scroll
        smoothly to the target section
  ════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });


  /* ════════════════════════════════════
     3. ACTIVE NAV LINK ON SCROLL
     — Highlights the correct sidebar link
        as the user scrolls through sections
  ════════════════════════════════════ */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  /* CHANGE OFFSET HERE if your header/sidebar covers content */
  const OFFSET = 120; // px from top of viewport

  function setActiveNav() {
    let currentId = '';
    sections.forEach(section => {
      const top = section.getBoundingClientRect().top;
      if (top <= OFFSET) currentId = section.id;
    });

    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.classList.toggle('active', href === currentId);
    });
  }

  window.addEventListener('scroll', setActiveNav, { passive: true });
  setActiveNav(); // run once on load


  /* ════════════════════════════════════
     4. SCROLL REVEAL ANIMATION
     — Elements with class "reveal" fade in
        when they enter the viewport
  ════════════════════════════════════ */
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        /* Once visible, animate skill bars if inside a skill card */
        const bar = entry.target.querySelector('.skill-fill');
        if (bar) {
          const pct = entry.target.dataset.pct || 0;
          bar.style.width = pct + '%';
        }

        /* Stop observing once revealed */
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12, /* CHANGE reveal threshold here (0–1) */
  });

  revealEls.forEach(el => revealObserver.observe(el));


  /* ════════════════════════════════════
     5. PROJECT FILTER BAR
     — Filters portfolio cards by category
  ════════════════════════════════════ */
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      /* Update active button */
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter; /* "all" | "wordpress" | "html" | "ecommerce" */

      projectCards.forEach(card => {
        if (filter === 'all' || card.dataset.category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });


  /* ════════════════════════════════════
     6. PROJECT MODAL POPUP
     — Clicking "View Details" opens a modal
        with the project's image + description
  ════════════════════════════════════ */
  const modalOverlay = document.getElementById('modalOverlay');
  const modalClose   = document.getElementById('modalClose');
  const modalImg     = document.getElementById('modalImg');
  const modalTitle   = document.getElementById('modalTitle');
  const modalDesc    = document.getElementById('modalDesc');
  const modalTags    = document.getElementById('modalTags');

  function openModal(card) {
    const img   = card.dataset.img   || '';
    const title = card.dataset.title || 'Project';
    const desc  = card.dataset.desc  || '';
    const tags  = (card.dataset.tags || '').split(',').map(t => t.trim()).filter(Boolean);

    modalImg.src   = img;
    modalImg.alt   = title;
    modalTitle.textContent = title;
    modalDesc.textContent  = desc;

    /* Build tag chips */
    modalTags.innerHTML = tags.map(t => `<span>${t}</span>`).join('');

    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* Attach to each "View Details" button */
  document.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.project-card');
      openModal(card);
    });
  });

  modalClose.addEventListener('click', closeModal);

  /* Close modal when clicking outside */
  modalOverlay.addEventListener('click', e => {
    if (e.target === modalOverlay) closeModal();
  });

  /* Close modal with Escape key */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });


  /* ════════════════════════════════════
     7. CONTACT FORM VALIDATION
     — Validates fields before "sending"
        CHANGE this section to connect to a
        real form service (e.g. Formspree,
        EmailJS, or a backend endpoint)
  ════════════════════════════════════ */
  const contactForm  = document.getElementById('contactForm');
  const formSuccess  = document.getElementById('formSuccess');

  /* Helper: show/clear errors */
  function setError(fieldId, errorId, message) {
    const field = document.getElementById(fieldId);
    const error = document.getElementById(errorId);
    if (message) {
      field.classList.add('invalid');
      error.textContent = message;
    } else {
      field.classList.remove('invalid');
      error.textContent = '';
    }
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    let valid = true;

    /* Name validation */
    if (!name || name.length < 2) {
      setError('name', 'nameError', 'Please enter your name (min 2 characters).');
      valid = false;
    } else {
      setError('name', 'nameError', '');
    }

    /* Email validation */
    if (!email || !validateEmail(email)) {
      setError('email', 'emailError', 'Please enter a valid email address.');
      valid = false;
    } else {
      setError('email', 'emailError', '');
    }

    /* Message validation */
    if (!message || message.length < 10) {
      setError('message', 'messageError', 'Please write a message (min 10 characters).');
      valid = false;
    } else {
      setError('message', 'messageError', '');
    }

    if (!valid) return;

    /* ─ SUCCESS ─
       CHANGE THIS SECTION to actually send the form.
       Example with Formspree:

       fetch('https://formspree.io/f/YOUR_FORM_ID', {
         method: 'POST',
         headers: { 'Accept': 'application/json' },
         body: new FormData(contactForm)
       }).then(() => showSuccess());

       Example with EmailJS:
       emailjs.sendForm('SERVICE_ID', 'TEMPLATE_ID', contactForm);
    */

    /* For now, just simulate success */
    contactForm.reset();
    formSuccess.classList.add('show');
    setTimeout(() => formSuccess.classList.remove('show'), 5000);
  });

  /* Clear individual field errors on input */
  ['name', 'email', 'message'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      document.getElementById(id).classList.remove('invalid');
      const errId = id + 'Error';
      const errEl = document.getElementById(errId);
      if (errEl) errEl.textContent = '';
    });
  });


  /* ════════════════════════════════════
     8. TYPING EFFECT (Hero eyebrow)
     — Optional: animates the hero eyebrow
        text with a typing cursor
  ════════════════════════════════════ */
  const eyebrow = document.querySelector('.hero-eyebrow');
  if (eyebrow) {
    /* CHANGE THIS TEXT if you want a different typed message */
    const messages = [
      'Welcome to my portfolio',
      'Available for freelance work',
      'Let\'s build something great'
    ];
    let msgIdx  = 0;
    let charIdx = 0;
    let deleting = false;

    function typeLoop() {
      const current = messages[msgIdx];
      if (!deleting) {
        eyebrow.textContent = current.slice(0, ++charIdx);
        if (charIdx === current.length) {
          deleting = true;
          setTimeout(typeLoop, 2000); /* pause at end */
          return;
        }
      } else {
        eyebrow.textContent = current.slice(0, --charIdx);
        if (charIdx === 0) {
          deleting = false;
          msgIdx = (msgIdx + 1) % messages.length;
        }
      }
      setTimeout(typeLoop, deleting ? 40 : 80);
    }

    /* Start typing after a short delay */
    setTimeout(typeLoop, 800);
  }

}); /* end DOMContentLoaded */
