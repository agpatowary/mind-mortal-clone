
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

  const letterM = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { 
        pathLength: { type: "spring", duration: 1.5, bounce: 0 },
        opacity: { duration: 0.3 }
      }
    }
  };

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
            <svg 
              viewBox="0 0 100 100" 
              className="w-full h-full"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <motion.path
                d="M 50 10 L 80 30 L 80 70 L 50 90 L 20 70 L 20 30 Z"
                stroke="currentColor"
                strokeWidth="4"
                variants={letterM}
                initial="hidden"
                animate="visible"
                fill="transparent"
              />
              <motion.path
                d="M 50 10 L 50 90"
                stroke="currentColor"
                strokeWidth="4"
                variants={letterM}
                initial="hidden"
                animate="visible"
                fill="transparent"
              />
              <motion.path
                d="M 20 30 L 50 50 L 80 30"
                stroke="currentColor"
                strokeWidth="4"
                variants={letterM}
                initial="hidden"
                animate="visible"
                fill="transparent"
              />
              <motion.circle
                cx="50"
                cy="50"
                r="5"
                fill="#CCFF00"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1, duration: 0.5 }}
              />
            </svg>
          </motion.div>
        </motion.div>
      ) : (
        <div className={`relative w-16 h-16 md:w-20 md:h-20 ${logoColor}`}>
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M 50 10 L 80 30 L 80 70 L 50 90 L 20 70 L 20 30 Z"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
            />
            <path
              d="M 50 10 L 50 90"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
            />
            <path
              d="M 20 30 L 50 50 L 80 30"
              stroke="currentColor"
              strokeWidth="4"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="5"
              fill="#CCFF00"
            />
          </svg>
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
