
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface BlobLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

const BlobLogo: React.FC<BlobLogoProps> = ({ 
  className = '', 
  size = 'md',
  interactive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Define the size based on prop
  const sizeClass = size === 'sm' ? 'w-12 h-12' : 
                    size === 'lg' ? 'w-24 h-24' : 
                    'w-16 h-16';

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let hue = 0;
    
    // Set canvas size
    const setCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    
    // Animation parameters
    const center = { x: canvas.width / 2, y: canvas.height / 2 };
    const baseRadius = Math.min(canvas.width, canvas.height) * 0.35;
    const blobPoints = 6;
    const amplitude = baseRadius * 0.2;
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Increment hue for color change
      hue = (hue + 0.5) % 360;
      const blobColor = `hsl(${hue}, 100%, 50%)`;
      const time = Date.now() * 0.001;
      
      // Draw blob
      ctx.save();
      ctx.translate(center.x, center.y);
      
      ctx.beginPath();
      
      for (let angle = 0; angle < Math.PI * 2; angle += 0.01) {
        let radius = baseRadius;
        
        // Add variation to each point
        for (let i = 1; i <= blobPoints; i++) {
          radius += Math.sin(angle * i + time) * amplitude / i;
        }
        
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        if (angle === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.closePath();
      
      // Gradient fill for blob
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, baseRadius * 1.5);
      gradient.addColorStop(0, '#C8FF00');
      gradient.addColorStop(1, '#F97316');
      
      ctx.fillStyle = gradient;
      ctx.globalAlpha = 0.8;
      ctx.fill();
      
      ctx.restore();
      
      // Continue animation
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <div className={`relative ${sizeClass} ${className}`}>
      {interactive ? (
        <motion.div
          className="w-full h-full"
          whileHover={{ 
            scale: 1.1,
            rotate: [0, -5, 5, -3, 3, 0],
            transition: { duration: 0.5 }
          }}
          whileTap={{ scale: 0.9 }}
          drag={interactive}
          dragConstraints={{ top: -10, right: 10, bottom: 10, left: -10 }}
          dragElastic={0.2}
        >
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full"
          />
          <img 
            src="/lovable-uploads/dee5eb1f-c8e0-4606-9178-09c2c914ca98.png" 
            alt="MMortal Logo" 
            className="absolute inset-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 object-contain z-10"
          />
        </motion.div>
      ) : (
        <div className="w-full h-full">
          <canvas 
            ref={canvasRef} 
            className="absolute inset-0 w-full h-full"
          />
          <img 
            src="/lovable-uploads/dee5eb1f-c8e0-4606-9178-09c2c914ca98.png" 
            alt="MMortal Logo" 
            className="absolute inset-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 object-contain z-10"
          />
        </div>
      )}
    </div>
  );
};

export default BlobLogo;
