
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
                    'text-[#F97316]';

  return (
    <div className={`flex flex-col items-center ${className}`}>
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
              src="/lovable-uploads/bcc0ccf7-c2c6-48ef-af7c-832d8c5bdaa7.png" 
              alt="MMortal Logo" 
              className="w-full h-full object-contain"
            />
          </motion.div>
        </motion.div>
      ) : (
        <div className={`relative w-16 h-16 md:w-20 md:h-20 ${logoColor}`}>
          <img 
            src="/lovable-uploads/bcc0ccf7-c2c6-48ef-af7c-832d8c5bdaa7.png" 
            alt="MMortal Logo" 
            className="w-full h-full object-contain"
          />
        </div>
      )}
      <motion.div 
        className="font-bold mt-2 text-sm md:text-base"
        whileHover={interactive ? { 
          scale: 1.2, 
          color: "#F97316",
          textShadow: "0px 0px 8px rgba(249, 115, 22, 0.6)"
        } : undefined}
      >
        <span className="gradient-text">MMORTAL</span>
      </motion.div>
    </div>
  );
};

export default Logo;
