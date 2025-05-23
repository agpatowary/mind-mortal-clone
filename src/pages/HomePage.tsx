
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import FeaturedMentorsSection from '@/components/home/FeaturedMentorsSection';
import CaseStudiesSection from '@/components/home/CaseStudiesSection';
import CtaSection from '@/components/home/CtaSection';

const HomePage: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Dummy data for HeroSection
  const heroData = {
    title: "Your Story. Your Legacy. Forever.",
    subtitle: "Preserve your wisdom. Share your ideas. Connect with the future.",
    primaryButtonText: "Start Your Journey",
    secondaryButtonText: "Explore Features"
  };

  const sections = [
    { component: () => <HeroSection data={heroData} />, name: 'hero' },
    { component: FeaturesSection, name: 'features' },
    { component: FeaturedMentorsSection, name: 'mentors' },
    { component: CaseStudiesSection, name: 'case-studies' },
    { component: CtaSection, name: 'cta' }
  ];

  const goToSection = useCallback((sectionIndex: number) => {
    if (sectionIndex >= 0 && sectionIndex < sections.length && !isTransitioning) {
      setIsTransitioning(true);
      setCurrentSection(sectionIndex);
      setTimeout(() => setIsTransitioning(false), 800);
    }
  }, [sections.length, isTransitioning]);

  const handleNext = useCallback(() => {
    if (currentSection < sections.length - 1) {
      goToSection(currentSection + 1);
    }
  }, [currentSection, sections.length, goToSection]);

  const handlePrevious = useCallback(() => {
    if (currentSection > 0) {
      goToSection(currentSection - 1);
    }
  }, [currentSection, goToSection]);

  // Reset and reprogram mouse wheel event listener
  useEffect(() => {
    let wheelTimeout: NodeJS.Timeout;
    
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (isTransitioning) return;
      
      // Clear existing timeout to debounce wheel events
      clearTimeout(wheelTimeout);
      
      wheelTimeout = setTimeout(() => {
        if (e.deltaY > 0) {
          // Scrolling down
          handleNext();
        } else if (e.deltaY < 0) {
          // Scrolling up
          handlePrevious();
        }
      }, 50); // 50ms debounce
    };

    // Reset keyboard event listener
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isTransitioning) return;
      
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          handleNext();
          break;
        case 'ArrowUp':
          e.preventDefault();
          handlePrevious();
          break;
      }
    };

    // Remove any existing event listeners first
    window.removeEventListener('wheel', handleWheel);
    window.removeEventListener('keydown', handleKeyDown);

    // Add fresh event listeners with passive: false to allow preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup function
    return () => {
      clearTimeout(wheelTimeout);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleNext, handlePrevious, isTransitioning]);

  const CurrentComponent = sections[currentSection].component;

  return (
    <div className="h-screen overflow-hidden relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="h-full w-full"
        >
          <CurrentComponent />
        </motion.div>
      </AnimatePresence>

      {/* Navigation dots */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 flex flex-col gap-3">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSection(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSection === index
                ? 'bg-white scale-125'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            disabled={isTransitioning}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
