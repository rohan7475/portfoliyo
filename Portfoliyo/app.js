/* ==========================================
   ROHAN SINGH - PORTFOLIO LOGIC CONTROLLER
   Vanilla ES6+ JavaScript
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- Initialization ---
  initTheme();
  initTypewriter();
  initStickyHeader();
  initScrollspy();
  initProjectFilters();
  initContactForm();
  initBackToTop();
  animateProgressBarsOnScroll();
});

/* ==========================================
   1. COLOR SYSTEM (THEME SWITCHER)
   ========================================== */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (!toggleBtn) return;

  // Retrieve previous settings
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme) {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }

  toggleBtn.addEventListener('click', () => {
    let theme = document.documentElement.getAttribute('data-theme');
    if (theme === 'dark') {
      theme = 'light';
    } else {
      theme = 'dark';
    }
    
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  });
}

/* ==========================================
   2. HERO TYPEWRITER ANIMATION
   ========================================== */
function initTypewriter() {
  const typingElement = document.getElementById('typing-element');
  if (!typingElement) return;

  const roles = [
    'Full-Stack Software Engineer',
    'UI/UX Web Developer',
    'Creative Systems Architect',
    'Problem Solver'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 100;
  let deletingDelay = 50;
  let wordStayDelay = 2000;

  function type() {
    const currentWord = roles[roleIndex];
    
    if (isDeleting) {
      // Removing characters
      typingElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = deletingDelay;
    } else {
      // Writing characters
      typingElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 100;
    }

    // Checking boundaries
    if (!isDeleting && charIndex === currentWord.length) {
      // Word completed, pause before deleting
      isDeleting = true;
      typingDelay = wordStayDelay;
    } else if (isDeleting && charIndex === 0) {
      // Word deleted, move to next
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingDelay = 500;
    }

    setTimeout(type, typingDelay);
  }

  // Start sequence
  setTimeout(type, 1000);
}

/* ==========================================
   3. STICKY HEADER & NAVBAR TRANSITIONS
   ========================================== */
function initStickyHeader() {
  const header = document.querySelector('.navbar-custom');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('navbar-scrolled');
    } else {
      header.classList.remove('navbar-scrolled');
    }
  });
}

/* ==========================================
   4. SCROLLSPY (ACTIVE LINK HIGHLIGHTING)
   ========================================== */
function initScrollspy() {
  const navLinks = document.querySelectorAll('.nav-link-custom');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120; // Offset for navbar header
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}

/* ==========================================
   5. PROJECT PORTFOLIO MASONRY FILTERS
   ========================================== */
function initProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card-wrapper');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Set active button styles
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        
        if (filterValue === 'all' || category === filterValue) {
          card.classList.remove('project-hidden');
        } else {
          card.classList.add('project-hidden');
        }
      });
    });
  });
}

/* ==========================================
   6. CONTACT FORM VALIDATOR & LOADER
   ========================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');
  const submitBtn = document.getElementById('submit-btn');
  const btnSpinner = document.getElementById('submit-spinner');
  const btnText = document.getElementById('btn-text');

  // Regex validations
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Real-time error removal
  const inputs = [nameInput, emailInput, subjectInput, messageInput];
  inputs.forEach(input => {
    if (!input) return;
    input.addEventListener('input', () => {
      input.classList.remove('is-invalid');
      const errEl = document.getElementById(`${input.id}-error`);
      if (errEl) errEl.style.display = 'none';
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Name
    if (!nameInput.value.trim()) {
      showError(nameInput, 'Please fill in your name.');
      isValid = false;
    }

    // Validate Email
    if (!emailInput.value.trim()) {
      showError(emailInput, 'Please fill in your email address.');
      isValid = false;
    } else if (!emailRegex.test(emailInput.value.trim())) {
      showError(emailInput, 'Please enter a valid email address.');
      isValid = false;
    }

    // Validate Subject
    if (!subjectInput.value.trim()) {
      showError(subjectInput, 'Please specify a subject.');
      isValid = false;
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      showError(messageInput, 'Please write your message.');
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      showError(messageInput, 'Message should be at least 10 characters.');
      isValid = false;
    }

    if (!isValid) return;

    // Trigger loading spinner
    submitBtn.disabled = true;
    btnSpinner.style.display = 'inline-block';
    btnText.textContent = 'Sending...';

    // Simulate server side submit delay
    setTimeout(() => {
      // Reset layout and values
      submitBtn.disabled = false;
      btnSpinner.style.display = 'none';
      btnText.textContent = 'Send Message';
      
      // Show Bootstrap Alert or success toast message
      alert('Success! Your message has been sent. Rohan will connect with you shortly.');
      form.reset();
    }, 1500);
  });

  function showError(input, message) {
    input.classList.add('is-invalid');
    const errEl = document.getElementById(`${input.id}-error`);
    if (errEl) {
      errEl.textContent = message;
      errEl.style.display = 'block';
    }
  }
}

/* ==========================================
   7. BACK TO TOP SCROLL SENSITIVITIES
   ========================================== */
function initBackToTop() {
  const backToTopBtn = document.getElementById('back-to-top-btn');
  const sentinel = document.getElementById('scroll-sentinel');
  if (!backToTopBtn || !sentinel) return;

  // Utilize Intersection Observer as specified by modern guidelines
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // If the top sentinel is out of view, the user has scrolled down
      if (!entry.isIntersecting) {
        backToTopBtn.classList.add('scrolled');
      } else {
        backToTopBtn.classList.remove('scrolled');
      }
    });
  }, { threshold: 0 });

  observer.observe(sentinel);

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================
   8. SKILL PROGRESS BAR ANIME
   ========================================== */
function animateProgressBarsOnScroll() {
  const skillsSection = document.getElementById('skills');
  const bars = document.querySelectorAll('.progress-bar-fill');
  if (!skillsSection || bars.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate each bar to its custom width
        bars.forEach(bar => {
          const width = bar.getAttribute('data-width');
          bar.style.width = width;
        });
        // Unobserve once triggered
        observer.unobserve(skillsSection);
      }
    });
  }, { threshold: 0.15 });

  observer.observe(skillsSection);
}
