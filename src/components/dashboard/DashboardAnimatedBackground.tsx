
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface FloatingObjectProps {
  children: React.ReactNode;
  interactiveDistance?: number;
  delay?: number;
  size?: number;
  color?: string;
  speed?: number;
  x?: number;
  y?: number;
}

const FloatingObject: React.FC<FloatingObjectProps> = ({
  children,
  interactiveDistance = 100,
  delay = 0,
  size = 40,
  color = 'rgba(255, 255, 255, 0.1)',
  speed = 2,
  x = 0,
  y = 0
}) => {
  const [position, setPosition] = useState({ x, y });
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const distanceX = mousePosition.x - position.x;
    const distanceY = mousePosition.y - position.y;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    if (distance < interactiveDistance) {
      setIsHovered(true);
      // Create a repulsion effect
      const angle = Math.atan2(distanceY, distanceX);
      const force = (interactiveDistance - distance) / interactiveDistance;
      const moveX = -Math.cos(angle) * force * 20;
      const moveY = -Math.sin(angle) * force * 20;

      setPosition(prev => ({
        x: prev.x + moveX,
        y: prev.y + moveY
      }));
    } else {
      setIsHovered(false);
      // Return slowly to original position
      setPosition(prev => ({
        x: prev.x + (x - prev.x) * 0.05,
        y: prev.y + (y - prev.y) * 0.05
      }));
    }
  }, [mousePosition, interactiveDistance, x, y]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: isHovered ? 1 : 0.7, 
        scale: isHovered ? 1.2 : 1,
        x: position.x,
        y: position.y,
        rotate: [0, 5, 0, -5, 0]
      }}
      transition={{
        rotate: {
          duration: speed * 2,
          repeat: Infinity,
          ease: "easeInOut",
          delay
        },
        scale: {
          duration: 0.3
        }
      }}
      style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: '50%',
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: isHovered ? '0 0 20px rgba(255, 255, 255, 0.3)' : 'none',
        cursor: 'pointer',
        zIndex: 1
      }}
    >
      {children}
    </motion.div>
  );
};

interface DashboardAnimatedBackgroundProps {
  children: React.ReactNode;
  objectCount?: number;
}

const DashboardAnimatedBackground: React.FC<DashboardAnimatedBackgroundProps> = ({
  children,
  objectCount = 8
}) => {
  const [dimensions, setDimensions] = useState({ width: 1000, height: 800 });
  
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);

  const colors = [
    'rgba(155, 135, 245, 0.3)',
    'rgba(249, 115, 22, 0.2)',
    'rgba(204, 255, 0, 0.2)',
    'rgba(51, 195, 240, 0.2)',
    'rgba(255, 149, 0, 0.2)',
  ];

  const objects = Array.from({ length: objectCount }).map((_, index) => ({
    id: index,
    x: Math.random() * dimensions.width * 0.8,
    y: Math.random() * dimensions.height * 0.8,
    size: Math.random() * 30 + 20,
    color: colors[index % colors.length],
    delay: Math.random() * 2,
    speed: Math.random() * 3 + 1
  }));

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Floating objects */}
      {objects.map(obj => (
        <FloatingObject
          key={obj.id}
          x={obj.x}
          y={obj.y}
          size={obj.size}
          color={obj.color}
          delay={obj.delay}
          speed={obj.speed}
        >
          {obj.id % 3 === 0 && <span className="text-xs text-white/80">✨</span>}
        </FloatingObject>
      ))}

      {/* Main content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default DashboardAnimatedBackground;
