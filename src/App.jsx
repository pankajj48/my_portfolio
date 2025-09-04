import React, { useState, useEffect, useRef } from 'react';
// Import the new CSS file
import './App.css';
// Dependencies
import Typewriter from 'https://esm.sh/typewriter-effect@2';
import Tsparticles, { initParticlesEngine } from "https://esm.sh/@tsparticles/react@3";
import { loadSlim } from "https://esm.sh/tsparticles-slim@2";
import Tilt from 'https://esm.sh/react-parallax-tilt@1';
import emailjs from 'https://esm.sh/@emailjs/browser@4';
// --- NEW: Import icons ---
import { FaReact, FaNodeJs, FaHtml5, FaCss3Alt, FaGitAlt, FaPython } from 'react-icons/fa';
import { SiJavascript, SiNextdotjs, SiExpress, SiFigma } from 'react-icons/si';
import { CgCPlusPlus } from "react-icons/cg";


// --- THEME COLORS (Used to set CSS variables) ---
const themes = {
  dark: {
    '--background': '#1C1C1C',
    '--text': '#EAEAEA',
    '--primary': '#F59E0B',
    '--secondary': '#D97706',
    '--surface': '#2A2A2A',
    '--border': '#333',
    '--hero-bg': '#1C1C1C',
    '--section-bg': '#2A2A2A',
    '--card-bg': '#2A2A2A',
    '--image-shadow': 'rgba(245, 158, 11, 0.2)',
    '--button-text': '#FFFFFF',
    '--logo-color': '#F59E0B',
    '--nav-link-hover-bg': '#2A2A2A',
    '--text-muted': '#8B949E',
    '--tooltip-bg': '#2A2A2A',
    '--tooltip-text': '#FFFFFF',
    '--title-head': 'white',
  },
  light: {
    '--background': '#FFF9F5', // Very light peach background
    '--text': '#5C3A21', // Dark brown for text
    '--primary': '#FFABAB', // Coral pink for primary actions
    '--secondary': '#FAD0C9', // Lighter pink
    '--surface': '#FFFFFF', // White for cards/surfaces
    '--border': '#FAD6A5', // Light peach for borders
    '--hero-bg': '#FFF9F5',
    '--section-bg': '#FFFFFF',
    '--card-bg': '#FFFFFF',
    '--image-shadow': 'rgba(255, 171, 171, 0.2)',
    '--button-text': '#5C3A21',
    '--logo-color': '#FF8686', // A slightly stronger pink for the logo
    '--nav-link-hover-bg': '#FFF0E8',
    '--text-muted': '#856A54', // Muted brown
    '--tooltip-bg': '#5C3A21',
    '--tooltip-text': '#FFFFFF', // Changed from 'black' for better contrast
    '--title-head': '#5C3A21', // Changed from 'black'
  }
};

// --- HELPER HOOKS ---
const useWindowSize = () => {
    const [size, setSize] = useState([window.innerWidth, window.innerHeight]);
    useEffect(() => {
        const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    return { width: size[0], height: size[1] };
};

const useFadeIn = (options = {}) => {
  const { threshold = 0.1 } = options;
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.unobserve(entry.target);
      }
    }, { threshold });

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => { if(currentRef) observer.unobserve(currentRef); };
  }, [threshold]);

  const style = {
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
  };

  return [ref, style, isVisible];
};

