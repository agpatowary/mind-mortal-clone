
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { User, Session } from '@supabase/supabase-js';

type UserRole = 'admin' | 'mentor' | 'disciple' | 'guest';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: any | null;
  roles: UserRole[];
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAdmin: () => boolean;
  isMentor: () => boolean;
  isDisciple: () => boolean;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchUserRoles = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .rpc('get_user_roles', { input_user_id: userId });

      if (error) throw error;
      
      if (data && data.length > 0) {
        setRoles(data as UserRole[]);
      } else {
        setRoles(['disciple']); // Default role
      }
    } catch (error) {
      console.error('Error fetching user roles:', error);
      setRoles(['disciple']); // Fallback to default role
    }
  };

  // Initialize auth state from supabase session
  useEffect(() => {
    // Set up auth state change listener
    const { data } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('Auth state change:', event, newSession ? 'session exists' : 'no session');
        
        // Update session and user state synchronously
        setSession(newSession);
        setUser(newSession?.user ?? null);
        
        if (event === 'SIGNED_OUT') {
          // Clear all user data immediately on sign out
          setProfile(null);
          setRoles(['guest']);
          setIsLoading(false);
          return;
        }
        
        // For signed in users, defer async operations
        if (newSession?.user) {
          setTimeout(() => {
            fetchUserProfile(newSession.user.id);
            fetchUserRoles(newSession.user.id);
            setIsLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setRoles(['guest']);
          setIsLoading(false);
        }
      }
    );

    // Check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setSession(session);
          setUser(session.user);
          await fetchUserProfile(session.user.id);
          await fetchUserRoles(session.user.id);
        } else {
          setUser(null);
          setSession(null);
          setProfile(null);
          setRoles(['guest']);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        toast({
          title: "Authentication Error",
          description: "There was a problem with authentication.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Cleanup subscription on unmount
    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      await fetchUserProfile(user.id);
      await fetchUserRoles(user.id);
    } catch (error) {
      console.error('Error refreshing profile:', error);
      toast({
        title: "Profile refresh failed",
        description: "There was an error refreshing your profile data.",
        variant: "destructive"
      });
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (error) throw error;
      
      toast({
        title: "Account created!",
        description: "Please check your email to confirm your account.",
      });
      
      navigate('/signin');
    } catch (error: any) {
      toast({
        title: "Sign up failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;
      
      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });
      
      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fixed signOut implementation using React Router navigation
  const signOut = async () => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear auth state
      setUser(null);
      setSession(null);
      setProfile(null);
      setRoles(['guest']);
      
      // Show success message
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      
      // Use React Router navigation instead of window.location
      navigate('/');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign out failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Role checker functions
  const isAdmin = () => roles.includes('admin');
  const isMentor = () => roles.includes('mentor');
  const isDisciple = () => roles.includes('disciple');
  const isAuthenticated = () => !!user;

  const value = {
    user,
    session,
    profile,
    roles,
    isLoading,
    signUp,
    signIn,
    signOut,
    refreshProfile,
    isAdmin,
    isMentor,
    isDisciple,
    isAuthenticated
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
