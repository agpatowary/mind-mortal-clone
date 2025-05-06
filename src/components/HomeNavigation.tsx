
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from './Logo';

interface HomeNavigationProps {
  currentSection: number;
  onNavigate: (index: number) => void;
}

const HomeNavigation: React.FC<HomeNavigationProps> = ({ 
  currentSection, 
  onNavigate 
}) => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);
  
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    document.documentElement.classList.toggle('dark', newMode);
  };
  
  const sections = ['Home', 'Features', 'Stories', 'Join Us'];
  
  return (
    <div className="fixed bottom-10 left-0 right-0 z-50 flex justify-center">
      <div className="flex items-center gap-2 bg-background/80 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-border">
        <div className="hidden md:flex items-center mr-4">
          <Logo variant={isDarkMode ? 'light' : 'default'} className="w-8 h-8" />
        </div>
        
        <div className="flex items-center gap-2">
          {sections.map((section, index) => (
            <Button
              key={section}
              variant={currentSection === index ? "default" : "ghost"}
              size="sm"
              onClick={() => onNavigate(index)}
              className={currentSection === index ? "font-medium" : ""}
            >
              {section}
            </Button>
          ))}
        </div>
        
        <div className="w-px h-6 bg-border mx-2" />
        
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleDarkMode}
          title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        
        <div className="w-px h-6 bg-border mx-2" />
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </Button>
          <Button 
            size="sm"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeNavigation;
