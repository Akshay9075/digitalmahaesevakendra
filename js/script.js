/**
 * Digital Maha E Seva Kendra - Main JavaScript
 */

(function () {
  'use strict';

  /* ---------- DOM Ready ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    initPageLoader();
    initStickyHeader();
    initScrollToTop();
    initCounterAnimation();
    initLightbox();
    initGalleryFilter();
    initContactForm();
    initActiveNavLink();
    initAOS();
  });

  /* ---------- Page Loader ---------- */
  function initPageLoader() {
    const loader = document.getElementById('page-loader');
    if (!loader) return;

    window.addEventListener('load', function () {
      setTimeout(function () {
        loader.classList.add('hidden');
      }, 500);
    });

    setTimeout(function () {
      loader.classList.add('hidden');
    }, 3000);
  }

  /* ---------- Sticky Header ---------- */
  function initStickyHeader() {
    const header = document.querySelector('.main-header');
    if (!header) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  /* ---------- Scroll To Top ---------- */
  function initScrollToTop() {
    const scrollBtn = document.getElementById('scrollToTop');
    if (!scrollBtn) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    });

    scrollBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Counter Animation ---------- */
  function initCounterAnimation() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const animateCounter = function (el) {
      const target = parseInt(el.getAttribute('data-count'), 10);
      const suffix = el.getAttribute('data-suffix') || '';
      const duration = 2000;
      const start = performance.now();

      const update = function (currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        el.textContent = current + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target + suffix;
        }
      };

      requestAnimationFrame(update);
    };

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            animateCounter(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(function (counter) {
      observer.observe(counter);
    });
  }

  /* ---------- Lightbox ---------- */
  function initLightbox() {
    const galleryItems = document.querySelectorAll('[data-lightbox]');
    if (!galleryItems.length) return;

    let overlay = document.getElementById('lightbox-overlay');

    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'lightbox-overlay';
      overlay.className = 'lightbox-overlay';
      overlay.innerHTML =
        '<div class="lightbox-content">' +
        '<button class="lightbox-close" aria-label="Close lightbox">&times;</button>' +
        '<img src="" alt="Gallery Image">' +
        '<p class="lightbox-caption"></p>' +
        '</div>';
      document.body.appendChild(overlay);
    }

    const lightboxImg = overlay.querySelector('img');
    const lightboxCaption = overlay.querySelector('.lightbox-caption');
    const closeBtn = overlay.querySelector('.lightbox-close');

    galleryItems.forEach(function (item) {
      item.addEventListener('click', function (e) {
        e.preventDefault();
        const imgSrc = item.getAttribute('href') || item.querySelector('img').src;
        const caption = item.getAttribute('data-caption') || '';
        lightboxImg.src = imgSrc;
        lightboxCaption.textContent = caption;
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeLightbox() {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      lightboxImg.src = '';
    }

    closeBtn.addEventListener('click', closeLightbox);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) closeLightbox();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  /* ---------- Gallery Filter ---------- */
  function initGalleryFilter() {
    const filterBtns = document.querySelectorAll('.gallery-filter button');
    const galleryItems = document.querySelectorAll('.gallery-grid .gallery-col');

    if (!filterBtns.length || !galleryItems.length) return;

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');

        galleryItems.forEach(function (item) {
          const category = item.getAttribute('data-category');

          if (filter === 'all' || category === filter) {
            item.style.display = '';
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            setTimeout(function () {
              item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              item.style.opacity = '1';
              item.style.transform = 'scale(1)';
            }, 50);
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* ---------- Contact Form Validation ---------- */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const fields = {
      name: {
        el: form.querySelector('#contactName'),
        validate: function (value) {
          return value.trim().length >= 2;
        },
        message: 'Please enter your full name (min 2 characters).'
      },
      phone: {
        el: form.querySelector('#contactPhone'),
        validate: function (value) {
          return /^[6-9]\d{9}$/.test(value.replace(/\s/g, ''));
        },
        message: 'Please enter a valid 10-digit Indian mobile number.'
      },
      email: {
        el: form.querySelector('#contactEmail'),
        validate: function (value) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: 'Please enter a valid email address.'
      },
      message: {
        el: form.querySelector('#contactMessage'),
        validate: function (value) {
          return value.trim().length >= 10;
        },
        message: 'Please enter a message (min 10 characters).'
      }
    };

    function showError(field, message) {
      field.el.classList.add('is-invalid');
      const feedback = field.el.parentElement.querySelector('.invalid-feedback');
      if (feedback) feedback.textContent = message;
    }

    function clearError(field) {
      field.el.classList.remove('is-invalid');
    }

    Object.keys(fields).forEach(function (key) {
      fields[key].el.addEventListener('input', function () {
        if (fields[key].validate(fields[key].el.value)) {
          clearError(fields[key]);
        }
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      let isValid = true;

      Object.keys(fields).forEach(function (key) {
        const field = fields[key];
        if (!field.validate(field.el.value)) {
          showError(field, field.message);
          isValid = false;
        } else {
          clearError(field);
        }
      });

      if (isValid) {
        const successAlert = document.getElementById('formSuccess');
        if (successAlert) {
          successAlert.classList.remove('d-none');
          form.reset();
          setTimeout(function () {
            successAlert.classList.add('d-none');
          }, 5000);
        }
      }
    });
  }

  /* ---------- Active Navigation Link ---------- */
  function initActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');

    navLinks.forEach(function (link) {
      const href = link.getAttribute('href');
      if (href === currentPage || (currentPage === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /* ---------- AOS Initialization ---------- */
  function initAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 80
      });
    }
  }
})();
