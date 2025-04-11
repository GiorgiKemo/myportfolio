import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const Projects = () => {
  const projects = [
    {
      id: 1,
      title: 'Restaurant Landing Page',
      description: 'A modern, responsive landing page for a restaurant with menu, about, and contact sections.',
      tags: ['HTML', 'CSS', 'JavaScript'],
      githubLink: 'https://github.com/GiorgiKemo/restaurant-landing',
      liveLink: 'https://giorgikemo.github.io/restaurant-landing/'
    },
    {
      id: 2,
      title: 'Portfolio Website',
      description: 'A clean and professional portfolio website template for showcasing your work and skills.',
      tags: ['HTML', 'CSS', 'JavaScript'],
      githubLink: 'https://github.com/GiorgiKemo/portfolio-website',
      liveLink: 'https://giorgikemo.github.io/portfolio-website/'
    },
    {
      id: 3,
      title: 'Photography Portfolio',
      description: 'A visually stunning portfolio website for photographers to showcase their work.',
      tags: ['HTML', 'CSS', 'JavaScript'],
      githubLink: 'https://github.com/GiorgiKemo/photography-portfolio',
      liveLink: 'https://giorgikemo.github.io/photography-portfolio/'
    },
    {
      id: 4,
      title: 'Event Landing Page',
      description: 'A landing page for events with registration, schedule, and speaker information.',
      tags: ['HTML', 'CSS', 'JavaScript'],
      githubLink: 'https://github.com/GiorgiKemo/event-landing',
      liveLink: 'https://giorgikemo.github.io/event-landing/'
    },
    {
      id: 5,
      title: 'Corporate Website',
      description: 'A professional corporate website with services, team, and contact information.',
      tags: ['HTML', 'CSS', 'JavaScript'],
      githubLink: 'https://github.com/GiorgiKemo/corporate-website',
      liveLink: 'https://giorgikemo.github.io/corporate-website/'
    },
    {
      id: 6,
      title: 'Travel Blog',
      description: 'A travel blog website with articles, destinations, and travel tips.',
      tags: ['HTML', 'CSS', 'JavaScript'],
      githubLink: 'https://github.com/GiorgiKemo/travel-blog',
      liveLink: 'https://giorgikemo.github.io/travel-blog/'
    },
    {
      id: 7,
      title: 'Airdrops Georgia',
      description: 'A platform for tracking and discovering cryptocurrency airdrops in Georgia.',
      tags: ['React', 'Node.js', 'MongoDB'],
      githubLink: 'https://github.com/GiorgiKemo/airdrops-geo',
      liveLink: 'https://airdrops-geo.onrender.com/airdrops/67f3ff7c7af3b5e4c76b9354'
    }
  ];

  return (
    <section id="projects" className="projects">
      <div className="container">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          My Projects
        </motion.h2>
        
        <div className="projects-grid">
          {projects.map((project, index) => (
            <motion.div 
              key={project.id}
              className="project-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                
                <div className="project-tags">
                  {project.tags.map(tag => (
                    <span key={tag} className="project-tag">{tag}</span>
                  ))}
                </div>
                
                <div className="project-links">
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="project-link">
                    <FaGithub /> GitHub
                  </a>
                  <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="project-link">
                    <FaExternalLinkAlt /> Live Demo
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
