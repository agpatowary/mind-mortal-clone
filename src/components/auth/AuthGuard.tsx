
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

type RoleType = 'admin' | 'mentor' | 'disciple' | 'all';

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: RoleType[];
  requireAuth?: boolean;
  redirectTo?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  allowedRoles = ['all'],
  requireAuth = true,
  redirectTo = '/signin'
}) => {
  const { isAuthenticated, roles, isLoading } = useAuth();
  const location = useLocation();

  // Show loading spinner while auth state is being determined
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated()) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If user is authenticated but doesn't have the required role
  if (isAuthenticated() && allowedRoles[0] !== 'all') {
    const hasRequiredRole = allowedRoles.some(role => 
      role === 'all' || roles.includes(role)
    );

    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // If no authentication is required but user is authenticated (e.g., for sign-in page)
  if (!requireAuth && isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default AuthGuard;
