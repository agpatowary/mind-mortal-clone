
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  children: React.ReactNode;
  density?: number;
  speed?: number;
  color?: string;
  mouseInteraction?: boolean;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  children,
  density = 15,
  speed = 20,
  color = 'primary',
  mouseInteraction = true,
}) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
  }>>([]);
  
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // Initialize particles
  useEffect(() => {
    // Set window size
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Create particles based on density
    const newParticles = Array.from({ length: density }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 30 + 10,
      duration: Math.random() * speed + 10,
      delay: Math.random() * 5,
    }));
    
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
  }, [density, speed]);

  // Mouse move event handler
  useEffect(() => {
    if (!mouseInteraction) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
        const maxDistance = 200;
        const repulsionFactor = mouseInteraction && distance < maxDistance 
          ? ((maxDistance - distance) / maxDistance) * 40 
          : 0;
        
        // Direction vector from particle to mouse (normalized)
        const dirX = distance > 0 ? (particleX - mousePosition.x) / distance : 0;
        const dirY = distance > 0 ? (particleY - mousePosition.y) / distance : 0;
        
        // Calculate repulsion offset
        const offsetX = dirX * repulsionFactor;
        const offsetY = dirY * repulsionFactor;

        return (
          <motion.div
            key={particle.id}
            className={`absolute rounded-full bg-${color}/10 backdrop-blur-md`}
            style={{ 
              width: particle.size, 
              height: particle.size,
              left: `${particle.x}vw`,
              top: `${particle.y}vh`,
            }}
            animate={{
              x: mouseInteraction ? [0, offsetX, 0] : [0, 20, 0],
              y: mouseInteraction ? [0, offsetY, 0] : [0, 20, 0],
              scale: mouseInteraction && distance < maxDistance 
                ? [1, 1 + ((maxDistance - distance) / maxDistance) * 0.3, 1] 
                : [1, 1.1, 1],
            }}
            transition={{
              duration: particle.duration * 0.1,
              ease: "easeInOut",
            }}
          />
        );
      })}
      
      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;
