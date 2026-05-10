import { motion as Motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <Motion.h2 
          className="section-title"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          About Me
        </Motion.h2>
        
        <div className="about-content">
          <Motion.div 
            className="about-text"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p>
              Hey there. I'm Giorgi, a full-stack developer focused on building complete web products that solve real business problems. My recent work includes CDL Jobs Center, an ATS-friendly resume builder, RoadReady driving-slot alerts, AIXCO websites, CRM dashboards, and local-business sites.
            </p>
            <p>
              My main stack is React, Next.js, TypeScript, Supabase, PostgreSQL, Stripe, Vercel, Tailwind CSS, and modern API integrations. I also work with AI services, Telegram automation, SEO, analytics, testing, and deployment workflows.
            </p>
            <p>
              I care about clean interfaces, reliable back-end flows, fast shipping, and production details like authentication, billing, data models, responsive design, and search visibility.
            </p>
          </Motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
