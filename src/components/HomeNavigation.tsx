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
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode');
    const isDark = storedDarkMode === null ? true : storedDarkMode === 'true';
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

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  if (isMobile) {
    return (
      <motion.div 
        className="flex items-center gap-1 bg-background/80 backdrop-blur-md rounded-full px-2 py-1 shadow-lg border border-border"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {sections.map((section, index) => (
            <motion.div
              key={section}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={currentSection === index ? "default" : "ghost"}
                size="sm"
                onClick={() => onNavigate(index)}
                className={`whitespace-nowrap px-2 py-0.5 h-auto text-xs ${currentSection === index ? "font-medium" : ""}`}
              >
                {index === 0 ? <Logo className="w-4 h-4" /> : section}
              </Button>
            </motion.div>
          ))}
        </div>
        
        <div className="w-px h-4 bg-border mx-1" />
        
        <motion.div
          whileHover={{ scale: 1.1, rotate: 15 }}
          whileTap={{ scale: 0.9 }}
        >
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-6 h-6 p-0"
            onClick={toggleDarkMode}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun className="h-3 w-3" /> : <Moon className="h-3 w-3" />}
          </Button>
        </motion.div>
      </motion.div>
    );
  }
  
  // Desktop version
  return (
    <motion.div 
      className="flex items-center gap-2 bg-background/80 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-border"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="flex items-center mr-4">
        <Logo variant={isDarkMode ? 'light' : 'default'} className="w-8 h-8" />
      </div>
      
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
        {sections.map((section, index) => (
          <motion.div
            key={section}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={currentSection === index ? "default" : "ghost"}
              size="sm"
              onClick={() => onNavigate(index)}
              className={`whitespace-nowrap ${currentSection === index ? "font-medium" : ""}`}
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
                onClick={handleSignOut}
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
    </motion.div>
  );
};

export default HomeNavigation;
