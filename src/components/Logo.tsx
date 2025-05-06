
import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'light' | 'dark';
  interactive?: boolean;
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  variant = 'default',
  interactive = true
}) => {
  const logoColor = variant === 'light' ? 'text-white' : 
                    variant === 'dark' ? 'text-primary' : 
                    'text-[#ccff00]';

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {interactive ? (
        <motion.div 
          className={`relative w-16 h-16 md:w-20 md:h-20 ${logoColor}`}
          whileHover={{ 
            scale: 1.1,
            rotate: [0, -10, 10, -5, 5, 0],
            transition: { duration: 0.5 }
          }}
          whileTap={{ scale: 0.9 }}
        >
          <motion.img 
            src="/lovable-uploads/305493ad-8ea7-4e70-a22a-e3aa8f3f820a.png" 
            alt="MMORTAL Logo" 
            className="w-full h-full object-contain"
            initial={{ y: 0 }}
            animate={{ y: [0, -5, 0] }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </motion.div>
      ) : (
        <div className={`relative w-16 h-16 md:w-20 md:h-20 ${logoColor}`}>
          <img 
            src="/lovable-uploads/305493ad-8ea7-4e70-a22a-e3aa8f3f820a.png" 
            alt="MMORTAL Logo" 
            className="w-full h-full object-contain"
          />
        </div>
      )}
      <motion.span 
        className="font-bold mt-2 text-sm md:text-base"
        whileHover={interactive ? { scale: 1.2, color: "#ccff00" } : undefined}
      >
        MMORTAL
      </motion.span>
    </div>
  );
};

export default Logo;
