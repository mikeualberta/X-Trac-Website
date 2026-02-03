(function () {
  'use strict';

  // Nav scroll
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function () {
    nav.classList.toggle('nav--scrolled', window.scrollY > 40);
  }, { passive: true });

  // Mobile nav
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  toggle.addEventListener('click', function () {
    links.classList.toggle('is-open');
  });
  links.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () { links.classList.remove('is-open'); });
  });

  // Hero entrance animation
  requestAnimationFrame(function () {
    document.querySelectorAll('.hero-anim').forEach(function (el) {
      el.classList.add('is-visible');
    });
  });

  // Scroll reveal
  var els = document.querySelectorAll(
    '.app-card, .construct-row, .product-feature, .tread, .oem-grid, .contact-layout, .product-showcase-inner, .product-features, .about-stat, .section-label, h2, .section-intro'
  );
  els.forEach(function (el) { el.classList.add('reveal'); });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  els.forEach(function (el) { observer.observe(el); });

  // Count-up animation for trust bar numbers
  var countEls = document.querySelectorAll('[data-count]');
  var countObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        var target = parseInt(el.getAttribute('data-count'), 10);
        var suffix = el.getAttribute('data-suffix') || '';
        var duration = 3200;
        var start = performance.now();
        function step(now) {
          var progress = Math.min((now - start) / duration, 1);
          // Ease out cubic
          var ease = 1 - Math.pow(1 - progress, 3);
          var current = Math.round(ease * target);
          el.textContent = current.toLocaleString() + suffix;
          if (progress < 1) {
            requestAnimationFrame(step);
          }
        }
        requestAnimationFrame(step);
        countObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  countEls.forEach(function (el) { countObserver.observe(el); });

  // Smooth scroll
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - 72,
          behavior: 'smooth'
        });
      }
    });
  });

  // Form (Formspree)
  var form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button');
      btn.textContent = 'Sending\u2026';
      btn.disabled = true;
      btn.style.opacity = '0.6';

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      }).then(function (response) {
        if (response.ok) {
          btn.textContent = 'Submitted';
          btn.style.opacity = '1';
          btn.style.background = '#1a7a3a';
          form.reset();
          setTimeout(function () {
            btn.textContent = 'Submit Inquiry';
            btn.style.background = '';
            btn.disabled = false;
          }, 2500);
        } else {
          btn.textContent = 'Error \u2014 Try Again';
          btn.style.opacity = '1';
          btn.style.background = '#7a1a1a';
          btn.disabled = false;
          setTimeout(function () {
            btn.textContent = 'Submit Inquiry';
            btn.style.background = '';
          }, 3000);
        }
      }).catch(function () {
        btn.textContent = 'Error \u2014 Try Again';
        btn.style.opacity = '1';
        btn.style.background = '#7a1a1a';
        btn.disabled = false;
        setTimeout(function () {
          btn.textContent = 'Submit Inquiry';
          btn.style.background = '';
        }, 3000);
      });
    });
  }
})();
