// Landing page behaviour: sticky booking bar + Zalo click tracking.
(function () {
  // Sticky "Đặt lịch" bar appears after the hero, hides again over the final CTA.
  var bar = document.getElementById('sticky-bar');
  var finalCta = document.getElementById('cuoi');
  if (bar) {
    var link = bar.querySelector('a');
    var update = function () {
      var y = window.scrollY || document.documentElement.scrollTop || 0;
      var nearFinal = finalCta && finalCta.getBoundingClientRect().top < window.innerHeight * 0.85;
      var show = y > 640 && !nearFinal;
      bar.classList.toggle('is-visible', show);
      bar.setAttribute('aria-hidden', show ? 'false' : 'true');
      if (link) link.tabIndex = show ? 0 : -1;
    };
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  }

  // Active section indicator in fixed header navigation
  var navButtons = Array.prototype.slice.call(document.querySelectorAll('.site-nav .nav-btn'));
  var sections = ['dau-hieu', 'buoi', 'chuyen-gia', 'dat', 'faq'].map(function (id) {
    return document.getElementById(id);
  }).filter(Boolean);

  if (navButtons.length && sections.length) {
    var updateActiveNav = function () {
      var scrollPos = (window.scrollY || document.documentElement.scrollTop || 0) + 140;
      var activeId = '';
      for (var i = sections.length - 1; i >= 0; i--) {
        var sec = sections[i];
        if (sec.offsetTop <= scrollPos) {
          activeId = sec.id;
          break;
        }
      }
      navButtons.forEach(function (btn) {
        var href = btn.getAttribute('href');
        var isActive = href === '#' + activeId;
        btn.classList.toggle('is-active', isActive);
      });
    };
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();
  }

  // Meta Pixel & Google Analytics: count Zalo clicks as Contact.
  document.querySelectorAll('[data-track="zalo"]').forEach(function (el) {
    el.addEventListener('click', function () {
      if (typeof window.fbq === 'function') window.fbq('track', 'Contact');
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'contact', { method: 'zalo' });
      }
    });
  });

  // Track clicks to external Fillout booking form
  document.querySelectorAll('[data-track="booking"]').forEach(function (el) {
    el.addEventListener('click', function () {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'begin_checkout', {
          event_category: 'booking',
          link_url: 'https://toitoanven.fillout.com/goi_ten_60'
        });
      }
      if (typeof window.fbq === 'function') {
        window.fbq('track', 'InitiateCheckout');
      }
    });
  });
})();
