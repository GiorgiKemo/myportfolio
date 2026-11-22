import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { projects, skills } from './portfolioData.js';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

describe('portfolio project hierarchy', () => {
  it('shows the featured projects in the chosen order', () => {
    assert.deepEqual(
      projects.slice(0, 9).map((project) => project.slug),
      [
        'ats-friendly-resume-builder',
        'lashes-by-monika',
        'aixess-broker-mvp',
        'shemikete-auto-repair',
        'maiseli-winery',
        'aixco-global-website',
        'resumeats-app',
        'shemikete-app',
        'reachline-app',
      ],
    );
  });

  it('includes the current production and client projects from GitHub', () => {
    const slugs = new Set(projects.map((project) => project.slug));

    [
      'cdl-jobs-center',
      'ats-friendly-resume-builder',
      'solence-energy',
      'georgia-driver-alert',
      'aixco-global-website',
      'aixco-energy',
      'mlc-crm',
      'avital-chicago',
      'cornerstone-roofing-co',
      'aixess-broker-mvp',
      'loop-meeting-room-booking',
      'georgian-painters',
      'maiseli-winery',
      'soft-spot-studio',
      'finance-flow',
      'mcp-seo-audit',
      'life-idea',
    ].forEach((slug) => assert.ok(slugs.has(slug), `${slug} is missing`));
  });

  it('only includes websites with live links, and projects with previews', () => {
    projects.forEach((project) => {
      if (project.platform !== 'mobile') assert.ok(project.liveLink, `${project.slug} is missing a live link`);
      assert.ok(project.previewImage, `${project.slug} is missing a preview image`);
      assert.ok(
        project.previewImageDimensions?.width > 0 && project.previewImageDimensions?.height > 0,
        `${project.slug} is missing preview image dimensions`,
      );
      assert.ok(
        existsSync(join(projectRoot, 'public', project.previewImage)),
        `${project.slug} preview image does not exist`,
      );
    });

    assert.equal(projects.some((project) => project.slug === 'aixco-gateway'), false);
    assert.equal(projects.some((project) => project.slug === 'load-hawk-dev'), false);
    assert.equal(projects.some((project) => project.slug === 'monad-leaderboard'), false);
    assert.equal(projects.some((project) => project.slug === 'chatbot-demo'), false);
  });

  it('keeps private GitHub repos off public portfolio links', () => {
    const privateProjectsWithGithubLinks = projects.filter(
      (project) => project.visibility === 'private' && project.githubLink,
    );

    assert.deepEqual(privateProjectsWithGithubLinks, []);
  });
});

describe('portfolio skills', () => {
  it('reflects the current stack visible across GitHub projects', () => {
    const skillNames = new Set(skills.map((skill) => skill.name));

    [
      'TypeScript',
      'React',
      'Supabase',
      'PostgreSQL',
      'Stripe',
      'Vercel',
      'Astro',
      'AI Integrations',
      'SEO & Analytics',
      'Telegram Bots',
      'Docker',
    ].forEach((skill) => assert.ok(skillNames.has(skill), `${skill} is missing`));
  });
});
