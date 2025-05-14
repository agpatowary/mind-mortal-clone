
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
  
  // Navigate to next slide
  const nextSlide = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };
  
  // Navigate to previous slide
  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };
  
  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
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
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0
    })
  };
  
  // Track slide direction for animations
  const [direction, setDirection] = useState(0);
  
  const handleNavigate = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };
  
  return (
    <div className="min-h-screen bg-background antialiased overflow-hidden">
      <AnimatedBackground objectCount={isMobile ? 5 : 10}>
        <div className="relative h-screen w-full">
          {/* Slide Navigation */}
          <HomeNavigation currentSection={currentSlide} onNavigate={handleNavigate} />
          
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
          
          {/* Slide navigation arrows */}
          <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-50">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full bg-background/40 backdrop-blur-sm ${currentSlide === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
              onClick={prevSlide}
              disabled={currentSlide === 0}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
          </div>
          
          <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-50">
            <Button
              variant="ghost"
              size="icon"
              className={`rounded-full bg-background/40 backdrop-blur-sm ${currentSlide === totalSlides - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
              onClick={nextSlide}
              disabled={currentSlide === totalSlides - 1}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
          
          {/* Slide indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-50 flex space-x-2">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => handleNavigate(index)}
                className={`h-2 rounded-full transition-all ${currentSlide === index ? 'w-8 bg-primary' : 'w-2 bg-muted-foreground/40'}`}
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
