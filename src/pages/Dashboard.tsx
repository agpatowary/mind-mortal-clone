
import React from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';
import DashboardSidebar from '@/components/DashboardSidebar';
import { SidebarInset } from '@/components/ui/sidebar';
import DashboardHome from '@/components/dashboard/DashboardHome';

const Dashboard: React.FC = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      }
    }
  };

  return (
    <div className="flex h-screen w-full bg-background">
      <DashboardSidebar />
      
      <SidebarInset>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex-1 p-4 md:p-8 overflow-auto w-full max-w-full"
        >
          {/* Render the outlet if we're on a sub-route, otherwise render the dashboard home */}
          {location.pathname === '/dashboard' ? <DashboardHome /> : <Outlet />}
        </motion.div>
      </SidebarInset>
    </div>
  );
};

export default Dashboard;
