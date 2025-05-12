
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BlobLogoProps {
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  variant?: 'default' | 'light' | 'dark';
}

const BlobLogo: React.FC<BlobLogoProps> = ({ 
  interactive = true, 
  size = 'md',
  className = '',
  variant = 'default'
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTapped, setIsTapped] = useState(false);
  
  const logoSizes = {
    'sm': "w-8 h-8",
    'md': "w-12 h-12",
    'lg': "w-16 h-16",
    'xl': "w-20 h-20"
  };
  
  // Orange M logo path
  const logoPath = "M29.4 12.17L24.76 25h-1.54L19.24 15.11 15.26 25h-1.54L9.13 12.17h1.79l3.61 10.12 3.9-10.12h1.52l3.9 10.15 3.67-10.15h1.88z";
  
  // Logo variants
  const colorVariants = {
    'default': {
      bgGradient: "from-[#F97316] to-[#F97316]/80",
      textColor: "text-white",
      logoColor: "#FFFFFF"
    },
    'light': {
      bgGradient: "from-white to-white/90",
      textColor: "text-[#F97316]",
      logoColor: "#F97316"
    },
    'dark': {
      bgGradient: "from-[#F97316] to-[#F97316]/80",
      textColor: "text-white",
      logoColor: "#FFFFFF"
    }
  };
  
  const currentVariant = colorVariants[variant];

  // Handle tap/click effects
  useEffect(() => {
    if (isTapped) {
      const timer = setTimeout(() => {
        setIsTapped(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isTapped]);

  return (
    <motion.div
      className={`relative flex items-center justify-center rounded-full shadow-md bg-gradient-to-br ${currentVariant.bgGradient} ${logoSizes[size]} ${className}`}
      onHoverStart={interactive ? () => setIsHovered(true) : undefined}
      onHoverEnd={interactive ? () => setIsHovered(false) : undefined}
      onTapStart={interactive ? () => setIsTapped(true) : undefined}
      animate={{
        scale: isTapped ? 0.95 : isHovered ? 1.05 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 10
      }}
    >
      <svg 
        viewBox="0 0 40 40" 
        className={`w-full h-full ${currentVariant.textColor}`}
      >
        <path 
          d={logoPath}
          fill={currentVariant.logoColor}
        />
      </svg>
      
      {interactive && isHovered && (
        <motion.div
          className="absolute inset-0 rounded-full bg-white opacity-10"
          initial={{ scale: 0 }}
          animate={{ scale: 1.1 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </motion.div>
  );
};

export default BlobLogo;
