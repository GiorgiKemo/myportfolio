import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <h3>Giorgi</h3>
            <p>Full-Stack Developer</p>
          </div>

          <div className="footer-social">
            <a href="https://github.com/GiorgiKemo" target="_blank" rel="noopener noreferrer" aria-label="GitHub profile">
              <FaGithub aria-hidden="true" />
            </a>
            <a href="https://www.linkedin.com/in/giorgi-kemoklidze-53383b263/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn profile">
              <FaLinkedin aria-hidden="true" />
            </a>
            <a href="https://x.com/GiorgiKem" target="_blank" rel="noopener noreferrer" aria-label="X profile">
              <FaXTwitter aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {currentYear} Giorgi. All Rights Reserved.</p>
          <p><a href="/affiliate/?utm_source=portfolio&utm_medium=owned&utm_campaign=affiliate_hub" onClick={() => window.gtag?.('event', 'affiliate_hub_click', { placement: 'footer', destination: '/affiliate/' })}>Learning resource guides</a></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
