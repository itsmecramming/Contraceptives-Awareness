document.addEventListener('DOMContentLoaded', () => {

  // --- Counter Animation (Home Page) ---
  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
      const updateCount = () => {
          const target = +counter.getAttribute('data-target');
          const count = +counter.innerText;
          const speed = 200; // lower is faster
          const inc = target / speed;

          if (count < target) {
              counter.innerText = Math.ceil(count + inc);
              setTimeout(updateCount, 10);
          } else {
              counter.innerText = target;
          }
      };
      // Simple intersection observer to trigger counter when visible
      const observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting) {
              updateCount();
              observer.disconnect();
          }
      }, { threshold: 0.5 });
      
      observer.observe(counter);
  });

  // --- Accordion Logic (Content Page) ---
  const accordions = document.querySelectorAll('.accordion');
  accordions.forEach(acc => {
      const header = acc.querySelector('.acc-header');
      header.addEventListener('click', () => {
          // Close others if desired, or toggle independently
          const isActive = acc.classList.contains('active');
          
          accordions.forEach(a => {
              a.classList.remove('active');
              a.querySelector('.acc-icon').innerText = '+';
          });

          if (!isActive) {
              acc.classList.add('active');
              acc.querySelector('.acc-icon').innerText = '-';
              
              // Trigger eff-bar inner animations if present
              const bars = acc.querySelectorAll('.eff-fill');
              bars.forEach(bar => {
                  setTimeout(() => {
                      bar.style.width = bar.getAttribute('data-width');
                  }, 100); // slight delay
              });
          }
      });
  });

  // --- Tabs Logic (Content Page) ---
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
          // Remove active classes
          tabBtns.forEach(b => b.classList.remove('active'));
          tabContents.forEach(c => c.classList.remove('active'));

          // Add active to clicked and matched target
          btn.classList.add('active');
          const targetId = btn.getAttribute('data-tab');
          document.getElementById(targetId).classList.add('active');
      });
  });

  // --- Sticky TOC Highlight (Content Page) ---
  const sections = document.querySelectorAll('.content-sec');
  const navLinks = document.querySelectorAll('#toc-list a');

  if (sections.length > 0 && navLinks.length > 0) {
      window.addEventListener('scroll', () => {
          let current = '';
          sections.forEach(sec => {
              const secTop = sec.offsetTop;
              const secHeight = sec.clientHeight;
              if (scrollY >= (secTop - 200)) {
                  current = sec.getAttribute('id');
              }
          });

          navLinks.forEach(link => {
              link.classList.remove('active');
              if (link.getAttribute('href') === `#${current}`) {
                  link.classList.add('active');
              }
          });
      });
  }

  // --- Lightbox Integration ---
  const createLightbox = () => {
      const modal = document.createElement('div');
      modal.classList.add('lightbox-modal');
      modal.innerHTML = `
          <span class="lightbox-close">&times;</span>
          <img class="lightbox-content" src="" alt="Expanded Image">
      `;
      document.body.appendChild(modal);

      const closeBtn = modal.querySelector('.lightbox-close');
      const expandedImg = modal.querySelector('.lightbox-content');

      const closeModal = () => {
          modal.classList.remove('active');
          expandedImg.src = '';
      };

      closeBtn.addEventListener('click', closeModal);
      modal.addEventListener('click', (e) => {
          if (e.target === modal) closeModal();
      });

      document.querySelectorAll('.lightbox-trigger').forEach(img => {
          img.addEventListener('click', () => {
              expandedImg.src = img.src;
              modal.classList.add('active');
          });
      });
  };
  // --- Theme Toggle Logic ---
  const themeToggle = document.getElementById('theme-toggle');
  const brandLogo = document.getElementById('brand-logo');
  const footerLogo = document.querySelector('.footer-logo');
  const favicon = document.getElementById('favicon');

  const setTheme = (theme) => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (themeToggle) themeToggle.innerText = 'Light Mode';
      if (brandLogo) brandLogo.src = 'assets/logo-dark.svg';
      if (footerLogo) footerLogo.src = 'assets/logo-dark.svg';
      if (favicon) favicon.href = 'assets/logo-dark.svg';
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      if (themeToggle) themeToggle.innerText = 'Dark Mode';
      if (brandLogo) brandLogo.src = 'assets/logo-light.svg';
      if (footerLogo) footerLogo.src = 'assets/logo-light.svg';
      if (favicon) favicon.href = 'assets/logo-light.svg';
      localStorage.setItem('theme', 'light');
    }
  };

  // Initialize theme from localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    setTheme('dark');
  } else {
    setTheme('light'); // Explicitly set light as default
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      if (currentTheme === 'dark') {
        setTheme('light');
      } else {
        setTheme('dark');
      }
    });
  }

});
