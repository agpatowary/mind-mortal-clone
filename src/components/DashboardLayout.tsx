
import React from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardAnimatedBackground from './dashboard/DashboardAnimatedBackground';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-background">
      <DashboardAnimatedBackground />
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
