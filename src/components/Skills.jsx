import { motion as Motion } from 'framer-motion';
import { skills } from '../data/portfolioData';
import { techIcons } from '../data/techIcons';

const Skills = () => {
  return (
    <section id="skills" className="skills">
      <div className="container">
        <Motion.h2
          className="section-title"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          My Skills
        </Motion.h2>

        <Motion.div
          className="skills-container"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {skills.map((skill, index) => {
            const entryDelay = Math.min(0.1 * index, 0.3);
            const SkillIcon = techIcons[skill.icon] ?? techIcons.plug;

            return (
              <Motion.div
                key={skill.name}
                className="skill-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  opacity: { duration: 0.3, delay: entryDelay },
                  y: { duration: 0.3, delay: entryDelay },
                }}
                whileHover={{
                  scale: 1.05,
                  transition: {
                    type: 'tween',
                    duration: 0.12,
                    delay: 0,
                    ease: 'easeOut',
                  },
                }}
                style={{ willChange: 'transform' }}
              >
                <div className="skill-icon" style={{ color: skill.color }}>
                  <SkillIcon />
                </div>
                <h3>{skill.name}</h3>
              </Motion.div>
            );
          })}
        </Motion.div>
      </div>
    </section>
  );
};

export default Skills;
