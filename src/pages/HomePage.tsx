
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import HomeNavigation from '@/components/HomeNavigation';
import HeroSection from '@/components/home/HeroSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import CaseStudiesSection from '@/components/home/CaseStudiesSection';
import StoriesSection from '@/components/home/StoriesSection';
import FeaturedMentorsSection from '@/components/home/FeaturedMentorsSection';
import CtaSection from '@/components/home/CtaSection';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';
import { usePerformanceMode } from '@/hooks/usePerformanceMode';
import { useCallback as useCallbackStable } from 'react';

const HomePage = () => {
  const [activeSection, setActiveSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const lastScrollTime = useRef(Date.now());
  const { reducedMotion } = usePerformanceMode();
  
  const sections = [
    'hero',
    'features',
    'case-studies',
    'stories',
    'mentors',
    'cta'
  ];
  
  const scrollToSection = useCallbackStable((index: number) => {
    if (index >= 0 && index < sections.length) {
      setActiveSection(index);
      const element = document.getElementById(sections[index]);
      if (element) {
        element.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' });
      }
    }
  }, [sections, reducedMotion]);

  const handleScroll = useCallbackStable((e: WheelEvent) => {
    e.preventDefault();
    
    const now = Date.now();
    if (isScrolling || now - lastScrollTime.current < 800) return;
    
    setIsScrolling(true);
    lastScrollTime.current = now;
    
    if (e.deltaY > 0) {
      // Scroll down
      scrollToSection(activeSection + 1);
    } else {
      // Scroll up
      scrollToSection(activeSection - 1);
    }
    
    setTimeout(() => {
      setIsScrolling(false);
    }, 800);
  }, [activeSection, isScrolling, scrollToSection]);
  
  useEffect(() => {
    const wheelHandler = (e: WheelEvent) => handleScroll(e);
    
    window.addEventListener('wheel', wheelHandler, { passive: false } as AddEventListenerOptions);
    
    return () => {
      window.removeEventListener('wheel', wheelHandler, { passive: false } as AddEventListenerOptions);
    };
  }, [handleScroll]);
  
  const handleNavigation = useCallback((sectionIndex: number) => {
    scrollToSection(sectionIndex);
  }, [scrollToSection]);

  return (
    <div className="flex flex-col min-h-screen bg-background overflow-x-hidden">
      {!reducedMotion && <AnimatedBackground />}
      
      <HomeNavigation 
        currentSection={activeSection} 
        onNavigate={handleNavigation} 
      />
      
      <main className="flex-grow">
        <section id="hero" className="min-h-screen flex items-center">
          <HeroSection />
        </section>
        
        <section id="features" className="min-h-screen flex items-center">
          <FeaturesSection />
        </section>
        
        <section id="case-studies" className="min-h-screen flex items-center">
          <CaseStudiesSection />
        </section>
        
        <section id="stories" className="min-h-screen flex items-center">
          <StoriesSection />
        </section>
        
        <section id="mentors" className="min-h-screen flex items-center">
          <FeaturedMentorsSection />
        </section>
        
        <section id="cta" className="min-h-screen flex items-center">
          <CtaSection />
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default HomePage;
