
import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Home, 
  Archive, 
  MessageSquare, 
  Menu, 
  User, 
  LogOut, 
  Settings, 
  Lightbulb,
  Users,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import BlobLogo from './BlobLogo';
import LoadingScreen from './LoadingScreen';

const DashboardLayout: React.FC = () => {
  const { user, profile, isLoading, signOut, isAdmin } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname.startsWith(path) ? 'text-primary bg-primary/10' : '';
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const navItems = [
    { name: 'Home', path: '/dashboard', icon: <Home className="w-5 h-5" /> },
    { name: 'Legacy Vault', path: '/dashboard/legacy-vault', icon: <Archive className="w-5 h-5" /> },
    { name: 'Idea Vault', path: '/dashboard/idea-vault', icon: <Lightbulb className="w-5 h-5" /> },
    { name: 'Mentorship', path: '/dashboard/mentorship', icon: <Users className="w-5 h-5" /> },
    { name: 'Timeless Messages', path: '/dashboard/timeless-messages', icon: <MessageSquare className="w-5 h-5" /> },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  if (isLoading) {
    return <LoadingScreen isLoading={isLoading} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header / Top Bar */}
      <header className="border-b sticky top-0 z-40 bg-background">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-4">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <SheetHeader>
                  <SheetTitle>
                    <div className="flex items-center gap-2">
                      <BlobLogo size="sm" />
                      <span>MMortal</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-1 mt-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={`flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-md transition-colors hover:bg-muted ${isActive(item.path)}`}
                    >
                      {item.icon}
                      {item.name}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
            <div className="hidden md:flex items-center gap-2">
              <BlobLogo size="sm" />
              <span className="font-semibold text-lg">MMortal</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 mx-6 flex-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-md transition-colors hover:bg-muted ${isActive(item.path)}`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar>
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback>{profile?.full_name?.charAt(0) || user?.email?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-1">
                    <p className="font-medium">{profile?.full_name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/dashboard/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                
                {isAdmin() && (
                  <DropdownMenuItem onClick={() => navigate('/admin')}>
                    <ShieldCheck className="mr-2 h-4 w-4" />
                    Admin Dashboard
                  </DropdownMenuItem>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-6 bg-muted/30">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
