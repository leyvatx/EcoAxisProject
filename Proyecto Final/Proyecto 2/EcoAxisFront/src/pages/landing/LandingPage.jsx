import React from 'react';
import Hero from '../../components/landing/Hero';
import Features from '../../components/landing/Features';
import About from '../../components/landing/About';
import Contact from '../../components/landing/Contact';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Hero />
      <Features />
      <About />
      <Contact />
    </div>
  );
};

export default LandingPage;
