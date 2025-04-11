import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          About Me
        </motion.h2>
        
        <div className="about-content">
          <motion.div 
            className="about-text"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p>
              Hey there. I'm a web developer passionate about building digital experiences that are both highly functional and visually engaging. My core expertise lies in the JavaScript ecosystem, particularly using React for front-ends and Node.js for back-ends, alongside a strong command of HTML and CSS.
            </p>
            <p>
              I'm also proficient with various other programming languages and web technologies relevant to modern development. I genuinely enjoy tackling complex technical challenges to deliver smooth, intuitive user experiences.
            </p>
            <p>
              I'm always exploring new tools and techniques in web development and have a knack for explaining technical concepts clearly. If you have a web project in mind, let's talk about how I can help bring your vision to life.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
