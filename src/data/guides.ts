// Generated from the previous site's guides (scratchpad extract script). Edit freely.
// Order matches the Field Guide library. `updated`/`priority` come from the previous sitemap.xml.
export type GuideTopic = 'web' | 'ai' | 'biz' | 'creative' | 'family' | 'career';

export interface GuideSummary {
  slug: string;
  /** Root-relative URL, e.g. /affiliate/hosting-checklist.html */
  href: string;
  /** Short card title used in the library. */
  title: string;
  /** Full <title> of the guide page. */
  seoTitle: string;
  /** Meta description. */
  description: string;
  /** One-line library blurb. */
  blurb: string;
  /** Breadcrumb category, e.g. "Websites & hosting". */
  category: string;
  /** Short library label, e.g. "Hosting". */
  label: string;
  topic: GuideTopic;
  /** Library filter topics. */
  cats: GuideTopic[];
  icon: string;
  format: string;
  readTime: string;
  /** ISO date (sitemap lastmod). */
  updated: string;
  /** Sitemap priority. */
  priority: number;
  isNew: boolean;
  /** Has an interactive calculator. */
  interactive: boolean;
  /** Affiliate program on the page, if any. */
  partner: string | null;
}

export const hub = {
  href: '/affiliate/',
  title: 'The Field Guide',
  updated: '2026-09-29',
  priority: 0.9,
} as const;

