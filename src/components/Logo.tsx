
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
                    'text-[#c8ff00]';

  return (
    <div className={`flex items-center ${className}`}>
      {interactive ? (
        <motion.div 
          className={`relative w-16 h-16 md:w-20 md:h-20 ${logoColor}`}
          whileHover={{ 
            scale: 1.1,
            rotate: [0, -5, 5, -3, 3, 0],
            transition: { duration: 0.5 }
          }}
          whileTap={{ scale: 0.9 }}
          drag
          dragConstraints={{ top: -10, right: 10, bottom: 10, left: -10 }}
          dragElastic={0.2}
        >
          <motion.div
            className="w-full h-full"
            initial="hidden"
            animate="visible"
          >
            <img 
              src="/lovable-uploads/dee5eb1f-c8e0-4606-9178-09c2c914ca98.png" 
              alt="MMortal Logo" 
              className="w-full h-full object-contain"
            />
          </motion.div>
        </motion.div>
      ) : (
        <div className={`relative w-16 h-16 md:w-20 md:h-20 ${logoColor}`}>
          <img 
            src="/lovable-uploads/dee5eb1f-c8e0-4606-9178-09c2c914ca98.png" 
            alt="MMortal Logo" 
            className="w-full h-full object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default Logo;