// --- DATA ---
const experience = [
  { date: 'May 2025 - June 2025', title: 'Front-End Developer Intern', company: ' Alphawizz Technology Pvt. Ltd.', description: 'Developed and deployed two React-based projects, improving page load performance by 30% and reducing UI bug reports by 40% Enhanced code reusability by 50% through adoption of component-based architecture, leading to faster development cycles across modules.' },
  { date: 'May 2024 – June 2024', title: 'Website Design and Development Intern', company: ' Internship Studio', description: ' Built a fully responsive e-commerce website, increasing mobile conversion rate by 35% Streamlined manufacturing processes, reducing production costs by 10%. Optimized frontend workflows, reducing load time by 30% and improving user engagement.' },
];
const education = [
  { date: '2022 - 2026', title: 'B.Tech in Computer Science', institution: 'IES IPS Academy indore', description: 'CGPA: 8.44' },
  { date: '2020 - 2021', title: 'Higher Secondary Education (Class XII)', institution: 'Govt. Model HS School Kailaras', description: 'Percentage: 86.8%' }
];
const projects = [
  { title: 'GitPulse', description: 'A sleek and powerful GitPulse web application to help you monitor and analyze activity across your Git repository with ease.', imageUrl: 'https://github.com/user-attachments/assets/9d11c0f5-6b38-4fa7-98c7-dc3433525a24', liveUrl: 'https://gitpulse-tgk7.onrender.com/', repoUrl: 'https://github.com/pankajj48/GitPulse.git' },
  { title: 'Plumbing', description: 'A responsive React-based plumbing website featuring product showcases and intuitive state-managed UI.', imageUrl: 'https://github.com/user-attachments/assets/62ee6e10-e066-46bd-bbcc-c2a014d0eb29', liveUrl: 'https://pankajj48.github.io/plumbing/', repoUrl: 'https://github.com/pankajj48/plumbing.git' },
  { title: 'YouTube Clone', description: 'An interactive video streaming UI built with React, featuring category filters, search, and responsive design', imageUrl: 'https://github.com/user-attachments/assets/6e24b84e-1e7b-4a76-bc42-17472145378c', liveUrl: 'https://pankajj48.github.io/YouTube-Clone/', repoUrl: 'https://github.com/pankajj48/YouTube-Clone.git' },
  { title: 'Wedding Planning Webpage', description: 'A visually rich and mobile-friendly wedding planning site built with HTML, CSS, Bootstrap, and Swiper.js.', imageUrl: 'https://github.com/user-attachments/assets/daba285b-a056-4310-969f-22c520d74756', liveUrl: 'https://pankajj48.github.io/Wed-webpage/', repoUrl: 'https://github.com/pankajj48/Wed-webpage.git' },
  { title: 'E-Commerce website', description: 'A modern, responsive online store built using HTML, CSS, and Bootstrap, showcasing product listings and banners. ', imageUrl: 'https://github.com/user-attachments/assets/d3c575e3-173e-422a-a4c9-00b623667983', liveUrl: 'https://pankajj48.github.io/Bhanukart/', repoUrl: 'https://github.com/pankajj48/Bhanukart.git' },
  { title: 'Expenses Tracker', description: 'A React-based tool to manage income and expenses with real-time balance updates and chart-based reporting.', imageUrl: 'https://github.com/user-attachments/assets/1d179547-dcdd-460f-b9ca-244b392ca2f6', liveUrl: 'https://projectexpenses.netlify.app/index.html', repoUrl: 'https://github.com/pankajj48/Expenses_tracker.git' },
];

// --- NEW: Modified skills data with icons ---
const skills = {
    frontend: [
        { name: 'HTML5', icon: <FaHtml5 size={40} /> },
        { name: 'CSS3', icon: <FaCss3Alt size={40} /> },
        { name: 'JavaScript', icon: <SiJavascript size={40} /> },
        { name: 'React', icon: <FaReact size={40} /> },
        { name: 'Next.js', icon: <SiNextdotjs size={40} /> },
    ],
    backend: [
        { name: 'Node.js', icon: <FaNodeJs size={40} /> },
        { name: 'Express', icon: <SiExpress size={40} /> },
    ],
    language: [
        { name: 'C++', icon: <CgCPlusPlus size={40} /> },
        { name: 'Python', icon: <FaPython size={40} /> },
    ],
    tools: [
        { name: 'Git', icon: <FaGitAlt size={40} /> },
        { name: 'Figma', icon: <SiFigma size={40} /> },
    ]
};

// --- HELPER COMPONENTS ---
const CustomCursor = () => {
  const cursorRef = useRef(null);
  useEffect(() => {
    const onMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = `${e.clientX}px`;
        cursorRef.current.style.top = `${e.clientY}px`;
      }
    };
    const onMouseOver = (e) => {
      if (e.target.closest('a, button')) {
        cursorRef.current?.classList.add('grow');
      }
    };
    const onMouseOut = (e) => {
      if (e.target.closest('a, button')) {
        cursorRef.current?.classList.remove('grow');
      }
    };
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
    };
  }, []);
  return <div ref={cursorRef} className="custom-cursor" />;
};

// --- NEW: SkillIcon component for the new design ---
const SkillIcon = ({ icon, name }) => (
    <div className="skill-icon-container">
        {icon}
        <span className="skill-tooltip">{name}</span>
    </div>
);

const TimelineItem = ({ data }) => {
    const [ref, style] = useFadeIn({ threshold: 0.5 });
    return (
        <div ref={ref} className="timeline-item" style={style}>
            <div className="timeline-dot"></div>
            <div className="timeline-content">
                <div className="timeline-date">{data.date}</div>
                <h3 className="timeline-title">{data.title}</h3>
                <h4 className="timeline-subtitle">{data.company || data.institution}</h4>
                <p className="timeline-text">{data.description}</p>
            </div>
        </div>
    );
};

