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

        <div className="projects-grid">
          {projects.map((project, index) => {
            const entryDelay = Math.min(index * 0.1, 0.3);

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
                  aria-label={`Open ${project.title} live site`}
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
                        <FaExternalLinkAlt /> Live Site
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
