
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import Logo from './Logo';
import { useIsMobile } from '@/hooks/use-mobile';

interface HomeNavigationProps {
  currentSection: number;
  onNavigate: (index: number) => void;
}

const HomeNavigation: React.FC<HomeNavigationProps> = ({ 
  currentSection, 
  onNavigate 
}) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { isAuthenticated, signOut } = useAuth();
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
  
  const sections = ['Home', 'Features', 'Experts', 'Case Studies', 'Join Us'];
  
  // Listen for custom navigation events
  useEffect(() => {
    const handleCustomNavigation = (e: CustomEvent) => {
      const { index } = (e as CustomEvent<{ index: number }>).detail;
      onNavigate(index);
    };
    
    document.addEventListener('navigateToSlide', handleCustomNavigation as EventListener);
    return () => {
      document.removeEventListener('navigateToSlide', handleCustomNavigation as EventListener);
    };
  }, [onNavigate]);
  
  return (
    <div className="fixed top-6 left-0 right-0 z-50 flex justify-center">
      <motion.div 
        className="flex items-center gap-2 bg-background/80 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-border"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        {!isMobile && (
          <div className="flex items-center mr-4">
            <Logo variant={isDarkMode ? 'light' : 'default'} className="w-8 h-8" />
          </div>
        )}
        
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
          {sections.map((section, index) => (
            <motion.div
              key={section}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={currentSection === index ? "default" : "ghost"}
                size={isMobile ? "sm" : "sm"}
                onClick={() => onNavigate(index)}
                className={`whitespace-nowrap ${isMobile ? 'px-2' : ''} ${currentSection === index ? "font-medium" : ""}`}
              >
                {section}
              </Button>
            </motion.div>
          ))}
        </div>
        
        <div className="w-px h-6 bg-border mx-2" />
        
        <motion.div
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDarkMode}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </motion.div>
        
        {!isMobile && (
          <>
            <div className="w-px h-6 bg-border mx-2" />
            
            <div className="flex gap-2">
              {isAuthenticated() ? (
                <>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      size="sm"
                      onClick={() => navigate("/dashboard")}
                    >
                      Dashboard
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={signOut}
                    >
                      Sign Out
                    </Button>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate("/signin")}
                    >
                      Sign In
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      size="sm"
                      onClick={() => navigate("/signup")}
                    >
                      Sign Up
                    </Button>
                  </motion.div>
                </>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default HomeNavigation;
