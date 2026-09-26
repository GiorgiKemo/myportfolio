import { motion as Motion } from 'framer-motion';
import { FaExternalLinkAlt, FaGithub, FaLock } from 'react-icons/fa';
import { projects } from '../data/portfolioData';
import { resolveProjectTagColor, resolveProjectTagIcon } from '../data/techIcons';

const Projects = () => {
  return (
    <section id="projects" className="projects">
      <div className="container">
        <Motion.h2
          className="section-title"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          My Projects
        </Motion.h2>

        <Motion.article
          className="agency-feature"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="agency-feature-copy">
            <p className="agency-feature-kicker">My studio · Featured</p>
            <h3>CleanWeb<br />Agency<span>.</span></h3>
            <p>I founded CleanWeb to bring design, development, and interactive 3D into one hands-on studio. Explore the experience and see what we can build together.</p>
            <a href="https://cleanweb-agency.vercel.app/" target="_blank" rel="noopener noreferrer" className="agency-feature-link">
              Explore CleanWeb <FaExternalLinkAlt aria-hidden="true" />
            </a>
          </div>
          <a href="https://cleanweb-agency.vercel.app/" target="_blank" rel="noopener noreferrer" className="agency-feature-preview" aria-label="Visit the CleanWeb Agency website">
            <img src="/project-previews/cleanweb-agency.png" alt="CleanWeb Agency homepage with its intertwined CW mark in 3D" width="1440" height="800" loading="lazy" />
          </a>
        </Motion.article>

        <div className="projects-grid">
          {projects.map((project, index) => {
            const entryDelay = Math.min(index * 0.1, 0.3);
            const liveLinkLabel = project.liveLinkLabel ?? 'Live Site';

            return (
              <Motion.div
                key={project.id}
                className="project-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  opacity: { duration: 0.4, delay: entryDelay },
                  y: { duration: 0.4, delay: entryDelay },
                }}
                whileHover={{
                  y: -10,
                  transition: { duration: 0.12, delay: 0, ease: 'easeOut' },
                }}
                style={{ willChange: 'transform' }}
              >
                <a
                  href={project.liveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-preview"
                  aria-label={`Open ${project.title} project link`}
                >
                  <img
                    src={project.previewImage}
                    alt={`${project.title} landing page preview`}
                    loading="lazy"
                  />
                </a>

                <div className="project-content">
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>

                  <div className="project-tags">
                    {project.tags.map((tag) => {
                      const TagIcon = resolveProjectTagIcon(tag);
                      const tagColor = resolveProjectTagColor(tag);

                      return (
                        <span
                          key={tag}
                          className="project-tag"
                          title={tag}
                          aria-label={tag}
                          style={{ color: tagColor }}
                        >
                          <TagIcon aria-hidden="true" />
                        </span>
                      );
                    })}
                  </div>

                  <div className="project-links">
                    {project.githubLink ? (
                      <a
                        href={project.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                      >
                        <FaGithub /> GitHub
                      </a>
                    ) : (
                      <span className="project-link project-link-muted">
                        <FaLock /> Private code
                      </span>
                    )}

                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-link"
                      >
                        <FaExternalLinkAlt /> {liveLinkLabel}
                      </a>
                    )}
                  </div>
                </div>
              </Motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Projects;
