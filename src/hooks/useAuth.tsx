
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { User } from '@supabase/supabase-js';

type UserRole = 'admin' | 'mentor' | 'disciple' | 'guest';

interface AuthContextType {
  user: User | null;
  profile: any | null;
  roles: UserRole[];
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
  isMentor: () => boolean;
  isDisciple: () => boolean;
  isAuthenticated: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Initialize auth state from supabase session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for an existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          await fetchUserProfile(session.user.id);
          await fetchUserRoles(session.user.id);
        } else {
          setUser(null);
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

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user);
          await fetchUserProfile(session.user.id);
          await fetchUserRoles(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
          setRoles(['guest']);
        }
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  const signOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      setProfile(null);
      setRoles(['guest']);
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
      
      navigate('/');
    } catch (error: any) {
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
    profile,
    roles,
    isLoading,
    signUp,
    signIn,
    signOut,
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
