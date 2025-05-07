
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Archive, Home, MessageSquare, Plus, User, Users } from 'lucide-react';
import Logo from './Logo';

type MenuItem = {
  name: string;
  path: string;
  icon: React.ComponentType<any>;
};

const menuItems: MenuItem[] = [
  {
    name: 'Home',
    path: '/dashboard',
    icon: Home
  },
  {
    name: 'Create',
    path: '/dashboard/create',
    icon: Plus
  },
  {
    name: 'Legacy Vault',
    path: '/dashboard/legacy-vault',
    icon: Archive
  },
  {
    name: 'Wisdom Exchange',
    path: '/dashboard/wisdom-exchange',
    icon: Users
  },
  {
    name: 'Timeless Messages',
    path: '/dashboard/timeless-messages',
    icon: MessageSquare
  },
  {
    name: 'Profile',
    path: '/dashboard/profile',
    icon: User
  }
];

const sidebarAnimation = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemAnimation = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

const DashboardSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <motion.aside
      className="sticky top-0 h-screen w-16 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-6 z-10"
      initial="hidden"
      animate="visible"
      variants={sidebarAnimation}
    >
      <div className="mb-8">
        <Logo interactive={false} className="w-10 h-10" />
      </div>

      <nav className="flex-1 flex flex-col items-center space-y-4 w-full">
        <TooltipProvider>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
                            (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            
            return (
              <motion.div key={item.name} variants={itemAnimation} className="w-full px-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to={item.path} className="w-full block">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "w-full h-10 rounded-md",
                          isActive 
                            ? "bg-primary/10 text-primary border border-primary/20" 
                            : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                        )}
                      >
                        {React.createElement(item.icon, {
                          className: cn(
                            "h-5 w-5",
                            isActive ? "text-primary" : "text-sidebar-foreground"
                          ),
                          "aria-hidden": "true"
                        })}
                        <span className="sr-only">{item.name}</span>
                      </Button>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.name}</p>
                  </TooltipContent>
                </Tooltip>
              </motion.div>
            );
          })}
        </TooltipProvider>
      </nav>
    </motion.aside>
  );
};

export default DashboardSidebar;
