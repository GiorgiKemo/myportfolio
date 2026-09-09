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

  const trackEvent = (eventName, params = {}) => {
    const detail = { event: eventName, ...params };
    window.dataLayer.push(detail);
    window.gtag('event', eventName, params);
    window.dispatchEvent(new CustomEvent(eventName, { detail }));
  };

  window.trackAffiliateEvent = trackEvent;

  const getPageSlug = () => {
    const path = window.location.pathname.replace(/\/$/, '');
    if (!path || path === '/affiliate') return 'affiliate-hub';
    return path.split('/').pop().replace(/\.html$/, '') || 'affiliate-page';
  };

  const initializeAffiliateMeasurement = () => {
    const pageSlug = getPageSlug();
    const links = [...document.querySelectorAll('a[data-affiliate-program]')];

    links.forEach((link, index) => {
      link.dataset.affiliatePlacement ||= `cta_${index + 1}`;
      trackEvent('affiliate_cta_impression', {
        affiliate_program: link.dataset.affiliateProgram,
        affiliate_page: window.location.pathname,
        affiliate_placement: link.dataset.affiliatePlacement,
      });
    });

    trackEvent('guide_view', {
      guide_slug: pageSlug,
      page_type: pageSlug === 'affiliate-hub' ? 'hub' : 'guide',
    });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAffiliateMeasurement, { once: true });
  } else {
    initializeAffiliateMeasurement();
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
      affiliate_placement: link.dataset.affiliatePlacement || 'cta_unknown',
    };

    trackEvent('affiliate_outbound_click', {
      affiliate_program: detail.affiliate_program,
      affiliate_page: detail.affiliate_page,
      destination: detail.destination,
      link_text: detail.link_text,
      affiliate_placement: detail.affiliate_placement,
    });
  };

  document.addEventListener('click', trackAffiliateClick, { capture: true });
})();
