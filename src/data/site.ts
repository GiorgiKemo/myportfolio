export const site = {
  name: 'Giorgi Kemoklidze',
  short: 'Giorgi',
  url: 'https://giorgi.codes',
  role: 'Full-Stack Developer',
  location: 'Tbilisi, Georgia',
  timezone: 'Asia/Tbilisi',
  gaId: 'G-5EEHYS9R9T',
  email: 'contact@giorgi.codes',
  phone: '+995 596 33 33 16',
  links: {
    github: 'https://github.com/GiorgiKemo',
    linkedin: 'https://www.linkedin.com/in/giorgi-kemoklidze-53383b263/',
    x: 'https://x.com/GiorgiKem',
    telegram: 'https://t.me/GiorgiKemo',
    whatsapp: 'https://wa.me/995596333316',
  },
  // Kept identical to the previous site so analytics campaigns keep working.
  resourcesHref: '/affiliate/?utm_source=portfolio&utm_medium=owned&utm_campaign=affiliate_hub',
} as const;

export const services = [
  {
    name: 'Conversion Snapshot',
    price: '$149',
    description: 'A focused review of one public page or funnel so the highest-friction fixes are easy to act on.',
    deliverables: ['Annotated findings', 'Prioritized fix list', 'Clear next-step recommendation'],
    scopeHref: '/offers/conversion-snapshot.html',
  },
  {
    name: 'Conversion Page Sprint',
    price: '$1,500',
    description: 'A focused landing-page build for a service, product, or campaign that needs a sharper path to action.',
    deliverables: ['Responsive page implementation', 'CTA and form states', 'Launch-ready QA handoff'],
  },
  {
    name: 'Workflow / Dashboard Sprint',
    price: 'From $3,000',
    description: 'A scoped web workflow or dashboard for teams that need an operational process to become easier to run.',
    deliverables: ['User flow and data model', 'Working interface', 'Acceptance checklist'],
  },
] as const;
