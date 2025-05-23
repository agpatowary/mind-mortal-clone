
import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import {
  Users,
  CreditCard,
  Settings,
  BarChart,
  LogOut,
  Award
} from "lucide-react";

const AdminDashboard = () => {
  const { isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    // Admin-only access
    if (!isAdmin()) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this area.",
        variant: "destructive"
      });
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);

  const sidebarItems = [
    {
      title: 'Overview',
      href: '/admin',
      icon: BarChart
    },
    {
      title: 'Users',
      href: '/admin/users',
      icon: Users
    },
    {
      title: 'Mentor Applications',
      href: '/admin/mentor-applications',
      icon: Award
    },
    {
      title: 'Subscriptions',
      href: '/admin/subscriptions',
      icon: CreditCard
    },
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: Settings
    }
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Admin Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-sidebar border-r border-sidebar-border">
        <div className="py-4 px-6 border-b border-sidebar-border flex justify-between items-center">
          <h2 className="text-xl font-bold text-primary">Admin Portal</h2>
        </div>
        
        <div className="p-6 space-y-2 flex-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.title}
              to={item.href}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "w-full justify-start gap-2 px-3",
                location.pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-secondary"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
        
        <div className="p-6 border-t border-sidebar-border">
          <button
            onClick={handleSignOut}
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "w-full justify-start gap-2 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive"
            )}
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
      
      {/* Mobile admin navbar */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border w-full sticky top-0 bg-background z-10">
        <h2 className="text-lg font-bold text-primary">Admin Portal</h2>
        <div className="flex gap-2">
          {sidebarItems.map((item) => (
            <Link
              key={item.title}
              to={item.href}
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "p-2",
                location.pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "hover:bg-secondary"
              )}
              title={item.title}
            >
              <item.icon className="h-4 w-4" />
              <span className="sr-only">{item.title}</span>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminDashboard;
