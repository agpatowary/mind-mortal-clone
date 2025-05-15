
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronUp, ChevronDown } from 'lucide-react';

import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import StoriesSection from '@/components/home/StoriesSection';
import CtaSection from '@/components/home/CtaSection';
import HomeNavigation from '@/components/HomeNavigation';
import AnimatedBackground from '@/components/AnimatedBackground';
import FeaturedMentorsSection from '@/components/home/FeaturedMentorsSection';

// Import JSON data
import homeContent from '@/data/homeContent.json';

const HomePage = () => {
  const navigate = useNavigate();
  
  // State for current slide
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  
  // Total number of slides
  const totalSlides = 5;
  
  // Update isMobile state on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Prevent scroll events from triggering multiple slide changes
  const handleScrollDebounced = (direction: number) => {
    if (isScrolling) return;
    
    setIsScrolling(true);
    
    if (direction > 0) {
      nextSlide();
    } else {
      prevSlide();
    }
    
    // Clear any existing timeout
    if (scrollTimeoutRef.current) {
      window.clearTimeout(scrollTimeoutRef.current);
    }
    
    // Set a new timeout
    scrollTimeoutRef.current = window.setTimeout(() => {
      setIsScrolling(false);
      scrollTimeoutRef.current = null;
    }, 800); // Wait for slide animation to complete
  };
  
  // Handle wheel events for mouse scrolling
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      // Determine scroll direction
      const direction = Math.sign(e.deltaY);
      handleScrollDebounced(direction);
    };
    
    // Fix: Use EventListenerOptions interface
    const wheelOptions: EventListenerOptions = { passive: false };
    document.addEventListener('wheel', handleWheel, wheelOptions);
    
    return () => {
      document.removeEventListener('wheel', handleWheel, wheelOptions);
      
      // Clear any pending timeouts when component unmounts
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [isScrolling]);
  
  // Navigate to next slide
  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setDirection(1);
      setCurrentSlide(currentSlide + 1);
    }
  };
  
  // Navigate to previous slide
  const prevSlide = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(currentSlide - 1);
    }
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        nextSlide();
      } else if (e.key === 'ArrowUp') {
        prevSlide();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);
  
  // Slide components array
  const slides = [
    <HeroSection key="hero" data={homeContent.hero} />,
    <FeaturesSection key="features" data={homeContent.features} />,
    <FeaturedMentorsSection key="mentors" />,
    <StoriesSection key="stories" data={homeContent.caseStudies} />,
    <CtaSection key="cta" data={homeContent.cta} />
  ];
  
  const slideVariants = {
    enter: (direction: number) => ({
      y: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      y: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      y: direction > 0 ? '-100%' : '100%',
      opacity: 0
    })
  };
  
  // Track slide direction for animations
  const [direction, setDirection] = useState(0);
  
  const handleNavigate = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };
  
  // Listen for custom navigation events
  useEffect(() => {
    const handleCustomNavigation = (e: CustomEvent) => {
      const { index } = (e as CustomEvent<{ index: number }>).detail;
      handleNavigate(index);
    };
    
    document.addEventListener('navigateToSlide', handleCustomNavigation as EventListener);
    return () => {
      document.removeEventListener('navigateToSlide', handleCustomNavigation as EventListener);
    };
  }, [currentSlide]);
  
  return (
    <div className="min-h-screen bg-background antialiased overflow-hidden">
      <AnimatedBackground objectCount={isMobile ? 5 : 10}>
        <div className="relative h-screen w-full">
          {/* Slide container */}
          <div className="h-screen w-full overflow-hidden">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={currentSlide}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  type: "tween",
                  ease: "easeInOut",
                  duration: 0.5
                }}
                className="absolute inset-0 w-full h-full"
              >
                {slides[currentSlide]}
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Slide Navigation - moved below the slides*/}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
            <HomeNavigation currentSection={currentSlide} onNavigate={handleNavigate} />
          </div>
          
          {/* Slide navigation arrows - Changed to up/down arrows */}
          <div className="absolute bottom-1/2 right-4 transform translate-y-1/2 z-50">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full bg-background/40 backdrop-blur-sm mb-2 ${currentSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
              onClick={prevSlide}
              disabled={currentSlide === 0}
            >
              <ChevronUp className="h-6 w-6" />
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full bg-background/40 backdrop-blur-sm ${currentSlide === totalSlides - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
              onClick={nextSlide}
              disabled={currentSlide === totalSlides - 1}
            >
              <ChevronDown className="h-6 w-6" />
            </Button>
          </div>
          
          {/* Slide indicators */}
          <div className="absolute right-6 top-1/2 transform -translate-y-1/2 z-50 flex flex-col space-y-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => handleNavigate(index)}
                className={`w-2 transition-all ${currentSlide === index ? 'h-8 bg-primary' : 'h-2 bg-muted-foreground/40'} rounded-full`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </AnimatedBackground>
    </div>
  );
};

export default HomePage;
