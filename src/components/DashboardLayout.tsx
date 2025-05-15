
import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, LogOut } from 'lucide-react';
import DashboardSidebar from './DashboardSidebar';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardAnimatedBackground from './dashboard/DashboardAnimatedBackground';

const DashboardLayout: React.FC = () => {
  const { signOut, isLoading, user } = useAuth();
  const { toast } = useToast();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If there's no user and we're not loading, redirect to sign-in
    if (!isLoading && !user) {
      navigate('/signin');
    }
  }, [user, isLoading, navigate]);

  const handleSignOut = async () => {
    if (isSigningOut) return; // Prevent multiple clicks
    
    try {
      setIsSigningOut(true);
      await signOut();
      // Explicitly navigate to home page after sign out
      navigate('/');
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account.",
      });
    } catch (error) {
      console.error('Sign out error in layout:', error);
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out.",
        variant: "destructive"
      });
    } finally {
      setIsSigningOut(false);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <DashboardAnimatedBackground objectCount={6}>
      <div className="flex h-screen w-full bg-background/80 backdrop-blur-sm overflow-hidden">
        <DashboardSidebar />
        
        <main className="flex-1 overflow-auto flex flex-col">
          <motion.div 
            className="flex justify-end p-4 border-b border-border"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AnimatePresence>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    variant="ghost" 
                    onClick={handleSignOut}
                    disabled={isSigningOut}
                    className="flex items-center gap-2 hover:bg-secondary/80 transition-colors"
                  >
                    {isSigningOut ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <LogOut size={16} />
                    )}
                    <span>{isSigningOut ? "Signing Out..." : "Sign Out"}</span>
                  </Button>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
          
          <div className="p-6 flex-1 overflow-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={window.location.pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </DashboardAnimatedBackground>
  );
};

export default DashboardLayout;
