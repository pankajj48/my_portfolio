import React, { useState, useEffect, useRef } from 'react';
// Dependencies: npm install typewriter-effect react-tsparticles tsparticles-slim react-parallax-tilt
import Typewriter from 'https://esm.sh/typewriter-effect@2';
import Tsparticles, { initParticlesEngine } from "https://esm.sh/@tsparticles/react@3";
import { loadSlim } from "https://esm.sh/tsparticles-slim@2";
import Tilt from 'https://esm.sh/react-parallax-tilt@1';


// --- Global Styles Component to fix layout issues ---
const GlobalStyles = ({ theme }) => (
  <style>{`
    html,
    body {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      width: 100%;
      overflow-x: hidden;
      scroll-behavior: smooth; /* Fallback smooth scrolling */
    }
    .Typewriter__cursor {
      color: ${theme.primary};
      font-size: 2rem;
    }
  `}</style>
);

// --- THEME COLORS ---
const themes = {
  dark: {
    background: '#1C1C1C',
    text: '#EAEAEA',
    primary: '#F59E0B',
    secondary: '#D97706',
    surface: '#2A2A2A',
    border: '#333',
    heroBg: '#1C1C1C',
    sectionBg: '#2A2A2A',
    cardBg: '#2A2A2A',
    buttonText: '#FFFFFF',
    logoColor: '#F59E0B',
    navLinkHoverBg: '#2A2A2A',
    timelineLine: 'linear-gradient(180deg, #F59E0B, #D97706)',
    timelineDot: '#F59E0B',
    imageShadow: 'rgba(245, 158, 11, 0.2)',
  },
  light: {
    background: '#F5F5DC', // Beige background
    text: '#3D2B1F', // Dark brown text
    primary: '#8B4513', // Saddle brown accent
    secondary: '#A0522D', // Sienna accent
    surface: '#FFFFFF',
    border: '#D2B48C', // Tan border
    heroBg: '#F5F5DC',
    sectionBg: '#FFFFFF',
    cardBg: '#FFFFFF',
    buttonText: '#FFFFFF',
    logoColor: '#8B4513',
    navLinkHoverBg: '#EADDCA',
    timelineLine: 'linear-gradient(180deg, #8B4513, #A0522D)',
    timelineDot: '#8B4513',
    imageShadow: 'rgba(139, 69, 19, 0.2)',
  }
};


