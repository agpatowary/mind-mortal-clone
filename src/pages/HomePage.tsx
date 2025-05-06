
import React, { useState, useRef, useEffect } from 'react';
import homeContent from '../data/homeContent.json';
import HomeNavigation from '../components/HomeNavigation';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import StoriesSection from '../components/home/StoriesSection';
import CtaSection from '../components/home/CtaSection';

const HomePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  
  const scrollToSection = (index: number) => {
    if (sectionsRef.current[index]) {
      sectionsRef.current[index]?.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY + window.innerHeight / 2;
      
      let newActiveSection = 0;
      sectionsRef.current.forEach((section, index) => {
        if (section) {
          const { offsetTop, offsetHeight } = section;
          if (
            currentScrollPos >= offsetTop && 
            currentScrollPos < offsetTop + offsetHeight
          ) {
            newActiveSection = index;
          }
        }
      });
      
      if (newActiveSection !== activeSection) {
        setActiveSection(newActiveSection);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeSection]);
  
  return (
    <div className="overflow-x-hidden">
      <HomeNavigation 
        currentSection={activeSection} 
        onNavigate={scrollToSection} 
      />
      
      <div ref={el => sectionsRef.current[0] = el}>
        <HeroSection data={homeContent.hero} />
      </div>
      
      <div ref={el => sectionsRef.current[1] = el}>
        <FeaturesSection data={homeContent.features} />
      </div>
      
      <div ref={el => sectionsRef.current[2] = el}>
        <StoriesSection data={homeContent.stories} />
      </div>
      
      <div ref={el => sectionsRef.current[3] = el}>
        <CtaSection data={homeContent.cta} />
      </div>
    </div>
  );
};

export default HomePage;
