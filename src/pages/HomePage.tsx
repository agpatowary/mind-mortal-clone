
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import StoriesSection from '@/components/home/StoriesSection';
import CtaSection from '@/components/home/CtaSection';
import HomeNavigation from '@/components/HomeNavigation';
import AnimatedBackground from '@/components/AnimatedBackground';
import CaseStudiesSection from '@/components/home/CaseStudiesSection';
import FeaturedMentorsSection from '@/components/home/FeaturedMentorsSection';

// Import JSON data
import homeContent from '@/data/homeContent.json';

const HomePage = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle section navigation from HomeNavigation component
  const handleNavigate = (index: number) => {
    setCurrentSection(index);
    const sections = ['hero', 'features', 'stories', 'cta'];
    const element = document.getElementById(`${sections[index]}-section`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Update currentSection based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById('hero-section');
      const featuresSection = document.getElementById('features-section');
      const storiesSection = document.getElementById('stories-section');
      const ctaSection = document.getElementById('cta-section');
      
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      if (ctaSection && scrollPosition >= ctaSection.offsetTop) {
        setCurrentSection(3);
      } else if (storiesSection && scrollPosition >= storiesSection.offsetTop) {
        setCurrentSection(2);
      } else if (featuresSection && scrollPosition >= featuresSection.offsetTop) {
        setCurrentSection(1);
      } else {
        setCurrentSection(0);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <div className="min-h-screen bg-background antialiased">
      <AnimatedBackground objectCount={isMobile ? 5 : 10}>
        {/* Hero Section */}
        <section id="hero-section">
          <HeroSection data={homeContent.hero} />
        </section>
        
        {/* Features Section */}
        <section id="features-section">
          <FeaturesSection data={homeContent.features} />
        </section>
        
        {/* Case Studies Section */}
        <section id="case-studies-section">
          <CaseStudiesSection data={homeContent.caseStudies} />
        </section>
        
        {/* Featured Mentors Section */}
        <section id="mentors-section">
          <FeaturedMentorsSection />
        </section>
        
        {/* User Stories Section */}
        <section id="stories-section">
          <StoriesSection data={homeContent.stories} />
        </section>
        
        {/* CTA Section */}
        <section id="cta-section">
          <CtaSection data={homeContent.cta} />
        </section>
        
        {/* Navigation */}
        <HomeNavigation currentSection={currentSection} onNavigate={handleNavigate} />
      </AnimatedBackground>
    </div>
  );
};

export default HomePage;
