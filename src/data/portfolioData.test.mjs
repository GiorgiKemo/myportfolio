import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import { projects, skills } from './portfolioData.js';

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

describe('portfolio project hierarchy', () => {
  it('orders projects from highest to lowest complexity', () => {
    assert.equal(projects[0].slug, 'cdl-jobs-center');

    for (let index = 1; index < projects.length; index += 1) {
      assert.ok(
        projects[index - 1].complexityScore >= projects[index].complexityScore,
        `${projects[index - 1].title} should rank above ${projects[index].title}`,
      );
    }
  });

  it('includes the current production and client projects from GitHub', () => {
    const slugs = new Set(projects.map((project) => project.slug));

    [
      'cdl-jobs-center',
      'ats-friendly-resume-builder',
      'georgia-driver-alert',
      'aixco-global-website',
      'aixco-energy',
      'mlc-crm',
      'avital-chicago',
      'cornerstone-roofing-co',
    ].forEach((slug) => assert.ok(slugs.has(slug), `${slug} is missing`));
  });

  it('only includes projects that have live previews', () => {
    projects.forEach((project) => {
      assert.ok(project.liveLink, `${project.slug} is missing a live link`);
      assert.ok(project.previewImage, `${project.slug} is missing a preview image`);
      assert.ok(
        existsSync(join(projectRoot, 'public', project.previewImage)),
        `${project.slug} preview image does not exist`,
      );
    });

    assert.equal(projects.some((project) => project.slug === 'aixco-gateway'), false);
    assert.equal(projects.some((project) => project.slug === 'load-hawk-dev'), false);
    assert.equal(projects.some((project) => project.slug === 'ilgcs-astro-rebuild'), false);
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
