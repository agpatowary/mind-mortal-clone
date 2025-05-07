
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  PlusSquare, 
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import Logo from './Logo';
import { Button } from './ui/button';
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter
} from '@/components/ui/sidebar';

// Custom SVG components for our specific feature icons
const LegacyIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 3a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2H5z"/>
    <path d="M12 8v8M8 12h8"/>
    <path d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"/>
  </svg>
);

const WisdomIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <path d="M12 7v10M7 12h10"/>
    <path d="M7 17.5C7 18.9 9.2 20 12 20s5-1.1 5-2.5-2.2-2.5-5-2.5-5 1.1-5 2.5z"/>
  </svg>
);

const TimelessIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 6 12 12 16 14"/>
    <path d="M16 8.6c1 1.1 1.7 2.5 1.9 4"/>
  </svg>
);

const DashboardSidebar: React.FC = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  
  const menuItems = [
    { 
      title: 'Dashboard', 
      icon: LayoutDashboard, 
      path: '/dashboard',
      isActive: location.pathname === '/dashboard'
    },
    { 
      title: 'Create', 
      icon: PlusSquare, 
      path: '/dashboard/create',
      isActive: location.pathname === '/dashboard/create'
    },
    { 
      title: 'Legacy Vault', 
      icon: LegacyIcon, 
      path: '/dashboard/legacy-vault',
      isActive: location.pathname.startsWith('/dashboard/legacy-vault') 
    },
    { 
      title: 'Wisdom Exchange', 
      icon: WisdomIcon, 
      path: '/dashboard/wisdom-exchange',
      isActive: location.pathname.startsWith('/dashboard/wisdom-exchange')
    },
    { 
      title: 'Timeless Messages', 
      icon: TimelessIcon, 
      path: '/dashboard/timeless-messages',
      isActive: location.pathname.startsWith('/dashboard/timeless-messages')
    },
    { 
      title: 'Profile', 
      icon: User, 
      path: '/dashboard/profile',
      isActive: location.pathname === '/dashboard/profile'
    },
  ];

  return (
    <SidebarProvider>
      <Sidebar variant="inset" className="bg-[#1A1F2C] border-r border-[#2A2F3C]">
        <SidebarHeader>
          <div className="flex items-center justify-center p-4">
            <Logo variant="default" interactive={false} className="h-8" />
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item, index) => (
              <SidebarMenuItem key={index}>
                <SidebarMenuButton
                  asChild
                  isActive={item.isActive}
                  tooltip={item.title} // Show tooltip with the name
                >
                  <Link to={item.path} className="w-full">
                    {typeof item.icon === 'function' ? (
                      React.createElement(item.icon)
                    ) : (
                      <item.icon className="h-5 w-5" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        
        <SidebarFooter>
          <div className="p-4">
            <Button 
              variant="ghost" 
              className="w-full justify-center" 
              onClick={signOut}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </SidebarFooter>
        
        <SidebarTrigger className="absolute right-4 top-4 md:hidden" />
      </Sidebar>
    </SidebarProvider>
  );
};

export default DashboardSidebar;