const ProjectCard = ({ project }) => {
    const [ref, style] = useFadeIn({ threshold: 0.2 });
    return (
        <Tilt className="project-grid-item" tiltMaxAngleX={5} tiltMaxAngleY={5} perspective={1000} transitionSpeed={1500} scale={1.03}>
            <div ref={ref} className="project-card" style={style}>
                <img src={project.imageUrl} alt={project.title} className="project-image" />
                <div className="project-content">
                    <h3 className="project-title">{project.title}</h3>
                    <p className="project-description">{project.description}</p>
                    <div className="project-links">
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">Live Demo</a>
                        <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">GitHub Repo</a>
                    </div>
                </div>
            </div>
        </Tilt>
    );
};


// --- MAIN APP COMPONENT ---
export default function App() {
  const [init, setInit] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('portfolio-theme') || 'dark');
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { width } = useWindowSize();
  const isMobile = width <= 768;

  const appRef = useRef(null);
  const form = useRef();

  useEffect(() => {
    const themeColors = themes[theme];
    if (appRef.current) {
      for (const key in themeColors) {
        appRef.current.style.setProperty(key, themeColors[key]);
      }
    }
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);
  
  useEffect(() => {
    initParticlesEngine(async (engine) => {
        await loadSlim(engine);
    }).then(() => setInit(true));

    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
    
  useEffect(() => {
    if (!isMobile) setMobileMenuOpen(false);
  }, [isMobile]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };
  
  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  const sendEmail = (e) => {
    e.preventDefault();
    const serviceID = 'YOUR_SERVICE_ID';
    const templateID = 'YOUR_TEMPLATE_ID';
    const publicKey = 'YOUR_PUBLIC_KEY';

    emailjs.sendForm(serviceID, templateID, form.current, publicKey)
      .then((result) => {
          console.log('SUCCESS!', result.text);
          alert('Message sent successfully!');
          form.current.reset();
      }, (error) => {
          console.log('FAILED...', error.text);
          alert('Failed to send message. Please check your EmailJS IDs and try again.');
      });
  };

  const [aboutRef, aboutStyle] = useFadeIn({threshold: 0.2});
  const [expRef, expStyle, expVisible] = useFadeIn({threshold: 0.1});
  const [eduRef, eduStyle, eduVisible] = useFadeIn({threshold: 0.1});
  const [projectsRef, projectsStyle] = useFadeIn({threshold: 0.1});
  const [contactRef, contactStyle] = useFadeIn({threshold: 0.2});
  
const particlesOptions = {
    background: {
        color: {
            value: 'var(--background)'
        }
    },
    fpsLimit: 60,
    interactivity: {
        events: {
            onHover: {
                enable: true,
                mode: "repulse"
            }
        }
    },
    particles: {
        color: {
            value: 'var(--primary)'
        },
        links: {
            color: 'var(--text)',
            distance: 150,
            enable: true,
            opacity: 0.2,
            width: 1
        },
        move: {
            direction: "none",
            enable: true,
            outModes: "out",
            random: false,
            speed: 2,
            straight: false
        },
        number: {
            density: {
                enable: true
            },
            value: 80
        },
        opacity: {
            value: 0.5
        },
        shape: {
            type: "circle"
        },
        size: {
            value: { min: 1, max: 5 }
        }
    },
    detectRetina: true
};

  return (
    
    <div ref={appRef} className="app">
      {!isMobile && <CustomCursor />}
      {init && <Tsparticles id="tsparticles" options={particlesOptions} aria-hidden="true" />}
      
      <header className="header">
        <div className={`header-container ${isScrolled ? 'scrolled' : ''}`}>
          <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="logo">DevFolio</a>
          
          {isMobile ? (
            <div className="mobile-header-controls">
              <button onClick={toggleTheme} className="theme-toggle-button">
                  {theme === 'dark' ? '☀️' : '🌙'}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className="hamburger-button"
                aria-label="Toggle navigation"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-nav-menu"
              >
                  <div className={`hamburger-line ${isMobileMenuOpen ? 'open-1' : ''}`}></div>
                  <div className={`hamburger-line ${isMobileMenuOpen ? 'open-2' : ''}`}></div>
                  <div className={`hamburger-line ${isMobileMenuOpen ? 'open-3' : ''}`}></div>
              </button>
            </div>
          ) : (
            <nav className="nav">
              <a href="#about" onClick={(e) => handleNavClick(e, '#about')} className="nav-link">About</a>
              <a href="#experience" onClick={(e) => handleNavClick(e, '#experience')} className="nav-link">Experience</a>
              <a href="#projects" onClick={(e) => handleNavClick(e, '#projects')} className="nav-link">Projects</a>
              <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="nav-link">Contact</a>
              <button onClick={toggleTheme} className="theme-toggle-button">
                  {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </nav>
          )}
        </div>
      </header>
      
      {isMobileMenuOpen && <div className="mobile-nav-backdrop" onClick={() => setMobileMenuOpen(false)}></div>}
      
    <nav id="mobile-nav-menu" className={`mobile-nav-container ${isMobileMenuOpen ? 'open' : ''}`}>
      <a href="#about" onClick={(e) => handleNavClick(e, '#about')} className="mobile-nav-link">About</a>
      <a href="#experience" onClick={(e) => handleNavClick(e, '#experience')} className="mobile-nav-link">Experience</a>
      <a href="#projects" onClick={(e) => handleNavClick(e, '#projects')} className="mobile-nav-link">Projects</a>
      <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} className="mobile-nav-link">Contact</a>
    </nav>

      <main>
        <section id="home" className="hero">
          <span className="hero-greeting">Hello, I am</span>
          <h1 className="hero-title">Pankaj Namdev</h1>
          <div className="hero-subtitle">
            <Typewriter
              options={{
                strings: ['Creative Frontend Developer', 'UI/UX Enthusiast', 'React Specialist', 'Problem Solver'],
                autoStart: true,
                loop: true,
                delay: 75,
              }}
            />
          </div>
          <div className="hero-button-container">
            <a href="#projects" onClick={(e) => handleNavClick(e, '#projects')} className="hero-button">View My Work</a>
            <a href="/assets/PankajNamdev_FrontendDeveloper_Resume.pdf" download="PankajNamdev_Resume.pdf" className="secondary-button">Download Resume</a>
          </div>
          <div className="hero-socials">
             <a href="https://github.com/pankajj48" target="_blank" rel="noopener noreferrer" className="social-link">
                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="24" height="24"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
              </a>
              <a href="https://www.linkedin.com/in/pankajj48" target="_blank" rel="noopener noreferrer" className="social-link">
                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="24" height="24"><title>LinkedIn</title><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
              </a>
          </div>
        </section>

        <section id="about" className="section" ref={aboutRef} style={aboutStyle}>
          <div className="container">
            <h2 className="section-title">About Me</h2>
            <div className="about-container">
                <div className="about-image-container">
                    <img src="assets/1000038025.jpg" alt="Developer portrait" className="about-image" />
                </div>
                <div className="about-right">
                    <p className="about-text">I'm a passionate frontend developer with a knack for creating beautiful, functional, and user-centered digital experiences. I love turning complex problems into simple, elegant solutions that delight users and drive business goals.</p>
                    {/* --- NEW SKILLS ICONS IMPLEMENTATION --- */}
                    <div className="skills-icons-wrapper">
                        <h3 className="skills-title">Technologies I Use</h3>
                        <div className="skills-grid-icons">
                            {[...skills.frontend, ...skills.backend, ...skills.language, ...skills.tools].map(skill => (
                                <SkillIcon key={skill.name} icon={skill.icon} name={skill.name} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </section>
        
        <section id="experience" className="section alt-bg" ref={expRef} style={expStyle}>
            <div className="container">
                <h2 className="section-title">Career Journey</h2>
                <div className="timeline">
                    <div className="timeline-line" style={{ height: expVisible ? '100%' : '0%' }}></div>
                    {experience.map((item, index) => (
                        <TimelineItem key={index} data={item} />
                    ))}
                </div>
            </div>
        </section>

        <section id="projects" className="section" ref={projectsRef} style={projectsStyle}>
          <div className="container">
              <h2 className="section-title">My Creations</h2>
              <div className="project-grid">
                {projects.map((project, index) => (
                    <ProjectCard key={index} project={project} />
                ))}
              </div>
          </div>
        </section>
        
        <section id="education" className="section alt-bg" ref={eduRef} style={eduStyle}>
            <div className="container">
                <h2 className="section-title">Education</h2>
                 <div className="timeline">
                    <div className="timeline-line" style={{ height: eduVisible ? '100%' : '0%' }}></div>
                    {education.map((item, index) => (
                       <TimelineItem key={index} data={item} />
                    ))}
                </div>
            </div>
        </section>

        <section id="contact" className="section no-border" ref={contactRef} style={contactStyle}>
          <div className="container">
            <h2 className="section-title">Get In Touch</h2>
            <form ref={form} className="contact-form" onSubmit={sendEmail}>
              <input type="text" name="name" placeholder="Your Name" required className="form-input" />
              <input type="email" name="email" placeholder="Your Email" required className="form-input" />
              <textarea name="message" placeholder="Your Message" rows="6" required className="form-input"></textarea>
              <button type="submit" className="form-button">Send Message</button>
            </form>
          </div>
        </section>
      </main>
      
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Pankaj Namdev. All Rights Reserved.</p>
      </footer>
    </div>
  );
}