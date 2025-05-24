import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { User, Session } from '@supabase/supabase-js';

const USER_ROLES = {
  ADMIN: 'admin',
  MENTOR: 'mentor',
  DISCIPLE: 'disciple',
  GUEST: 'guest'
} as const;

type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

interface Profile {
  id: string;
  full_name: string | null;
  bio: string | null;
  location: string | null;
  avatar_url: string | null;
  updated_at: string | null;
  username: string | null;
  phone: string | null;
  profile_completion: string[] | null;
  is_mentor: boolean | null;
}


interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  roles: UserRole[];
  isLoading: boolean;
  isProfileLoading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  isAdmin: boolean;
  isMentor: boolean;
  isDisciple: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state change:', event, newSession ? 'session exists' : 'no session');

        if (event === 'SIGNED_OUT') {
          setSession(null);
          setUser(null);
          setProfile(null);
          setRoles([USER_ROLES.GUEST]);
          return;
        }

        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          await fetchUserProfile(newSession.user.id);
          await fetchUserRoles(newSession.user.id);
        }
      }
    );

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
          setRoles([USER_ROLES.GUEST]);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        toast({
          title: 'Authentication Error',
          description: 'There was a problem with authentication.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      setIsProfileLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsProfileLoading(false);
    }
  };

  const fetchUserRoles = async (userId: string) => {
    try {
      const { data, error } = await supabase.rpc('get_user_roles', { input_user_id: userId });
      if (error) throw error;
      setRoles(data && data.length > 0 ? (data as UserRole[]) : [USER_ROLES.GUEST]);
    } catch (error) {
      console.error('Error fetching user roles:', error);
      setRoles([USER_ROLES.GUEST]);
    }
  };

  const refreshProfile = async () => {
    if (!user) return;
    try {
      await fetchUserProfile(user.id);
      await fetchUserRoles(user.id);
    } catch (error) {
      console.error('Error refreshing profile:', error);
      toast({
        title: 'Profile refresh failed',
        description: 'There was an error refreshing your profile data.',
        variant: 'destructive',
      });
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
        },
      });

      if (error) throw error;

      toast({
        title: 'Account created!',
        description: 'Please check your email to confirm your account.',
      });

      navigate('/signin');
    } catch (error: any) {
      toast({
        title: 'Sign up failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) throw error;

      toast({
        title: 'Welcome back!',
        description: 'You have successfully signed in.',
      });

      navigate('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Sign in failed',
        description: error.message,
        variant: 'destructive',
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
      setSession(null);
      setProfile(null);
      setRoles([USER_ROLES.GUEST]);

      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully.',
      });

      navigate('/');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast({
        title: 'Sign out failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isAdmin = useMemo(() => roles.includes(USER_ROLES.ADMIN), [roles]);
  const isMentor = useMemo(() => roles.includes(USER_ROLES.MENTOR), [roles]);
  const isDisciple = useMemo(() => roles.includes(USER_ROLES.DISCIPLE), [roles]);
  const isAuthenticated = useMemo(() => !!user, [user]);

  const value = {
    user,
    session,
    profile,
    roles,
    isLoading,
    isProfileLoading,
    signUp,
    signIn,
    signOut,
    refreshProfile,
    isAdmin,
    isMentor,
    isDisciple,
    isAuthenticated,
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
