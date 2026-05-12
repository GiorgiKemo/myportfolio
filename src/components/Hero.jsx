import { motion as Motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { FaArrowDown, FaDatabase, FaRobot, FaRocket } from 'react-icons/fa';
import { FiCode, FiCpu, FiLayers } from 'react-icons/fi';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="hero-layout">
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

            <Motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="hero-highlights"
              aria-label="Specialties"
            >
              <span><FiCode /> Web Apps</span>
              <span><FaRobot /> AI Tools</span>
              <span><FaDatabase /> Supabase</span>
            </Motion.div>
          </div>

          <Motion.div
            initial={{ opacity: 0, x: 48 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="hero-art"
            aria-hidden="true"
          >
            <div className="art-window">
              <div className="art-window-top">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="art-code-line wide"></div>
              <div className="art-code-line medium"></div>
              <div className="art-code-line short"></div>
              <div className="art-stack">
                <div><FiLayers /> Frontend</div>
                <div><FiCpu /> Logic</div>
                <div><FaDatabase /> Data</div>
              </div>
            </div>
            <div className="art-metric art-metric-top">
              <FaRocket />
              <strong>Launch</strong>
              <span>production-ready</span>
            </div>
            <div className="art-metric art-metric-bottom">
              <FiCode />
              <strong>Build</strong>
              <span>clean interfaces</span>
            </div>
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
