
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface Subscription {
  id: string;
  status: 'active' | 'trialing' | 'canceled' | 'incomplete' | 'expired';
  tier: 'Monthly' | 'Yearly' | 'Lifetime' | 'Free';
  created_at: string;
  expires_at: string | null;
  cancel_at_period_end: boolean;
}

interface UseSubscription {
  subscription: Subscription | null;
  isLoading: boolean;
  error: string;
  checkSubscription: () => Promise<void>;
  createCheckout: (plan: 'Monthly' | 'Yearly' | 'Lifetime') => Promise<void>;
  openCustomerPortal: () => Promise<void>;
  subscription_tier?: string; // Added for backward compatibility
}

export const useSubscription = (): UseSubscription => {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      checkSubscription();
    } else {
      setSubscription(null);
      setIsLoading(false);
    }
  }, [user]);

  const checkSubscription = async () => {
    try {
      setIsLoading(true);
      setError('');

      // For demo/development purposes, simulate a subscription
      // In a real app, you would call your Supabase Edge Function
      const demoSubscription: Subscription = {
        id: 'sub_demo',
        status: 'active',
        tier: 'Monthly',
        created_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        cancel_at_period_end: false
      };
      
      setSubscription(demoSubscription);
    } catch (err: any) {
      console.error('Error checking subscription:', err);
      setError(err.message || 'Failed to check subscription');
      setSubscription(null);
    } finally {
      setIsLoading(false);
    }
  };

  const createCheckout = async (plan: 'Monthly' | 'Yearly' | 'Lifetime') => {
    try {
      setIsLoading(true);
      setError('');

      // In a real app, you would call your Supabase Edge Function to create a checkout
      toast({
        title: 'Subscription',
        description: `Creating checkout for ${plan} plan...`,
      });

      // Simulate a checkout process
      setTimeout(() => {
        toast({
          title: 'Subscription Demo',
          description: 'In a real app, this would redirect to a payment page.',
        });
        setIsLoading(false);
      }, 1500);
    } catch (err: any) {
      console.error('Error creating checkout:', err);
      setError(err.message || 'Failed to create checkout');
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to create checkout session',
        variant: 'destructive',
      });
    }
  };

  const openCustomerPortal = async () => {
    try {
      setIsLoading(true);
      setError('');

      // In a real app, you would call your Supabase Edge Function to open the customer portal
      toast({
        title: 'Subscription',
        description: 'Opening customer portal...',
      });

      // Simulate opening a customer portal
      setTimeout(() => {
        toast({
          title: 'Subscription Demo',
          description: 'In a real app, this would redirect to the customer portal.',
        });
        setIsLoading(false);
      }, 1500);
    } catch (err: any) {
      console.error('Error opening customer portal:', err);
      setError(err.message || 'Failed to open customer portal');
      setIsLoading(false);
      toast({
        title: 'Error',
        description: 'Failed to open customer portal',
        variant: 'destructive',
      });
    }
  };

  return {
    subscription,
    isLoading,
    error,
    checkSubscription,
    createCheckout,
    openCustomerPortal,
    subscription_tier: subscription?.tier, // Added for backward compatibility
  };
};
