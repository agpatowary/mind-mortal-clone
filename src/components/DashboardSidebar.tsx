
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  PlusSquare, 
  Archive, 
  Users, 
  Clock, 
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
      icon: Archive, 
      path: '/dashboard/legacy-vault',
      isActive: location.pathname.startsWith('/dashboard/legacy-vault') 
    },
    { 
      title: 'Wisdom Exchange', 
      icon: Users, 
      path: '/dashboard/wisdom-exchange',
      isActive: location.pathname.startsWith('/dashboard/wisdom-exchange')
    },
    { 
      title: 'Timeless Messages', 
      icon: Clock, 
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
      <Sidebar variant="inset" className="bg-background border-r border-border">
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
                  tooltip={item.title}
                >
                  <Link to={item.path} className="w-full">
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        
        <SidebarFooter>
          <div className="p-4">
            <Button 
              variant="outline" 
              className="w-full justify-start" 
              onClick={signOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </SidebarFooter>
        
        <SidebarTrigger className="absolute right-4 top-4 md:hidden" />
      </Sidebar>
    </SidebarProvider>
  );
};

export default DashboardSidebar;
