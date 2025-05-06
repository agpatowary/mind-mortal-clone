
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
      <div className={`relative w-16 h-16 md:w-20 md:h-20 ${logoColor}`}>
        <img 
          src="/lovable-uploads/305493ad-8ea7-4e70-a22a-e3aa8f3f820a.png" 
          alt="MMORTAL Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      <span className="font-bold mt-2 text-sm md:text-base">MMORTAL</span>
    </div>
  );
};

export default Logo;
