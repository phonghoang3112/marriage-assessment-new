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

  // Meta Pixel: count Zalo clicks as Contact (only runs if the Pixel is installed).
  document.querySelectorAll('[data-track="zalo"]').forEach(function (el) {
    el.addEventListener('click', function () {
      if (typeof window.fbq === 'function') window.fbq('track', 'Contact');
    });
  });
})();
