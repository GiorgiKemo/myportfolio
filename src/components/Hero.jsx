import { motion as Motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { FaArrowDown } from 'react-icons/fa';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="hero-content">
          <Motion.h1
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-title"
          >
            Full-Stack Developer
          </Motion.h1>
          
          <Motion.p
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-subtitle"
          >
            Building production websites, AI tools, business dashboards, and Supabase-backed apps from idea to launch
          </Motion.p>
          
          <Motion.div
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
          </Motion.div>
        </div>
        
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="scroll-down"
        >
          <Link to="about" smooth={true} duration={800} offset={-70}>
            <FaArrowDown />
          </Link>
        </Motion.div>
      </div>
    </section>
  );
};

export default Hero;
