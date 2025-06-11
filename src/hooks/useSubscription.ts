
import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface Subscription {
  tier: string | null;
  active: boolean;
  startDate?: string;
  endDate?: string;
  plan_id?: string;
}

export function useSubscription() {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchSubscription = async () => {
      if (!user) {
        setIsLoading(false);
        console.log('No user logged in, skipping subscription fetch');
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch subscription info from subscribers table
        const { data, error } = await supabase
          .from('subscribers')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          const now = new Date();
          const endDate = data.subscription_end ? new Date(data.subscription_end) : null;
          const active = endDate ? endDate > now : false;
          
          setSubscription({
            tier: data.subscription_tier,
            active,
            startDate: data.created_at,
            endDate: data.subscription_end,
            plan_id: data.plan_id || undefined
          });
        } else {
          // No subscription found, set to free plan
          setSubscription({
            tier: null,
            active: true
          });
        }
      } catch (err) {
        console.error('Error fetching subscription:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch subscription'));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSubscription();
  }, [user]);

  return { subscription, isLoading, error };
}
