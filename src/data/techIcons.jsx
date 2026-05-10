import {
  FaCss3Alt,
  FaDatabase,
  FaBolt,
  FaChartLine,
  FaCloud,
  FaCube,
  FaFigma,
  FaGitAlt,
  FaHtml5,
  FaJs,
  FaNodeJs,
  FaPlug,
  FaReact,
  FaRobot,
} from 'react-icons/fa';
import {
  SiAstro,
  SiDocker,
  SiMongodb,
  SiNextdotjs,
  SiPostgresql,
  SiPython,
  SiStripe,
  SiSupabase,
  SiTailwindcss,
  SiTelegram,
  SiTypescript,
  SiVercel,
} from 'react-icons/si';

export const techIcons = {
  analytics: FaChartLine,
  astro: SiAstro,
  cloud: FaCloud,
  css: FaCss3Alt,
  database: FaDatabase,
  docker: SiDocker,
  figma: FaFigma,
  git: FaGitAlt,
  html: FaHtml5,
  javascript: FaJs,
  mongodb: SiMongodb,
  nextjs: SiNextdotjs,
  node: FaNodeJs,
  plug: FaPlug,
  postgresql: SiPostgresql,
  python: SiPython,
  react: FaReact,
  robot: FaRobot,
  spark: FaBolt,
  stripe: SiStripe,
  supabase: SiSupabase,
  tailwind: SiTailwindcss,
  telegram: SiTelegram,
  typescript: SiTypescript,
  vercel: SiVercel,
  web3: FaCube,
};

export const techIconColors = {
  analytics: '#F9AB00',
  astro: '#FF5D01',
  cloud: '#2563EB',
  css: '#1572B6',
  database: '#4479A1',
  docker: '#2496ED',
  figma: '#A259FF',
  git: '#F05032',
  html: '#E34F26',
  javascript: '#F7DF1E',
  mongodb: '#47A248',
  nextjs: '#111111',
  node: '#339933',
  plug: '#4F46E5',
  postgresql: '#336791',
  python: '#3776AB',
  react: '#61DAFB',
  robot: '#6E40C9',
  spark: '#4285F4',
  stripe: '#635BFF',
  supabase: '#3ECF8E',
  tailwind: '#06B6D4',
  telegram: '#26A5E4',
  typescript: '#3178C6',
  vercel: '#111111',
  web3: '#8247E5',
};

const projectTagAliases = {
  ai: 'robot',
  'ai api': 'robot',
  'ai matching': 'robot',
  automation: 'spark',
  crm: 'database',
  'framer motion': 'react',
  'google ai': 'spark',
  'hugging face': 'spark',
  leaderboard: 'analytics',
  'next.js': 'nextjs',
  'pdf export': 'database',
  'react hook form': 'react',
  'tailwind css': 'tailwind',
  'telegram bot': 'telegram',
  vite: 'javascript',
  web3: 'web3',
};

const normalizeTag = (tag) => tag.trim().toLowerCase();

export const resolveProjectTagIcon = (tag) => {
  const normalizedTag = normalizeTag(tag);
  const iconKey = projectTagAliases[normalizedTag] ?? normalizedTag;

  return techIcons[iconKey] ?? techIcons.plug;
};

export const resolveProjectTagColor = (tag) => {
  const normalizedTag = normalizeTag(tag);
  const iconKey = projectTagAliases[normalizedTag] ?? normalizedTag;

  return techIconColors[iconKey] ?? techIconColors.plug;
};
