
import React from 'react';
import { motion } from 'framer-motion';

export interface AnimatedBackgroundProps {
  children?: React.ReactNode;
  color?: string;
  intensity?: 'light' | 'medium' | 'strong';
  pattern?: 'dots' | 'grid' | 'noise';
  // Additional optional props for feature pages
  mouseInteraction?: boolean;
  density?: number;
  speed?: number;
  interactionStrength?: number;
  particleSize?: string;
  objectCount?: number;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  children,
  color = '#F97316',
  intensity = 'medium',
  pattern = 'dots',
  mouseInteraction,
  density,
  speed,
  interactionStrength,
  particleSize,
  objectCount
}) => {
  // Determine opacity based on intensity
  const getOpacity = () => {
    switch (intensity) {
      case 'light': return 0.03;
      case 'medium': return 0.05;
      case 'strong': return 0.08;
      default: return 0.05;
    }
  };
  
  // Create array of floating elements
  const createElements = () => {
    const elements = [];
    const count = objectCount || (pattern === 'dots' ? 50 : pattern === 'grid' ? 25 : 40);
    
    for (let i = 0; i < count; i++) {
      const size = Math.random() * 10 + 5; // Size between 5-15px
      elements.push({
        id: i,
        x: Math.random() * 100, // Position X (0-100%)
        y: Math.random() * 100, // Position Y (0-100%)
        size: particleSize ? parseInt(particleSize) : size,
        duration: (speed || 1) * (Math.random() * 20 + 20), // Animation duration between 20-40s
        delay: Math.random() * 20 // Delay start by 0-20s
      });
    }
    
    return elements;
  };
  
  const elements = React.useMemo(() => createElements(), [pattern, objectCount, particleSize, speed]);
  const opacity = getOpacity();
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      {elements.map((el) => (
        <motion.div
          key={el.id}
          className="absolute rounded-full"
          style={{
            left: `${el.x}%`,
            top: `${el.y}%`,
            width: el.size,
            height: el.size,
            backgroundColor: color,
            opacity: opacity,
          }}
          animate={{
            x: [
              Math.random() * 100 - 50, // Move randomly by -50 to +50px
              Math.random() * 100 - 50,
              Math.random() * 100 - 50
            ],
            y: [
              Math.random() * 100 - 50,
              Math.random() * 100 - 50,
              Math.random() * 100 - 50
            ],
            scale: [1, 1.2, 0.8, 1],
            opacity: [opacity, opacity * 1.5, opacity],
          }}
          transition={{
            duration: el.duration,
            delay: el.delay,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
      
      {/* Background pattern */}
      {pattern === 'grid' && (
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `linear-gradient(to right, ${color} 1px, transparent 1px), 
                             linear-gradient(to bottom, ${color} 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
            opacity: opacity * 0.5
          }}
        />
      )}
      
      {children}
    </div>
  );
};

export default AnimatedBackground;
