
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  children: React.ReactNode;
  density?: number;
  speed?: number;
  color?: string;
  mouseInteraction?: boolean;
  interactionStrength?: number;
  particleSize?: 'small' | 'medium' | 'large' | 'mixed';
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  children,
  density = 20,
  speed = 25,
  color = 'primary',
  mouseInteraction = true,
  interactionStrength = 100,
  particleSize = 'mixed',
}) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    duration: number;
    delay: number;
  }>>([]);
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Colors for particles
  const particleColors = [
    'bg-primary/20',
    'bg-[#9b87f5]/20',
    'bg-[#D946EF]/15',
    'bg-[#F97316]/15',
    'bg-[#0EA5E9]/15',
  ];

  // Initialize particles
  useEffect(() => {
    // Set window size
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Create particles based on density
    const newParticles = Array.from({ length: density }, (_, i) => {
      let size = 0;
      
      // Set particle size based on the particleSize prop
      if (particleSize === 'small') {
        size = Math.random() * 15 + 5;
      } else if (particleSize === 'large') {
        size = Math.random() * 50 + 20;
      } else if (particleSize === 'mixed') {
        // Create a mix of different sizes with more variation
        const sizeGroup = Math.random();
        if (sizeGroup < 0.5) {
          size = Math.random() * 15 + 5; // Small
        } else if (sizeGroup < 0.8) {
          size = Math.random() * 30 + 15; // Medium
        } else {
          size = Math.random() * 50 + 30; // Large
        }
      } else {
        // Medium is default
        size = Math.random() * 30 + 10;
      }
      
      return {
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        duration: Math.random() * speed + 10,
        delay: Math.random() * 5,
      };
    });
    
    setParticles(newParticles);

    // Handle window resize
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [density, speed, particleSize]);

  // Mouse move event handler
  useEffect(() => {
    if (!mouseInteraction) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
      setIsHovering(true);
      
      // Reset hover state after mouse stops moving
      clearTimeout((window as any).mouseTimeout);
      (window as any).mouseTimeout = setTimeout(() => {
        setIsHovering(false);
      }, 1000);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout((window as any).mouseTimeout);
    };
  }, [mouseInteraction]);

  // Calculate distance from mouse to particle
  const getDistance = (x1: number, y1: number, x2: number, y2: number) => {
    const xDist = x1 - x2;
    const yDist = y1 - y2;
    return Math.sqrt(xDist * xDist + yDist * yDist);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background particles */}
      {particles.map((particle) => {
        // Convert percentage position to pixels
        const particleX = (particle.x / 100) * windowSize.width;
        const particleY = (particle.y / 100) * windowSize.height;
        
        // Calculate distance from mouse
        const distance = getDistance(
          mousePosition.x, 
          mousePosition.y, 
          particleX, 
          particleY
        );
        
        // Mouse repulsion effect - stronger when closer
        const maxDistance = interactionStrength * 3;
        const repulsionFactor = (mouseInteraction && distance < maxDistance) 
          ? ((maxDistance - distance) / maxDistance) * interactionStrength 
          : 0;
        
        // Direction vector from particle to mouse (normalized)
        const dirX = distance > 0 ? (particleX - mousePosition.x) / distance : 0;
        const dirY = distance > 0 ? (particleY - mousePosition.y) / distance : 0;
        
        // Calculate repulsion offset
        const offsetX = dirX * repulsionFactor;
        const offsetY = dirY * repulsionFactor;

        // Determine if particle is near cursor for glow effect
        const isNearCursor = isHovering && distance < maxDistance / 2;

        return (
          <motion.div
            key={particle.id}
            className={`absolute rounded-full ${particle.color} backdrop-blur-sm ${
              isNearCursor ? 'shadow-lg shadow-primary/30' : ''
            }`}
            style={{ 
              width: particle.size, 
              height: particle.size,
              left: `${particle.x}vw`,
              top: `${particle.y}vh`,
            }}
            animate={{
              x: mouseInteraction ? [0, offsetX, 0] : [0, 20, 0],
              y: mouseInteraction ? [0, offsetY, 0] : [0, 20, 0],
              scale: isNearCursor 
                ? [1, 1 + ((maxDistance - distance) / maxDistance) * 0.5, 1] 
                : [1, 1.1, 1],
              opacity: isNearCursor ? [0.8, 1, 0.8] : undefined,
            }}
            transition={{
              duration: isNearCursor ? 1 : particle.duration * 0.1,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        );
      })}
      
      {/* Mouse trail effect */}
      {mouseInteraction && isHovering && (
        <motion.div
          className="absolute pointer-events-none w-20 h-20 rounded-full bg-primary/5 backdrop-blur-sm"
          style={{
            left: mousePosition.x - 40,
            top: mousePosition.y - 40,
          }}
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.1, 0],
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
        />
      )}
      
      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;
