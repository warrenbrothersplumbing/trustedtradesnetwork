// Click tracking for Trusted Trades Network
(function() {
  function trackClick(company, type, value) {
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ company, type, value })
    }).catch(function(err) {
      console.log('Tracking error:', err);
    });
  }

  document.addEventListener('click', function(e) {
    const link = e.target.closest('a[href^="tel:"]');
    if (link) {
      const company = link.getAttribute('data-company') || 'unknown';
      const phone = link.getAttribute('href').replace('tel:', '');
      trackClick(company, 'phone', phone);
    }
  });

  document.addEventListener('click', function(e) {
    const link = e.target.closest('a[data-track-website]');
    if (link) {
      const company = link.getAttribute('data-company') || 'unknown';
      trackClick(company, 'website', link.href);
    }
  });
})();
