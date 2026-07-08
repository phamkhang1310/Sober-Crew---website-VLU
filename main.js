/* Sober Crew Interactive UI Logic */

document.addEventListener('DOMContentLoaded', () => {
  
  // =========================================================================
  // 1. Sticky Header
  // =========================================================================
  const header = document.getElementById('main-header');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initial run on page load

  // =========================================================================
  // 11. Preloader & Custom Cursor Init
  // =========================================================================
  // Preloader
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      preloader.classList.add('loaded');
      setTimeout(() => preloader.remove(), 800); // Remove after transition
    }
  });

  // Custom Cursor
  const cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  const cursorOutline = document.createElement('div');
  cursorOutline.className = 'cursor-outline';
  document.body.appendChild(cursorDot);
  document.body.appendChild(cursorOutline);

  window.addEventListener('mousemove', (e) => {
    const posX = e.clientX;
    const posY = e.clientY;
    
    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;
    
    // Slight delay for outline for smooth trailing effect
    cursorOutline.animate({
      left: `${posX}px`,
      top: `${posY}px`
    }, { duration: 500, fill: "forwards" });
  });

  // Hover effect on links and buttons
  const interactiveElements = document.querySelectorAll('a, button, .btn, .gallery-card, input, textarea');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorOutline.classList.add('hover-active');
    });
    el.addEventListener('mouseleave', () => {
      cursorOutline.classList.remove('hover-active');
    });
  });

  // =========================================================================
  // 2. Mobile Nav Toggle
  // =========================================================================
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileNavToggle && navMenu) {
    mobileNavToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = mobileNavToggle.querySelector('i');
      if (navMenu.classList.contains('active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars-staggered';
      }
    });

    // Close menu when clicking navigation links
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileNavToggle.querySelector('i').className = 'fa-solid fa-bars-staggered';
      });
    });
  }

  // =========================================================================
  // 3. Project Slider (Production Zone / Videographer)
  // =========================================================================
  const slides = document.querySelectorAll('.slide-card');
  const btnPrev = document.getElementById('slider-prev');
  const btnNext = document.getElementById('slider-next');
  let currentSlideIndex = 0;

  const updateSlider = (index) => {
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
    currentSlideIndex = index;
  };

  if (btnPrev && btnNext && slides.length > 0) {
    btnPrev.addEventListener('click', () => {
      let nextIndex = currentSlideIndex - 1;
      if (nextIndex < 0) {
        nextIndex = slides.length - 1;
      }
      updateSlider(nextIndex);
    });

    btnNext.addEventListener('click', () => {
      let nextIndex = currentSlideIndex + 1;
      if (nextIndex >= slides.length) {
        nextIndex = 0;
      }
      updateSlider(nextIndex);
    });

    // Enable clicking directly on background slide to focus it
    slides.forEach((slide, index) => {
      slide.addEventListener('click', () => {
        if (!slide.classList.contains('active')) {
          updateSlider(index);
        }
      });
    });
  }

  // =========================================================================
  // 4. Modals Controller (Login, Signup, QR Zoom)
  // =========================================================================
  const loginModal = document.getElementById('login-modal');
  const signupModal = document.getElementById('signup-modal');
  const qrModal = document.getElementById('qr-modal');

  const triggers = [
    { btnId: 'btn-login-header', modal: loginModal },
    { btnId: 'btn-login-hero', modal: loginModal },
    { btnId: 'btn-signup-header', modal: signupModal },
    { btnId: 'btn-signup-hero', modal: signupModal },
    { btnId: 'thumb-qr-code', modal: qrModal }
  ];

  const closers = [
    { btnId: 'login-modal-close', modal: loginModal },
    { btnId: 'signup-modal-close', modal: signupModal },
    { btnId: 'qr-modal-close', modal: qrModal }
  ];

  // Open Modals
  triggers.forEach(t => {
    const el = document.getElementById(t.btnId);
    if (el && t.modal) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        t.modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock scrolling
      });
    }
  });

  // Close Modals via Close Button
  closers.forEach(c => {
    const el = document.getElementById(c.btnId);
    if (el && c.modal) {
      el.addEventListener('click', () => {
        c.modal.classList.remove('active');
        document.body.style.overflow = ''; // Unlock scrolling
      });
    }
  });

  // Close Modals via Background Overlay Click
  const modals = [loginModal, signupModal, qrModal];
  modals.forEach(modal => {
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }
  });

  // =========================================================================
  // 5. Password Show/Hide Toggle
  // =========================================================================
  const passwordToggles = [
    { toggleId: 'login-pass-toggle', inputId: 'login-pass' },
    { toggleId: 'signup-pass-toggle', inputId: 'signup-pass' }
  ];

  passwordToggles.forEach(pt => {
    const toggleBtn = document.getElementById(pt.toggleId);
    const passInput = document.getElementById(pt.inputId);
    
    if (toggleBtn && passInput) {
      toggleBtn.addEventListener('click', () => {
        const type = passInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passInput.setAttribute('type', type);
        
        const icon = toggleBtn.querySelector('i');
        if (type === 'password') {
          icon.className = 'fa-solid fa-eye';
        } else {
          icon.className = 'fa-solid fa-eye-slash';
        }
      });
    }
  });

  // =========================================================================
  // 6. Custom Notification Toasts Creator
  // =========================================================================
  const toastContainer = document.getElementById('toast-container');

  const showToast = (message, type = 'success') => {
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const iconClass = type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation';
    
    toast.innerHTML = `
      <i class="fa-solid ${iconClass}"></i>
      <span class="toast-message">${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
      toast.classList.add('active');
    }, 50);
    
    // Animate out and remove
    setTimeout(() => {
      toast.classList.remove('active');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 3500);
  };

  // =========================================================================
  // 7. Form Submissions Handlers & Auth
  // =========================================================================

  // Authentication State Manager
  function checkAuth() {
    const user = JSON.parse(localStorage.getItem('soberCrewUser'));
    const headerActions = document.querySelector('.header-actions');
    const loginBtn = document.getElementById('btn-login-header');
    const signupBtn = document.getElementById('btn-signup-header');

    // Remove existing profile/logout buttons if any
    const existingProfile = document.getElementById('user-profile-btn');
    const existingLogout = document.getElementById('user-logout-btn');
    if (existingProfile) existingProfile.remove();
    if (existingLogout) existingLogout.remove();

    if (user) {
      if (loginBtn) loginBtn.style.display = 'none';
      if (signupBtn) signupBtn.style.display = 'none';

      const profileBtn = document.createElement('div');
      profileBtn.id = 'user-profile-btn';
      profileBtn.className = 'btn btn-login';
      profileBtn.innerHTML = `<i class="fa-solid fa-user" style="margin-right: 8px;"></i> ${user.name}`;
      
      const logoutBtn = document.createElement('button');
      logoutBtn.id = 'user-logout-btn';
      logoutBtn.className = 'btn btn-signup';
      logoutBtn.style.background = 'transparent';
      logoutBtn.style.border = '1px solid var(--neon-lime)';
      logoutBtn.style.color = 'var(--neon-lime)';
      logoutBtn.innerText = 'LOG OUT';
      
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('soberCrewUser');
        checkAuth();
        showToast('Successfully logged out', 'success');
      });

      profileBtn.style.cursor = 'pointer'; // Even though we use custom cursor, keep pointer for fallback
      profileBtn.addEventListener('click', () => {
        openProfileModal(user);
      });

      // Insert before mobile toggle
      const mobileToggle = document.getElementById('mobile-nav-toggle');
      if (mobileToggle) {
        headerActions.insertBefore(profileBtn, mobileToggle);
        headerActions.insertBefore(logoutBtn, mobileToggle);
      } else {
        headerActions.appendChild(profileBtn);
        headerActions.appendChild(logoutBtn);
      }
    } else {
      if (loginBtn) loginBtn.style.display = 'inline-flex';
      if (signupBtn) signupBtn.style.display = 'inline-flex';
    }
  }

  // --- Profile Modal Logic ---
  const profileModalHtml = `
    <div class="modal" id="profile-modal">
      <div class="modal-content" style="max-width: 600px;">
        <button class="modal-close" id="profile-close-btn">&times;</button>
        <h2 class="modal-title" style="margin-bottom: 10px;">My Profile</h2>
        <div id="profile-details" style="color: var(--text-gray); margin-bottom: 30px; font-size: 0.9rem;"></div>
        
        <h3 style="color: var(--neon-lime); font-family: var(--font-primary); font-size: 1.2rem;">Booking History</h3>
        <table class="profile-history-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody id="profile-history-body">
            <!-- History rows will be injected here -->
          </tbody>
        </table>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', profileModalHtml);

  const profileModal = document.getElementById('profile-modal');
  const profileCloseBtn = document.getElementById('profile-close-btn');

  function openProfileModal(user) {
    const details = document.getElementById('profile-details');
    details.innerHTML = `<strong>Name:</strong> ${user.name} &nbsp;|&nbsp; <strong>Email:</strong> ${user.email}`;
    
    const tbody = document.getElementById('profile-history-body');
    const bookings = JSON.parse(localStorage.getItem('soberCrewBookings')) || [];
    const userBookings = bookings.filter(b => b.email === user.email);

    if (userBookings.length === 0) {
      tbody.innerHTML = `<tr><td colspan="3" style="text-align: center;">No bookings found.</td></tr>`;
    } else {
      tbody.innerHTML = userBookings.map(b => `
        <tr>
          <td>${b.service}</td>
          <td>${b.date}</td>
          <td style="color: var(--neon-lime);">Confirmed</td>
        </tr>
      `).join('');
    }

    profileModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  if (profileCloseBtn) {
    profileCloseBtn.addEventListener('click', () => {
      profileModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  }

  // Helper: Simulate Backend DB
  function getUsersDb() {
    return JSON.parse(localStorage.getItem('soberCrewUsersDB')) || [];
  }
  function saveUsersDb(users) {
    localStorage.setItem('soberCrewUsersDB', JSON.stringify(users));
  }

  // Run check on load
  checkAuth();

  // Login Form
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('login-user').value;
      const pass = document.getElementById('login-pass').value;
      const btn = loginForm.querySelector('button[type="submit"]');
      const originalHtml = btn.innerHTML;

      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
      btn.disabled = true;

      // Simulate network delay
      setTimeout(() => {
        const users = getUsersDb();
        const user = users.find(u => (u.email === email || u.name === email) && u.password === pass);

        if (user) {
          localStorage.setItem('soberCrewUser', JSON.stringify({ name: user.name, email: user.email }));
          loginModal.classList.remove('active');
          document.body.style.overflow = '';
          showToast(`Welcome back, ${user.name}!`, 'success');
          loginForm.reset();
          checkAuth();
        } else {
          showToast('Invalid credentials. Please check your email and password.', 'error');
        }
        btn.innerHTML = originalHtml;
        btn.disabled = false;
      }, 800);
    });
  }

  // Signup Form
  const signupForm = document.getElementById('signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('signup-name').value;
      const email = document.getElementById('signup-email').value;
      const pass = document.getElementById('signup-pass').value;
      const confirmPass = document.getElementById('signup-confirm').value;

      if (pass !== confirmPass) {
        showToast("Error: Passwords do not match!", "error");
        return;
      }

      const btn = signupForm.querySelector('button[type="submit"]');
      const originalHtml = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
      btn.disabled = true;

      // Simulate network delay
      setTimeout(() => {
        const users = getUsersDb();
        if (users.find(u => u.email === email)) {
          showToast('Error: Email already exists!', 'error');
        } else {
          // Register new user
          const newUser = { name, email, password: pass };
          users.push(newUser);
          saveUsersDb(users);

          // Log them in automatically
          localStorage.setItem('soberCrewUser', JSON.stringify({ name: newUser.name, email: newUser.email }));
          signupModal.classList.remove('active');
          document.body.style.overflow = '';
          showToast(`Account successfully registered for ${newUser.name}!`, 'success');
          signupForm.reset();
          checkAuth();
        }
        btn.innerHTML = originalHtml;
        btn.disabled = false;
      }, 800);
    });
  }

  // Newsletter Subscription Form
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const emailInput = document.getElementById('newsletter-email');
      const email = emailInput.value;
      const btn = newsletterForm.querySelector('button');
      
      const originalHtml = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
      btn.disabled = true;

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const result = await response.json();
        
        if (result.success) {
          showToast(`Subscribed successfully with ${email}!`, 'success');
          newsletterForm.reset();
        } else {
          showToast(result.message || 'Error occurred.', 'error');
        }
      } catch (err) {
        showToast('Network error, please try again later.', 'error');
      } finally {
        btn.innerHTML = originalHtml;
        btn.disabled = false;
      }
    });
  }

  // Booking Form
  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const btn = bookingForm.querySelector('button[type="submit"]');
      const originalHtml = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> SENDING...';
      btn.disabled = true;

      const payload = {
        name: document.getElementById('book-name').value,
        email: document.getElementById('book-email').value,
        service: document.getElementById('book-service').value,
        date: document.getElementById('book-date').value,
        message: document.getElementById('book-message').value
      };

      // Simulate booking request without server
      setTimeout(() => {
        // Save to booking history if logged in
        const currentUserStr = localStorage.getItem('soberCrewUser');
        if (currentUserStr) {
          const user = JSON.parse(currentUserStr);
          payload.email = user.email; // bind booking to logged-in user's email
        }

        const bookings = JSON.parse(localStorage.getItem('soberCrewBookings')) || [];
        bookings.push(payload);
        localStorage.setItem('soberCrewBookings', JSON.stringify(bookings));

        showToast('Booking request sent successfully! We will contact you soon.', 'success');
        bookingForm.reset();
        
        btn.innerHTML = originalHtml;
        btn.disabled = false;
      }, 800);
    });
  }

  // =========================================================================
  // 10. Parallax Scrolling Effect
  // =========================================================================
  const heroBg = document.querySelector('.hero-bg-img');
  const glowOrbs = document.querySelectorAll('.glow-orb');
  
  if (heroBg || glowOrbs.length > 0) {
    window.addEventListener('scroll', () => {
      let scrollY = window.scrollY;
      
      if (heroBg) {
        // Move the background down slightly as we scroll down (parallax effect)
        heroBg.style.transform = `translateY(${scrollY * 0.3}px) scale(1.02)`;
      }
      
      glowOrbs.forEach((orb, index) => {
        // Different speed for different orbs
        let speed = index === 0 ? 0.2 : -0.15;
        orb.style.transform = `translateY(${scrollY * speed}px)`;
      });
    });
  }


  // =========================================================================
  // 8. Scroll Reveal Animations
  // =========================================================================
  const revealElements = document.querySelectorAll('.reveal');
  
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Optional: stop observing once revealed
        // observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // =========================================================================
  // 9. Active Navigation Highlight
  // =========================================================================
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinksList = document.querySelectorAll('.nav-menu .nav-link');

  const highlightNav = () => {
    let scrollY = window.scrollY;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');
      
      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinksList.forEach(link => {
          link.classList.remove('active-link');
          if (link.getAttribute('href') && link.getAttribute('href').includes(sectionId)) {
            link.classList.add('active-link');
          }
        });
      }
    });
  };
  
  window.addEventListener('scroll', highlightNav);
  highlightNav(); // Call once on load
});
