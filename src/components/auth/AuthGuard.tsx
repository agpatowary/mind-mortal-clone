
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LoadingScreen from '@/components/LoadingScreen';

export interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, requiredRole }) => {
  const { user, isLoading, hasRole } = useAuth();
  const location = useLocation();

  // Check if the user has the required role if specified
  const hasRequiredRole = React.useMemo(() => {
    if (!requiredRole || !user) return true;
    return hasRole ? hasRole(requiredRole) : false;
  }, [user, requiredRole, hasRole]);

  useEffect(() => {
    // This is for debugging purposes
    if (requiredRole && user && !hasRequiredRole) {
      console.log(`User does not have the required role: ${requiredRole}`);
    }
  }, [user, requiredRole, hasRequiredRole]);

  if (isLoading) {
    return <LoadingScreen isLoading={true} />;
  }

  if (!user) {
    // User is not authenticated, redirect to login
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }

  if (requiredRole && !hasRequiredRole) {
    // User is authenticated but doesn't have the required role
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and has required role (if specified)
  return <>{children}</>;
};

export default AuthGuard;
