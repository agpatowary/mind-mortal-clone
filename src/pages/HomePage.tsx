
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import homeContent from '../data/homeContent.json';
import HomeNavigation from '../components/HomeNavigation';
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeaturesSection';
import StoriesSection from '../components/home/StoriesSection';
import CtaSection from '../components/home/CtaSection';
import AnimatedBackground from '../components/AnimatedBackground';

const HomePage: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const sectionsRef = useRef<(HTMLDivElement | null)[]>([]);
  const totalSections = 4;
  
  // Function to navigate to a section
  const navigateToSection = (index: number) => {
    if (index >= 0 && index < totalSections && !isScrolling) {
      setIsScrolling(true);
      setActiveSection(index);
      
      // Reset scrolling state after animation completes
      setTimeout(() => {
        setIsScrolling(false);
      }, 1000);
    }
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        navigateToSection(activeSection + 1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        navigateToSection(activeSection - 1);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection]);
  
  // Handle wheel/scroll events
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      // Prevent default to disable normal scrolling
      e.preventDefault();
      
      if (isScrolling) return;
      
      // Determine scroll direction and navigate
      if (e.deltaY > 30) {
        navigateToSection(activeSection + 1);
      } else if (e.deltaY < -30) {
        navigateToSection(activeSection - 1);
      }
    };
    
    // Add wheel event listener with passive: false to allow preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [activeSection, isScrolling]);
  
  // Section components and their variants for animations
  const sections = [
    <HeroSection key="hero" data={homeContent.hero} />,
    <FeaturesSection key="features" data={homeContent.features} />,
    <StoriesSection key="stories" data={homeContent.stories} />,
    <CtaSection key="cta" data={homeContent.cta} />
  ];
  
  const sectionVariants = {
    enter: (direction: number) => ({
      y: direction > 0 ? '100vh' : '-100vh',
      opacity: 0
    }),
    center: {
      y: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      y: direction < 0 ? '100vh' : '-100vh',
      opacity: 0
    })
  };
  
  return (
    <AnimatedBackground mouseInteraction={true} density={25} speed={15}>
      <div className="overflow-hidden h-screen">
        <HomeNavigation 
          currentSection={activeSection} 
          onNavigate={navigateToSection} 
        />
        
        <AnimatePresence 
          initial={false} 
          custom={activeSection > 0 ? -1 : 1}
          mode="wait"
        >
          <motion.div
            key={activeSection}
            custom={activeSection > 0 ? 1 : -1}
            variants={sectionVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              y: { type: "tween", duration: 0.8 },
              opacity: { duration: 0.5 }
            }}
            className="h-screen w-screen"
          >
            {sections[activeSection]}
          </motion.div>
        </AnimatePresence>
        
        {/* Pagination dots */}
        <div className="fixed right-6 top-1/2 transform -translate-y-1/2 z-50 hidden md:flex flex-col gap-3">
          {Array.from({ length: totalSections }).map((_, index) => (
            <button
              key={`dot-${index}`}
              onClick={() => navigateToSection(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeSection === index 
                  ? "bg-primary scale-125" 
                  : "bg-muted-foreground hover:bg-primary/50"
              }`}
              aria-label={`Navigate to section ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </AnimatedBackground>
  );
};

export default HomePage;
