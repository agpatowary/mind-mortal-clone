
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import homeContent from '@/data/homeContent.json';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CaseStudiesSection from '@/components/home/CaseStudiesSection';
import StoriesSection from '@/components/home/StoriesSection';
import FeaturedMentorsSection from '@/components/home/FeaturedMentorsSection';
import CtaSection from '@/components/home/CtaSection';
import HomeNavigation from '@/components/HomeNavigation';
import Footer from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';

const sections = [
  'hero',
  'features',
  'case-studies',
  'stories',
  'mentors',
  'cta'
];

const HomePage = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const wheelTimeoutRef = useRef<number | null>(null);
  const navigate = useNavigate();
  
  // Improved wheel event handling
  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      
      // Clear any existing timeout
      if (wheelTimeoutRef.current) {
        window.clearTimeout(wheelTimeoutRef.current);
      }
      
      // Set a timeout to prevent rapid section changes
      wheelTimeoutRef.current = window.setTimeout(() => {
        const scrollDown = event.deltaY > 0;
        
        if (scrollDown && currentSection < sections.length - 1 && !isNavigating) {
          setIsNavigating(true);
          setCurrentSection(prev => prev + 1);
          setTimeout(() => setIsNavigating(false), 1000);
        } else if (!scrollDown && currentSection > 0 && !isNavigating) {
          setIsNavigating(true);
          setCurrentSection(prev => prev - 1);
          setTimeout(() => setIsNavigating(false), 1000);
        }
      }, 50); // Short debounce time for responsive scrolling
    };
    
    // Add the event listener to the window
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    // Clean up
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (wheelTimeoutRef.current) {
        window.clearTimeout(wheelTimeoutRef.current);
      }
    };
  }, [currentSection, isNavigating]);
  
  // Touch events for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStart - touchEnd;
    
    // Swipe up (scroll down)
    if (diff > 50 && currentSection < sections.length - 1 && !isNavigating) {
      setIsNavigating(true);
      setCurrentSection(prev => prev + 1);
      setTimeout(() => setIsNavigating(false), 1000);
    } 
    // Swipe down (scroll up)
    else if (diff < -50 && currentSection > 0 && !isNavigating) {
      setIsNavigating(true);
      setCurrentSection(prev => prev - 1);
      setTimeout(() => setIsNavigating(false), 1000);
    }
    
    setTouchStart(null);
  };

  const handleDotClick = (index: number) => {
    if (!isNavigating) {
      setIsNavigating(true);
      setCurrentSection(index);
      setTimeout(() => setIsNavigating(false), 1000);
    }
  };

  return (
    <div 
      className="h-screen overflow-hidden bg-background"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <HomeNavigation />
      
      {/* Navigation dots */}
      <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-50 flex flex-col space-y-4">
        {sections.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${
              currentSection === index ? 'bg-primary' : 'bg-gray-400'
            }`}
            onClick={() => handleDotClick(index)}
            aria-label={`Navigate to section ${index + 1}`}
          />
        ))}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="h-screen"
        >
          {currentSection === 0 && <HeroSection content={homeContent.hero} />}
          {currentSection === 1 && <FeaturesSection content={homeContent.features} />}
          {currentSection === 2 && <CaseStudiesSection content={homeContent.caseStudies} />}
          {currentSection === 3 && <StoriesSection content={homeContent.testimonials} />}
          {currentSection === 4 && <FeaturedMentorsSection content={homeContent.mentors} />}
          {currentSection === 5 && <CtaSection content={homeContent.cta} />}
        </motion.div>
      </AnimatePresence>
      
      <AnimatePresence>
        {currentSection === sections.length - 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute bottom-0 left-0 right-0"
          >
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomePage;
