
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sun, Moon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
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
  const { isAuthenticated, signOut } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
  
  // Animation variants
  const mobileMenuVariants = {
    closed: {
      opacity: 0,
      y: -20,
      height: 0,
      transition: {
        y: { stiffness: 1000 }
      }
    },
    open: {
      opacity: 1,
      y: 0,
      height: 'auto',
      transition: {
        y: { stiffness: 1000, velocity: -100 }
      }
    }
  };
  
  return (
    <>
      {/* Mobile Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 md:hidden">
        <div className="flex items-center justify-between p-4 bg-background/80 backdrop-blur-md border-b">
          <Logo variant={isDarkMode ? 'light' : 'default'} className="w-8 h-8" />
          
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDarkMode}
              title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
        
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={mobileMenuVariants}
              className="bg-background/80 backdrop-blur-md border-b"
            >
              <div className="flex flex-col p-4 space-y-3">
                {sections.map((section, index) => (
                  <Button
                    key={section}
                    variant={currentSection === index ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => {
                      onNavigate(index);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    {section}
                  </Button>
                ))}
                
                <div className="pt-2 border-t">
                  {isAuthenticated() ? (
                    <>
                      <Button 
                        className="w-full mb-2"
                        onClick={() => {
                          navigate("/dashboard");
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Dashboard
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          signOut();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button 
                        className="w-full mb-2"
                        onClick={() => {
                          navigate("/signin");
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Sign In
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          navigate("/signup");
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        Sign Up
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Desktop Navigation */}
      <div className="fixed bottom-10 left-0 right-0 z-50 hidden md:flex justify-center">
        <motion.div 
          className="flex items-center gap-2 bg-background/80 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-border"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        >
          <div className="hidden md:flex items-center mr-4">
            <Logo variant={isDarkMode ? 'light' : 'default'} className="w-8 h-8" />
          </div>
          
          <div className="flex items-center gap-2">
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
                  className={currentSection === index ? "font-medium" : ""}
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
        </motion.div>
      </div>
    </>
  );
};

export default HomeNavigation;
