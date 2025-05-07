
import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface BlobLogoProps {
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const BlobLogo: React.FC<BlobLogoProps> = ({ 
  interactive = true, 
  size = 'md',
  className = '' 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();
  const noiseOffsetRef = useRef<number>(0);
  
  // Calculate size based on the prop - make it smaller
  const sizeValue = size === 'sm' ? 50 : size === 'md' ? 80 : 120;
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set canvas size and ensure pixel ratio is correct
    const dpr = window.devicePixelRatio || 1;
    canvas.width = sizeValue * dpr;
    canvas.height = sizeValue * dpr;
    
    ctx.scale(dpr, dpr);
    
    // Modern gradient with deeper colors
    const gradient = ctx.createLinearGradient(0, 0, sizeValue, sizeValue);
    gradient.addColorStop(0, '#22c55e'); // New green color
    gradient.addColorStop(1, '#0ea5e9'); // New blue color
    
    // Create points around a circle
    const points = 12; // More points for smoother blob
    const angleStep = (Math.PI * 2) / points;
    const center = sizeValue / 2;
    const radius = sizeValue * 0.3; // Smaller radius
    
    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      noiseOffsetRef.current += 0.01;
      
      // Draw blob with noise
      ctx.beginPath();
      
      for (let i = 0; i < points; i++) {
        const angle = i * angleStep;
        
        // Reduced noise for more subtle movement
        const noise = interactive 
          ? Math.sin(noiseOffsetRef.current + i) * (sizeValue * 0.03) 
          : Math.sin(noiseOffsetRef.current + i) * (sizeValue * 0.01);
        
        const pointRadius = radius + noise;
        
        const x = center + Math.cos(angle) * pointRadius;
        const y = center + Math.sin(angle) * pointRadius;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          // Use quadratic curves for smoother blob
          const prevAngle = (i - 1) * angleStep;
          const prevX = center + Math.cos(prevAngle) * (radius + noise);
          const prevY = center + Math.sin(prevAngle) * (radius + noise);
          
          const cpX = (prevX + x) / 2;
          const cpY = (prevY + y) / 2;
          
          ctx.quadraticCurveTo(prevX, prevY, cpX, cpY);
        }
      }
      
      // Close the path
      const firstAngle = 0;
      const firstX = center + Math.cos(firstAngle) * (radius + Math.sin(noiseOffsetRef.current) * (sizeValue * 0.03));
      const firstY = center + Math.sin(firstAngle) * (radius + Math.sin(noiseOffsetRef.current) * (sizeValue * 0.03));
      
      const lastAngle = (points - 1) * angleStep;
      const lastX = center + Math.cos(lastAngle) * (radius + Math.sin(noiseOffsetRef.current + points - 1) * (sizeValue * 0.03));
      const lastY = center + Math.sin(lastAngle) * (radius + Math.sin(noiseOffsetRef.current + points - 1) * (sizeValue * 0.03));
      
      const cpX = (lastX + firstX) / 2;
      const cpY = (lastY + firstY) / 2;
      
      ctx.quadraticCurveTo(lastX, lastY, cpX, cpY);
      
      // Fill the blob
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Add a subtle glow effect
      ctx.shadowColor = 'rgba(14, 165, 233, 0.5)';
      ctx.shadowBlur = 15;
      
      // Draw the text
      ctx.font = `bold ${sizeValue * 0.25}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#fff';
      
      // Draw the "MM" text
      ctx.fillText('MM', center, center);
      
      requestRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Cleanup
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [interactive, sizeValue]);
  
  return (
    <motion.div 
      className={`relative ${className}`}
      style={{ width: sizeValue, height: sizeValue }}
      whileHover={interactive ? { scale: 1.05 } : {}}
      whileTap={interactive ? { scale: 0.95 } : {}}
    >
      <canvas 
        ref={canvasRef} 
        style={{ 
          width: sizeValue, 
          height: sizeValue,
          cursor: interactive ? 'pointer' : 'default' 
        }}
      />
    </motion.div>
  );
};

export default BlobLogo;
