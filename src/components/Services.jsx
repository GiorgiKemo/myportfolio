import { motion as Motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { FaArrowRight, FaCheck } from 'react-icons/fa';

const serviceOffers = [
  {
    name: 'Conversion Snapshot',
    price: '$149',
    description: 'A focused review of one public page or funnel so the highest-friction fixes are easy to act on.',
    deliverables: ['Annotated findings', 'Prioritized fix list', 'Clear next-step recommendation'],
    accent: 'teal',
    scopeHref: '/offers/conversion-snapshot.html',
  },
  {
    name: 'Conversion Page Sprint',
    price: '$1,500',
    description: 'A focused landing-page build for a service, product, or campaign that needs a sharper path to action.',
    deliverables: ['Responsive page implementation', 'CTA and form states', 'Launch-ready QA handoff'],
    accent: 'blue',
  },
  {
    name: 'Workflow / Dashboard Sprint',
    price: 'From $3,000',
    description: 'A scoped web workflow or dashboard for teams that need an operational process to become easier to run.',
    deliverables: ['User flow and data model', 'Working interface', 'Acceptance checklist'],
    accent: 'purple',
  },
];

const Services = () => {
  const trackOfferClick = (offer) => {
    window.gtag?.('event', 'service_offer_click', {
      offer,
      placement: 'services_section',
    });
  };

  return (
    <section id="services" className="services">
      <div className="container">
        <Motion.div
          className="services-heading"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <p className="services-kicker">Work together</p>
            <h2 className="section-title services-title">A clear starting point for the next improvement.</h2>
          </div>
          <p className="services-intro">
            Choose a defined scope first. Every offer is confirmed against the actual problem before work begins.
          </p>
        </Motion.div>

        <div className="services-grid">
          {serviceOffers.map((offer, index) => (
            <Motion.article
              className={`service-card service-card-${offer.accent}`}
              key={offer.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
            >
              <div className="service-card-top">
                <span className="service-index">0{index + 1}</span>
                <span className="service-price">{offer.price}</span>
              </div>
              <h3>{offer.name}</h3>
              <p>{offer.description}</p>
              <ul>
                {offer.deliverables.map((item) => (
                  <li key={item}><FaCheck aria-hidden="true" />{item}</li>
                ))}
              </ul>
              <Link
                to="contact"
                smooth={true}
                duration={600}
                offset={-70}
                className="service-cta"
                onClick={() => {
                  trackOfferClick(offer.name);
                  window.dispatchEvent(new CustomEvent('portfolio:select-service', {
                    detail: { offer: offer.name },
                  }));
                }}
              >
                Discuss this offer <FaArrowRight aria-hidden="true" />
              </Link>
              {offer.scopeHref && (
                <a className="service-scope-link" href={offer.scopeHref}>
                  View the scope before you enquire
                </a>
              )}
            </Motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
