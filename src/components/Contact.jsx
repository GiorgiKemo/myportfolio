import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [emailjsReady, setEmailjsReady] = useState(false);
  const form = useRef();

  // Initialize EmailJS when component mounts
  useEffect(() => {
    // Try to get from environment variables first
    let publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    // If not available in environment, use hardcoded fallback for GitHub Pages
    // Note: This is not ideal for security, but ensures functionality on GitHub Pages
    if (!publicKey) {
      console.warn('EmailJS public key not found in environment variables, using fallback');
      publicKey = '02CPxeXz4EuwYVpqv'; // Your public key
    }

    if (publicKey) {
      try {
        emailjs.init(publicKey);
        setEmailjsReady(true);
        console.log('EmailJS initialized successfully with key:', publicKey.substring(0, 4) + '...');
      } catch (error) {
        console.error('Failed to initialize EmailJS:', error);
      }
    } else {
      console.error('EmailJS public key is missing');
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    if (!emailjsReady) {
      console.error('EmailJS is not initialized');
      setSubmitStatus({ success: false, message: 'Email service is not available. Please try again later.' });
      setIsSubmitting(false);
      return;
    }

    // Using environment variables for EmailJS credentials
    let serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    let templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;

    // If not available in environment, use hardcoded fallback for GitHub Pages
    if (!serviceId) {
      console.warn('EmailJS service ID not found in environment variables, using fallback');
      serviceId = 'service_4nfbd67'; // Your service ID
    }

    if (!templateId) {
      console.warn('EmailJS template ID not found in environment variables, using fallback');
      templateId = 'template_p099j7y'; // Your template ID
    }

    if (!serviceId || !templateId) {
      console.error('EmailJS service ID or template ID is missing');
      setSubmitStatus({ success: false, message: 'Email service configuration error. Please try again later.' });
      setIsSubmitting(false);
      return;
    }

    // Prepare template parameters
    const templateParams = {
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message
    };

    // Use send method instead of sendForm for more control
    emailjs.send(serviceId, templateId, templateParams)
      .then((result) => {
        console.log('Email sent successfully:', result.text);
        setSubmitStatus({ success: true, message: 'Thank you for your message! I will get back to you soon.' });
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
      })
      .catch((error) => {
        console.error('Failed to send email:', error);
        setSubmitStatus({ success: false, message: 'Failed to send message. Please try again later.' });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <section id="contact" className="contact">
      <div className="container">
        <motion.h2
          className="section-title"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Get In Touch
        </motion.h2>

        <div className="contact-container">
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <div>
                <h3>Email</h3>
                <p>giorgikemoklidze1998@gmail.com</p>
              </div>
            </div>

            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <div>
                <h3>Phone</h3>
                <p>+995 596 33 33 16</p>
              </div>
            </div>

            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <div>
                <h3>Location</h3>
                <p>Tbilisi, Georgia</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="contact-form"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <form ref={form} onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              {submitStatus && (
                <div className={`submit-message ${submitStatus.success ? 'success' : 'error'}`}>
                  {submitStatus.message}
                </div>
              )}

              <button type="submit" className="btn" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