// STYLES - All styles are defined as JavaScript objects (CSS-in-JS)
const styles = (theme) => ({
  // Global and Layout
  app: {
    backgroundColor: theme.background,
    color: theme.text,
    fontFamily: "'Inter', sans-serif",
    lineHeight: 1.7,
    cursor: 'none',
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 2rem',
  },
  section: {
    padding: '6rem 0',
    position: 'relative',
    zIndex: 2,
    width: '100%',
    borderBottom: `1px solid ${theme.border}`,
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: 'clamp(2rem, 5vw, 2.5rem)',
    marginBottom: '4rem',
    fontWeight: 700,
    color: theme.primary,
    position: 'relative',
    paddingBottom: '1rem',
  },
  sectionTitleAfter: {
    content: '""',
    position: 'absolute',
    width: '80px',
    height: '4px',
    background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`,
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    borderRadius: '2px',
  },

  // Custom Cursor
  cursor: (position) => ({
    width: '25px',
    height: '25px',
    border: `2px solid ${theme.primary}`,
    borderRadius: '50%',
    position: 'fixed',
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: 'translate(-50%, -50%)',
    pointerEvents: 'none',
    zIndex: 9999,
    transition: 'width 0.2s, height 0.2s, background-color 0.2s, transform 0.2s',
  }),
  cursorGrow: {
    transform: 'translate(-50%, -50%) scale(2)',
    backgroundColor: theme.imageShadow,
  },

  // Header
  header: {
    position: 'fixed',
    top: '1.5rem',
    left: '50%',
    transform: 'translateX(-50%)',
    width: 'auto',
    zIndex: 1000,
  },
  headerContainer: (isScrolled) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
    padding: '0.5rem',
    minWidth: '200px',
    borderRadius: '50px',
    backgroundColor: isScrolled ? (theme.background === '#1C1C1C' ? 'rgba(28, 28, 28, 0.7)' : 'rgba(245, 245, 220, 0.7)') : 'rgba(28, 28, 28, 0.4)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    border: `1px solid ${theme.border}`,
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.37)',
    transition: 'background-color 0.3s ease',
  }),
  logo: {
    fontWeight: 700,
    fontSize: '1.25rem',
    color: theme.logoColor,
    textDecoration: 'none',
    padding: '0.5rem 1rem',
  },
  nav: {
    display: 'flex',
    gap: '0.25rem',
  },
  navLink: {
    color: theme.text,
    textDecoration: 'none',
    fontWeight: 500,
    padding: '0.5rem 1rem',
    borderRadius: '50px',
    position: 'relative',
    transition: 'color 0.3s, background-color 0.3s',
  },
  navLinkHover: {
    color: theme.buttonText,
    backgroundColor: theme.navLinkHoverBg,
  },
  themeToggleButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'none',
    padding: '0.5rem',
    fontSize: '1.2rem',
  },
    
  // --- NEW: Mobile Navigation Styles ---
  hamburgerButton: {
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'none',
    padding: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
    width: '2rem',
    height: '2rem',
    zIndex: 1002,
  },
  hamburgerLine: {
    width: '2rem',
    height: '0.25rem',
    background: theme.primary,
    borderRadius: '10px',
    transition: 'all 0.3s linear',
    position: 'relative',
    transformOrigin: '1px',
  },
  mobileNavBackdrop: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },
  mobileNavContainer: (isOpen) => ({
    position: 'fixed',
    top: 0,
    right: 0,
    height: '100vh',
    width: '250px',
    backgroundColor: theme.surface,
    padding: '4rem 2rem',
    zIndex: 1001,
    transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
    transition: 'transform 0.3s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
  }),
  mobileNavLink: {
     fontSize: '1.5rem',
     color: theme.primary,
     textDecoration: 'none',
     fontWeight: 600,
  },


  // Hero Section
  hero: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: '0 2rem',
    position: 'relative',
    backgroundColor: theme.heroBg,
  },
  tsparticles: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
  },
  heroGreeting: {
    fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
    fontWeight: 500,
    color: theme.text,
    marginBottom: '0.5rem',
  },
  heroTitle: {
    fontSize: 'clamp(3rem, 10vw, 5rem)',
    fontWeight: 800,
    marginBottom: '1rem',
    background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    zIndex: 1,
    transform: 'translateZ(0)', // Force GPU rendering layer to fix clipping bug
  },
  heroSubtitle: {
    fontSize: 'clamp(1.25rem, 4vw, 1.75rem)',
    color: theme.text,
    marginBottom: '2.5rem',
    minHeight: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  heroButtonContainer: {
    display: 'flex',
    gap: '1.5rem',
    marginTop: '1rem',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  heroButton: (isHovered) => ({
    padding: '1rem 3rem',
    background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`,
    color: theme.buttonText,
    border: 'none',
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'none',
    textDecoration: 'none',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
    boxShadow: isHovered ? `0 10px 20px ${theme.imageShadow}` : `0 4px 15px ${theme.imageShadow}`,
    zIndex: 1,
  }),
  secondaryButton: (isHovered) => ({
    padding: '1rem 3rem',
    backgroundColor: 'transparent',
    color: theme.primary,
    border: `2px solid ${theme.primary}`,
    borderRadius: '50px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'none',
    textDecoration: 'none',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
    transform: isHovered ? 'translateY(-5px)' : 'translateY(0)',
    boxShadow: isHovered ? `0 10px 20px ${theme.imageShadow}` : 'none',
    backgroundColor: isHovered ? theme.imageShadow : 'transparent',
    zIndex: 1,
  }),
  heroSocials: {
    marginTop: '2.5rem',
    display: 'flex',
    gap: '1.5rem',
  },
  socialLink: {
    color: theme.text,
    fontSize: '1.5rem',
    transition: 'color 0.3s ease, transform 0.3s ease',
  },

  // About & Skills Section
  aboutContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '4rem',
    alignItems: 'center',
  },
  aboutImageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aboutImage: {
    width: '280px',
    height: '280px',
    borderRadius: '16px',
    objectFit: 'cover',
    border: `2px solid ${theme.border}`,
    boxShadow: `0 0 35px ${theme.imageShadow}`,
  },
  aboutRight: {
    display: 'flex',
    flexDirection: 'column',
  },
  aboutText: {
    textAlign: 'left',
    fontSize: '1.1rem',
    color: theme.text,
    marginBottom: '2rem',
  },
  skillsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
    gap: '1.5rem',
  },
  skillIconWrapper: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.surface,
    padding: '1rem',
    borderRadius: '12px',
    border: `1px solid ${theme.border}`,
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  },
  skillTooltip: {
    position: 'absolute',
    bottom: '110%',
    left: '50%',
    transform: 'translateX(-50%)',
    backgroundColor: '#2A2A2A',
    color: '#FFFFFF',
    padding: '0.5rem 1rem',
    borderRadius: '6px',
    fontSize: '0.9rem',
    whiteSpace: 'nowrap',
    opacity: 0,
    visibility: 'hidden',
    transition: 'opacity 0.3s ease, visibility 0.3s ease',
  },

  // Experience & Education Timeline
  timeline: {
    position: 'relative',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem 0',
  },
  timelineLine: (isVisible) => ({
    content: '""',
    position: 'absolute',
    width: '3px',
    background: `linear-gradient(180deg, ${theme.primary}, ${theme.secondary})`,
    top: 0,
    left: '8px',
    height: isVisible ? '100%' : '0%',
    transition: 'height 1s ease-out',
  }),
  timelineItem: {
    paddingLeft: '3rem',
    position: 'relative',
    marginBottom: '3rem',
  },
  timelineDot: {
    content: '""',
    position: 'absolute',
    width: '16px',
    height: '16px',
    left: '0px',
    backgroundColor: theme.primary,
    top: '5px',
    borderRadius: '50%',
    zIndex: 1,
  },
  timelineContent: {
    position: 'relative',
  },
  timelineDate: {
    color: '#8B949E',
    fontWeight: 500,
    marginBottom: '0.5rem',
  },
  timelineTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: theme.text,
  },
  timelineSubtitle: {
    color: theme.text,
    marginBottom: '1rem',
    fontStyle: 'italic',
  },
  timelineText: {
    color: theme.text,
  },

  // Projects Section
  projectGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem',
  },
  projectCard: {
    backgroundColor: theme.surface,
    borderRadius: '12px',
    overflow: 'hidden',
    border: `1px solid ${theme.border}`,
    transition: 'transform 0.3s ease, border-color 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  projectImage: {
    width: '100%',
    height: '220px',
    objectFit: 'cover',
  },
  projectContent: {
    padding: '1.5rem',
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
  },
  projectTitle: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: theme.text,
    marginBottom: '0.5rem',
  },
  projectDescription: {
    color: theme.text,
    marginBottom: '1.5rem',
    flexGrow: 1,
  },
  projectLinks: {
    display: 'flex',
    gap: '1rem',
    marginTop: 'auto',
  },
  projectLink: {
    color: theme.primary,
    textDecoration: 'none',
    fontWeight: 600,
    transition: 'color 0.3s',
  },

  // Contact Section & Footer
  contactForm: { maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' },
  formInput: { width: '100%', padding: '1rem', backgroundColor: theme.surface, border: `1px solid ${theme.border}`, borderRadius: '8px', color: theme.text, fontSize: '1rem', transition: 'border-color 0.3s, box-shadow 0.3s' },
  formButton: { padding: '1rem', background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`, color: theme.buttonText, border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: 600, cursor: 'none', transition: 'opacity 0.3s ease' },
  footer: { textAlign: 'center', padding: '3rem', fontSize: '0.9rem', color: '#8B949E', borderTop: `1px solid ${theme.border}` }
});

// --- SVG ICONS ---
const icons = {
  HTML5: () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#E34F26" width="48" height="48"><title>HTML5</title><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622-13.234.002.69 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/></svg>,
  CSS3: () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#1572B6" width="48" height="48"><title>CSS3</title><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.565-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622-13.234.002.69 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/></svg>,
  JavaScript: () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#F7DF1E" width="48" height="48"><title>JavaScript</title><path d="M0 0h24v24H0V0zm22.05 19.95H1.95V4.05h20.1v15.9zM12 9.75c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5zm5.25 0c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z"/></svg>,
  React: () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#61DAFB" width="48" height="48"><title>React</title><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8zm-4.002-9.414a.999.999 0 0 1 1.414 0L12 13.172l2.586-2.586a.999.999 0 1 1 1.414 1.414L13.414 14.5l2.586 2.586a.999.999 0 1 1-1.414 1.414L12 15.914l-2.586 2.586a.999.999 0 1 1-1.414-1.414L10.586 14.5 8.002 11.914a.999.999 0 0 1 0-1.414z"/></svg>,
  TypeScript: () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#3178C6" width="48" height="48"><title>TypeScript</title><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm18.59 14.898H20.5v-3.06h-1.91v3.06zm-3.82 0h1.91v-3.06h-1.91v3.06zM12 17.808l-3.82-1.035.23-2.718 3.59.963V7.002H8.532V4.38H15.47v10.518z"/></svg>,
  NextJS: () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#000000" width="48" height="48"><title>Next.js</title><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm-1-17.914V18h2V8.385l4.646 5.357.707-.707L12.707 6.086A1 1 0 0 0 11.293 6.086L7.646 12.028l.707.707L13 8.385V18h-2V4.086z"/></svg>,
  NodeJS: () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#339933" width="48" height="48"><title>Node.js</title><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.04 15.61c-.48.28-1.06.44-1.7.44-1.48 0-2.69-1.21-2.69-2.69s1.21-2.69 2.69-2.69c.64 0 1.22.16 1.7.44l.96-1.5c-.7-.44-1.56-.69-2.66-.69-2.48 0-4.49 2.01-4.49 4.49s2.01 4.49 4.49 4.49c1.1 0 1.96-.25 2.66-.69l-.96-1.5zm4.84-1.5h-2.2v-1.9h2.2v-2.2h1.9v2.2h2.2v1.9h-2.2v2.2h-1.9v-2.2z"/></svg>,
  Git: () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#F05032" width="48" height="48"><title>Git</title><path d="M22.81 10.584l-2.4-2.4a1.5 1.5 0 0 0-2.12 0l-6.166 6.166a1.5 1.5 0 0 0 0 2.12l2.4 2.4a1.5 1.5 0 0 0 2.12 0l6.166-6.166a1.5 1.5 0 0 0 0-2.12zM12.001 2.001a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16z"/></svg>,
  Figma: () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="#F24E1E" width="48" height="48"><title>Figma</title><path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zM8.25 12a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0zm3.75-6a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5z"/></svg>,
  GitHub: () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="24" height="24"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>,
  LinkedIn: () => <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" width="24" height="24"><title>LinkedIn</title><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>,
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
  { title: 'Plumbing', description: 'A responsive React-based plumbing website featuring product showcases and intuitive state-managed UI.', imageUrl: 'https://github.com/user-attachments/assets/62ee6e10-e066-46bd-bbcc-c2a014d0eb29', liveUrl: 'https://pankajj48.github.io/plumbing/', repoUrl: 'https://github.com/pankajj48/plumbing.git' },
  { title: 'YouTube Clone', description: 'An interactive video streaming UI built with React, featuring category filters, search, and responsive design', imageUrl: 'https://github.com/user-attachments/assets/6e24b84e-1e7b-4a76-bc42-17472145378c', liveUrl: 'https://pankajj48.github.io/YouTube-Clone/', repoUrl: 'https://github.com/pankajj48/YouTube-Clone.git' },
  { title: 'Wedding Planning Webpage', description: 'A visually rich and mobile-friendly wedding planning site built with HTML, CSS, Bootstrap, and Swiper.js.', imageUrl: 'https://github.com/user-attachments/assets/daba285b-a056-4310-969f-22c520d74756', liveUrl: 'https://pankajj48.github.io/Wed-webpage/', repoUrl: 'https://github.com/pankajj48/Wed-webpage.git' },
  { title: 'E-Commerce website', description: 'A modern, responsive online store built using HTML, CSS, and Bootstrap, showcasing product listings and banners. ', imageUrl: 'https://github.com/user-attachments/assets/d3c575e3-173e-422a-a4c9-00b623667983', liveUrl: 'https://pankajj48.github.io/Bhanukart/', repoUrl: 'https://github.com/pankajj48/Bhanukart.git' },
  { title: 'Expenses Tracker', description: 'A React-based tool to manage income and expenses with real-time balance updates and chart-based reporting.', imageUrl: 'https://github.com/user-attachments/assets/1d179547-dcdd-460f-b9ca-244b392ca2f6', liveUrl: 'https://projectexpenses.netlify.app/index.html', repoUrl: 'https://github.com/pankajj48/Expenses_tracker.git' },
  { title: 'Quiz Website', description: 'A fully responsive and interactive  Quiz Application that allows users to answer multiple-choice questions', imageUrl: 'https://github.com/user-attachments/assets/3dc990b3-0fc1-45b0-8b97-41b20ba4a6ca', liveUrl: 'https://pankajj48.github.io/QUIZ-APPLICATION', repoUrl: 'https://github.com/pankajj48/QUIZ-APPLICATION.git' },
];

const skills = {
    frontend: ['HTML5', 'CSS3', 'JavaScript', 'React', 'TypeScript', 'NextJS'],
    backend: ['NodeJS'],
    tools: ['Git', 'Figma']
};


// --- HELPER HOOKS & COMPONENTS ---

// --- NEW: Custom hook to get window size ---
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

const NavLink = ({ href, children, onMouseEnter, onMouseLeave, onClick, theme }) => {
  const [isHovered, setIsHovered] = useState(false);
  const linkStyle = { ...styles(theme).navLink, ...(isHovered ? styles(theme).navLinkHover : {}) };
  return (
    <a href={href} style={linkStyle} onClick={onClick} onMouseEnter={() => {setIsHovered(true); onMouseEnter();}} onMouseLeave={() => {setIsHovered(false); onMouseLeave();}}>
      {children}
    </a>
  );
};

const TimelineItem = ({ data, theme }) => {
    const [ref, style] = useFadeIn({ threshold: 0.5 });
    return (
        <div ref={ref} style={{...styles(theme).timelineItem, ...style}}>
            <div style={styles(theme).timelineDot}></div>
            <div style={styles(theme).timelineContent}>
                <div style={styles(theme).timelineDate}>{data.date}</div>
                <h3 style={styles(theme).timelineTitle}>{data.title}</h3>
                <h4 style={styles(theme).timelineSubtitle}>{data.company || data.institution}</h4>
                <p style={styles(theme).timelineText}>{data.description}</p>
            </div>
        </div>
    );
};

const CustomCursor = ({ theme }) => {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const onMouseMove = (e) => setPosition({ x: e.clientX, y: e.clientY });

    const onMouseOver = (e) => {
        if (e.target.closest('a, button')) {
            setIsHovering(true);
        }
    };
    const onMouseOut = (e) => {
        if (e.target.closest('a, button')) {
            setIsHovering(false);
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

  return <div style={{...styles(theme).cursor(position), ...(isHovering ? styles(theme).cursorGrow : {})}} />;
};

const ProjectCard = ({ project, theme }) => {
    const [ref, style] = useFadeIn({ threshold: 0.2 });
    return (
        <Tilt tiltMaxAngleX={5} tiltMaxAngleY={5} perspective={1000} transitionSpeed={1500} scale={1.03}>
            <div ref={ref} style={{...styles(theme).projectCard, ...style}}>
                <img src={project.imageUrl} alt={project.title} style={styles(theme).projectImage} />
                <div style={styles(theme).projectContent}>
                    <h3 style={styles(theme).projectTitle}>{project.title}</h3>
                    <p style={styles(theme).projectDescription}>{project.description}</p>
                    <div style={styles(theme).projectLinks}>
                        <a href={project.liveUrl} style={styles(theme).projectLink} target="_blank" rel="noopener noreferrer">Live Demo</a>
                        <a href={project.repoUrl} style={styles(theme).projectLink} target="_blank" rel="noopener noreferrer">GitHub Repo</a>
                    </div>
                </div>
            </div>
        </Tilt>
    );
}

const SkillIcon = ({ name, theme }) => {
    const [isHovered, setIsHovered] = useState(false);
    const IconComponent = icons[name];
    const wrapperStyle = {
        ...styles(theme).skillIconWrapper,
        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
        boxShadow: isHovered ? `0 8px 20px ${theme.imageShadow}` : 'none',
    };
    const tooltipStyle = {
        ...styles(theme).skillTooltip,
        opacity: isHovered ? 1 : 0,
        visibility: isHovered ? 'visible' : 'hidden',
    };

    return (
        <div style={wrapperStyle} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
            {IconComponent && <IconComponent />}
            <div style={tooltipStyle}>{name}</div>
        </div>
    );
};


// --- MAIN APP COMPONENT ---
export default function App() {
  const [init, setInit] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('portfolio-theme') || 'dark');
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false); // NEW state for mobile menu
  const { width } = useWindowSize(); // NEW hook usage
  const isMobile = width <= 768; // NEW mobile breakpoint check

  const currentTheme = themes[theme];
  const currentStyles = styles(currentTheme);

  useEffect(() => {
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
    
  // Close mobile menu if window is resized to be larger than mobile
  useEffect(() => {
    if (!isMobile) {
      setMobileMenuOpen(false);
    }
  }, [isMobile]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false); // Close mobile menu on link click
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const [aboutRef, aboutStyle] = useFadeIn({threshold: 0.2});
  const [expRef, expStyle, expVisible] = useFadeIn({threshold: 0.1});
  const [eduRef, eduStyle, eduVisible] = useFadeIn({threshold: 0.1});
  const [projectsRef, projectsStyle] = useFadeIn({threshold: 0.1});
  const [contactRef, contactStyle] = useFadeIn({threshold: 0.2});

  const particlesOptions = {
    background: { opacity: 0 },
    fpsLimit: 60,
    interactivity: {
      events: { onHover: { enable: true, mode: 'grab' }, resize: true },
      modes: { grab: { distance: 140, links: { opacity: 0.5 } } },
    },
    particles: {
      color: { value: theme === 'dark' ? '#30363D' : '#D2B48C' },
      links: { color: theme === 'dark' ? '#30363D' : '#D2B48C', distance: 150, enable: true, opacity: 0.2, width: 1 },
      move: { direction: 'none', enable: true, outModes: { default: 'bounce' }, random: false, speed: 1, straight: false },
      number: { density: { enable: true, area: 800 }, value: 40 },
      opacity: { value: 0.2 },
      shape: { type: 'circle' },
      size: { value: { min: 1, max: 3 } },
    },
    detectRetina: true,
  };

  return (
    <div style={currentStyles.app}>
      <GlobalStyles theme={currentTheme} />
      <CustomCursor theme={currentTheme} />
      {init && <Tsparticles id="tsparticles" options={particlesOptions} />}
      
      <header style={currentStyles.header}>
        <div style={{...currentStyles.headerContainer(isScrolled), paddingRight: isMobile ? '1rem' : '0.5rem'}}>
          <a href="#home" onClick={(e) => handleNavClick(e, '#home')} style={currentStyles.logo}>DevFolio</a>
          
          {/* --- MODIFIED: Conditional rendering for nav --- */}
          {isMobile ? (
            <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                <button onClick={toggleTheme} style={currentStyles.themeToggleButton}>
                    {theme === 'dark' ? '☀️' : '🌙'}
                </button>
                <button onClick={() => setMobileMenuOpen(!isMobileMenuOpen)} style={currentStyles.hamburgerButton}>
                    <div style={currentStyles.hamburgerLine}></div>
                    <div style={currentStyles.hamburgerLine}></div>
                    <div style={currentStyles.hamburgerLine}></div>
                </button>
            </div>
          ) : (
            <nav style={currentStyles.nav}>
              <NavLink href="#about" onClick={(e) => handleNavClick(e, '#about')} theme={currentTheme}>About</NavLink>
              <NavLink href="#experience" onClick={(e) => handleNavClick(e, '#experience')} theme={currentTheme}>Experience</NavLink>
              <NavLink href="#projects" onClick={(e) => handleNavClick(e, '#projects')} theme={currentTheme}>Projects</NavLink>
              <NavLink href="#contact" onClick={(e) => handleNavClick(e, '#contact')} theme={currentTheme}>Contact</NavLink>
              <button onClick={toggleTheme} style={currentStyles.themeToggleButton}>
                  {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </nav>
          )}
        </div>
      </header>
      
      {/* --- NEW: Mobile Sidebar --- */}
      {isMobile && isMobileMenuOpen && (
        <div style={currentStyles.mobileNavBackdrop} onClick={() => setMobileMenuOpen(false)}></div>
      )}
      <nav style={currentStyles.mobileNavContainer(isMobileMenuOpen)}>
          <a href="#about" onClick={(e) => handleNavClick(e, '#about')} style={currentStyles.mobileNavLink}>About</a>
          <a href="#experience" onClick={(e) => handleNavClick(e, '#experience')} style={currentStyles.mobileNavLink}>Experience</a>
          <a href="#projects" onClick={(e) => handleNavClick(e, '#projects')} style={currentStyles.mobileNavLink}>Projects</a>
          <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')} style={currentStyles.mobileNavLink}>Contact</a>
      </nav>

      <main>
        <section id="home" style={currentStyles.hero}>
          <span style={currentStyles.heroGreeting}>Hello, I am</span>
          <h1 key={theme} style={currentStyles.heroTitle}>Pankaj Namdev</h1>
          <div style={currentStyles.heroSubtitle}>
            <Typewriter
              options={{
                strings: ['Creative Frontend Developer', 'UI/UX Enthusiast', 'React Specialist', 'Problem Solver'],
                autoStart: true,
                loop: true,
                delay: 75,
              }}
            />
          </div>
          <div style={currentStyles.heroButtonContainer}>
            <a href="#projects" onClick={(e) => handleNavClick(e, '#projects')} style={currentStyles.heroButton(false)}>View My Work</a>
            <a href="assets/PankajNamdev_FrontendDeveloper_Resume.pdf (1).pdf" download="PankajNamdev_FrontendDeveloper_Resume.pdf" style={currentStyles.secondaryButton(false)}>Download Resume</a>
          </div>
          <div style={currentStyles.heroSocials}>
            <a href="https://github.com/pankajj48" target="_blank" rel="noopener noreferrer" style={currentStyles.socialLink}>
                <icons.GitHub />
            </a>
            <a href="https://www.linkedin.com/in/pankaj-namdev-a02673252/" target="_blank" rel="noopener noreferrer" style={currentStyles.socialLink}>
                <icons.LinkedIn />
            </a>
          </div>
        </section>

        <section id="about" style={currentStyles.section} ref={aboutRef}>
          <div style={{...currentStyles.container, ...aboutStyle}}>
            <h2 style={currentStyles.sectionTitle}><span style={currentStyles.sectionTitleAfter}></span>About Me</h2>
            <div style={currentStyles.aboutContainer}>
                <div style={currentStyles.aboutImageContainer}>
                    <img src="assets/1000038025.jpg" alt="Developer portrait" style={currentStyles.aboutImage} />
                </div>
                <div style={currentStyles.aboutRight}>
                    <p style={currentStyles.aboutText}>I'm a passionate frontend developer with a knack for creating beautiful, functional, and user-centered digital experiences. I love turning complex problems into simple, elegant solutions that delight users and drive business goals.</p>
                    <div style={currentStyles.skillsGrid}>
                        {Object.values(skills).flat().map(skill => (
                            <SkillIcon key={skill} name={skill} theme={currentTheme} />
                        ))}
                    </div>
                </div>
            </div>
          </div>
        </section>
        
        <section id="experience" style={{...currentStyles.section, backgroundColor: theme === 'dark' ? '#161B22' : '#FFFFFF'}} ref={expRef}>
            <div style={{...currentStyles.container, ...expStyle}}>
                <h2 style={currentStyles.sectionTitle}><span style={currentStyles.sectionTitleAfter}></span>Career Journey</h2>
                <div style={currentStyles.timeline}>
                    <div style={currentStyles.timelineLine(expVisible)}></div>
                    {experience.map((item, index) => (
                        <TimelineItem key={index} data={item} theme={currentTheme} />
                    ))}
                </div>
            </div>
        </section>

        <section id="projects" style={currentStyles.section} ref={projectsRef}>
          <div style={{...currentStyles.container, ...projectsStyle}}>
              <h2 style={currentStyles.sectionTitle}><span style={currentStyles.sectionTitleAfter}></span>My Creations</h2>
              <div style={currentStyles.projectGrid}>
                {projects.map((project, index) => (
                    <ProjectCard key={index} project={project} theme={currentTheme} />
                ))}
              </div>
          </div>
        </section>
        
        <section id="education" style={{...currentStyles.section, backgroundColor: theme === 'dark' ? '#161B22' : '#FFFFFF'}} ref={eduRef}>
            <div style={{...currentStyles.container, ...eduStyle}}>
                <h2 style={currentStyles.sectionTitle}><span style={currentStyles.sectionTitleAfter}></span>Education</h2>
                 <div style={currentStyles.timeline}>
                    <div style={currentStyles.timelineLine(eduVisible)}></div>
                    {education.map((item, index) => (
                       <TimelineItem key={index} data={item} theme={currentTheme} />
                    ))}
                </div>
            </div>
        </section>

        <section id="contact" style={{...currentStyles.section, borderBottom: 'none'}} ref={contactRef}>
          <div style={{...currentStyles.container, ...contactStyle}}>
            <h2 style={currentStyles.sectionTitle}><span style={currentStyles.sectionTitleAfter}></span>Get In Touch</h2>
            <form style={currentStyles.contactForm} onSubmit={(e) => e.preventDefault()}>
              <input type="text" name="name" placeholder="Your Name" style={currentStyles.formInput} />
              <input type="email" name="email" placeholder="Your Email" style={currentStyles.formInput} />
              <textarea name="message" placeholder="Your Message" rows="6" style={currentStyles.formInput}></textarea>
              <button type="submit" style={currentStyles.formButton}>Send Message</button>
            </form>
          </div>
        </section>
      </main>
      
      <footer style={currentStyles.footer}>
        <p>&copy; {new Date().getFullYear()} Pankaj Namdev. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
