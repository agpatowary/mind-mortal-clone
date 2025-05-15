
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

type SubscriptionInfo = {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
};

const SubscriptionStatus = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo | null>(null);

  // Fetch the subscription status when the component mounts
  useEffect(() => {
    if (user) {
      checkSubscription();
    }
  }, [user]);

  // Function to check the subscription status
  const checkSubscription = async () => {
    if (!user) return;
    
    setChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;
      
      setSubscriptionInfo(data);
      setLoading(false);
    } catch (error) {
      console.error('Error checking subscription:', error);
      toast({
        title: "Failed to check subscription",
        description: "There was an error checking your subscription status.",
        variant: "destructive"
      });
    } finally {
      setChecking(false);
    }
  };

  // Function to create a checkout session
  const handleSubscribe = async (plan: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to subscribe.",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { plan }
      });
      
      if (error) throw error;
      
      if (data?.url) {
        // Open Stripe checkout in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Checkout failed",
        description: "There was an error creating a checkout session.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to open customer portal for subscription management
  const handleManageSubscription = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      if (data?.url) {
        // Open Stripe customer portal in a new tab
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast({
        title: "Portal access failed",
        description: "There was an error accessing the subscription management portal.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Subscription Status</CardTitle>
          <CardDescription>Loading your subscription information...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Subscription Status</CardTitle>
            <CardDescription>
              {subscriptionInfo?.subscribed 
                ? `You are subscribed to the ${subscriptionInfo.subscription_tier} plan` 
                : "You don't have an active subscription"}
            </CardDescription>
          </div>
          {checking && <Loader2 className="h-4 w-4 animate-spin text-primary ml-2" />}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {subscriptionInfo?.subscribed ? (
            <div className="space-y-4">
              <div className="bg-primary/10 p-4 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium">{subscriptionInfo.subscription_tier} Plan</h3>
                  {subscriptionInfo.subscription_end && (
                    <p className="text-sm text-muted-foreground">
                      Valid until: {new Date(subscriptionInfo.subscription_end).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
              
              <Button onClick={handleManageSubscription} variant="outline" className="w-full">
                Manage Subscription
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground mb-4">
                Choose a subscription plan to unlock all features and secure your legacy for future generations.
              </p>
              
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-3">
                <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                  <Card className="border-primary/20 hover:border-primary cursor-pointer" onClick={() => handleSubscribe('Monthly')}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">The First Step</CardTitle>
                      <CardDescription>Monthly subscription</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold mb-2">$3.99<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                      <Button variant="outline" className="w-full mt-2">Subscribe</Button>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                  <Card className="border-primary/20 hover:border-primary cursor-pointer relative overflow-hidden" onClick={() => handleSubscribe('Yearly')}>
                    <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-2 py-1 text-xs font-medium">
                      Popular
                    </div>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Moment of Impact</CardTitle>
                      <CardDescription>Annual subscription</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold mb-2">$29.99<span className="text-sm font-normal text-muted-foreground">/year</span></p>
                      <Button className="w-full mt-2">Subscribe</Button>
                    </CardContent>
                  </Card>
                </motion.div>
                
                <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                  <Card className="border-primary/20 hover:border-primary cursor-pointer" onClick={() => handleSubscribe('Lifetime')}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Immortal</CardTitle>
                      <CardDescription>Lifetime access</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-3xl font-bold mb-2">$89<span className="text-sm font-normal text-muted-foreground">/lifetime</span></p>
                      <Button variant="outline" className="w-full mt-2">Purchase</Button>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SubscriptionStatus;