export const guides: GuideSummary[] = [
  {
    slug: "verpex-hosting-review",
    href: "/affiliate/verpex-hosting-review.html",
    title: "Verpex hosting review: plans, renewals & who it fits",
    seoTitle: "Verpex Hosting Review 2026: Plans, Renewal Prices & Who It Fits | Giorgi Codes",
    description: "A developer's Verpex hosting review: Bronze, Silver and Gold plans compared, renewal prices, what's included, who it fits and who should skip it. Includes a plan picker and 3-year cost calculator.",
    blurb: "Plan picker and a three-year cost calculator that uses renewal prices, not intro deals.",
    category: "Websites & hosting",
    label: "Hosting",
    topic: "web",
    cats: [
      "web"
    ],
    icon: "🖥️",
    format: "In-depth review",
    readTime: "4 min read",
    updated: "2026-09-29",
    priority: 0.9,
    isNew: true,
    interactive: true,
    partner: "verpex"
  },
  {
    slug: "onehomeschool-review",
    href: "/affiliate/onehomeschool-review.html",
    title: "OneHomeschool: a homeschool planner that works with your curriculum",
    seoTitle: "OneHomeschool Review: Homeschool Planner for Your Own Curriculum (Plans & Prices) | Giorgi Codes",
    description: "What OneHomeschool does, what each plan costs by number of children, and how to check your curriculum is supported. A homeschool planner with daily lesson guides, attendance and transcripts. Includes a plan picker.",
    blurb: "What it does, plan prices by number of kids, and how to check your curriculum is supported.",
    category: "Families",
    label: "Homeschool",
    topic: "family",
    cats: [
      "family"
    ],
    icon: "📚",
    format: "Guide + plan picker",
    readTime: "4 min read",
    updated: "2026-09-29",
    priority: 0.9,
    isNew: true,
    interactive: true,
    partner: "onehomeschool"
  },
  {
    slug: "sitemind-cost-calculator",
    href: "/affiliate/sitemind-cost-calculator.html",
    title: "SiteMind cost calculator: which plan fits your traffic?",
    seoTitle: "SiteMind Cost Calculator: Which Plan Fits Your Website Traffic? | Giorgi Codes",
    description: "Estimate how many AI chat conversations your website will have, which SiteMind plan fits (Starter, Growth, Pro), what it costs monthly or yearly, and how many leads you need to break even.",
    blurb: "Turn monthly visitors into expected conversations, plan fit, and the leads needed to break even.",
    category: "AI assistants",
    label: "AI · Calculator",
    topic: "ai",
    cats: [
      "ai",
      "biz"
    ],
    icon: "🧮",
    format: "Interactive calculator",
    readTime: "3 min read",
    updated: "2026-09-29",
    priority: 0.9,
    isNew: true,
    interactive: true,
    partner: "sitemind"
  },
  {
    slug: "hosting-checklist",
    href: "/affiliate/hosting-checklist.html",
    title: "Compare hosting without missing renewal costs",
    seoTitle: "Hosting comparison checklist | Giorgi Codes",
    description: "A practical hosting comparison checklist covering deployment, backups, support, export, and renewal cost.",
    blurb: "Deployment, backups, support, export and the second-year price.",
    category: "Websites & hosting",
    label: "Hosting",
    topic: "web",
    cats: [
      "web"
    ],
    icon: "🧾",
    format: "Checklist · 5 steps",
    readTime: "3 min read",
    updated: "2026-09-29",
    priority: 0.6,
    isNew: false,
    interactive: false,
    partner: "verpex"
  },
  {
    slug: "sitemind-review",
    href: "/affiliate/sitemind-review.html",
    title: "An honest SiteMind review before you subscribe",
    seoTitle: "SiteMind review for small business | Giorgi Codes",
    description: "An honest SiteMind review for small businesses: what it does, current pricing, who it fits, and what to check before starting the trial.",
    blurb: "What it does, current pricing, who it fits and what to check before the trial.",
    category: "AI assistants",
    label: "AI",
    topic: "ai",
    cats: [
      "ai"
    ],
    icon: "⭐",
    format: "In-depth review",
    readTime: "3 min read",
    updated: "2026-09-29",
    priority: 0.6,
    isNew: false,
    interactive: false,
    partner: "sitemind"
  },
  {
    slug: "sitemind-pricing-plans-checklist",
    href: "/affiliate/sitemind-pricing-plans-checklist.html",
    title: "Compare SiteMind plans before you subscribe",
    seoTitle: "SiteMind pricing and plans | Giorgi Codes",
    description: "A practical SiteMind pricing comparison covering plans, trial terms, usage limits, setup, and the questions to check before subscribing.",
    blurb: "Plans, trial terms and usage limits side by side.",
    category: "AI assistants",
    label: "AI",
    topic: "ai",
    cats: [
      "ai"
    ],
    icon: "💳",
    format: "Checklist · 5 steps",
    readTime: "3 min read",
    updated: "2026-09-29",
    priority: 0.6,
    isNew: false,
    interactive: false,
    partner: "sitemind"
  },
  {
    slug: "assistant-fit-calculator",
    href: "/affiliate/assistant-fit-calculator.html",
    title: "Estimate your AI website assistant fit",
    seoTitle: "AI website assistant fit calculator | Giorgi Codes",
    description: "Estimate which AI website assistant plan boundary might fit your website question volume and number of domains.",
    blurb: "Match your question volume and domains to a plan boundary.",
    category: "AI assistants",
    label: "AI · Calculator",
    topic: "ai",
    cats: [
      "ai"
    ],
    icon: "📐",
    format: "Interactive calculator",
    readTime: "3 min read",
    updated: "2026-09-29",
    priority: 0.6,
    isNew: false,
    interactive: true,
    partner: "sitemind"
  },
  {
    slug: "ai-website-assistant-checklist",
    href: "/affiliate/ai-website-assistant-checklist.html",
    title: "Choose an AI website assistant responsibly",
    seoTitle: "AI website assistant checklist | Giorgi Codes",
    description: "A practical checklist for choosing an AI website assistant without missing scope, data boundaries, review, pricing, or ownership details.",
    blurb: "Scope, data boundaries, review, pricing and ownership.",
    category: "AI assistants",
    label: "AI",
    topic: "ai",
    cats: [
      "ai"
    ],
    icon: "✅",
    format: "Checklist · 6 steps",
    readTime: "3 min read",
    updated: "2026-09-10",
    priority: 0.6,
    isNew: false,
    interactive: false,
    partner: "sitemind"
  },
  {
    slug: "ai-website-assistant-vs-live-chat-checklist",
    href: "/affiliate/ai-website-assistant-vs-live-chat-checklist.html",
    title: "AI assistant vs live chat",
    seoTitle: "AI website assistant vs live chat | Giorgi Codes",
    description: "AI website assistant vs live chat: a practical checklist for comparing source boundaries, handoff, privacy, cost, and useful outcomes.",
    blurb: "Source boundaries, human handoff, privacy and cost compared.",
    category: "AI assistants",
    label: "AI",
    topic: "ai",
    cats: [
      "ai"
    ],
    icon: "💬",
    format: "Checklist · 6 steps",
    readTime: "3 min read",
    updated: "2026-09-10",
    priority: 0.6,
    isNew: false,
    interactive: false,
    partner: "sitemind"
  },
  {
    slug: "ai-receptionist-vs-website-assistant",
    href: "/affiliate/ai-receptionist-vs-website-assistant.html",
    title: "Phone receptionist or website assistant?",
    seoTitle: "AI receptionist vs website assistant | Giorgi Codes",
    description: "A practical comparison of AI receptionists for phone calls and AI website assistants for visitor questions, with a transparent SiteMind fit path.",
    blurb: "Which kind of AI help fits where your customers actually ask.",
    category: "AI assistants",
    label: "AI",
    topic: "ai",
    cats: [
      "ai",
      "biz"
    ],
    icon: "📞",
    format: "Comparison",
    readTime: "3 min read",
    updated: "2026-09-10",
    priority: 0.6,
    isNew: false,
    interactive: false,
    partner: "sitemind"
  },
  {
    slug: "sitemind-website-ai-audit",
    href: "/affiliate/sitemind-website-ai-audit.html",
    title: "Run a 10-point AI website assistant audit",
    seoTitle: "10-point AI website assistant audit | Giorgi Codes",
    description: "A 10-point AI website assistant audit checklist for checking source quality, privacy boundaries, handoff, plan fit, and ownership before a trial.",
    blurb: "Source quality, privacy, handoff and plan fit before a trial.",
    category: "AI assistants",
    label: "AI",
    topic: "ai",
    cats: [
      "ai"
    ],
    icon: "🔍",
    format: "Checklist · 10 steps",
    readTime: "3 min read",
    updated: "2026-09-10",
    priority: 0.6,
    isNew: false,
    interactive: false,
    partner: "sitemind"
  },
  {
    slug: "ai-website-assistant-for-small-business",
    href: "/affiliate/ai-website-assistant-for-small-business.html",
    title: "Choose an AI assistant for a small business",
    seoTitle: "AI website assistant for small business | Giorgi Codes",
    description: "A practical checklist for choosing an AI website assistant for a small business, including source quality, privacy, handoff, ownership, and cost.",
    blurb: "A practical checklist for owners with no tech team.",
    category: "Small business",
    label: "Small business",
    topic: "biz",
    cats: [
      "ai",
      "biz"
    ],
    icon: "🏪",
    format: "Checklist · 7 steps",
    readTime: "3 min read",
    updated: "2026-09-10",
    priority: 0.6,
    isNew: false,
    interactive: false,
    partner: "sitemind"
  },
  {
    slug: "sitemind-for-web-agencies",
    href: "/affiliate/sitemind-for-web-agencies.html",
    title: "Add a grounded AI assistant to client sites",
    seoTitle: "SiteMind for web agencies | Giorgi Codes",
    description: "A practical guide for web designers and agencies deciding whether to refer or deploy a grounded AI website assistant for clients.",
    blurb: "For web designers and agencies deciding whether to deploy or refer.",
    category: "Small business",
    label: "Agency",
    topic: "biz",
    cats: [
      "ai",
      "biz"
    ],
    icon: "🏢",
    format: "Checklist · 5 steps",
    readTime: "3 min read",
    updated: "2026-09-10",
    priority: 0.6,
    isNew: false,
    interactive: false,
    partner: "sitemind"
  },
  {
    slug: "sitemind-agency-reseller-pilot",
    href: "/affiliate/sitemind-agency-reseller-pilot.html",
    title: "Plan a one-site AI reseller pilot",
    seoTitle: "SiteMind agency reseller pilot | Giorgi Codes",
    description: "A practical agency pilot plan for packaging a grounded AI website assistant into website maintenance and marketing retainers.",
    blurb: "Package an assistant into maintenance and marketing retainers.",
    category: "Small business",
    label: "Agency",
    topic: "biz",
    cats: [
      "ai",
      "biz"
    ],
    icon: "🧪",
    format: "Checklist · 5 steps",
    readTime: "3 min read",
    updated: "2026-09-10",
    priority: 0.6,
    isNew: false,
    interactive: false,
    partner: "sitemind"
  },
  {
    slug: "ai-website-builder-checklist",
    href: "/affiliate/ai-website-builder-checklist.html",
    title: "Compare AI website builders by ownership",
    seoTitle: "AI website builder checklist | Giorgi Codes",
    description: "A practical checklist for comparing AI website builders by ownership, forms, SEO, export, accessibility, and real operating cost.",
    blurb: "Forms, SEO, export, accessibility and real operating cost.",
    category: "Websites & hosting",
    label: "Websites",
    topic: "web",
    cats: [
      "web",
      "ai"
    ],
    icon: "🪄",
    format: "Checklist · 6 steps",
    readTime: "3 min read",
    updated: "2026-09-29",
    priority: 0.6,
    isNew: false,
    interactive: false,
    partner: "sitemind"
  },
  {
    slug: "ai-website-builder-for-small-business",
    href: "/affiliate/ai-website-builder-for-small-business.html",
    title: "Choose an AI website builder for a small business",
    seoTitle: "AI website builder for small business | Giorgi Codes",
    description: "A practical guide to choosing an AI website builder for a small business by comparing ownership, forms, SEO, support, integrations, and total cost.",
    blurb: "Ownership, support, integrations and total cost.",
    category: "Small business",
    label: "Small business",
    topic: "biz",
    cats: [
      "web",
      "biz"
    ],
    icon: "🧱",
    format: "Checklist · 6 steps",
    readTime: "3 min read",
    updated: "2026-09-29",
    priority: 0.6,
    isNew: false,
    interactive: false,
    partner: null
  },
  {
    slug: "webflow-vs-custom-react-checklist",
    href: "/affiliate/webflow-vs-custom-react-checklist.html",
    title: "Webflow vs a custom React site",
    seoTitle: "Webflow vs custom React checklist | Giorgi Codes",
    description: "A practical Webflow vs custom React checklist covering ownership, editing, hosting, SEO, accessibility, integrations, and client boundaries.",
    blurb: "Editing, hosting, SEO and who owns what.",
    category: "Websites & hosting",
    label: "Websites",
    topic: "web",
    cats: [
      "web"
    ],
    icon: "⚖️",
    format: "Checklist · 8 steps",
    readTime: "3 min read",
    updated: "2026-09-29",
    priority: 0.6,
    isNew: false,
    interactive: false,
    partner: null
  },
  {
    slug: "no-code-landing-page-checklist",
    href: "/affiliate/no-code-landing-page-checklist.html",
    title: "Plan a no-code landing page before you build",
    seoTitle: "No-code landing page checklist | Giorgi Codes",
    description: "A practical checklist for choosing and launching a no-code landing page without missing the offer, proof, forms, analytics, or ownership details.",
    blurb: "Offer, proof, forms, analytics and ownership.",
    category: "Websites & hosting",
    label: "Websites",
    topic: "web",
    cats: [
      "web"
    ],
    icon: "🚀",
    format: "Checklist · 5 steps",
    readTime: "3 min read",
    updated: "2026-09-29",
    priority: 0.6,
    isNew: false,
    interactive: false,
    partner: "sitemind"
  },
  {
    slug: "wordpress-woocommerce-checklist",
    href: "/affiliate/wordpress-woocommerce-checklist.html",
    title: "Plan a WordPress or WooCommerce launch",
    seoTitle: "WordPress and WooCommerce launch checklist | Giorgi Codes",
    description: "A practical pre-launch checklist for choosing and operating WordPress or WooCommerce tools.",
    blurb: "Pre-launch checks for choosing and running your store.",
    category: "Websites & hosting",
    label: "Commerce",
    topic: "web",
    cats: [
      "web",
      "biz"
    ],
    icon: "🛒",
    format: "Checklist · 5 steps",
    readTime: "3 min read",
    updated: "2026-09-29",
    priority: 0.6,
    isNew: false,
    interactive: false,
    partner: null
  },
  {
    slug: "website-maintenance-support-small-business",
    href: "/affiliate/website-maintenance-support-small-business.html",
    title: "Keep a small-business site healthy after launch",
    seoTitle: "Website maintenance and support for small business | Giorgi Codes",
    description: "Practical website maintenance and support for small businesses: fixes, migrations, performance, SEO, analytics, content updates, and clear ownership.",
    blurb: "Fixes, migrations, speed, SEO and content updates.",
    category: "Small business",
    label: "Services",
    topic: "biz",
    cats: [
      "web",
      "biz"
    ],
    icon: "🛠️",
    format: "Checklist · 6 steps",
    readTime: "3 min read",
    updated: "2026-09-09",
    priority: 0.6,
    isNew: false,
    interactive: false,
    partner: null
  },
  {
    slug: "hubspot-free-vs-starter-small-business",
    href: "/affiliate/hubspot-free-vs-starter-small-business.html",
    title: "HubSpot free vs paid plans",
    seoTitle: "HubSpot free vs paid plans for small business | Giorgi Codes",
    description: "A practical checklist for comparing HubSpot's free tools and paid plans for a small business, including seats, limits, ownership, and upgrade triggers.",
    blurb: "Seats, limits and the moment an upgrade is actually worth it.",
    category: "Small business",
    label: "Small business",
    topic: "biz",
    cats: [
      "biz"
    ],
    icon: "📇",
    format: "Checklist · 7 steps",
    readTime: "3 min read",
    updated: "2026-09-29",
    priority: 0.6,
    isNew: false,
    interactive: false,
    partner: null
  },
  {
    slug: "creator-video-workflow",
    href: "/affiliate/creator-video-workflow.html",
    title: "Build a repeatable short-form video workflow",
    seoTitle: "Creator video workflow checklist | Giorgi Codes",
    description: "A repeatable short-form video workflow for recording, captioning, reviewing, exporting, and publishing useful content.",
    blurb: "Record, caption, review, export and publish.",
    category: "Creators",
    label: "Creator",
    topic: "creative",
    cats: [
      "creative"
    ],
    icon: "🎬",
    format: "Checklist · 5 steps",
    readTime: "3 min read",
    updated: "2026-09-29",
    priority: 0.6,
    isNew: false,
    interactive: false,
    partner: null
  },
  {
    slug: "mubert-music-licensing-checklist",
    href: "/affiliate/mubert-music-licensing-checklist.html",
    title: "Check music rights before monetized video",
    seoTitle: "Music licensing checklist for monetized video | Giorgi Codes",
    description: "A rights-first checklist for choosing background music for monetized videos, podcasts, ads, and client work.",
    blurb: "A rights-first checklist for videos, podcasts and client work.",
    category: "Creators",
    label: "Rights",
    topic: "creative",
    cats: [
      "creative"
    ],
    icon: "🎵",
    format: "Checklist · 6 steps",
    readTime: "3 min read",
    updated: "2026-09-10",
    priority: 0.6,
    isNew: false,
    interactive: false,
    partner: null
  },
  {
    slug: "envato-elements-affiliate-guide",
    href: "/affiliate/envato-elements-affiliate-guide.html",
    title: "Evaluate a creative asset subscription",
    seoTitle: "Envato Elements affiliate guide | Giorgi Codes",
    description: "A practical guide to evaluating Envato Elements for creative workflows and understanding the published affiliate economics before applying.",
    blurb: "When an Envato Elements subscription pays off.",
    category: "Creators",
    label: "Creative",
    topic: "creative",
    cats: [
      "creative"
    ],
    icon: "🎨",
    format: "Checklist · 5 steps",
    readTime: "3 min read",
    updated: "2026-09-29",
    priority: 0.6,
    isNew: false,
    interactive: false,
    partner: null
  },
  {
    slug: "family-reading-resource-checklist",
    href: "/affiliate/family-reading-resource-checklist.html",
    title: "Choose family reading resources thoughtfully",
    seoTitle: "Family reading resource checklist | Giorgi Codes",
    description: "A calm checklist for comparing personalized and early-learning reading resources for families, caregivers, and educators.",
    blurb: "Personalized and early-learning books for families and teachers.",
    category: "Families",
    label: "Reading",
    topic: "family",
    cats: [
      "family",
      "creative"
    ],
    icon: "📖",
    format: "Checklist · 5 steps",
    readTime: "3 min read",
    updated: "2026-09-29",
    priority: 0.6,
    isNew: false,
    interactive: false,
    partner: null
  },
  {
    slug: "resumeats-concierge-checklist",
    href: "/affiliate/resumeats-concierge-checklist.html",
    title: "Choose the right level of resume help",
    seoTitle: "ResumeATS concierge checklist | Giorgi Codes",
    description: "A practical checklist for deciding between a self-service ATS resume builder, a targeted $99 resume concierge, and broader professional resume support.",
    blurb: "Self-service ATS builder, targeted concierge or full rewrite.",
    category: "Job seekers",
    label: "Career",
    topic: "career",
    cats: [
      "career"
    ],
    icon: "📄",
    format: "Checklist · 5 steps",
    readTime: "3 min read",
    updated: "2026-09-09",
    priority: 0.6,
    isNew: false,
    interactive: false,
    partner: null
  },
  {
    slug: "resumeble-vs-resumeats-checklist",
    href: "/affiliate/resumeble-vs-resumeats-checklist.html",
    title: "Focused resume help vs broader support",
    seoTitle: "Focused resume help vs broader resume writing | Giorgi Codes",
    description: "A practical comparison of a focused one-job resume concierge and broader professional resume-writing support.",
    blurb: "One-job concierge compared with full professional writing.",
    category: "Job seekers",
    label: "Career",
    topic: "career",
    cats: [
      "career"
    ],
    icon: "🎯",
    format: "Checklist · 6 steps",
    readTime: "3 min read",
    updated: "2026-09-10",
    priority: 0.6,
    isNew: false,
    interactive: false,
    partner: null
  }
];

export const topics: { id: GuideTopic; label: string; icon: string }[] = [
  { id: 'web', label: 'Websites', icon: '🌐' },
  { id: 'ai', label: 'AI', icon: '🤖' },
  { id: 'biz', label: 'Small business', icon: '🏪' },
  { id: 'creative', label: 'Creative', icon: '🎬' },
  { id: 'family', label: 'Family', icon: '📚' },
  { id: 'career', label: 'Career', icon: '💼' },
];

/** Guides featured on the hub / home page (sitemap priority 0.9). */
export const featuredGuides = guides.filter((g) => g.priority >= 0.9);
