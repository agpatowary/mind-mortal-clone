
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
  const { isAuthenticated, roles, isLoading, isAdmin, isMentor } = useAuth();
  const location = useLocation();

  // Improved loading spinner with better styling and centered position
  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-card p-6 rounded-lg shadow-lg flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">Loading...</p>
        </div>
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
