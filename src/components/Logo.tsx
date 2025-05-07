
import React from 'react';
import BlobLogo from './BlobLogo';
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
  return (
    <motion.div 
      className={`flex items-center ${className}`}
      whileHover={interactive ? { scale: 1.02 } : {}}
    >
      <BlobLogo size="sm" interactive={interactive} />
      <div className="ml-2 text-lg font-bold gradient-text">
        MemoryMind
      </div>
    </motion.div>
  );
};

export default Logo;
