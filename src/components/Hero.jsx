import { m as Motion } from 'framer-motion';
import { FaArrowDown, FaDatabase, FaRobot, FaRocket } from 'react-icons/fa';
import { FiCode, FiCpu, FiLayers } from 'react-icons/fi';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="hero-layout">
          <div className="hero-content">
            <Motion.h1
              initial={{ y: -50 }}
              animate={{ y: 0 }}
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
              <a href="#projects" className="btn">View My Work</a>
              <a href="#contact" className="btn btn-outline">Contact Me</a>
              <a
                className="btn btn-outline"
                href="/affiliate/?utm_source=portfolio&utm_medium=owned&utm_campaign=affiliate_hub"
                onClick={() => window.gtag?.('event', 'affiliate_hub_click', { placement: 'hero', destination: '/affiliate/' })}
              >
                Explore Practical Guides
              </a>
            </Motion.div>

            <Motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="hero-highlights"
              role="group"
              aria-label="Specialties"
            >
              <span><FiCode aria-hidden="true" /> Web Apps</span>
              <span><FaRobot aria-hidden="true" /> AI Tools</span>
              <span><FaDatabase aria-hidden="true" /> Supabase</span>
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
          <a href="#about" aria-label="Scroll to About section">
            <FaArrowDown aria-hidden="true" />
          </a>
        </Motion.div>
      </div>
    </section>
  );
};

export default Hero;
