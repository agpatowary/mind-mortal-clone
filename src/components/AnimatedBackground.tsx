
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  children: React.ReactNode;
  density?: number;
  speed?: number;
  color?: string;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  children,
  density = 15,
  speed = 20,
  color = 'primary',
}) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    duration: number;
    delay: number;
  }>>([]);

  useEffect(() => {
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
  }, [density, speed]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute rounded-full bg-${color}/10 backdrop-blur-md`}
          style={{ width: particle.size, height: particle.size }}
          initial={{ x: `${particle.x}vw`, y: `${particle.y}vh` }}
          animate={{
            x: [`${particle.x}vw`, `${(particle.x + 20) % 100}vw`, `${particle.x}vw`],
            y: [`${particle.y}vh`, `${(particle.y + 20) % 100}vh`, `${particle.y}vh`],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default AnimatedBackground;
