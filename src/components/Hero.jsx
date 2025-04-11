import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { FaArrowDown } from 'react-icons/fa';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="hero-content">
          <motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-title"
          >
            Web Developer
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-subtitle"
          >
            Building digital experiences that are both highly functional and visually engaging
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="hero-buttons"
          >
            <Link to="projects" smooth={true} duration={800} offset={-70}>
              <button className="btn">View My Work</button>
            </Link>
            <Link to="contact" smooth={true} duration={800} offset={-70}>
              <button className="btn btn-outline">Contact Me</button>
            </Link>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="scroll-down"
        >
          <Link to="about" smooth={true} duration={800} offset={-70}>
            <FaArrowDown />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
