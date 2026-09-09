(() => {
  const measurementId = 'G-5EEHYS9R9T';

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function gtag() {
    window.dataLayer.push(arguments);
  };

  window.gtag('js', new Date());
  window.gtag('config', measurementId);

  if (!document.querySelector(`script[src*="gtag/js?id=${measurementId}"]`)) {
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);
  }

  const trackAffiliateClick = (event) => {
    const link = event.target.closest('a[data-affiliate-program]');
    if (!link) return;

    const detail = {
      event: 'affiliate_outbound_click',
      affiliate_program: link.dataset.affiliateProgram,
      affiliate_page: window.location.pathname,
      destination: link.href,
      link_text: link.textContent.trim(),
    };

    window.dataLayer.push(detail);
    window.gtag('event', 'affiliate_outbound_click', {
      affiliate_program: detail.affiliate_program,
      affiliate_page: detail.affiliate_page,
      destination: detail.destination,
      link_text: detail.link_text,
    });
    window.dispatchEvent(new CustomEvent('affiliate_outbound_click', { detail }));
  };

  document.addEventListener('click', trackAffiliateClick, { capture: true });
})();
