import { useState, useEffect } from 'react';
import { Link, animateScroll as scroll } from 'react-scroll';
import { FaBars, FaTimes } from 'react-icons/fa';
import { motion as Motion } from 'framer-motion';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const scrollToTop = () => {
    setIsOpen(false);
    scroll.scrollToTop({
      duration: 500,
      smooth: true,
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { id: 'home', text: 'Home' },
    { id: 'about', text: 'About' },
    { id: 'skills', text: 'Skills' },
    { id: 'projects', text: 'Projects' },
    { href: '/affiliate/', text: 'Resources', className: 'nav-resource' },
    { id: 'contact', text: 'Contact' },
  ];

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <nav className="navbar">
          <Motion.div 
            className="logo"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <button
              type="button"
              className="logo-link"
              aria-label="Go to home"
              onClick={scrollToTop}
            >
              <img
                src="/logo-gk.png"
                alt="Giorgi logo"
                className="logo-image"
                draggable="false"
              />
            </button>
          </Motion.div>

          <button
            type="button"
            className="menu-icon"
            aria-label={isOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-controls="primary-navigation"
            aria-expanded={isOpen}
            onClick={toggleMenu}
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>

          <Motion.ul 
            id="primary-navigation"
            className={`nav-links ${isOpen ? 'active' : ''}`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {navLinks.map((link, index) => (
              <Motion.li 
                key={link.id ?? link.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * (index + 1) }}
              >
                {link.href ? (
                  <a className={link.className} href={link.href} aria-label="Open practical resource guides">
                    {link.text}
                  </a>
                ) : link.id === 'home' ? (
                  <button type="button" className="nav-link-button" onClick={scrollToTop}>
                    {link.text}
                  </button>
                ) : (
                  <Link
                    to={link.id}
                    smooth={true}
                    duration={500}
                    offset={-70}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.text}
                  </Link>
                )}
              </Motion.li>
            ))}
          </Motion.ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
