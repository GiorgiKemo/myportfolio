(() => {
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

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(detail);
    window.dispatchEvent(new CustomEvent('affiliate_outbound_click', { detail }));
  };

  document.addEventListener('click', trackAffiliateClick, { capture: true });
})();
