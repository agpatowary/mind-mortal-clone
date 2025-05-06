
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'default' | 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ className = '', variant = 'default' }) => {
  const logoColor = variant === 'light' ? 'text-white' : 
                    variant === 'dark' ? 'text-primary' : 
                    'text-[#ccff00]';

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className={`blob-container relative w-16 h-16 md:w-20 md:h-20 ${logoColor}`}>
        <svg 
          viewBox="0 0 500 500" 
          xmlns="http://www.w3.org/2000/svg" 
          className="w-full h-full"
        >
          <path
            d="M 250 50 L 350 150 L 250 250 L 150 150 Z M 250 250 L 350 350 L 250 450 L 150 350 Z"
            strokeWidth="30"
            stroke="currentColor"
            fill="transparent"
          />
        </svg>
      </div>
      <span className="font-bold mt-2 text-sm md:text-base">MMORTAL</span>
    </div>
  );
};

export default Logo;
