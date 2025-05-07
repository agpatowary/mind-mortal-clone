
import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, LogOut } from 'lucide-react';
import DashboardSidebar from './DashboardSidebar';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const DashboardLayout: React.FC = () => {
  const { signOut, isLoading } = useAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: "Signed out successfully",
        description: "You have been signed out of your account."
      });
    } catch (error) {
      toast({
        title: "Error signing out",
        description: "There was a problem signing you out.",
        variant: "destructive"
      });
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
    <div className="flex h-screen w-full bg-background overflow-hidden">
      <DashboardSidebar />
      
      <main className="flex-1 overflow-auto flex flex-col">
        <motion.div 
          className="flex justify-end p-4 border-b border-border"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Button 
            variant="ghost" 
            onClick={handleSignOut}
            className="flex items-center gap-2 hover:bg-secondary/80 transition-colors"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </Button>
        </motion.div>
        
        <div className="p-6 flex-1 overflow-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
