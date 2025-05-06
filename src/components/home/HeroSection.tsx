
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Logo from '../Logo';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
  data: {
    title: string;
    slogans: string[];
    description: string;
    backgroundImages: string[];
  };
}

const HeroSection: React.FC<HeroSectionProps> = ({ data }) => {
  const [currentSlogan, setCurrentSlogan] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    const slogan = data.slogans[currentSlogan];
    let typingTimeout: number;
    
    if (isTyping) {
      if (displayText.length < slogan.length) {
        typingTimeout = window.setTimeout(() => {
          setDisplayText(slogan.substring(0, displayText.length + 1));
        }, 100);
      } else {
        typingTimeout = window.setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    } else {
      if (displayText.length > 0) {
        typingTimeout = window.setTimeout(() => {
          setDisplayText(displayText.substring(0, displayText.length - 1));
        }, 50);
      } else {
        typingTimeout = window.setTimeout(() => {
          setCurrentSlogan((currentSlogan + 1) % data.slogans.length);
          setIsTyping(true);
        }, 500);
      }
    }
    
    return () => clearTimeout(typingTimeout);
  }, [currentSlogan, displayText, isTyping, data.slogans]);
  
  // Moving background elements
  const floatingElements = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 30 + 10,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));
  
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={data.backgroundImages[0]} 
          alt="Background" 
          className="w-full h-full object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 to-background"></div>
      </div>
      
      {/* Floating elements */}
      {floatingElements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute rounded-full bg-primary/10 backdrop-blur-md"
          style={{ width: el.size, height: el.size }}
          initial={{ x: `${el.x}vw`, y: `${el.y}vh` }}
          animate={{
            x: [`${el.x}vw`, `${(el.x + 20) % 100}vw`, `${el.x}vw`],
            y: [`${el.y}vh`, `${(el.y + 20) % 100}vh`, `${el.y}vh`],
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Logo className="mx-auto mb-8" />
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {data.title}
          </h1>
          
          <div className="h-16 md:h-20 flex items-center justify-center">
            <h2 className="text-2xl md:text-4xl font-semibold text-primary min-h-[4rem] flex items-center">
              {displayText}
              <span className="animate-pulse ml-1">|</span>
            </h2>
          </div>
          
          <p className="text-lg md:text-xl text-muted-foreground mt-6 mb-8">
            {data.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">Get Started</Button>
            </Link>
            <Link to="/features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">Learn More</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
