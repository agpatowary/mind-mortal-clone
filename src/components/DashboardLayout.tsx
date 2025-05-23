
import React from 'react';
import DashboardSidebar from './DashboardSidebar';
import DashboardAnimatedBackground from './dashboard/DashboardAnimatedBackground';
import ProfileDropdown from './dashboard/ProfileDropdown';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-background">
      <DashboardAnimatedBackground>
        <div className="flex w-full h-full">
          <DashboardSidebar />
          <main className="flex-1 overflow-auto relative">
            <div className="container mx-auto p-6 relative z-10">
              {children}
            </div>
          </main>
          <ProfileDropdown />
        </div>
      </DashboardAnimatedBackground>
    </div>
  );
};

export default DashboardLayout;
